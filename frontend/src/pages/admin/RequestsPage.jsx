import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllRequests, updateRequestStatus } from '../../services/bloodRequestService';
import RequestsTable from '../../components/admin/RequestsTable';
import MatchedDonorsModal from '../../components/admin/MatchedDonorsModal';

function RequestsPage() {
    const [searchParams] = useSearchParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [urgencyFilter, setUrgencyFilter] = useState(searchParams.get('urgency') || 'ALL');
    const [matchesRequestId, setMatchesRequestId] = useState(null);

    const fetchRequests = async () => {
        try {
            const res = await getAllRequests();
            setRequests(res.data);
        } catch (err) {
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusChange = async (requestId, status) => {
        setUpdatingId(requestId);
        try {
            await updateRequestStatus(requestId, status);
            setRequests((prev) => prev.map((r) => (r.requestId === requestId ? { ...r, status } : r)));
        } catch (err) {
            alert('Could not update status. Please try again.');
            console.error('Error updating status:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredRequests = requests
        .filter((r) => filter === 'ALL' || r.status === filter)
        .filter((r) => urgencyFilter === 'ALL' || r.urgency === urgencyFilter);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-danger">Blood Requests</h2>
                    <p className="text-muted mb-0">All requests raised by patients, with live status and donor matches.</p>
                </div>
                <div className="d-flex gap-2">
                    <select className="form-select" style={{ width: '180px' }} value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)}>
                        <option value="ALL">All Urgency</option>
                        <option value="EMERGENCY">Emergency Only</option>
                        <option value="NORMAL">Normal Only</option>
                    </select>
                    <select className="form-select" style={{ width: '180px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="FULFILLED">Fulfilled</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3">
                {loading ? (
                    <p className="text-muted mb-0">Loading...</p>
                ) : filteredRequests.length === 0 ? (
                    <p className="text-muted text-center py-3 mb-0">No requests found.</p>
                ) : (
                    <RequestsTable
                        requests={filteredRequests}
                        onStatusChange={handleStatusChange}
                        onViewMatches={setMatchesRequestId}
                        updatingId={updatingId}
                    />
                )}
            </div>

            <MatchedDonorsModal
                show={!!matchesRequestId}
                requestId={matchesRequestId}
                onClose={() => setMatchesRequestId(null)}
            />
        </div>
    );
}

export default RequestsPage;
