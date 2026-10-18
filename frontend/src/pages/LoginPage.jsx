import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';


function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await loginUser(form);
            const { token, user } = res.data;
            const { email, role, userId, isVerified } = user;

            login(token, email, role, userId, isVerified);
            if (role === 'Admin') {
                navigate('/admin/dashboard');
            } else if (role === 'Donor') {
                navigate('/donor/dashboard');
            } else if (role === 'Patient') {
                navigate('/patient/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center vh-100"
            style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)' }}
        >
            <div className="bg-white rounded-4 p-5 shadow-sm" style={{ width: '400px' }}>
                <div className="text-center mb-4">
                    <a href="/">
                        <img src={logo} alt="RaktSetu" style={{ width: '60px' }} />
                    </a>
                    <h4 className="fw-bold mt-2" style={{ color: 'var(--brand-red)' }}>Welcome Back</h4>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Login to your RaktSetu account</p>
                </div>

                {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="text-end mb-3">
                        <a href="/forgot-password" className="text-danger text-decoration-none" style={{ fontSize: '0.8rem' }}>
                            Forgot Password?
                        </a>
                    </div>
                    <button type="submit" className="btn btn-danger w-100 fw-semibold" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '0.85rem' }}>
                    Don't have an account? <a href="/register" className="text-danger fw-semibold">Register</a>
                </p>
                <p className="text-center mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
                    <a href="/" className="text-muted text-decoration-none">← Back to Home</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;