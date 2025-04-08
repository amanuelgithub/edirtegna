import { Form, Input, Button, Card, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/config';
import { AxiosError } from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const identifier = searchParams.get('phone');

  const mutation = useMutation<
    any,
    AxiosError,
    {
      identifier: string | null;
      previousPassword: string;
      password: string;
      confirmPassword: string;
    }
  >({
    mutationFn: async (values) => {
      const response = await axiosInstance.post(
        '/web/auth/set-password',
        values,
      );
      return response.data;
    },
    onError: (error: AxiosError) => {
      console.error(
        'Error during password update:',
        error.response?.data || error.message,
      );
      message.error('Failed to update password!');
    },
    onSuccess: (data: any) => {
      if (data.success) {
        message.success('Password updated successfully!');
        navigate('/auth/signin');
      } else {
        message.error(data?.message || 'Failed to update password!');
      }
    },
  });

  const onFinish = (values: {
    previousPassword: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }
    mutation.mutate({
      identifier,
      previousPassword: values.previousPassword,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card
        title="Set Password"
        variant="outlined"
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
        headStyle={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        <Form
          name="set_password"
          layout="vertical"
          style={{ width: '100%' }}
          initialValues={{}}
          onFinish={onFinish}
        >
          <Form.Item label="Identifier">
            <Input value={identifier || ''} disabled />
          </Form.Item>
          <Form.Item
            name="previousPassword"
            label="Previous Password"
            rules={[
              {
                required: true,
                message: 'Please input your previous password!',
              },
            ]}
          >
            <Input.Password placeholder="Enter your previous password" />
          </Form.Item>
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: 'Please input your new password!' },
            ]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: 'Please confirm your new password!' },
            ]}
          >
            <Input.Password placeholder="Confirm your new password" />
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{
                width: '100%',
                borderRadius: '8px',
                fontWeight: 'bold',
              }}
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
