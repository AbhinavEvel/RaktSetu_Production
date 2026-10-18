const BLOOD_GROUP_LABELS = {
    A_POS: 'A+', A_NEG: 'A-', AB_POS: 'AB+', AB_NEG: 'AB-',
    B_POS: 'B+', B_NEG: 'B-', O_POS: 'O+', O_NEG: 'O-',
};

function PatientsTable({ patients }) {
    return (
        <div className="table-responsive">
            <table className="table align-middle mb-0">
                <thead>
                    <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Blood Group Needed</th>
                        <th>Age</th>
                        <th>City</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                    {patients.map((p) => (
                        <tr key={p.patientId}>
                            <td className="fw-semibold">{p.name}</td>
                            <td>{p.email}</td>
                            <td>{p.phone || '—'}</td>
                            <td>
                                <span className="badge bg-danger-subtle text-danger">
                                    {BLOOD_GROUP_LABELS[p.bloodGroupNeeded] || p.bloodGroupNeeded}
                                </span>
                            </td>
                            <td>{p.age}</td>
                            <td>{p.city || '—'}</td>
                            <td>{p.state || '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PatientsTable;
