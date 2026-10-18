import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';

function PatientSidebar() {
    const menuItems = [
        { path: '/patient/dashboard', icon: '▦', label: 'Dashboard' },
        { path: '/patient/account', icon: '⚙️', label: 'My Account' },
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
                        PATIENT PORTAL
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

            <div className="text-muted text-center" style={{ fontSize: '0.75rem' }}>
                We're here to help you find blood, fast.
            </div>
        </div>
    );
}

export default PatientSidebar;
