import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { getStockSummary } from '../../services/reportService';
import { getAllRequests } from '../../services/bloodRequestService';
import { getAllDonors } from '../../services/donorService';

function DashboardStats() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [stockRes, requestsRes, donorsRes] = await Promise.all([
                    getStockSummary(),
                    getAllRequests(),
                    getAllDonors(),
                ]);

                const totalUnits = stockRes.data.reduce((sum, s) => sum + s.unitsAvailable, 0);
                const pendingRequests = requestsRes.data.filter((r) => r.status === 'PENDING').length;
                const totalDonors = donorsRes.data.length;
                const availableDonors = donorsRes.data.filter((d) => d.isAvailable === 'Yes').length;

                setStats([
                    {
                        icon: '📦', iconBg: '#fde2e2',
                        badge: 'Live', badgeColor: 'text-success',
                        label: 'Total Units Available', value: totalUnits,
                    },
                    {
                        icon: '✱', iconBg: '#fde2e2',
                        badge: pendingRequests > 0 ? 'Needs Attention' : 'All Clear',
                        badgeColor: pendingRequests > 0 ? 'text-danger' : 'text-success',
                        label: 'Pending Requests', value: pendingRequests,
                    },
                    {
                        icon: '🤝', iconBg: '#d9f2ef',
                        badge: 'Registered', badgeColor: 'text-muted',
                        label: 'Total Donors', value: totalDonors,
                    },
                    {
                        icon: '❤️', iconBg: '#f8d7da',
                        badge: 'Ready', badgeColor: 'text-muted',
                        label: 'Available Donors', value: availableDonors,
                    },
                ]);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) {
        return <div className="mb-4 text-muted">Loading stats...</div>;
    }

    return (
        <div className="d-flex gap-3 mb-4">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}

export default DashboardStats;
