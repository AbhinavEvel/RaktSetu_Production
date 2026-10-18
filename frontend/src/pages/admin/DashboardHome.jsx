import DashboardStats from '../../components/admin/DashboardStats';
import InventoryChart from '../../components/admin/InventoryChart';
import RecentDonations from '../../components/admin/RecentDonations';
import StockStatus from '../../components/admin/StockStatus';
import EmergencyAlerts from '../../components/admin/EmergencyAlerts';

function DashboardHome() {
    return (
        <div>
            <h2 className="fw-bold text-danger">System Overview</h2>
            <p className="text-muted">Real-time status of blood inventory and emergency operations.</p>

            <DashboardStats />

            <div className="row g-3">
                <div className="col-md-8">
                    <InventoryChart />
                    <div className="mt-3">
                        <RecentDonations />
                    </div>
                </div>
                <div className="col-md-4">
                    <EmergencyAlerts />
                    <StockStatus />
                </div>
            </div>
        </div>
    );
}

export default DashboardHome;