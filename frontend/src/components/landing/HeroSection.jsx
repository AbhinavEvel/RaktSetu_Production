import logo from '../../assets/logo.png';

function HeroSection() {
    return (
        <div style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)' }} className="py-5">
            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <span className="badge bg-white text-danger fw-semibold px-3 py-2 mb-3 rounded-pill" style={{ boxShadow: 'var(--shadow-soft)' }}>
                            🩸 Every Drop Counts
                        </span>
                        <h1 className="display-4 fw-bold text-dark mb-3" style={{ letterSpacing: '-1px' }}>
                            Bridging Lives <span style={{ color: 'var(--brand-red)' }}>Through Blood</span>
                        </h1>
                        <p className="lead text-muted mb-4" style={{ maxWidth: '520px' }}>
                            Connect blood donors with patients in need — fast, reliable, life-saving.
                            One donation can save up to three lives.
                        </p>
                        <div className="d-flex gap-3 mb-4">
                            <a href="/register" className="btn btn-danger btn-lg px-4 rounded-pill fw-semibold">
                                Become a Donor
                            </a>
                            <a href="/register" className="btn btn-outline-danger btn-lg px-4 rounded-pill fw-semibold">
                                Request Blood
                            </a>
                        </div>
                        <div className="d-flex align-items-center gap-4 text-muted" style={{ fontSize: '0.85rem' }}>
                            <span>✅ Verified Donors</span>
                            <span>⚡ Instant Matching</span>
                            <span>🔒 Secure & Private</span>
                        </div>
                    </div>
                    <div className="col-lg-5 text-center mt-5 mt-lg-0">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle"
                            style={{
                                width: '340px', height: '340px',
                                background: 'radial-gradient(circle, #ffffff 0%, #ffe3e3 100%)',
                                boxShadow: 'var(--shadow-soft)',
                            }}
                        >
                            <img src={logo} alt="RaktSetu" style={{ width: '250px', maxWidth: '85%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;