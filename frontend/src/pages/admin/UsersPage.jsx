import { useState, useEffect } from 'react';
import { getAllUsers, verifyUser, registerAdmin } from '../../services/userService';
import UsersTable from '../../components/admin/UsersTable';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [addingAdmin, setAddingAdmin] = useState(false);
    const [addAdminError, setAddAdminError] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleVerify = async (userId) => {
        setVerifyingId(userId);
        try {
            await verifyUser(userId);
            setUsers((prev) => prev.map((u) => (u.userId === userId ? { ...u, isVerified: 'Accepted' } : u)));
        } catch (err) {
            alert('Could not verify this user. Please try again.');
            console.error('Error verifying user:', err);
        } finally {
            setVerifyingId(null);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setAddingAdmin(true);
        setAddAdminError('');
        try {
            await registerAdmin({ ...adminForm, role: 'Admin' });
            setShowAddAdmin(false);
            setAdminForm({ name: '', email: '', password: '', phone: '' });
            await fetchUsers();
        } catch (err) {
            setAddAdminError(err.response?.data?.message || 'Could not create admin account.');
            console.error('Error creating admin:', err);
        } finally {
            setAddingAdmin(false);
        }
    };

    const filtered = filter === 'ALL' ? users : users.filter((u) => u.isVerified === filter);
    const pendingCount = users.filter((u) => u.isVerified === 'Pending').length;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-danger">Users</h2>
                    <p className="text-muted mb-0">
                        Manage registered accounts. {pendingCount > 0 && `${pendingCount} awaiting verification.`}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <select className="form-select" style={{ width: '200px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="ALL">All Users</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <button className="btn btn-danger fw-semibold" onClick={() => setShowAddAdmin(true)}>
                        + Add Admin
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3">
                {loading ? (
                    <p className="text-muted mb-0">Loading...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-muted text-center py-3 mb-0">No users found.</p>
                ) : (
                    <UsersTable users={filtered} onVerify={handleVerify} verifyingId={verifyingId} />
                )}
            </div>

            {showAddAdmin && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Admin</h5>
                                <button className="btn-close" onClick={() => setShowAddAdmin(false)}></button>
                            </div>
                            <form onSubmit={handleAddAdmin}>
                                <div className="modal-body">
                                    {addAdminError && <div className="alert alert-danger py-2">{addAdminError}</div>}
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={adminForm.name}
                                            onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={adminForm.email}
                                            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={adminForm.phone}
                                            onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={adminForm.password}
                                            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddAdmin(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-danger" disabled={addingAdmin}>
                                        {addingAdmin ? 'Creating...' : 'Create Admin'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersPage;
