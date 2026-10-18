import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationDropdown from '../admin/NotificationDropdown';

function PatientTopbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-4 py-3">
            <div>
                <span className="fw-semibold" style={{ fontSize: '1rem' }}>
                    Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
                </span>
            </div>

            <div className="d-flex align-items-center gap-3">
                <NotificationDropdown />

                <div
                    className="d-flex align-items-center gap-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/patient/account')}
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
                            {user?.email || 'Patient'}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            PATIENT
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

export default PatientTopbar;
