import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRole }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;   // localStorage check hone tak wait
    }

    if (!user) {
        return <Navigate to="/login" replace />;   // Login hi nahi hai
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;        // Login hai, lekin galat role (jaise Donor Admin page kholne ki koshish kare)
    }

    return children;   // Sab sahi — andar wala Component dikhao
}

export default ProtectedRoute;