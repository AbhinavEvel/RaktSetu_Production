const BLOOD_GROUP_LABELS = {
    A_POS: 'A+', A_NEG: 'A-', AB_POS: 'AB+', AB_NEG: 'AB-',
    B_POS: 'B+', B_NEG: 'B-', O_POS: 'O+', O_NEG: 'O-',
};

const STATUS_STYLES = {
    PENDING: 'bg-warning-subtle text-warning',
    FULFILLED: 'bg-success-subtle text-success',
    CANCELLED: 'bg-secondary-subtle text-secondary',
};

function BloodRequestsTable({ requests, onEdit, onCancel, cancellingId }) {
    return (
        <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="fw-bold mb-3">My Blood Requests</h6>

            {requests.length === 0 ? (
                <p className="text-muted text-center py-3 mb-0" style={{ fontSize: '0.9rem' }}>
                    No requests yet. Click "New Request" whenever blood is needed.
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                        <thead>
                            <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                                <th>Blood Group</th>
                                <th>Component</th>
                                <th>Units</th>
                                <th>Urgency</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '0.9rem' }}>
                            {requests.map((r) => (
                                <tr key={r.requestId}>
                                    <td className="fw-semibold">{BLOOD_GROUP_LABELS[r.bloodGroup] || r.bloodGroup}</td>
                                    <td>{r.component}</td>
                                    <td>{r.unitsNeeded}</td>
                                    <td>
                                        <span className={`badge ${r.urgency === 'EMERGENCY' ? 'bg-danger-subtle text-danger' : 'bg-light text-dark'}`}>
                                            {r.urgency}
                                        </span>
                                    </td>
                                    <td style={{ maxWidth: '160px' }} className="text-truncate">{r.locationDetails}</td>
                                    <td>
                                        <span className={`badge ${STATUS_STYLES[r.status] || 'bg-light text-dark'}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td>
                                        {r.status === 'PENDING' && (
                                            <div className="d-flex gap-1">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => onEdit(r)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    disabled={cancellingId === r.requestId}
                                                    onClick={() => onCancel(r.requestId)}
                                                >
                                                    {cancellingId === r.requestId ? '...' : 'Cancel'}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BloodRequestsTable;
