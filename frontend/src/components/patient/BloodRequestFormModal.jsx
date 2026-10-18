import { useState, useEffect } from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const COMPONENTS = ['WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS'];
const COMPONENT_LABELS = {
    WHOLE_BLOOD: 'Whole Blood', RBC: 'Red Blood Cells', PLASMA: 'Plasma', PLATELETS: 'Platelets',
};

const emptyForm = {
    bloodGroup: '',
    component: '',
    unitsNeeded: '',
    urgency: 'NORMAL',
    contactNumber: '',
    locationDetails: '',
    additionalNote: '',
};

// Pass `initialData` (an existing request) to edit it instead of creating a new one.
function BloodRequestFormModal({ show, onClose, onSave, defaultBloodGroup, saving, initialData }) {
    const isEditMode = !!initialData;
    const [form, setForm] = useState({ ...emptyForm, bloodGroup: defaultBloodGroup || '' });

    useEffect(() => {
        if (!show) return;
        if (initialData) {
            setForm({
                bloodGroup: initialData.bloodGroup,
                component: initialData.component,
                unitsNeeded: initialData.unitsNeeded,
                urgency: initialData.urgency,
                contactNumber: initialData.contactNumber,
                locationDetails: initialData.locationDetails,
                additionalNote: initialData.additionalNote || '',
            });
        } else {
            setForm({ ...emptyForm, bloodGroup: defaultBloodGroup || '' });
        }
    }, [show, initialData, defaultBloodGroup]);

    if (!show) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...form, unitsNeeded: Number(form.unitsNeeded) });
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEditMode ? `Edit Request #${initialData.requestId}` : 'Raise Blood Request'}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
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
                                    <label className="form-label">Component</label>
                                    <select
                                        name="component"
                                        className="form-select"
                                        value={form.component}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        {COMPONENTS.map((c) => (
                                            <option key={c} value={c}>{COMPONENT_LABELS[c]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Units Needed</label>
                                    <input
                                        type="number"
                                        name="unitsNeeded"
                                        className="form-control"
                                        value={form.unitsNeeded}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Urgency</label>
                                    <select
                                        name="urgency"
                                        className="form-select"
                                        value={form.urgency}
                                        onChange={handleChange}
                                    >
                                        <option value="NORMAL">Normal</option>
                                        <option value="EMERGENCY">Emergency</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contact Number</label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    className="form-control"
                                    value={form.contactNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Location Details</label>
                                <input
                                    type="text"
                                    name="locationDetails"
                                    className="form-control"
                                    placeholder="Hospital name, city, etc."
                                    value={form.locationDetails}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Additional Note (optional)</label>
                                <textarea
                                    name="additionalNote"
                                    className="form-control"
                                    rows={2}
                                    value={form.additionalNote}
                                    onChange={handleChange}
                                />
                            </div>

                            {isEditMode && (
                                <div className="alert alert-info py-2 mb-0" style={{ fontSize: '0.8rem' }}>
                                    If the new details can be covered by current stock, this request will be marked
                                    fulfilled immediately. Otherwise, donors will be re-matched based on the updated details.
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-danger" disabled={saving}>
                                {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BloodRequestFormModal;
