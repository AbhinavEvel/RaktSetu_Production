import { useState, useEffect } from 'react';
import { getStockSummary } from '../../services/reportService';

// Rough safe-level baseline per blood group (units), used only to color-code the bar.
// Admins can tune this later — the point is showing which groups are running low.
const SAFE_LEVEL = 50;

function StockStatus() {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await getStockSummary();

                const totals = {};
                res.data.forEach((s) => {
                    totals[s.bloodGroup] = (totals[s.bloodGroup] || 0) + s.unitsAvailable;
                });

                const rows = Object.entries(totals)
                    .map(([group, units]) => {
                        const percent = Math.min(100, Math.round((units / SAFE_LEVEL) * 100));
                        const color = percent < 30 ? 'danger' : percent < 60 ? 'warning' : 'success';
                        const label = percent < 30 ? 'Low Stock' : percent < 60 ? 'Moderate' : 'Safe Level';
                        return { group, units, percent, color, label };
                    })
                    .sort((a, b) => a.percent - b.percent)
                    .slice(0, 4);

                setStock(rows);
            } catch (err) {
                console.error('Error fetching stock status:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStock();
    }, []);

    return (
        <div className="bg-white rounded-3 p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Stock Status</h5>
            {loading ? (
                <p className="text-muted mb-0">Loading...</p>
            ) : stock.length === 0 ? (
                <p className="text-muted mb-0">No stock data yet.</p>
            ) : (
                stock.map((s) => (
                    <div key={s.group} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                            <span>
                                <span className="fw-bold text-danger me-1">{s.group}</span>
                                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{s.label}</span>
                            </span>
                            <span className={`fw-semibold text-${s.color}`}>{s.units} units</span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                            <div
                                className={`progress-bar bg-${s.color}`}
                                style={{ width: `${s.percent}%` }}
                            ></div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default StockStatus;
