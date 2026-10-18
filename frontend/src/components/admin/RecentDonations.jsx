import { useState, useEffect } from 'react';
import { getAllDonations } from '../../services/donationService';
import { getAllDonors } from '../../services/donorService';

function RecentDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [donationsRes, donorsRes] = await Promise.all([
                    getAllDonations(),
                    getAllDonors(),
                ]);

                const donorMap = {};
                donorsRes.data.forEach((d) => {
                    donorMap[d.donorId] = d;
                });

                const enriched = donationsRes.data
                    .map((don) => ({
                        ...don,
                        donorName: donorMap[don.donorId]?.name || `Donor #${don.donorId}`,
                        bloodGroup: donorMap[don.donorId]?.bloodGroup || '—',
                        city: donorMap[don.donorId]?.city || '—',
                    }))
                    .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
                    .slice(0, 5);

                setDonations(enriched);
            } catch (err) {
                console.error('Error fetching recent donations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2);
    const statusColor = (status) => (status === 'COMPLETED' ? 'success' : 'warning');

    return (
        <div className="bg-white rounded-3 p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Recent Donation Records</h5>
            </div>

            {loading ? (
                <p className="text-muted mb-0">Loading...</p>
            ) : donations.length === 0 ? (
                <p className="text-muted mb-0">No donations recorded yet.</p>
            ) : (
                <table className="table align-middle">
                    <thead>
                        <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                            <th>DONOR NAME</th>
                            <th>BLOOD GROUP</th>
                            <th>CITY</th>
                            <th>DATE</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((d) => (
                            <tr key={d.donationId}>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div
                                            className="rounded-circle bg-danger-subtle text-danger fw-bold d-flex align-items-center justify-content-center"
                                            style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}
                                        >
                                            {initials(d.donorName)}
                                        </div>
                                        <div>
                                            <div className="fw-semibold">{d.donorName}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                ID: #DN-{d.donorId}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge bg-danger-subtle text-danger">{d.bloodGroup}</span>
                                </td>
                                <td>{d.city}</td>
                                <td>{d.donationDate}</td>
                                <td>
                                    <span className={`text-${statusColor(d.status)}`}>
                                        ● {d.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default RecentDonations;
