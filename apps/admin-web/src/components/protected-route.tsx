import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth.context';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, accessToken: token } = useAuth();
  // const { data } = useQuery(getProfileQueryOptions());
  const location = useLocation();
  // console.log('user:', user);

  // useEffect(() => {
  //   if (!user) {
  //     queryClient.invalidateQueries({ queryKey: ['profile'] });
  //   }
  // }, [user]);

  if (!token) {
    // if (!user) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles?.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
