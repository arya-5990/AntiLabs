import React, { useState, useEffect, useRef } from 'react';

import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ApplicationModal.css';

/* ─── tiny inline SVG icons (no extra dep needed) ─────────── */
const Icon = {
    user: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    ),
    building: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M3 21h18M9 8h1m5 0h1M9 12h1m5 0h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
        </svg>
    ),
    school: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    ),
    calendar: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    ),
    cap: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M22 10l-10-5L2 10l10 5 10-5zM6 12.5V17c0 1.1 2.686 2 6 2s6-.9 6-2v-4.5" />
        </svg>
    ),
    phone: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
        </svg>
    ),
    mail: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
        </svg>
    ),
    upload: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    error: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    briefcase: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
    ),
    arrow: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
    ),
};

/* ─── File Upload Zone component ──────────────────────────── */
function FileZone({ label, hint, accept, maxSizeMB, file, onChange }) {
    return (
        <div className="am__file-group">
            <label>{label}</label>
            <div className={`am__file-zone${file ? ' has-file' : ''}`}>
                <input
                    type="file"
                    accept={accept}
                    required
                    onChange={onChange}
                    title=""
                />
                <span className={`am__file-icon${file ? " has-file" : ""}`}>{file ? Icon.check : Icon.upload}</span>
                {file ? (
                    <>
                        <p className="am__file-zone-text am__file-zone-text--attached">
                            File attached
                        </p>
                        <p className="am__file-name">{file.name}</p>
                    </>
                ) : (
                    <p className="am__file-zone-text">
                        <strong>Click to browse</strong> or drag & drop
                    </p>
                )}
            </div>
            <span className="am__file-hint">{hint} · Max {maxSizeMB}MB · PDF accepted</span>
        </div>
    );
}

/* ─── Main component ──────────────────────────────────────── */
export default function ApplicationModal({ role, onClose }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: user?.name || '',
        university_name: '',
        college_name: '',
        current_year: '',
        degree_pursuing: '',
        branch: '',
        graduation_year: '',
        mobile_number: user?.phone_number || '',
        email: user?.email || '',
    });

    const [collegeProof, setCollegeProof] = useState(null);
    const [resume, setResume] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Manual Math Captcha
    const generateMathProblem = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const op = Math.random() > 0.5 ? '+' : '-';
        if (op === '+') {
            return { text: `${num1} + ${num2}`, answer: num1 + num2 };
        } else {
            // Ensuring positive result for subtraction
            if (num1 < num2) return { text: `${num2} - ${num1}`, answer: num2 - num1 };
            return { text: `${num1} - ${num2}`, answer: num1 - num2 };
        }
    };

    const [mathProblem, setMathProblem] = useState(generateMathProblem());
    const [mathAnswer, setMathAnswer] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e, setter, maxSizeMB) => {
        const file = e.target.files[0];
        if (!file) { setter(null); return; }
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File exceeds ${maxSizeMB}MB limit. Please choose a smaller file.`);
            e.target.value = '';
            setter(null);
            return;
        }
        setError('');
        setter(file);
    };

    const uploadToCloudinary = async (file) => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name')
            throw new Error('Cloudinary configuration missing. Check your .env file.');

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST', body: data,
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || 'Failed to upload file to Cloudinary');
        }
        return (await res.json()).secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (parseInt(mathAnswer) !== mathProblem.answer) {
            setError('Security Verification failed. Incorrect Math answer.');
            setMathProblem(generateMathProblem());
            setMathAnswer('');
            return;
        }
        if (!termsAccepted) { setError('You must accept the terms & conditions to proceed.'); return; }
        if (!collegeProof) { setError('Please upload your college proof document.'); return; }
        if (!resume) { setError('Please upload your resume.'); return; }

        setLoading(true);
        try {
            // ── Step 1: Upload files to Cloudinary ────────────
            const [proofUrl, resumeUrl] = await Promise.all([
                uploadToCloudinary(collegeProof),
                uploadToCloudinary(resume),
            ]);

            // ── Step 3: Save to Supabase ──────────────────────

            // Radically robust dynamic fee extraction:
            // 1. Check if there's a direct explicit property
            let extractedFee = role.fee || role.fees || role.price || role.amount;

            // 2. Try parsing it via regex if it's explicitly typed in the free-text description
            if (!extractedFee && role.description) {
                const feeMatch = role.description.match(/(?:fee|price|cost|amount).*?(?:rs\.?|inr|₹|$)?\s*(\d+(?:,\d+)*)/i);
                if (feeMatch && feeMatch[1]) {
                    extractedFee = parseInt(feeMatch[1].replace(/,/g, ''), 10);
                }
            }

            // 3. Fallback to ripping all numbers out of the compensation string (e.g. "15,000 INR")
            if (!extractedFee && role.compensation) {
                extractedFee = parseInt(role.compensation.replace(/\D/g, ''), 10);
            }

            // Fallback safety to 999
            const fees = extractedFee && !isNaN(extractedFee) && extractedFee > 0 ? Number(extractedFee) : 999;

            const { data: insertedData, error: dbError } = await supabase.from('training_registrations').insert([{
                user_id: user?.user_id || null,
                position: role.title,
                role_id: role.id || role.posting_id || null,
                full_name: formData.full_name,
                university_name: formData.university_name,
                college_name: formData.college_name,
                current_year: formData.current_year,
                degree_pursuing: formData.degree_pursuing,
                branch: formData.branch,
                graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
                mobile_number: formData.mobile_number,
                email: formData.email,
                college_proof_url: proofUrl,
                resume_url: resumeUrl,
                fees_amount: fees,
                payment_status: 'pending'
            }]).select();

            if (dbError) {
                if (dbError.code === '23505')
                    throw new Error('You have already registered for this training program.');
                throw dbError;
            }

            const applicationId = insertedData?.[0]?.registration_id;

            // ── Step 4: Initialize Instamojo Payment ───────────
            const orderRes = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-instamojo-order`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        application_id: applicationId,
                        customer_email: formData.email,
                        customer_phone: formData.mobile_number,
                        customer_name: formData.full_name,
                        amount: fees, // Dynamic price synced with database record
                        return_url: `${window.location.origin}/profile?reg_id=${applicationId}`
                    }),
                }
            );

            const orderData = await orderRes.json();
            if (!orderData.longurl) {
                throw new Error(orderData.error || 'Failed to initialize payment gateway.');
            }

            // Redirect directly to Instamojo payment link
            window.location.href = orderData.longurl;

        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /* ─── render ──────────────────────────────────────────── */
    return (
        <div className="am__overlay" onClick={onClose}>
            <div className="am__wrapper" onClick={(e) => e.stopPropagation()}>

                {/* ── Header ── */}
                <div className="am__header">
                    <div>
                        <div className="am__header-badge">
                            {Icon.briefcase}&nbsp;Internship Application
                        </div>
                        <h2 className="am__title">Application Form</h2>
                        <p className="am__subtitle">
                            Applying for:&nbsp;<strong>{role.title}</strong>
                        </p>
                    </div>
                    <button className="am__close-btn" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* ── Form ── */}
                <form id="am-form" className="am__form" onSubmit={handleSubmit}>

                    {error && (
                        <div className="am__error">
                            {Icon.error}&nbsp;{error}
                        </div>
                    )}

                    {/* Personal Info */}
                    <div className="am__section-label">Personal Information</div>

                    <div className="am__input-group">
                        <label>Full Name *</label>
                        <div className="am__input-wrap">
                            <input
                                type="text" name="full_name" required
                                placeholder="e.g. Arya Sharma"
                                value={formData.full_name} onChange={handleChange}
                            />
                            <span className="am__input-icon">{Icon.user}</span>
                        </div>
                    </div>

                    <div className="am__row">
                        <div className="am__input-group">
                            <label>Mobile Number *</label>
                            <div className="am__input-wrap">
                                <input
                                    type="tel" name="mobile_number" required
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.mobile_number} onChange={handleChange}
                                />
                                <span className="am__input-icon">{Icon.phone}</span>
                            </div>
                        </div>
                        <div className="am__input-group">
                            <label>Email Address *</label>
                            <div className="am__input-wrap">
                                <input
                                    type="email" name="email" required
                                    placeholder="you@example.com"
                                    value={formData.email} onChange={handleChange}
                                />
                                <span className="am__input-icon">{Icon.mail}</span>
                            </div>
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="am__section-label">Academic Details</div>

                    <div className="am__row">
                        <div className="am__input-group">
                            <label>University Name</label>
                            <div className="am__input-wrap">
                                <input
                                    type="text" name="university_name"
                                    placeholder="e.g. DAVV"
                                    value={formData.university_name} onChange={handleChange}
                                />
                                <span className="am__input-icon">{Icon.building}</span>
                            </div>
                        </div>
                        <div className="am__input-group">
                            <label>College Name *</label>
                            <div className="am__input-wrap">
                                <input
                                    type="text" name="college_name" required
                                    placeholder="e.g. IIPS"
                                    value={formData.college_name} onChange={handleChange}
                                />
                                <span className="am__input-icon">{Icon.school}</span>
                            </div>
                        </div>
                    </div>

                    <div className="am__row">
                        <div className="am__input-group">
                            <label>Current Year *</label>
                            <div className="am__input-wrap">
                                <input
                                    type="text" name="current_year" required
                                    placeholder="e.g. 2nd Year"
                                    value={formData.current_year} onChange={handleChange}
                                />
                                <span className="am__input-icon">{Icon.calendar}</span>
                            </div>
                        </div>
                        <div className="am__input-group">
                            <label>Degree Pursuing *</label>
                            <div className="am__input-wrap">
                                <input
                                    type="text" name="degree_pursuing" required
                                    placeholder="e.g. B.Tech"
                                    value={formData.degree_pursuing} onChange={handleChange}
                                />
                                <span className="am__input-icon">{Icon.cap}</span>
                            </div>
                        </div>
                        <div className="am__input-group">
                            <label>Branch *</label>
                            <div className="am__input-wrap">
                                <input
                                    type="text" name="branch" required
                                    placeholder="e.g. CSE, IT, ECE"
                                    value={formData.branch} onChange={handleChange}
                                />
                                <span className="am__input-icon">{Icon.building}</span>
                            </div>
                        </div>
                        <div className="am__input-group">
                            <label>Graduation Year *</label>
                            <div className="am__input-wrap">
                                <input
                                    type="number" name="graduation_year" required
                                    placeholder="YYYY" min="2024" max="2035"
                                    value={formData.graduation_year} onChange={handleChange}
                                    style={{ paddingLeft: '14px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="am__section-label">Documents</div>

                    <FileZone
                        label="College Proof (ID Card, Fee Receipt, etc.) *"
                        hint="ID Card or Fee Receipt"
                        accept="application/pdf,image/*"
                        maxSizeMB={5}
                        file={collegeProof}
                        onChange={(e) => handleFileChange(e, setCollegeProof, 5)}
                    />

                    <FileZone
                        label="Resume *"
                        hint="PDF only"
                        accept="application/pdf"
                        maxSizeMB={7}
                        file={resume}
                        onChange={(e) => handleFileChange(e, setResume, 7)}
                    />

                    {/* Terms */}
                    <div className="am__section-label">Consent</div>

                    <div className="am__checkbox-group">
                        <input
                            type="checkbox" id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <label htmlFor="terms">
                            I have read and agree to the{' '}
                            <a href="/terms" target="_blank" rel="noreferrer">Terms & Conditions</a>,{' '}
                            <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>, and{' '}
                            Refund Policy of AntiLabs.
                        </label>
                    </div>

                    {/* Manual Math Captcha */}
                    <div className="am__captcha">
                        <label>Security Verification *</label>
                        <div className="am__captcha-box">
                            <span className="am__captcha-problem">
                                {mathProblem.text.split('').map((ch, i) =>
                                    /[+\-]/.test(ch)
                                        ? <span key={i}> {ch} </span>
                                        : ch
                                )} = ?
                            </span>
                            <input
                                type="number"
                                required
                                placeholder="Answer"
                                value={mathAnswer}
                                onChange={(e) => setMathAnswer(e.target.value)}
                                className="am__captcha-input"
                            />
                        </div>
                        <span className="am__captcha-hint">Solve the problem above to confirm you're human.</span>
                    </div>

                </form>

                {/* ── Footer (outside scroll area) ── */}
                <div className="am__footer">
                    <button
                        type="button"
                        className="am__btn-cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="am-form"
                        className="am__btn-submit"
                        disabled={loading}
                    >
                        {loading
                            ? <><span className="am__spinner" />Processing…</>
                            : <>Continue to Payment&nbsp;{Icon.arrow}</>
                        }
                    </button>
                </div>

            </div>
        </div>
    );
}

