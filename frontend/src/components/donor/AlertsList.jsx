function AlertsList({ alerts, onRespond, respondingId, canAccept = true }) {
    return (
        <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="fw-bold mb-3">Emergency Alerts</h6>

            {alerts.length === 0 ? (
                <p className="text-muted text-center py-3 mb-0" style={{ fontSize: '0.9rem' }}>
                    No alerts right now. We'll notify you when a nearby patient needs your blood group.
                </p>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {alerts.map((a) => (
                        <div key={a.alertId} className="border rounded-3 p-3">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                                        Blood Request #{a.requestId}
                                    </div>
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                        Sent: {a.sentAt}
                                    </div>
                                </div>
                                <span
                                    className={`badge ${
                                        a.response === 'ACCEPTED'
                                            ? 'bg-success-subtle text-success'
                                            : a.response === 'REJECTED'
                                            ? 'bg-danger-subtle text-danger'
                                            : 'bg-warning-subtle text-warning'
                                    }`}
                                >
                                    {a.response}
                                </span>
                            </div>

                            {a.response === 'PENDING' && (
                                <div className="d-flex gap-2 mt-2">
                                    <button
                                        className="btn btn-success btn-sm fw-semibold"
                                        disabled={respondingId === a.alertId || !canAccept}
                                        title={!canAccept ? 'Your account must be verified by an admin before you can accept' : ''}
                                        onClick={() => onRespond(a.alertId, 'ACCEPTED')}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm fw-semibold"
                                        disabled={respondingId === a.alertId}
                                        onClick={() => onRespond(a.alertId, 'REJECTED')}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AlertsList;
