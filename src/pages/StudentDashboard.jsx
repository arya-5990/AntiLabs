import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Player state
  const [activeCourse, setActiveCourse] = useState(null); // The training_registration object
  const [sections, setSections] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [progress, setProgress] = useState([]); // Array of lecture_ids completed
  const [activeLecture, setActiveLecture] = useState(null);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Custom Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const videoRef = useRef(null);

  // 1. Fetch Enrolled Courses on Mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('training_registrations')
          .select(`
            *,
            Careers (
              title
            )
          `)
          .eq('user_id', user.user_id)
          .eq('payment_status', 'paid');

        if (error) throw error;
        setEnrolledCourses(data || []);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [user, navigate]);

  // 2. Fetch Course Data when a course is selected
  useEffect(() => {
    if (!activeCourse) return;

    const fetchCurriculum = async () => {
      setLoadingPlayer(true);
      try {
        // Fetch Sections
        const { data: secs, error: secErr } = await supabase
          .from('sections')
          .select('*')
          .eq('career_id', activeCourse.role_id)
          .order('position', { ascending: true });

        if (secErr) throw secErr;
        setSections(secs || []);

        // Initialize expanded state (all expanded by default)
        const expState = {};
        (secs || []).forEach(s => expState[s.section_id] = true);
        setExpandedSections(expState);

        if (secs && secs.length > 0) {
          const sectionIds = secs.map(s => s.section_id);
          
          // Fetch Lectures
          const { data: lecs, error: lecErr } = await supabase
            .from('lectures')
            .select('*')
            .in('section_id', sectionIds)
            .order('lecture_number', { ascending: true });

          if (lecErr) throw lecErr;
          setLectures(lecs || []);

          // Fetch Progress
          const { data: prog, error: progErr } = await supabase
            .from('user_progress')
            .select('lecture_id')
            .eq('user_id', user.user_id);

          if (progErr && progErr.code !== '42P01') { 
            // Ignore 42P01 (relation does not exist) in case table isn't created yet
            console.error('Progress fetch error:', progErr);
          }
          
          const completedIds = (prog || []).map(p => p.lecture_id);
          setProgress(completedIds);
        }
      } catch (err) {
        console.error('Error loading curriculum:', err);
      } finally {
        setLoadingPlayer(false);
      }
    };

    fetchCurriculum();
  }, [activeCourse, user]);

  // Derive flat ordered lectures
  const orderedLectures = [];
  sections.forEach(sec => {
    const secLectures = lectures.filter(l => l.section_id === sec.section_id);
    orderedLectures.push(...secLectures);
  });

  // Auto-select first available or next uncompleted video
  useEffect(() => {
    if (activeCourse && !loadingPlayer && orderedLectures.length > 0 && !activeLecture) {
      // Find the first uncompleted lecture
      const firstUncompleted = orderedLectures.find(l => !progress.includes(l.lecture_id));
      if (firstUncompleted) {
        setActiveLecture(firstUncompleted);
      } else {
        // If all completed, select the first one
        setActiveLecture(orderedLectures[0]);
      }
    }
  }, [activeCourse, loadingPlayer, orderedLectures, progress, activeLecture]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const isLectureUnlocked = (lecture) => {
    const index = orderedLectures.findIndex(l => l.lecture_id === lecture.lecture_id);
    if (index === 0) return true; // First lecture is always unlocked
    
    // Unlocked if the previous lecture in the sequence is completed
    const prevLecture = orderedLectures[index - 1];
    return progress.includes(prevLecture.lecture_id);
  };

  const handleLectureClick = (lecture) => {
    if (isLectureUnlocked(lecture)) {
      setActiveLecture(lecture);
      setIsPlaying(false);
      setPlaybackRate(1);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const markLectureComplete = async () => {
    if (!activeLecture) return;

    try {
      // Optimistic update
      setProgress(prev => [...prev, activeLecture.lecture_id]);

      const { error } = await supabase
        .from('user_progress')
        .insert([{
          user_id: user.user_id,
          lecture_id: activeLecture.lecture_id
        }]);
      
      // If table missing error, just keep optimistic state
      if (error && error.code !== '42P01') throw error;

      // Auto-advance to next video if available
      const index = orderedLectures.findIndex(l => l.lecture_id === activeLecture.lecture_id);
      if (index >= 0 && index < orderedLectures.length - 1) {
        setActiveLecture(orderedLectures[index + 1]);
      }

    } catch (err) {
      console.error('Error marking complete:', err);
      // Revert optimistic update on failure
      setProgress(prev => prev.filter(id => id !== activeLecture.lecture_id));
    }
  };

  const calculateOverallProgress = () => {
    if (orderedLectures.length === 0) return 0;
    return Math.round((progress.length / orderedLectures.length) * 100);
  };

  if (!user) return null;

  return (
    <div className="student-dashboard-page">
      <Navbar />
      
      <main className="dashboard-main">
        {!activeCourse ? (
          // COURSES GRID VIEW
          <>
            <div className="dashboard-header">
              <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
              <p>Continue your learning journey.</p>
            </div>

            {loadingCourses ? (
              <div>Loading your courses...</div>
            ) : enrolledCourses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '24px' }}>
                <h3 style={{ marginBottom: '16px', color: '#64748b' }}>No active courses found.</h3>
                <button onClick={() => navigate('/careers')} className="btn btn-primary">Browse Careers</button>
              </div>
            ) : (
              <div className="courses-grid">
                {enrolledCourses.map(course => (
                  <div key={course.registration_id} className="course-card" onClick={() => setActiveCourse(course)}>
                    <div className="course-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                    </div>
                    <h3>{course.Careers?.title || course.position || 'Training Program'}</h3>
                    <p>Enrolled on {new Date(course.created_at).toLocaleDateString()}</p>
                    
                    <div className="course-progress">
                      <div className="course-progress-bar">
                        {/* We don't have progress per course here easily without fetching, so show a dummy or general text, or we can fetch progress for all in parallel. Let's just show a play icon. */}
                        <div className="course-progress-fill" style={{ width: '100%', background: '#f1f5f9' }}></div>
                      </div>
                      <div className="course-progress-text">
                        <span style={{ color: '#0ea5e9' }}>Go to Course</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // PLAYER VIEW
          <div className="player-container">
            {/* Sidebar */}
            <div className="curriculum-sidebar">
              <div className="sidebar-header">
                <button className="back-btn" onClick={() => { setActiveCourse(null); setActiveLecture(null); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  Back to Dashboard
                </button>
                <h2>{activeCourse.Careers?.title || activeCourse.position}</h2>
                <div className="overall-progress">
                  <div className="course-progress-bar">
                    <div className="course-progress-fill" style={{ width: `${calculateOverallProgress()}%` }}></div>
                  </div>
                  <div className="course-progress-text">
                    <span>{calculateOverallProgress()}% Complete</span>
                    <span>{progress.length}/{orderedLectures.length} Videos</span>
                  </div>
                </div>
              </div>

              <div className="sections-list">
                {loadingPlayer ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Loading curriculum...</div>
                ) : sections.map(section => {
                  const sectionLectures = lectures.filter(l => l.section_id === section.section_id);
                  const isExpanded = expandedSections[section.section_id];

                  return (
                    <div key={section.section_id} className="section-item">
                      <div className="section-header" onClick={() => toggleSection(section.section_id)}>
                        <span className="section-title">Section {section.position}: {section.title}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      
                      {isExpanded && (
                        <div className="lectures-list">
                          {sectionLectures.map(lecture => {
                            const isCompleted = progress.includes(lecture.lecture_id);
                            const isActive = activeLecture?.lecture_id === lecture.lecture_id;
                            const isUnlocked = isLectureUnlocked(lecture);

                            return (
                              <div 
                                key={lecture.lecture_id} 
                                className={`lecture-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                                onClick={() => handleLectureClick(lecture)}
                              >
                                <div className="lecture-icon">
                                  {isCompleted ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                  ) : !isUnlocked ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                  ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                  )}
                                </div>
                                <span className="lecture-title">{lecture.lecture_number}. {lecture.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Video Area */}
            <div className="video-area">
              {activeLecture ? (
                <>
                  <div className="video-wrapper">
                    {/* Assuming video_url is a direct video link or YouTube embed. */}
                    {activeLecture.video_url.includes('youtube') || activeLecture.video_url.includes('youtu.be') ? (
                       <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                         <iframe 
                          className="video-player"
                          src={activeLecture.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/') + "?controls=0&disablekb=1&modestbranding=1&rel=0"}
                          title={activeLecture.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                         ></iframe>
                       </div>
                    ) : (
                      <div className="custom-video-container">
                        <video 
                          ref={videoRef}
                          className="video-player" 
                          src={activeLecture.video_url}
                          onEnded={() => {
                            setIsPlaying(false);
                            markLectureComplete();
                          }}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onClick={togglePlay}
                          controlsList="nodownload nofullscreen noremoteplayback"
                          disablePictureInPicture
                          style={{ cursor: 'pointer' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                        <div className="custom-controls">
                          <button onClick={togglePlay} className="control-btn play-btn" title={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                            ) : (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            )}
                          </button>
                          <div style={{ flex: 1 }}></div>
                          <button onClick={handleSpeedChange} className="control-btn speed-btn" title="Playback Speed">
                            {playbackRate}x
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="video-info">
                    <div className="video-title-row">
                      <div>
                        <h2 style={{ marginBottom: '8px' }}>{activeLecture.title}</h2>
                        <p style={{ color: '#64748b' }}>Lecture {activeLecture.lecture_number}</p>
                      </div>
                      
                      {progress.includes(activeLecture.lecture_id) ? (
                        <div className="completed-badge">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                          Completed
                        </div>
                      ) : (
                        <button 
                          className="complete-btn" 
                          onClick={markLectureComplete}
                        >
                          Mark as Completed
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      )}
                    </div>
                    {/* Additional description could go here */}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                  Select a video to start learning
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
