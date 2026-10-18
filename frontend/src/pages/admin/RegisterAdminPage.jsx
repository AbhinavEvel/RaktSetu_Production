import { useState } from 'react';
import { registerAdmin } from '../../services/authService';

function RegisterAdminPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await registerAdmin({ ...form, role: 'Admin' });
            setSuccess(`Admin account created for ${form.email}.`);
            setForm({ name: '', email: '', password: '', phone: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create admin account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="fw-bold text-danger">Register New Admin</h2>
            <p className="text-muted">Create another administrator account for RaktSetu.</p>

            <div className="bg-white rounded-3 shadow-sm p-4" style={{ maxWidth: '480px' }}>
                {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}
                {success && <div className="alert alert-success py-2" style={{ fontSize: '0.85rem' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            minLength={6}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-danger fw-semibold" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Admin Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterAdminPage;
