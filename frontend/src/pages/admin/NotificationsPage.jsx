import { useState, useEffect } from 'react';
import { getAllNotifications } from '../../services/notificationService';

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await getAllNotifications();
                const sorted = [...res.data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setNotifications(sorted);
            } catch (err) {
                console.error('Error fetching notifications:', err);
                setError('Could not load notifications.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const filtered = notifications.filter((n) => {
        if (filter === 'READ') return n.isRead;
        if (filter === 'UNREAD') return !n.isRead;
        return true;
    });

    const typeColor = (type) => {
        if (type === 'EMERGENCY' || type === 'ALERT') return 'danger';
        if (type === 'SUCCESS' || type === 'DONATION') return 'success';
        return 'secondary';
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 className="fw-bold text-danger mb-0">Notifications</h2>
                    <p className="text-muted mb-0">Full history of system notifications across all users.</p>
                </div>
                <select className="form-select" style={{ width: '180px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="ALL">All</option>
                    <option value="UNREAD">Unread Only</option>
                    <option value="READ">Read Only</option>
                </select>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-4">
                {loading ? (
                    <p className="text-muted mb-0">Loading...</p>
                ) : error ? (
                    <p className="text-danger mb-0">{error}</p>
                ) : filtered.length === 0 ? (
                    <p className="text-muted mb-0">No notifications found.</p>
                ) : (
                    <table className="table align-middle">
                        <thead>
                            <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                                <th>USER ID</th>
                                <th>TYPE</th>
                                <th>MESSAGE</th>
                                <th>STATUS</th>
                                <th>DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((n) => (
                                <tr key={n.notificationId}>
                                    <td>#{n.userId}</td>
                                    <td>
                                        <span className={`badge bg-${typeColor(n.type)}-subtle text-${typeColor(n.type)}`}>
                                            {n.type}
                                        </span>
                                    </td>
                                    <td style={{ maxWidth: '420px' }}>{n.message}</td>
                                    <td>
                                        {n.isRead ? (
                                            <span className="text-muted">Read</span>
                                        ) : (
                                            <span className="text-danger fw-semibold">Unread</span>
                                        )}
                                    </td>
                                    <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default NotificationsPage;
