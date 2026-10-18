function HowItWorks() {
    const steps = [
        { icon: '📝', title: 'Register', desc: 'Sign up as a donor or patient in under 2 minutes.' },
        { icon: '🔍', title: 'Get Matched', desc: 'Our system finds the nearest compatible donor instantly.' },
        { icon: '🚑', title: 'Save a Life', desc: 'Coordinate donation and help someone in critical need.' },
    ];

    return (
        <div className="container py-5 my-4">
            <div className="text-center mb-5">
                <h2 className="section-title fs-1">How RaktSetu Works</h2>
                <p className="text-muted">Three simple steps to make a difference</p>
            </div>
            <div className="row g-4">
                {steps.map((step, index) => (
                    <div className="col-md-4 text-center" key={index}>
                        <div className="bg-white rounded-4 p-4 h-100 hover-lift" style={{ border: '1px solid #f1f1f1' }}>
                            <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                style={{ width: '70px', height: '70px', fontSize: '2rem', backgroundColor: '#fde2e2' }}
                            >
                                {step.icon}
                            </div>
                            <h5 className="fw-bold">{index + 1}. {step.title}</h5>
                            <p className="text-muted mb-0">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HowItWorks;