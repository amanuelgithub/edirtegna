import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Checkbox,
  Upload,
  UploadProps,
  GetProp,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  useCreateCountryMutation,
  useGetCountryById,
  useUpdateCountryMutation,
} from '@/hooks/api/parameters/country';

type AddCountryProps = {
  id: number | undefined;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  onSubmit: (isSaved: boolean) => void;
};

interface CountryFormValues {
  countryName: string;
  phonePrefix?: string;
  icon?: string;
  isActive?: boolean;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default function AddCountry({
  id,
  isModalOpen,
  handleCancel,
  handleOk,
  onSubmit,
}: AddCountryProps) {
  // const queryClient = useQueryClient();
  const [form] = Form.useForm();

  // Fetch country data for editing
  const { data: countryData, isLoading: isFetching } = useGetCountryById(id);
  const { mutate: createMutate, isPending: isCreationPending } =
    useCreateCountryMutation();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateCountryMutation();

  const onFinish = (values: CountryFormValues) => {
    // mutation.mutate(values);
    if (id) {
      updateMutate(values);
    } else {
      createMutate(values);
    }
  };

  // Populate form fields when editing
  useEffect(() => {
    if (id && countryData) {
      console.log('found form data value: ', countryData);
      form.setFieldsValue({
        countryName: countryData?.data?.countryName, // Ensure the field matches the API response
        phonePrefix: countryData?.data?.phonePrefix,
        icon: countryData?.data?.icon,
        isActive: countryData?.data?.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [id, countryData, form]);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

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
        initialValues={{
          countryName: '',
          phonePrefix: '',
          icon: '',
          isActive: false,
        }}
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
        <Form.Item
          name="phonePrefix"
          label="Phone Prefix"
          rules={[
            { required: false, message: 'Please input the phone prefix!' },
          ]}
        >
          <Input placeholder="Enter phone prefix" />
        </Form.Item>
        <Form.Item
          name="icon"
          label="Icon"
          rules={[{ required: false, message: 'Please input the icon!' }]}
        >
          {/* <Input placeholder="Enter icon" /> */}

          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox
          // indeterminate={indeterminate}
          // onChange={onCheckAllChange}
          // checked={checkAll}
          >
            Is Active
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            // loading={mutation.isPending || isFetching}
            loading={isCreationPending || isUpdatePending || isFetching}
            style={{ width: '100%' }}
          >
            {id ? 'Update Country' : 'Add Country'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
