import { useState, useEffect } from 'react';
import { getCurrentUser, changePassword } from '../../services/authService';

function AccountPage() {
    const [profile, setProfile] = useState(null);
    const [loadError, setLoadError] = useState('');

    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getCurrentUser();
                setProfile(res.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setLoadError('Could not load your account details.');
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.newPassword !== form.confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }
        if (form.newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }

        setSaving(true);
        try {
            await changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setSuccess('Password changed successfully.');
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Could not change password.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h2 className="fw-bold text-danger">My Account</h2>
            <p className="text-muted">Your account details and security settings.</p>

            <div className="row g-3">
                <div className="col-md-5">
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Profile</h5>
                        {loadError && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{loadError}</div>}
                        {!profile && !loadError && <p className="text-muted mb-0">Loading...</p>}
                        {profile && (
                            <div style={{ fontSize: '0.9rem' }}>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="text-muted">Name</span>
                                    <span className="fw-semibold">{profile.name}</span>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="text-muted">Email</span>
                                    <span className="fw-semibold">{profile.email}</span>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="text-muted">Phone</span>
                                    <span className="fw-semibold">{profile.phone || '—'}</span>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <span className="text-muted">Role</span>
                                    <span className="fw-semibold">{profile.role}</span>
                                </div>
                                <div className="d-flex justify-content-between py-2">
                                    <span className="text-muted">Verification Status</span>
                                    <span className={`fw-semibold ${profile.isVerified === 'Accepted' ? 'text-success' : 'text-warning'}`}>
                                        {profile.isVerified}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Change Password</h5>

                        {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}
                        {success && <div className="alert alert-success py-2" style={{ fontSize: '0.85rem' }}>{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="form-control"
                                    value={form.currentPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="form-control"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    minLength={6}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    minLength={6}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-danger fw-semibold" disabled={saving}>
                                {saving ? 'Saving...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountPage;
