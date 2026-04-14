import React, { useEffect, useRef, useState } from 'react';
import './VideoIntro.css';

export default function VideoIntro({ onDone }) {
    const videoRef = useRef(null);
    const [phase, setPhase] = useState('playing'); // 'playing' | 'fading' | 'done'

    useEffect(() => {
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

        vid.play().catch(() => { });
        vid.addEventListener('ended', handleEnded);
        return () => vid.removeEventListener('ended', handleEnded);
    }, [onDone]);

    if (phase === 'done') return null;

    return (
        <div className={`vi ${phase === 'fading' ? 'vi--fade' : ''}`}>
            <video
                ref={videoRef}
                className="vi__video"
                muted
                playsInline
            >
                <source src="/hero_video.mp4" type="video/mp4" />
            </video>
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
