import { useState, useEffect } from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const COMPONENTS = ['WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS'];
const COMPONENT_LABELS = {
    WHOLE_BLOOD: 'Whole Blood', RBC: 'Red Blood Cells', PLASMA: 'Plasma', PLATELETS: 'Platelets',
};
const SHELF_LIFE_DAYS = { WHOLE_BLOOD: 35, RBC: 42, PLASMA: 365, PLATELETS: 5 };

const emptyForm = { bagNumber: '', bloodGroup: '', component: '', quantityMl: '', receivedDate: '' };

function InventoryFormModal({ show, onClose, onSave, editData }) {
    const [form, setForm] = useState(emptyForm);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (editData) {
            setForm({
                bagNumber: editData.bagNumber || '',
                bloodGroup: editData.bloodGroup || '',
                component: editData.componentName || '',
                quantityMl: editData.quantityMl || '',
                receivedDate: editData.receivedDate || '',
            });
        } else {
            setForm(emptyForm);
        }
    }, [editData, show]);

    if (!show) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...form, quantityMl: Number(form.quantityMl) });
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{editData ? 'Edit' : 'Add'} Inventory</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Bag Number</label>
                                <input
                                    type="text"
                                    name="bagNumber"
                                    className="form-control"
                                    placeholder="e.g. BAG-1001"
                                    value={form.bagNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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
                                        {BLOOD_GROUPS.map((g) => (
                                            <option key={g} value={g}>{g}</option>
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
                            <div className="mb-3">
                                <label className="form-label">Quantity (ml)</label>
                                <input
                                    type="number"
                                    name="quantityMl"
                                    className="form-control"
                                    value={form.quantityMl}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Received Date</label>
                                <input
                                    type="date"
                                    name="receivedDate"
                                    className="form-control"
                                    value={form.receivedDate}
                                    onChange={handleChange}
                                    max={today}
                                    required
                                />
                                <div className="form-text">Expiry date is calculated automatically based on the component's shelf life. Future dates aren't allowed.</div>
                                {form.receivedDate && form.component && (
                                    (() => {
                                        const expiry = new Date(form.receivedDate);
                                        expiry.setDate(expiry.getDate() + SHELF_LIFE_DAYS[form.component]);
                                        const expiryStr = expiry.toISOString().slice(0, 10);
                                        const alreadyExpired = expiryStr < today;
                                        return (
                                            <div className={`mt-1 small ${alreadyExpired ? 'text-danger fw-semibold' : 'text-muted'}`}>
                                                {alreadyExpired
                                                    ? `⚠ This bag would already be expired (expiry: ${expiryStr}). Pick a more recent received date.`
                                                    : `Calculated expiry: ${expiryStr}`}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-danger">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default InventoryFormModal;
