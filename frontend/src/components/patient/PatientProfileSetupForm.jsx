import { useState } from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function PatientProfileSetupForm({ onSave, saving }) {
    const [form, setForm] = useState({
        bloodGroupNeeded: '',
        age: '',
        city: '',
        state: '',
        address: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!form.bloodGroupNeeded) {
            setError('Blood group needed is required.');
            return;
        }
        if (!form.age || Number(form.age) < 1) {
            setError('Please enter a valid age.');
            return;
        }

        onSave({ ...form, age: Number(form.age) });
    };

    return (
        <div className="bg-white rounded-3 shadow-sm p-4" style={{ maxWidth: '560px' }}>
            <h4 className="fw-bold text-danger mb-1">Complete Your Patient Profile</h4>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                Set this up once so you can raise blood requests quickly whenever needed.
            </p>

            {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Blood Group Needed</label>
                        <select
                            name="bloodGroupNeeded"
                            className="form-select"
                            value={form.bloodGroupNeeded}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            {BLOOD_GROUPS.map((bg) => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Age</label>
                        <input
                            type="number"
                            name="age"
                            className="form-control"
                            value={form.age}
                            onChange={handleChange}
                            min={1}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">City</label>
                        <input
                            type="text"
                            name="city"
                            className="form-control"
                            value={form.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">State</label>
                        <input
                            type="text"
                            name="state"
                            className="form-control"
                            value={form.state}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label">Address</label>
                    <textarea
                        name="address"
                        className="form-control"
                        rows={2}
                        value={form.address}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-danger fw-semibold w-100" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
}

export default PatientProfileSetupForm;
