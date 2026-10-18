import logo from '../../assets/logo.png';

function Footer() {
    return (
        <footer className="bg-dark text-white pt-5 pb-3 mt-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <img src={logo} alt="RaktSetu" style={{ width: '36px', height: '36px' }} />
                            <span className="fw-bold fs-5">RaktSetu</span>
                        </div>
                        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                            Bridging Lives Through Blood — connecting donors with patients across the city.
                        </p>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h6 className="fw-bold">Quick Links</h6>
                        <ul className="list-unstyled text-secondary" style={{ fontSize: '0.9rem' }}>
                            <li><a href="/" className="text-secondary text-decoration-none">Home</a></li>
                            <li><a href="/register" className="text-secondary text-decoration-none">Become a Donor</a></li>
                            <li><a href="/register" className="text-secondary text-decoration-none">Request Blood</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h6 className="fw-bold">Contact</h6>
                        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                            <a href="mailto:raktsetu05206@gmail.com" className="text-secondary text-decoration-none">raktsetu05206@gmail.com</a><br />
                            <a href="tel:+917814980312" className="text-secondary text-decoration-none">+91-7814980312</a>
                        </p>
                    </div>
                </div>
                <hr className="border-secondary" />
                <p className="text-center text-secondary mb-0" style={{ fontSize: '0.8rem' }}>
                    © 2026 RaktSetu. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;