import { useState } from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function PatientProfileCard({ profile, onUpdate, updating }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        bloodGroupNeeded: profile.bloodGroupNeeded,
        age: profile.age,
        city: profile.city || '',
        state: profile.state || '',
        address: profile.address || '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        onUpdate({ ...form, age: Number(form.age) });
        setEditing(false);
    };

    return (
        <div className="bg-white rounded-3 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h5 className="fw-bold mb-0">{profile.name}</h5>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{profile.email}</span>
                </div>
                <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger fw-bold"
                    style={{ width: '50px', height: '50px', fontSize: '1rem' }}
                >
                    {profile.bloodGroupNeeded}
                </div>
            </div>

            {!editing ? (
                <>
                    <div className="row g-2 mb-3" style={{ fontSize: '0.9rem' }}>
                        <div className="col-6"><span className="text-muted">Phone:</span> {profile.phone || '—'}</div>
                        <div className="col-6"><span className="text-muted">Age:</span> {profile.age}</div>
                        <div className="col-6"><span className="text-muted">City:</span> {profile.city || '—'}</div>
                        <div className="col-6"><span className="text-muted">State:</span> {profile.state || '—'}</div>
                        <div className="col-12"><span className="text-muted">Address:</span> {profile.address || '—'}</div>
                    </div>

                    <div className="d-flex justify-content-end border-top pt-3">
                        <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={() => setEditing(true)}>
                            Edit Profile
                        </button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSave}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Blood Group Needed</label>
                            <select name="bloodGroupNeeded" className="form-select" value={form.bloodGroupNeeded} onChange={handleChange}>
                                {BLOOD_GROUPS.map((bg) => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Age</label>
                            <input type="number" name="age" className="form-control" value={form.age} onChange={handleChange} min={1} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">City</label>
                            <input type="text" name="city" className="form-control" value={form.city} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">State</label>
                            <input type="text" name="state" className="form-control" value={form.state} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea name="address" className="form-control" rows={2} value={form.address} onChange={handleChange} />
                    </div>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-danger btn-sm fw-semibold" disabled={updating}>
                            {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default PatientProfileCard;
