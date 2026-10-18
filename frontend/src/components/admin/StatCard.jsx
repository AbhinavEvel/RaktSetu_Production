function StatCard({ icon, iconBg, badge, badgeColor, label, value }) {
    return (
        <div className="bg-white rounded-3 p-3 shadow-sm flex-fill">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div
                    className="d-flex align-items-center justify-content-center rounded-2"
                    style={{ width: '45px', height: '45px', backgroundColor: iconBg, fontSize: '1.3rem' }}
                >
                    {icon}
                </div>
                <span className={`fw-semibold ${badgeColor}`} style={{ fontSize: '0.85rem' }}>
                    {badge}
                </span>
            </div>
            <div className="text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                {label}
            </div>
            <div className="fw-bold text-dark" style={{ fontSize: '1.8rem' }}>
                {value}
            </div>
        </div>
    );
}

export default StatCard;