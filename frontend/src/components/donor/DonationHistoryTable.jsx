function DonationHistoryTable({ donations }) {
    return (
        <div className="bg-white rounded-3 shadow-sm p-3">
            <h6 className="fw-bold mb-3">Donation History</h6>

            {donations.length === 0 ? (
                <p className="text-muted text-center py-3 mb-0" style={{ fontSize: '0.9rem' }}>
                    No donations recorded yet. Once you donate, it'll show up here.
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                        <thead>
                            <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                                <th>Date</th>
                                <th>Units</th>
                                <th>Quantity (ml)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '0.9rem' }}>
                            {donations.map((d) => (
                                <tr key={d.donationId}>
                                    <td>{d.donationDate}</td>
                                    <td>{d.unitsDonated}</td>
                                    <td>{d.quantityMl}</td>
                                    <td>
                                        <span className={`badge ${d.status === 'COMPLETED' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                            {d.status}
                                        </span>
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

export default DonationHistoryTable;
