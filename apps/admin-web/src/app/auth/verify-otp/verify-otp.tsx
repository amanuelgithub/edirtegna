import { Form, Button, Card, message, Input } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/config';
import { AxiosError } from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const identifier = searchParams.get('identifier');

  const mutation = useMutation<
    any,
    AxiosError,
    { otp: string; identifier: string | null }
  >({
    mutationFn: async (values) => {
      const response = await axiosInstance.post('/web/auth/verify-otp', values);
      return response.data;
    },
    onError: (error: AxiosError) => {
      console.error(
        'Error during OTP verification:',
        error.response?.data || error.message,
      );
      message.error('OTP verification failed!');
    },
    onSuccess: (data: any) => {
      if (data) {
        if (!data.success && data.statusCode === 419) {
          navigate('/auth/set-password', { state: { phone: identifier } });
        } else if (!data.success && data.statusCode === 416) {
          navigate('/auth/set-password', { state: { phone: identifier } });
        } else if (data.success) {
          // Assuming onboardingCompleted is handled elsewhere
          navigate('/dashboard');
        }
      }
    },
  });

  const onFinish = (values: { otp: string }) => {
    mutation.mutate({ ...values, identifier });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card
        title="Verify OTP"
        variant="outlined"
        style={{
          width: '100%',
          maxWidth: '400px',
          // borderRadius: '12px',
          // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
        styles={{
          header: {
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          },
        }}
      >
        <Form
          name="verify_otp"
          layout="vertical"
          style={{ width: '100%' }}
          initialValues={{}}
          onFinish={onFinish}
        >
          <Form.Item
            name="otp"
            label="Enter OTP"
            rules={[{ required: true, message: 'Please input your OTP!' }]}
          >
            <Input.OTP
              length={4}
              autoFocus
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
              }}
            />
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
              Verify
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
