import { Form, Button, Card, message, Input } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/config';
import { AxiosError } from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const identifier = searchParams.get('identifier');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

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
          navigate('/dashboard');
        }
      }
    },
  });

  const resendOtpMutation = useMutation<
    any,
    AxiosError,
    { identifier: string | null }
  >({
    mutationFn: async (values) => {
      const response = await axiosInstance.post('/web/auth/resend-otp', values);
      return response.data;
    },
    onError: (error: AxiosError) => {
      console.error(
        'Error during OTP resend:',
        error.response?.data || error.message,
      );
      message.error('Failed to resend OTP!');
    },
    onSuccess: () => {
      message.success('OTP resent successfully!');
      setCountdown(30); // Start the 30-second countdown
    },
  });

  const onFinish = (values: { otp: string }) => {
    mutation.mutate({ ...values, identifier });
  };

  const handleResendOtp = () => {
    setIsResending(true);
    resendOtpMutation.mutate(
      { identifier },
      {
        onSettled: () => setIsResending(false),
      },
    );
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card
        title="Verify OTP"
        variant="outlined"
        style={{
          width: '100%',
          maxWidth: '400px',
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
        <div className="flex justify-center mt-4">
          <Button
            type="link"
            onClick={handleResendOtp}
            disabled={isResending || countdown > 0}
            style={{ fontWeight: 'bold' }}
          >
            {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
