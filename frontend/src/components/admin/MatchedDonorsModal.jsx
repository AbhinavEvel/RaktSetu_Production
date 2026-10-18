import { useState, useEffect } from 'react';
import { getMatchedDonors, rematchDonors } from '../../services/bloodRequestService';

function MatchedDonorsModal({ show, onClose, requestId }) {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rematching, setRematching] = useState(false);

    const fetchMatches = () => {
        setLoading(true);
        getMatchedDonors(requestId)
            .then((res) => setDonors(res.data))
            .catch((err) => console.error('Error fetching matched donors:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!show || !requestId) return;
        fetchMatches();
    }, [show, requestId]);

    if (!show) return null;

    const handleRematch = async () => {
        setRematching(true);
        try {
            const res = await rematchDonors(requestId);
            setDonors(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Could not re-run matching. Please try again.');
            console.error('Error rematching donors:', err);
        } finally {
            setRematching(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Matched Donors — Request #{requestId}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <p className="text-muted mb-0">Loading...</p>
                        ) : donors.length === 0 ? (
                            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                No donors have been alerted for this request yet. This can happen if no donor's
                                blood group, city, availability, verification, or cooldown matched at the time it
                                was created. Add/verify a matching donor, then try "Re-run Matching" below.
                            </p>
                        ) : (
                            <div className="d-flex flex-column gap-2">
                                {donors.map((d) => (
                                    <div key={d.alertId} className="border rounded-3 p-2 d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{d.donorName}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Sent: {d.sentAt}</div>
                                        </div>
                                        <span
                                            className={`badge ${
                                                d.response === 'ACCEPTED'
                                                    ? 'bg-success-subtle text-success'
                                                    : d.response === 'REJECTED'
                                                    ? 'bg-danger-subtle text-danger'
                                                    : 'bg-warning-subtle text-warning'
                                            }`}
                                        >
                                            {d.response}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-outline-danger" disabled={rematching} onClick={handleRematch}>
                            {rematching ? 'Matching...' : '🔄 Re-run Matching'}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchedDonorsModal;
