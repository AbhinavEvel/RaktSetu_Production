const STATUS_STYLES = {
    Accepted: 'bg-success-subtle text-success',
    Pending: 'bg-warning-subtle text-warning',
    Rejected: 'bg-danger-subtle text-danger',
};

function UsersTable({ users, onVerify, verifyingId }) {
    return (
        <div className="table-responsive">
            <table className="table align-middle mb-0">
                <thead>
                    <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Verification</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                    {users.map((u) => (
                        <tr key={u.userId}>
                            <td className="fw-semibold">{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone || '—'}</td>
                            <td>
                                <span className="badge bg-light text-dark">{u.role}</span>
                            </td>
                            <td>
                                <span className={`badge ${STATUS_STYLES[u.isVerified] || 'bg-light text-dark'}`}>
                                    {u.isVerified}
                                </span>
                            </td>
                            <td>
                                {u.isVerified !== 'Accepted' && (
                                    <button
                                        className="btn btn-danger btn-sm fw-semibold"
                                        disabled={verifyingId === u.userId}
                                        onClick={() => onVerify(u.userId)}
                                    >
                                        {verifyingId === u.userId ? 'Verifying...' : 'Verify'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersTable;
