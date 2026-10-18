import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getStockSummary } from '../../services/reportService';

const GROUP_ORDER = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function InventoryChart() {
    const [view, setView] = useState('volume');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await getStockSummary();

                // Aggregate units across components, per blood group
                const totals = {};
                res.data.forEach((s) => {
                    totals[s.bloodGroup] = (totals[s.bloodGroup] || 0) + s.unitsAvailable;
                });

                const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

                const chartData = GROUP_ORDER.map((group) => ({
                    group,
                    volume: totals[group] || 0,
                    percentage: Math.round(((totals[group] || 0) / grandTotal) * 100),
                }));

                setData(chartData);
            } catch (err) {
                console.error('Error fetching stock summary:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStock();
    }, []);

    return (
        <div className="bg-white rounded-3 p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Blood Inventory Distribution</h5>
                <div className="btn-group btn-group-sm">
                    <button
                        className={`btn ${view === 'volume' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        onClick={() => setView('volume')}
                    >
                        Volume (Units)
                    </button>
                    <button
                        className={`btn ${view === 'percentage' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        onClick={() => setView('percentage')}
                    >
                        Percentage
                    </button>
                </div>
            </div>

            {loading ? (
                <p className="text-muted mb-0">Loading chart...</p>
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="group" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey={view === 'volume' ? 'volume' : 'percentage'}
                            fill="#b91c3c"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default InventoryChart;
