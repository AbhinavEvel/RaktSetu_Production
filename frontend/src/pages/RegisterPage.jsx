import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import logo from '../assets/logo.png';

function RegisterPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'Donor',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Typing karte hi us field ka error clear kar do
        setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    // Backend ke rules ke exact match mein client-side validation
    const validate = () => {
        const errors = {};

        // Name: required, max 50 chars
        if (!form.name.trim()) {
            errors.name = 'Name is required';
        } else if (form.name.length > 50) {
            errors.name = 'Name must be under 50 characters';
        }

        // Email: required, valid format
       // Email: required, only @gmail.com or @yahoo.com allowed
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/;
        if (!form.email.trim()) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(form.email)) {
            errors.email = 'Only @gmail.com or @yahoo.com emails are allowed';
        }

        // Password: required, min 6 chars
        if (!form.password) {
            errors.password = 'Password is required';
        } else if (form.password.length < 6) {
            errors.password = 'Password must be atleast 6 characters';
        }

        // Phone: matches backend pattern ^[6-9][0-9]{9}$
        const phoneRegex = /^[6-9][0-9]{9}$/;
        if (!form.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(form.phone)) {
            errors.phone = 'Enter a valid 10-digit phone number';
        }

        // Role: required
        if (!form.role) {
            errors.role = 'Role is required';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Pehle client-side validation
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return; // API call mat karo agar validation fail ho
        }

        setLoading(true);
        try {
            await registerUser(form);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const data = err.response?.data;
            let errMsg = 'Registration failed. Please try again.';

            if (data?.message) {
                if (typeof data.message === 'string') {
                    // Simple string error (jaise "Email already exists")
                    errMsg = data.message;
                } else if (typeof data.message === 'object') {
                    // Backend field-wise errors bhej raha hai — unhe fieldErrors mein daal do
                    setFieldErrors(data.message);
                    errMsg = 'Please fix the errors below.';
                }
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center py-5"
            style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)', minHeight: '100vh' }}
        >
            <div className="bg-white rounded-4 p-5 shadow-sm" style={{ width: '440px' }}>
                <div className="text-center mb-4">
                    <a href="/">
                        <img src={logo} alt="RaktSetu" style={{ width: '60px' }} />
                    </a>
                    <h4 className="fw-bold mt-2" style={{ color: 'var(--brand-red)' }}>Create Account</h4>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Join RaktSetu and start saving lives</p>
                </div>

                {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}
                {success && <div className="alert alert-success py-2" style={{ fontSize: '0.85rem' }}>{success}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                            value={form.name}
                            onChange={handleChange}
                        />
                        {fieldErrors.name && (
                            <div className="invalid-feedback">{fieldErrors.name}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                            value={form.email}
                            onChange={handleChange}
                        />
                        {fieldErrors.email && (
                            <div className="invalid-feedback">{fieldErrors.email}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                            value={form.password}
                            onChange={handleChange}
                        />
                        {fieldErrors.password && (
                            <div className="invalid-feedback">{fieldErrors.password}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`}
                            value={form.phone}
                            onChange={handleChange}
                            // placeholder="e.g. 9876543210"
                        />
                        {fieldErrors.phone && (
                            <div className="invalid-feedback">{fieldErrors.phone}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="form-label">I want to register as</label>
                        <select
                            name="role"
                            className={`form-select ${fieldErrors.role ? 'is-invalid' : ''}`}
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="Donor">Donor</option>
                            <option value="Patient">Patient</option>
                        </select>
                        {fieldErrors.role && (
                            <div className="invalid-feedback">{fieldErrors.role}</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-danger w-100 fw-semibold" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '0.85rem' }}>
                    Already have an account? <a href="/login" className="text-danger fw-semibold">Login</a>
                </p>
                <p className="text-center mt-2 mb-0" style={{ fontSize: '0.8rem' }}>
                    <a href="/" className="text-muted text-decoration-none">← Back to Home</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;