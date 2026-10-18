const BLOOD_GROUP_LABELS = {
    A_POS: 'A+', A_NEG: 'A-', AB_POS: 'AB+', AB_NEG: 'AB-',
    B_POS: 'B+', B_NEG: 'B-', O_POS: 'O+', O_NEG: 'O-',
};

function DonorsTable({ donors }) {
    return (
        <div className="table-responsive">
            <table className="table align-middle mb-0">
                <thead>
                    <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Blood Group</th>
                        <th>Age</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Availability</th>
                        <th>Last Donation</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                    {donors.map((d) => (
                        <tr key={d.donorId}>
                            <td className="fw-semibold">{d.name}</td>
                            <td>{d.email}</td>
                            <td>{BLOOD_GROUP_LABELS[d.bloodGroup] || d.bloodGroup}</td>
                            <td>{d.age}</td>
                            <td>{d.city || '—'}</td>
                            <td>{d.state || '—'}</td>
                            <td>
                                <span className={`badge ${d.isAvailable === 'Yes' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                    {d.isAvailable === 'Yes' ? 'Available' : 'Not Available'}
                                </span>
                            </td>
                            <td>{d.lastDonationDate || '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DonorsTable;
