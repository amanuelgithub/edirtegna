// components/ProtectedRoute.tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import { useLayoutEffect } from 'react';

// interface ProtectedRouteProps {
//   allowedRoles?: string[];
// }

const PublicRoute: React.FC = () => {
  const { user, accessToken: token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // console.log('user:', user);

  useLayoutEffect(() => {
    if (user && token) {
      console.log('public route -> ', user);
      // return <Navigate to="/auth/signin" replace state={{ from: location }} />;
      // redirect back to the previous page
      navigate(location.state?.from ? location.state.from : '/dashboard', {
        replace: true,
      });
    }

    return () => {
      // cleanup
    };
    // }, [location.state.from, navigate, user]);
  }, [user]);

  // if (allowedRoles && !allowedRoles?.includes(user.role)) {
  //   return <Navigate to="/403" replace />;
  // }

  return <Outlet />;
};

export default PublicRoute;
