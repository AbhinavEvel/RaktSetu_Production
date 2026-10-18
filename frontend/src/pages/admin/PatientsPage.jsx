import { useState, useEffect } from 'react';
import { getAllPatients } from '../../services/patientService';
import PatientsTable from '../../components/admin/PatientsTable';

function PatientsPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getAllPatients()
            .then((res) => setPatients(res.data))
            .catch((err) => console.error('Error fetching patients:', err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = patients.filter(
        (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.city?.toLowerCase().includes(search.toLowerCase()) ||
            p.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-danger">Patients</h2>
                    <p className="text-muted mb-0">All registered patients in the system.</p>
                </div>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, email, city..."
                    style={{ width: '280px' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3">
                {loading ? (
                    <p className="text-muted mb-0">Loading...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-muted text-center py-3 mb-0">No patients found.</p>
                ) : (
                    <PatientsTable patients={filtered} />
                )}
            </div>
        </div>
    );
}

export default PatientsPage;
