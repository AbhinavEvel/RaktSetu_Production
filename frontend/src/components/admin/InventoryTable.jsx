function InventoryTable({ data, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-3 p-4 shadow-sm">
            <table className="table align-middle">
                <thead>
                    <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                        <th>BAG NUMBER</th>
                        <th>BLOOD GROUP</th>
                        <th>COMPONENT</th>
                        <th>QUANTITY (ML)</th>
                        <th>EXPIRY DATE</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 && (
                        <tr><td colSpan="7" className="text-center text-muted py-3">No inventory records found</td></tr>
                    )}
                    {data.map((item) => (
                        <tr key={item.inventoryId}>
                            <td>{item.bagNumber}</td>
                            <td>
                                <span className="badge bg-danger-subtle text-danger">{item.bloodGroup}</span>
                            </td>
                            <td>{item.componentName}</td>
                            <td>{item.quantityMl}</td>
                            <td>{item.expiryDate}</td>
                            <td>{item.status}</td>
                            <td>
                                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onEdit(item)}>
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(item.inventoryId)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryTable;