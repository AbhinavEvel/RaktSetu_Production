import { Outlet } from 'react-router-dom';
import DonorSidebar from '../components/donor/DonorSidebar';
import DonorTopbar from '../components/donor/DonorTopbar';

function DonorLayout() {
    return (
        <div className="d-flex">
            <DonorSidebar />
            <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <DonorTopbar />
                <div className="p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default DonorLayout;
