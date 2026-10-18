import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

function Topbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-4 py-3">
            <input
                type="text"
                className="form-control"
                placeholder="🔍 Search donors, requests, or stock..."
                style={{ maxWidth: '400px' }}
            />

            <div className="d-flex align-items-center gap-3">
                <button
                    className="btn btn-danger fw-semibold"
                    onClick={() => navigate('/admin/requests?urgency=EMERGENCY')}
                >
                    Emergency Request
                </button>

                <NotificationDropdown />

                <div
                    className="d-flex align-items-center gap-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/admin/account')}
                    title="My Account"
                >
                    <div
                        className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center"
                        style={{ width: '38px', height: '38px' }}
                    >
                        👤
                    </div>
                    <div>
                        <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                            {user?.email || 'Admin User'}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {user?.role || 'SUPER ADMIN'}
                        </div>
                    </div>
                </div>

                <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Topbar;