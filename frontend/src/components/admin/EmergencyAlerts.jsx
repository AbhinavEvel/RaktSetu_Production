import { useState, useEffect } from 'react';
import { getAllRequests } from '../../services/bloodRequestService';

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

function EmergencyAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await getAllRequests();
                const emergencyPending = res.data
                    .filter((r) => r.urgency === 'EMERGENCY' && r.status === 'PENDING')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);
                setAlerts(emergencyPending);
            } catch (err) {
                console.error('Error fetching emergency alerts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <div className="rounded-3 p-3 mb-3" style={{ backgroundColor: '#7a1f2b' }}>
            <div className="d-flex align-items-center gap-2 mb-3 text-white">
                <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                <h6 className="fw-bold mb-0">Emergency Alerts</h6>
            </div>

            {loading ? (
                <div className="bg-white rounded-3 p-3 text-muted" style={{ fontSize: '0.85rem' }}>Loading...</div>
            ) : alerts.length === 0 ? (
                <div className="bg-white rounded-3 p-3 text-muted" style={{ fontSize: '0.85rem' }}>
                    No pending emergency requests right now.
                </div>
            ) : (
                alerts.map((alert) => (
                    <div key={alert.requestId} className="bg-white rounded-3 p-3 mb-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="badge bg-danger fw-semibold" style={{ fontSize: '0.7rem' }}>
                                CRITICAL
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {timeAgo(alert.createdAt)}
                            </span>
                        </div>
                        <div className="fw-bold text-dark mb-1">{alert.bloodGroup} Required</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                            {alert.locationDetails} — {alert.unitsNeeded} unit{alert.unitsNeeded > 1 ? 's' : ''} needed.
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default EmergencyAlerts;
