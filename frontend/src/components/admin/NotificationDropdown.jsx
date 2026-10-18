import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getUserNotifications, markAsRead } from '../../services/notificationService';

function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const { user } = useContext(AuthContext);

    const fetchNotifications = async () => {
        if (!user?.userId) return;
        try {
            const res = await getUserNotifications(user.userId);
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    // Bahar click hone pe dropdown band ho jaaye
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            fetchNotifications();
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="position-relative" ref={dropdownRef}>
            <span
                style={{ fontSize: '1.2rem', cursor: 'pointer', position: 'relative' }}
                onClick={() => setOpen(!open)}
            >
                🔔
                {unreadCount > 0 && (
                    <span
                        className="badge bg-danger rounded-circle position-absolute"
                        style={{ top: '-6px', right: '-8px', fontSize: '0.6rem' }}
                    >
                        {unreadCount}
                    </span>
                )}
            </span>

            {open && (
                <div
                    className="position-absolute bg-white rounded-3 shadow-sm"
                    style={{ top: '35px', right: 0, width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 1000 }}
                >
                    <div className="p-3 border-bottom fw-bold">Notifications</div>
                    {notifications.length === 0 && (
                        <div className="p-3 text-muted text-center" style={{ fontSize: '0.85rem' }}>
                            No notifications yet
                        </div>
                    )}
                    {notifications.map((n) => (
                        <div
                            key={n.notificationId}
                            className={`p-3 border-bottom ${!n.isRead ? 'bg-danger-subtle' : ''}`}
                            style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                            onClick={() => handleMarkAsRead(n.notificationId)}
                        >
                            <div>{n.message}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{n.createdAt}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;