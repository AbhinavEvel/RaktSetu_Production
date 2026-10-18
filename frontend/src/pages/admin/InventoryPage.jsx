import { useState, useEffect } from 'react';
import { getAllInventory, addInventory, updateInventory, deleteInventory } from '../../services/inventoryService';
import InventoryTable from '../../components/admin/InventoryTable';
import InventoryFormModal from '../../components/admin/InventoryFormModal';

function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        try {
            const res = await getAllInventory();
            setInventory(res.data);
        } catch (err) {
            console.error('Error fetching inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleSave = async (formData) => {
        try {
            if (editData) {
                await updateInventory(editData.inventoryId, formData);
            } else {
                await addInventory(formData);
            }
            setShowModal(false);
            setEditData(null);
            fetchInventory();
        } catch (err) {
            console.error('Error saving inventory:', err);
            alert('Something went wrong while saving.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await deleteInventory(id);
            fetchInventory();
        } catch (err) {
            console.error('Error deleting inventory:', err);
        }
    };

    const handleEdit = (item) => {
        setEditData(item);
        setShowModal(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-danger">Blood Inventory</h2>
                    <p className="text-muted mb-0">Manage blood stock levels and expiry tracking.</p>
                </div>
                <button className="btn btn-danger fw-semibold" onClick={() => { setEditData(null); setShowModal(true); }}>
                    + Add Inventory
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <InventoryTable data={inventory} onEdit={handleEdit} onDelete={handleDelete} />
            )}

            <InventoryFormModal
                show={showModal}
                onClose={() => { setShowModal(false); setEditData(null); }}
                onSave={handleSave}
                editData={editData}
            />
        </div>
    );
}

export default InventoryPage;