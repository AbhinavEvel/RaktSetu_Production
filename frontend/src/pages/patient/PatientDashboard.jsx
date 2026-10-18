import { useState, useEffect, useContext } from 'react';
import { getMyProfile, createProfile, updateProfile } from '../../services/patientService';
import { createRequest, getRequestsByPatient, cancelOwnRequest, editOwnRequest } from '../../services/bloodRequestService';
import PatientProfileSetupForm from '../../components/patient/PatientProfileSetupForm';
import PatientProfileCard from '../../components/patient/PatientProfileCard';
import BloodRequestFormModal from '../../components/patient/BloodRequestFormModal';
import BloodRequestsTable from '../../components/patient/BloodRequestsTable';
import StatCard from '../../components/admin/StatCard';
import { AuthContext } from '../../context/AuthContext';

function PatientDashboard() {
    const { user } = useContext(AuthContext);
    const isVerified = user?.isVerified === 'Accepted';
    const [profile, setProfile] = useState(null);
    const [profileMissing, setProfileMissing] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [error, setError] = useState('');

    const fetchRequests = async (patientId) => {
        try {
            const res = await getRequestsByPatient(patientId);
            setRequests(res.data);
        } catch (err) {
            console.error('Error fetching requests:', err);
        }
    };

    const fetchAll = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getMyProfile();
            setProfile(res.data);
            setProfileMissing(false);
            await fetchRequests(res.data.patientId);
        } catch (err) {
            if (err.response?.status === 404) {
                setProfileMissing(true);
            } else {
                setError('Could not load your profile. Please try again.');
                console.error('Error fetching profile:', err);
            }
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
            await fetchRequests(res.data.patientId);
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

    const handleCreateRequest = async (formData) => {
        setSaving(true);
        try {
            if (editingRequest) {
                await editOwnRequest(editingRequest.requestId, formData);
            } else {
                await createRequest(formData);
            }
            setShowModal(false);
            setEditingRequest(null);
            await fetchRequests(profile.patientId);
        } catch (err) {
            alert(err.response?.data?.message || 'Could not submit your request. Please try again.');
            console.error('Error saving request:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleEditClick = (request) => {
        setEditingRequest(request);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRequest(null);
    };

    const handleCancelRequest = async (requestId) => {
        if (!window.confirm('Cancel this blood request? This cannot be undone.')) return;
        setCancellingId(requestId);
        try {
            await cancelOwnRequest(requestId);
            await fetchRequests(profile.patientId);
        } catch (err) {
            alert(err.response?.data?.message || 'Could not cancel this request. Please try again.');
            console.error('Error cancelling request:', err);
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return <p className="text-muted">Loading your dashboard...</p>;
    }

    if (profileMissing) {
        return <PatientProfileSetupForm onSave={handleCreateProfile} saving={saving} />;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
    const fulfilledCount = requests.filter((r) => r.status === 'FULFILLED').length;
    const emergencyCount = requests.filter((r) => r.urgency === 'EMERGENCY').length;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-danger">My Patient Dashboard</h2>
                    <p className="text-muted mb-0">Manage your profile and blood requests.</p>
                </div>
                <button
                    className="btn btn-danger fw-semibold"
                    onClick={() => setShowModal(true)}
                    disabled={!isVerified}
                    title={!isVerified ? 'Your account must be verified by an admin before you can raise a request' : ''}
                >
                    + New Request
                </button>
            </div>

            {!isVerified && (
                <div className="alert alert-warning">
                    Your account is pending admin verification. You'll be able to raise blood requests once it's approved.
                </div>
            )}

            <div className="d-flex gap-3 mb-4">
                <StatCard
                    icon="🩸" iconBg="#fde2e2"
                    badge={profile.bloodGroupNeeded} badgeColor="text-danger"
                    label="Blood Group Needed" value=" "
                />
                <StatCard
                    icon="⏳" iconBg="#fff3cd"
                    badge={pendingCount > 0 ? 'In progress' : 'None'} badgeColor="text-muted"
                    label="Pending Requests" value={pendingCount}
                />
                <StatCard
                    icon="✅" iconBg="#d9f2ef"
                    badge="Fulfilled" badgeColor="text-success"
                    label="Fulfilled Requests" value={fulfilledCount}
                />
                <StatCard
                    icon="🚨" iconBg="#fde2e2"
                    badge="Emergency" badgeColor="text-danger"
                    label="Emergency Requests" value={emergencyCount}
                />
            </div>

            <div className="row g-3">
                <div className="col-md-5">
                    <PatientProfileCard profile={profile} onUpdate={handleUpdateProfile} updating={saving} />
                </div>
                <div className="col-md-7">
                    <BloodRequestsTable
                        requests={requests}
                        onEdit={handleEditClick}
                        onCancel={handleCancelRequest}
                        cancellingId={cancellingId}
                    />
                </div>
            </div>

            <BloodRequestFormModal
                show={showModal}
                onClose={handleCloseModal}
                onSave={handleCreateRequest}
                defaultBloodGroup={profile.bloodGroupNeeded}
                saving={saving}
                initialData={editingRequest}
            />
        </div>
    );
}

export default PatientDashboard;
