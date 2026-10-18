import { useState, useEffect } from 'react';
import {
    getStockSummary,
    getMonthlyDonations,
    getRequestsSummary,
    getExpiryAlerts,
} from '../../services/reportService';

function AnalyticsPage() {
    const [stock, setStock] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [requestsSummary, setRequestsSummary] = useState([]);
    const [expiring, setExpiring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [stockRes, monthlyRes, requestsRes, expiringRes] = await Promise.all([
                    getStockSummary(),
                    getMonthlyDonations(),
                    getRequestsSummary(),
                    getExpiryAlerts(),
                ]);
                setStock(stockRes.data);
                setMonthly(monthlyRes.data);
                setRequestsSummary(requestsRes.data);
                setExpiring(expiringRes.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError('Could not load analytics. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    const totalUnits = stock.reduce((sum, s) => sum + s.unitsAvailable, 0);
    const maxUnits = Math.max(1, ...stock.map((s) => s.unitsAvailable));

    return (
        <div>
            <h2 className="fw-bold text-danger">Analytics</h2>
            <p className="text-muted">Stock, donation, and request trends across the system.</p>

            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="bg-white rounded-3 shadow-sm p-3">
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>TOTAL UNITS ACROSS ALL GROUPS</div>
                        <div className="fs-3 fw-bold">{totalUnits}</div>
                    </div>
                </div>
                {requestsSummary.map((r) => (
                    <div className="col-md-3" key={r.status}>
                        <div className="bg-white rounded-3 shadow-sm p-3">
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>{r.status} REQUESTS</div>
                            <div className="fs-3 fw-bold">{r.count}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-3">
                <div className="col-md-7">
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Stock by Blood Group &amp; Component</h5>
                        {stock.length === 0 ? (
                            <p className="text-muted mb-0">No stock data yet.</p>
                        ) : (
                            stock.map((s, i) => (
                                <div key={i} className="mb-2">
                                    <div className="d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
                                        <span>{s.bloodGroup} · {s.component}</span>
                                        <span className="text-muted">{s.unitsAvailable} units</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div
                                            className="progress-bar bg-danger"
                                            style={{ width: `${(s.unitsAvailable / maxUnits) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="bg-white rounded-3 shadow-sm p-4 mt-3">
                        <h5 className="fw-bold mb-3">Monthly Donations</h5>
                        {monthly.length === 0 ? (
                            <p className="text-muted mb-0">No donation records yet.</p>
                        ) : (
                            <table className="table table-sm">
                                <thead>
                                    <tr className="text-muted" style={{ fontSize: '0.8rem' }}>
                                        <th>MONTH</th>
                                        <th>DONATIONS</th>
                                        <th>TOTAL UNITS DONATED</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthly.map((m) => (
                                        <tr key={m.month}>
                                            <td>{m.month}</td>
                                            <td>{m.totalDonations}</td>
                                            <td>{m.totalUnits}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Bags Expiring Soon (≤ 3 days)</h5>
                        {expiring.length === 0 ? (
                            <p className="text-muted mb-0">No bags expiring soon.</p>
                        ) : (
                            expiring.map((bag) => (
                                <div key={bag.inventoryId} className="d-flex justify-content-between border-bottom py-2" style={{ fontSize: '0.85rem' }}>
                                    <span>{bag.bagNumber} · {bag.bloodGroup} · {bag.componentName}</span>
                                    <span className="text-danger fw-semibold">{bag.expiryDate}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsPage;
