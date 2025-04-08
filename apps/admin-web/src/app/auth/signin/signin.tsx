import { Form, Input, Button, Checkbox, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import styles from './signin.module.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/config';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
// import { setAccessToken } from '../../../utils';
import { useAuth } from '../../../context/auth.context';
import { useEffect } from 'react';
// import { getProfileQueryOptions } from '../../../services/query-options';
import { createGetProfileQueryOptions } from '@/hooks/api';

interface LoginValues {
  identifier: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    // add additional user properties as needed
  };
}

export default function SigninPage() {
  const queryClient = useQueryClient();
  const { login, setAccessToken } = useAuth();
  const navigate = useNavigate();
  const mutation = useMutation<AuthResponse, AxiosError, LoginValues>({
    mutationFn: async (values: LoginValues) => {
      const response = await axiosInstance.post<AuthResponse>(
        '/web/auth/login',
        values,
      );
      return response.data;
    },
    onError: (error: AxiosError) => {
      console.error(
        'Error during authentication:',
        error.response?.data || error.message,
      );
    },
    // onSuccess: (data: AuthResponse) => {
    onSuccess: (data: any, values: LoginValues) => {
      console.log('Authentication successful:', data);
      if (!data.success && data.statusCode === 412) {
        // verify account...
        navigate(`/auth/verify-otp?identifier=${values.identifier}`);
      } else if (!data.success && data.statusCode === 419) {
        // initial / password reset......
        navigate('/auth/reset-password');
      } else if (!data.success && data.statusCode === 416) {
        // device change detected......
        // this.authenticationService
        //   .resendOtp(this.f['email'].value)
        //   .subscribe((r) => {
        //     if (r.success) {
        //       this.isLoading = false;
        //       this.router.navigate(['/', 'auth', 'verify'], {
        //         queryParams: { ndevice: this.f['email'].value },
        //       });
        //     }
        //   });
        navigate('/auth/verify-otp');
      } else if (!data.success) {
        // show error message using antd message
        message.error(data?.message || 'Login failed!');
      } else {
        // this.isLoading = false;
        // this.toastService.success(data?.message || `Login successful!`);
        // this.router.navigate([this.returnUrl]);
        console.log('login data: ', data);
        // login(mutation.data?.user);
        setAccessToken(data?.accessToken);
        setAccessToken(data?.accessToken);
        queryClient.invalidateQueries({ queryKey: ['profile'] });

        navigate('/dashboard');
        // navigate('/dashboard');
      }
    },
  });
  // get profile data
  const { data: userProfileData, isSuccess: isProfileSuccess } = useQuery({
    ...createGetProfileQueryOptions(),
    enabled: !!mutation.data,
  });

  // const { data: apiTestData } = useQuery({
  //   queryKey: ['api-test'],
  //   queryFn: () => {
  //     return axiosInstance.get('/api-test');
  //   },
  // });

  useEffect(() => {
    console.log('Profile:', userProfileData?.data);
    if (isProfileSuccess) {
      login(userProfileData?.data);
    }
  }, [isProfileSuccess, login, userProfileData]);

  // upon successful login, call the login function from the auth context
  // to update the user state
  // useEffect(() => {
  //   console.log('mutation.isSuccess', mutation.isSuccess);
  //   if (mutation.isSuccess) {
  //     login(mutation.data?.user);
  //   }
  // }, [mutation.isSuccess, login]);

  const onFinish = (values: LoginValues) => {
    mutation.mutate(values);
  };

  return (
    <div className=" flex items-center justify-start gap-40 p-16 flex-col min-h-screen bg-gray-100 p-4">
      {/* <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4"> */}
      <div>{'</Logo>'}</div>

      {/* <div className={styles.form_container}> */}
      {/* <div>{JSON.stringify(mutation.data)}</div> */}

      {/* <div className="bg-indigo-500 p-2 font-mono">Hello!</div> */}

      <Card
        title="Sign In"
        variant="outlined"
        style={{ width: '400px', borderRadius: '10px' }}
      >
        <Form
          name="normal_login"
          // className={styles.login_form}
          // className="flex flex-col items-center justify-center w-1/3 h-1/2 p-5 bg-white border border-gray-200 rounded-md"
          style={{ width: '100%' }}
          initialValues={{}}
          onFinish={onFinish}
        >
          {/* <div>
            <h1 className="font-semibold text-2xl pt-2 pb-5">Sign In</h1>
          </div> */}
          <Form.Item
            name="identifier"
            rules={[
              { required: true, message: 'Please input your identifier!' },
            ]}
            // className="w-[75%]"
          >
            <Input
              size="large"
              prefix={<UserOutlined className="" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
            // className="w-[75%]"
          >
            <Input
              size="large"
              prefix={<LockOutlined className="" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="pb-4">Remember me</Checkbox>
          </Form.Item> */}
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              // className={styles.login_form_button}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
