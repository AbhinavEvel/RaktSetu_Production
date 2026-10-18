import { useState, useEffect, useContext } from 'react';
import { getMyProfile, createProfile, updateProfile, updateAvailability } from '../../services/donorService';
import { getMyDonations } from '../../services/donationService';
import { getMyAlerts, respondToAlert } from '../../services/alertService';
import ProfileSetupForm from '../../components/donor/ProfileSetupForm';
import DonorProfileCard from '../../components/donor/DonorProfileCard';
import DonationHistoryTable from '../../components/donor/DonationHistoryTable';
import AlertsList from '../../components/donor/AlertsList';
import StatCard from '../../components/admin/StatCard';
import { AuthContext } from '../../context/AuthContext';

const COOLDOWN_DAYS = 90;

function getNextEligibleDate(lastDonationDate) {
    if (!lastDonationDate) return null;
    const last = new Date(lastDonationDate);
    const next = new Date(last);
    next.setDate(next.getDate() + COOLDOWN_DAYS);
    return next;
}

function DonorDashboard() {
    const { user } = useContext(AuthContext);
    const isVerified = user?.isVerified === 'Accepted';
    const [profile, setProfile] = useState(null);
    const [profileMissing, setProfileMissing] = useState(false);
    const [donations, setDonations] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [respondingId, setRespondingId] = useState(null);
    const [error, setError] = useState('');

    const fetchAll = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getMyProfile();
            setProfile(res.data);
            setProfileMissing(false);
        } catch (err) {
            if (err.response?.status === 404) {
                setProfileMissing(true);
            } else {
                setError('Could not load your profile. Please try again.');
                console.error('Error fetching profile:', err);
            }
        }

        try {
            const [donationsRes, alertsRes] = await Promise.all([getMyDonations(), getMyAlerts()]);
            setDonations(donationsRes.data);
            setAlerts(alertsRes.data);
        } catch (err) {
            console.error('Error fetching donations/alerts:', err);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleCreateProfile = async (formData) => {
        setSaving(true);
        try {
            const res = await createProfile(formData);
            setProfile(res.data);
            setProfileMissing(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Could not save your profile. Please try again.');
            console.error('Error creating profile:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateProfile = async (formData) => {
        setSaving(true);
        try {
            const res = await updateProfile(formData);
            setProfile(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Could not update your profile.');
            console.error('Error updating profile:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleAvailability = async (value) => {
        setSaving(true);
        try {
            const res = await updateAvailability(value);
            setProfile(res.data);
        } catch (err) {
            console.error('Error updating availability:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleRespondAlert = async (alertId, response) => {
        setRespondingId(alertId);
        try {
            await respondToAlert(alertId, response);
            setAlerts((prev) => prev.map((a) => (a.alertId === alertId ? { ...a, response } : a)));
        } catch (err) {
            alert(err.response?.data?.message || 'Could not submit your response. Please try again.');
            console.error('Error responding to alert:', err);
        } finally {
            setRespondingId(null);
        }
    };

    if (loading) {
        return <p className="text-muted">Loading your dashboard...</p>;
    }

    if (profileMissing) {
        return <ProfileSetupForm onSave={handleCreateProfile} saving={saving} />;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const nextEligible = getNextEligibleDate(profile.lastDonationDate);
    const isEligibleNow = !nextEligible || nextEligible <= new Date();
    const completedDonations = donations.filter((d) => d.status === 'COMPLETED').length;
    const pendingAlerts = alerts.filter((a) => a.response === 'PENDING').length;

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-danger">My Donor Dashboard</h2>
                <p className="text-muted mb-0">Track your donations, availability, and emergency alerts.</p>
            </div>

            {!isVerified && (
                <div className="alert alert-warning">
                    Your account is pending admin verification. You'll be able to accept donation alerts once it's approved.
                </div>
            )}

            <div className="d-flex gap-3 mb-4">
                <StatCard
                    icon="🩸" iconBg="#fde2e2"
                    badge={profile.bloodGroup} badgeColor="text-danger"
                    label="Your Blood Group" value=" "
                />
                <StatCard
                    icon="🤝" iconBg="#d9f2ef"
                    badge={isEligibleNow ? 'Eligible' : 'Cooldown'} badgeColor={isEligibleNow ? 'text-success' : 'text-muted'}
                    label="Total Donations" value={completedDonations}
                />
                <StatCard
                    icon="📅" iconBg="#fde2e2"
                    badge="90-day cooldown" badgeColor="text-muted"
                    label="Next Eligible" value={isEligibleNow ? 'Now' : nextEligible.toLocaleDateString()}
                />
                <StatCard
                    icon="🔔" iconBg="#fff3cd"
                    badge={pendingAlerts > 0 ? 'Action needed' : 'All clear'} badgeColor={pendingAlerts > 0 ? 'text-danger' : 'text-muted'}
                    label="Pending Alerts" value={pendingAlerts}
                />
            </div>

            <div className="row g-3">
                <div className="col-md-5">
                    <DonorProfileCard
                        profile={profile}
                        onUpdate={handleUpdateProfile}
                        onToggleAvailability={handleToggleAvailability}
                        updating={saving}
                        isEligibleNow={isEligibleNow}
                        nextEligibleDate={nextEligible}
                    />
                </div>
                <div className="col-md-7 d-flex flex-column gap-3">
                    <AlertsList alerts={alerts} onRespond={handleRespondAlert} respondingId={respondingId} canAccept={isVerified} />
                    <DonationHistoryTable donations={donations} />
                </div>
            </div>
        </div>
    );
}

export default DonorDashboard;
