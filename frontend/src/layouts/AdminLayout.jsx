import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';

function AdminLayout() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <Topbar />
                <div className="p-4">
                    <Outlet />   {/* Yahan Dashboard/Inventory/Reports content aayega */}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;