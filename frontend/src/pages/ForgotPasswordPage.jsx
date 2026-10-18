import { useState } from 'react';
import { forgotPassword } from '../services/authService';
import logo from '../assets/logo.png';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await forgotPassword({ email });
            setMessage(res.data || 'If an account exists for this email, a password reset link has been sent.');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Something went wrong. Please try again.');
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
                    <h4 className="fw-bold mt-2" style={{ color: 'var(--brand-red)' }}>Forgot Password</h4>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                        Enter your account email and we'll send you a reset link.
                    </p>
                </div>

                {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}
                {message && <div className="alert alert-success py-2" style={{ fontSize: '0.85rem' }}>{message}</div>}

                {!message && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-danger w-100 fw-semibold" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;
