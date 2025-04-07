import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../config';
import React from 'react';
import { Outlet } from 'react-router-dom';

interface IRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

function App() {
  const mutation = useMutation({
    mutationFn: () =>
      axiosInstance.post<unknown, IRefreshResponse>(
        '/web/auth/refresh',
        {},
        { withCredentials: true },
      ),
    onSuccess: (data: IRefreshResponse) => {
      // window.location.reload();
      console.log('Refreshed the page:', data);
      // setAccessToken(data?.accessToken);
    },
    onError: (error: IRefreshResponse) => {
      console.error('Error refreshing the page:', error);
    },
  });
  console.log('app.tsx');

  React.useEffect(() => {
    mutation.mutate();
  }, []);

  return <Outlet />;
}

export default App;
