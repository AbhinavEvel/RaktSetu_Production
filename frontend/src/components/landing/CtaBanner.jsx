function CtaBanner() {
    return (
        <div className="container my-5">
            <div
                className="rounded-4 p-5 text-center text-white"
                style={{ background: 'linear-gradient(135deg, var(--brand-red) 0%, var(--brand-red-dark) 100%)' }}
            >
                <h2 className="fw-bold mb-2">Someone Needs Your Help Today</h2>
                <p className="mb-4" style={{ opacity: 0.9 }}>
                    Join hundreds of donors making a real difference, one donation at a time.
                </p>
                <a href="/register" className="btn btn-light btn-lg px-5 rounded-pill fw-semibold text-danger">
                    Register Now
                </a>
            </div>
        </div>
    );
}

export default CtaBanner;