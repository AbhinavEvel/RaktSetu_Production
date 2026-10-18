function RequestsTable({ requests, onStatusChange, onViewMatches, updatingId }) {
    return (
        <div className="table-responsive">
            <table className="table align-middle mb-0">
                <thead>
                    <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                        <th>ID</th>
                        <th>Blood Group</th>
                        <th>Component</th>
                        <th>Units</th>
                        <th>Urgency</th>
                        <th>Contact</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                    {requests.map((r) => (
                        <tr key={r.requestId}>
                            <td>#{r.requestId}</td>
                            <td className="fw-semibold">{r.bloodGroup}</td>
                            <td>{r.component}</td>
                            <td>{r.unitsNeeded}</td>
                            <td>
                                <span className={`badge ${r.urgency === 'EMERGENCY' ? 'bg-danger-subtle text-danger' : 'bg-light text-dark'}`}>
                                    {r.urgency}
                                </span>
                            </td>
                            <td>{r.contactNumber}</td>
                            <td style={{ maxWidth: '150px' }} className="text-truncate">{r.locationDetails}</td>
                            <td>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: '130px' }}
                                    value={r.status}
                                    disabled={updatingId === r.requestId}
                                    onChange={(e) => onStatusChange(r.requestId, e.target.value)}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="FULFILLED">FULFILLED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </td>
                            <td>
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => onViewMatches(r.requestId)}
                                >
                                    Matches
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RequestsTable;
