import { useState, useEffect } from 'react';
import { getPublicStats } from '../../services/publicService';

function StatsSection() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getPublicStats()
            .then((res) => setStats(res.data))
            .catch((err) => console.error('Error fetching public stats:', err));
    }, []);

    const displayStats = [
        { icon: '🩸', label: 'Registered Donors', value: stats ? `${stats.registeredDonors}+` : '—' },
        { icon: '❤️', label: 'Lives Saved', value: stats ? `${stats.livesSaved}+` : '—' },
        { icon: '✅', label: 'Requests Fulfilled', value: stats ? `${stats.requestsFulfilled}+` : '—' },
    ];

    return (
        <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 2 }}>
            <div className="row g-3">
                {displayStats.map((stat, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="bg-white rounded-4 p-4 text-center hover-lift" style={{ boxShadow: 'var(--shadow-soft)' }}>
                            <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                            <h2 className="fw-bold mt-2 mb-0" style={{ color: 'var(--brand-red)' }}>{stat.value}</h2>
                            <p className="text-muted mb-0">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatsSection;
