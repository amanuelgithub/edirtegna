import { RouterProvider } from 'react-router-dom';
import { useAppInit } from './app-initializer.context'; // Adjust path as needed
import { Flex, Spin } from 'antd';
// import { useAppInit } from './auth-initializer.context'; // Adjust path as needed

export const AppContent = ({ router }: any) => {
  const { isInitialized, loading, error } = useAppInit();

  // Show loading state until initialization is complete
  if (!isInitialized) {
    // return; // if you want to return nothing
    return (
      <Flex
        align="center"
        justify="center"
        gap="middle"
        style={{ height: '100vh' }}
      >
        <Spin />
      </Flex>
    );
  }

  // Show error if initialization failed
  //   if (error) {
  //     return <div>Error: {error}</div>;
  //   }

  // Render RouterProvider when initialized successfully
  return <RouterProvider router={router} />;
};
