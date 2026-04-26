import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabase';
import './VideoIntro.css';

export default function VideoIntro({ onDone }) {
    const videoRef = useRef(null);
    const [phase, setPhase] = useState('loading'); // 'loading' | 'playing' | 'fading' | 'done'
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('settings')
                    .select('hero_video_url_desktop, hero_video_url_mobile')
                    .eq('id', 1)
                    .single();

                if (error) throw error;
                
                if (data) {
                    const isMobile = window.innerWidth <= 768;
                    const url = isMobile 
                        ? (data.hero_video_url_mobile || data.hero_video_url_desktop) 
                        : (data.hero_video_url_desktop || data.hero_video_url_mobile);
                        
                    if (url) {
                        setVideoUrl(url);
                        setPhase('playing');
                    } else {
                        // Finish if no URL is present
                        setPhase('fading');
                        setTimeout(() => { setPhase('done'); onDone?.(); }, 900);
                    }
                } else {
                    setPhase('fading');
                    setTimeout(() => { setPhase('done'); onDone?.(); }, 900);
                }
            } catch (error) {
                console.error("Error fetching video settings:", error);
                // Fallback to hardcoded video
                setVideoUrl("/hero_video.mp4");
                setPhase('playing');
            }
        };

        fetchSettings();
    }, [onDone]);

    useEffect(() => {
        if (phase !== 'playing' || !videoUrl) return;

        const vid = videoRef.current;
        if (!vid) return;

        const handleEnded = () => {
            setPhase('fading');
            // After fade-out transition completes, tell parent we're done
            setTimeout(() => {
                setPhase('done');
                onDone?.();
            }, 900);
        };

        // Reload video to apply the new src
        vid.load();
        vid.play().catch(() => { });
        vid.addEventListener('ended', handleEnded);
        return () => vid.removeEventListener('ended', handleEnded);
    }, [phase, videoUrl, onDone]);

    if (phase === 'done') return null;

    return (
        <div className={`vi ${phase === 'fading' ? 'vi--fade' : ''}`}>
            {videoUrl && (
                <video
                    ref={videoRef}
                    className="vi__video"
                    muted
                    playsInline
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
            )}
            {/* Skip button */}
            <button
                className="vi__skip"
                onClick={() => {
                    setPhase('fading');
                    setTimeout(() => { setPhase('done'); onDone?.(); }, 900);
                }}
            >
                Skip intro ›
            </button>
        </div>
    );
}
