import { Outlet } from 'react-router-dom';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopbar from '../components/patient/PatientTopbar';

function PatientLayout() {
    return (
        <div className="d-flex">
            <PatientSidebar />
            <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <PatientTopbar />
                <div className="p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default PatientLayout;
