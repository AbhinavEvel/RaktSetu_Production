import logo from '../../assets/logo.png';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white sticky-top" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div className="container py-2">
                <a className="navbar-brand d-flex align-items-center gap-2" href="/">
                    <img src={logo} alt="RaktSetu" style={{ width: '44px', height: '44px' }} />
                    <span className="fw-bold fs-4" style={{ color: 'var(--brand-red)' }}>RaktSetu</span>
                </a>
                <div className="d-flex gap-2">
                    <a href="/login" className="btn btn-outline-danger btn-sm px-4 rounded-pill">Login</a>
                    <a href="/register" className="btn btn-danger btn-sm px-4 rounded-pill">Register</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;