import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import './Auth.css';

export default function ProfilePage() {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [trainings, setTrainings] = useState([]);
    const [loadingTrainings, setLoadingTrainings] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        profession: '',
        residential_address: '',
        age: ''
    });

    // Payment confirmation from Instamojo
    useEffect(() => {
        const checkPayment = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const regId = queryParams.get('reg_id');
            const paymentStatus = queryParams.get('payment_status');

            if (regId && paymentStatus) {
                if (paymentStatus === 'Credit') {
                    try {
                        await supabase
                            .from('training_registrations')
                            .update({ payment_status: 'paid' })
                            .eq('registration_id', regId);
                        setSuccessMsg('Payment Successful! Registration confirmed.');
                    } catch (err) {
                        console.error('Failed to confirm payment status', err);
                    }
                } else {
                    setErrorMsg('Payment Failed or Cancelled. Please try again.');
                }
                // Clean up URL to prevent re-triggering
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        };
        checkPayment();
    }, []);

    // Populate form data once user is available
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                profession: user.profession || '',
                residential_address: user.residential_address || '',
                age: user.age || ''
            });

            const fetchTrainings = async () => {
                try {
                    const { data, error } = await supabase
                        .from('training_registrations')
                        .select('*')
                        .eq('user_id', user.user_id)
                        .eq('payment_status', 'paid');

                    if (!error && data) {
                        setTrainings(data);
                    }
                } catch (err) {
                    console.error("Error fetching trainings", err);
                } finally {
                    setLoadingTrainings(false);
                }
            };
            fetchTrainings();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="auth-page">
                <Navbar />
                <main className="auth-container" style={{ textAlign: 'center' }}>
                    <div className="auth-card">
                        <h2>Unauthorized</h2>
                        <p style={{ marginTop: '8px', color: '#64748b' }}>Please log in to view this page.</p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary auth-btn" style={{ marginTop: '24px' }}>
                            Go to Login
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const { data, error } = await supabase
                .from('users')
                .update({
                    name: formData.name,
                    phone_number: formData.phone_number,
                    profession: formData.profession,
                    residential_address: formData.residential_address,
                    age: formData.age ? parseInt(formData.age) : null
                })
                .eq('user_id', user.user_id)
                .select()
                .single();

            if (error) throw error;

            login(data); // update global context and localStorage
            setSuccessMsg('Profile updated successfully!');
            setIsEditing(false);

            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Update error:', err);
            setErrorMsg(err.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    // To handle responsiveness smoothly without extra CSS classes
    const layoutStyle = {
        maxWidth: '1000px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '48px',
        padding: '48px',
        alignItems: 'flex-start'
    };

    return (
        <div className="auth-page">
            <Navbar />
            <main className="auth-container">
                <div className="auth-card" style={layoutStyle}>

                    {/* LEFT SIDEBAR */}
                    <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: '240px' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            backgroundColor: '#0ea5e9',
                            color: '#fff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3.5rem',
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            boxShadow: '0 8px 24px rgba(14, 165, 233, 0.3)'
                        }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>{user.name}</h1>
                        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1.05rem' }}>{user.profession || 'Member'}</p>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="btn btn-primary auth-btn" style={{ width: '100%', margin: 0 }}>
                                    Edit Profile
                                </button>
                            ) : (
                                <button onClick={() => {
                                    setIsEditing(false);
                                    setErrorMsg('');
                                    // Reset form data onto user's current original state
                                    setFormData({
                                        name: user.name || '',
                                        email: user.email || '',
                                        phone_number: user.phone_number || '',
                                        profession: user.profession || '',
                                        residential_address: user.residential_address || '',
                                        age: user.age || ''
                                    });
                                }} className="btn btn-secondary auth-btn" style={{ width: '100%', margin: 0 }}>
                                    Cancel Editing
                                </button>
                            )}

                            <button onClick={handleLogout} className="btn btn-secondary auth-btn" style={{ width: '100%', margin: 0, borderColor: '#fca5a5', color: '#dc2626', backgroundColor: '#fef2f2' }}>
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div style={{ flex: '3 1 400px', minWidth: '300px', position: 'relative' }}>
                        {/* Hidden vertical line mimicking a border visible only on desktop width */}
                        <div style={{ position: 'absolute', left: '-24px', top: '0', bottom: '0', width: '1px', backgroundColor: '#e2e8f0', display: window.innerWidth > 800 ? 'block' : 'none' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a' }}>
                                {isEditing ? 'Update Details' : 'Personal Information'}
                            </h2>
                        </div>

                        {errorMsg && (
                            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', fontWeight: '500', fontSize: '0.95rem' }}>
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', fontWeight: '500', fontSize: '0.95rem', border: '1px solid #bbf7d0' }}>
                                {successMsg}
                            </div>
                        )}

                        {!isEditing ? (
                            <div className="auth-form-grid" style={{ gap: '20px' }}>
                                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <strong style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</strong>
                                    <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '1.1rem' }}>{user.name}</div>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <strong style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</strong>
                                    <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '1.1rem' }}>{user.email}</div>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <strong style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profession</strong>
                                    <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '1.1rem' }}>{user.profession || '-'}</div>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <strong style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</strong>
                                    <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '1.1rem' }}>{user.phone_number || '-'}</div>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <strong style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age</strong>
                                    <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '1.1rem' }}>{user.age || '-'}</div>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>
                                    <strong style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Residential Address</strong>
                                    <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>{user.residential_address || '-'}</div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="auth-form auth-form-grid" style={{ gap: '20px' }}>
                                <div className="auth-group">
                                    <label>Full Name</label>
                                    <input type="text" name="name" className="auth-input" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="auth-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" className="auth-input" value={formData.email} onChange={handleChange} disabled style={{ backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} title="Email address cannot be changed." />
                                </div>
                                <div className="auth-group">
                                    <label>Profession</label>
                                    <input type="text" name="profession" className="auth-input" value={formData.profession} onChange={handleChange} required />
                                </div>
                                <div className="auth-group">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone_number" className="auth-input" value={formData.phone_number} onChange={handleChange} required />
                                </div>
                                <div className="auth-group">
                                    <label>Age</label>
                                    <input type="number" name="age" className="auth-input" value={formData.age} onChange={handleChange} min="1" max="150" />
                                </div>
                                <div className="auth-group auth-group--full">
                                    <label>Residential Address</label>
                                    <textarea name="residential_address" className="auth-input" value={formData.residential_address} onChange={handleChange} required style={{ minHeight: '100px' }} />
                                </div>
                                <div className="auth-group auth-group--full" style={{ marginTop: '8px' }}>
                                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading} style={{ margin: 0 }}>
                                        {loading ? 'Saving Changes...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Training Programs */}
                        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a', marginBottom: '24px' }}>
                                My Enrolled Programs
                            </h2>
                            {loadingTrainings ? (
                                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Loading your programs...</div>
                            ) : trainings.length === 0 ? (
                                <div style={{ padding: '32px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                                    <p style={{ color: '#64748b', marginBottom: '16px' }}>You haven't completed enrollment for any training programs yet.</p>
                                    <button onClick={() => navigate('/careers')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.95rem', margin: '0 auto' }}>Explore Programs</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {trainings.map((t) => (
                                        <div key={t.registration_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                            <div>
                                                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '8px' }}>{t.position}</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.9rem', color: '#64748b' }}>
                                                    <span>🏦 {t.college_name}</span>
                                                    <span>🎓 {t.degree_pursuing}</span>
                                                    <span>📅 Class of {t.graduation_year}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #bbf7d0' }}>Payment Confirmed</span>
                                                <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>₹{parseInt(t.fees_amount).toLocaleString('en-IN')} Paid</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
