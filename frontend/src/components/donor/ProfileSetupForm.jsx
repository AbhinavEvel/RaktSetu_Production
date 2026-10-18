import { useState } from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function ProfileSetupForm({ onSave, saving }) {
    const [form, setForm] = useState({
        bloodGroup: '',
        age: '',
        city: '',
        state: '',
        address: '',
        isAvailable: 'Yes',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!form.bloodGroup) {
            setError('Blood group is required.');
            return;
        }
        if (!form.age || Number(form.age) < 18) {
            setError('Donor must be at least 18 years old.');
            return;
        }

        onSave({ ...form, age: Number(form.age) });
    };

    return (
        <div className="bg-white rounded-3 shadow-sm p-4" style={{ maxWidth: '560px' }}>
            <h4 className="fw-bold text-danger mb-1">Complete Your Donor Profile</h4>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                Just a few details so hospitals and patients can find you when it matters.
            </p>

            {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Blood Group</label>
                        <select
                            name="bloodGroup"
                            className="form-select"
                            value={form.bloodGroup}
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
                            min={18}
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

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                        name="address"
                        className="form-control"
                        rows={2}
                        value={form.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label d-block">Currently available to donate?</label>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="isAvailable"
                            value="Yes"
                            checked={form.isAvailable === 'Yes'}
                            onChange={handleChange}
                        />
                        <label className="form-check-label">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="isAvailable"
                            value="No"
                            checked={form.isAvailable === 'No'}
                            onChange={handleChange}
                        />
                        <label className="form-check-label">No</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-danger fw-semibold w-100" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
}

export default ProfileSetupForm;
