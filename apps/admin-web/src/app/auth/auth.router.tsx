import { RouteObject, Navigate } from 'react-router-dom';
import SigninPage from './signin/signin';
import SignupPage from './signup/signup';
import VerifyOtpPage from './verify-otp/verify-otp';
import SetPasswordPage from './set-password/set-password';
import ForgotPasswordPage from './forgot-password/forgot-password';
import PublicRoute from '@/components/public-route';

export const authRouter: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/auth/signin" replace />,
  },
  {
    path: '/auth',
    children: [
      {
        index: true,
        element: <Navigate to="/auth/signin" replace />,
      },
      {
        path: 'signin',
        // element: <SigninPage />,
        element: <PublicRoute />,
        children: [{ index: true, element: <SigninPage /> }],
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'verify-otp',
        element: <VerifyOtpPage />,
      },
      {
        path: 'set-password',
        element: <SetPasswordPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
];
