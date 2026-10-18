import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

function Sidebar() {
    const navigate = useNavigate();
    const menuItems = [
        { path: '/admin/dashboard', icon: '▦', label: 'Dashboard' },
        { path: '/admin/inventory', icon: '🩸', label: 'Inventory' },
        { path: '/admin/donors', icon: '👥', label: 'Donors' },
        { path: '/admin/patients', icon: '🧑‍⚕️', label: 'Patients' },
        { path: '/admin/requests', icon: '📍', label: 'Blood Requests' },
        { path: '/admin/users', icon: '✅', label: 'Users' },
        { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
        { path: '/admin/notifications', icon: '🔔', label: 'Notifications' },
        { path: '/admin/register-admin', icon: '🛡️', label: 'Register Admin' },
        { path: '/admin/account', icon: '⚙️', label: 'My Account' },
    ];

    return (
        <div className="d-flex flex-column bg-white border-end vh-100 p-3" style={{ width: '260px' }}>
            {/* Logo Section */}
            <div className="d-flex align-items-center mb-4">
                <img src={logo} alt="RaktSetu" style={{ width: '45px', height: '45px' }} />
                <div className="ms-2">
                    <div className="fw-bold text-danger" style={{ fontSize: '0.95rem' }}>
                        BLOOD BANK
                    </div>
                    <div className="fw-bold text-danger" style={{ fontSize: '0.95rem', marginTop: '-4px' }}>
                        MANAGEMENT
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-grow-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `d-flex align-items-center gap-2 px-3 py-2 mb-1 rounded text-decoration-none ${
                                isActive ? 'bg-danger-subtle text-danger fw-semibold' : 'text-secondary'
                            }`
                        }
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Button */}
            <button className="btn btn-danger fw-bold" onClick={() => navigate('/admin/inventory')}>
                Schedule Donation
            </button>
        </div>
    );
}

export default Sidebar;