import { useState, useEffect } from 'react';
import { getAllDonors } from '../../services/donorService';
import DonorsTable from '../../components/admin/DonorsTable';

function DonorsPage() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);

    useEffect(() => {
        getAllDonors()
            .then((res) => setDonors(res.data))
            .catch((err) => console.error('Error fetching donors:', err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = donors.filter((d) => {
        const matchesSearch =
            d.name?.toLowerCase().includes(search.toLowerCase()) ||
            d.city?.toLowerCase().includes(search.toLowerCase()) ||
            d.email?.toLowerCase().includes(search.toLowerCase());
        const matchesAvailability = !availableOnly || d.isAvailable === 'Yes';
        return matchesSearch && matchesAvailability;
    });

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-danger">Donors</h2>
                    <p className="text-muted mb-0">All registered donors in the system.</p>
                </div>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, email, city..."
                        style={{ width: '260px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="form-check form-switch d-flex align-items-center ps-0">
                        <input
                            className="form-check-input ms-0 me-2"
                            type="checkbox"
                            role="switch"
                            checked={availableOnly}
                            onChange={(e) => setAvailableOnly(e.target.checked)}
                        />
                        <label className="form-check-label" style={{ fontSize: '0.85rem' }}>Available only</label>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3">
                {loading ? (
                    <p className="text-muted mb-0">Loading...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-muted text-center py-3 mb-0">No donors found.</p>
                ) : (
                    <DonorsTable donors={filtered} />
                )}
            </div>
        </div>
    );
}

export default DonorsPage;
