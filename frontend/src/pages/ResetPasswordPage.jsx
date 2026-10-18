import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import logo from '../assets/logo.png';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError('This reset link is missing its token. Please request a new one.');
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ token, newPassword: form.newPassword });
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Could not reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center py-5"
            style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)', minHeight: '100vh' }}
        >
            <div className="bg-white rounded-4 p-5 shadow-sm" style={{ width: '420px' }}>
                <div className="text-center mb-4">
                    <a href="/">
                        <img src={logo} alt="RaktSetu" style={{ width: '60px' }} />
                    </a>
                    <h4 className="fw-bold mt-2" style={{ color: 'var(--brand-red)' }}>Reset Password</h4>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Choose a new password for your account.</p>
                </div>

                {!token && (
                    <div className="alert alert-warning py-2" style={{ fontSize: '0.85rem' }}>
                        No reset token found in the link. Please use the link from your email, or request a new one.
                    </div>
                )}

                {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}
                {success && <div className="alert alert-success py-2" style={{ fontSize: '0.85rem' }}>{success}</div>}

                {!success && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                minLength={6}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-danger w-100 fw-semibold" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <p className="text-center mt-4 mb-0" style={{ fontSize: '0.85rem' }}>
                    <a href="/login" className="text-danger fw-semibold text-decoration-none">← Back to Login</a>
                </p>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
