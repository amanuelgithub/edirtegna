import { Modal, Form, Input, Button, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/config';
import { useEffect } from 'react';

type AddCountryProps = {
  id: number | undefined; // id for editing (if applicable)
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  onSubmit: (isSaved: boolean) => void;
};

interface CountryFormValues {
  countryName: string;
}

export default function AddCountry({
  id,
  isModalOpen,
  handleCancel,
  handleOk,
  onSubmit,
}: AddCountryProps) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  // Fetch country data for editing
  const { data: countryData, isLoading: isFetching } = useQuery({
    queryKey: ['country', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosInstance.get(`/manage/countries/${id}`);
      return response.data;
    },
    enabled: !!id, // Only fetch if `id` is provided
  });

  // Mutation for creating or updating a country
  const mutation = useMutation({
    mutationFn: async (values: CountryFormValues) => {
      if (id) {
        // Update existing country
        const response = await axiosInstance.put(
          `/manage/countries/${id}`,
          values,
        );
        return response.data;
      } else {
        // Create new country
        const response = await axiosInstance.post('/manage/countries', values);
        return response.data;
      }
    },
    onSuccess: () => {
      message.success(
        id ? 'Country updated successfully!' : 'Country added successfully!',
      );
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      onSubmit(true);
      handleOk();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to save country!');
    },
  });

  const onFinish = (values: CountryFormValues) => {
    mutation.mutate(values);
  };

  // Populate form fields when editing
  useEffect(() => {
    if (id && countryData) {
      console.log('found form data value: ', countryData);
      form.setFieldsValue({
        countryName: countryData?.data?.countryName, // Ensure the field matches the API response
      });
    } else {
      form.resetFields();
    }
  }, [id, countryData, form]);

  return (
    <Modal
      title={id ? 'Edit Country' : 'Add Country'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        name="add_country"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ countryName: '' }}
      >
        <Form.Item
          name="countryName"
          label="Country Name"
          rules={[
            { required: true, message: 'Please input the country name!' },
          ]}
        >
          <Input placeholder="Enter country name" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending || isFetching}
            style={{ width: '100%' }}
          >
            {id ? 'Update Country' : 'Add Country'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
