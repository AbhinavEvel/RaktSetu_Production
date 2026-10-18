import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%)', minHeight: '100vh' }}
        >
            <div className="text-center bg-white rounded-4 p-5 shadow-sm" style={{ maxWidth: '480px' }}>
                <img src={logo} alt="RaktSetu" style={{ width: '56px' }} className="mb-3" />
                <h1 className="fw-bold" style={{ color: 'var(--brand-red)', fontSize: '4rem' }}>404</h1>
                <h5 className="fw-bold mb-2">Page Not Found</h5>
                <p className="text-muted mb-4">
                    The page you're looking for doesn't exist or may have been moved.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                    <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                    <button className="btn btn-danger fw-semibold" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
