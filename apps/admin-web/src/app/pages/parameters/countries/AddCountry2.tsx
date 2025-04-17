import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Upload, message, Modal, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/config';
import {
  useCreateCountryMutation,
  useGetCountryById,
  useUpdateCountryMutation,
} from '@/hooks/api/parameters';

type AddCountryProps = {
  id: number | undefined;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  // onSubmit: (isSaved: boolean) => void;
};

const ProfileForm = ({
  id,
  isModalOpen,
  handleCancel,
  handleOk,
}: // onSubmit,
AddCountryProps) => {
  const { handleSubmit, control } = useForm();
  const [previewImage, setPreviewImage] = useState(null);

  const { data: countryData, isLoading: isFetching } = useGetCountryById(id);
  const { mutate: createMutate, isPending: isCreationPending } =
    useCreateCountryMutation();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateCountryMutation();

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      return axiosInstance.post('/manage/countries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      message.success('Form submitted successfully!');
    },
    onError: () => {
      message.error('Submission failed.');
    },
  });

  useEffect(() => {
    console.log('ID:', id);
    console.log('Country Data:', countryData);
  }, [countryData, id]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('countryName', data.countryName);
    formData.append('shortName', data.shortName);
    formData.append('phonePrefix', data.phonePrefix);
    formData.append('isActive', data.isActive ? 'true' : 'false');

    if (data.icon && data.icon.length > 0) {
      console.log('icon: ', data.icon[0]);
      formData.append('icon', data.icon[0].originFileObj);
    }

    mutation.mutate(formData);
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M ? false : Upload.LIST_IGNORE;
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setPreviewImage(file.preview);
  };

  return (
    <Modal
      title={id ? 'Edit Country' : 'Add Country'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Country Name">
          <Controller
            name="countryName"
            control={control}
            rules={{ required: 'Country name is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} placeholder="Enter country name" />
                {error && <span style={{ color: 'red' }}>{error.message}</span>}
              </>
            )}
          />
        </Form.Item>

        <Form.Item label="Short Name">
          <Controller
            name="shortName"
            control={control}
            rules={{ required: 'Short name is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} placeholder="Enter short name" />
                {error && <span style={{ color: 'red' }}>{error.message}</span>}
              </>
            )}
          />
        </Form.Item>

        <Form.Item label="Phone Prefix">
          <Controller
            name="phonePrefix"
            control={control}
            rules={{ required: 'Phone prefix is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} placeholder="Enter phone prefix" />
                {error && <span style={{ color: 'red' }}>{error.message}</span>}
              </>
            )}
          />
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Is Active</Checkbox>
        </Form.Item>

        <Form.Item label="Logo">
          <Controller
            name="icon"
            control={control}
            rules={{
              required: 'Logo is required',
              validate: (value) =>
                (value && value.length > 0) || 'Please upload an image',
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Upload
                  listType="picture-card"
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  onPreview={handlePreview}
                  onChange={(info) => {
                    field.onChange(info.fileList);
                    if (info.fileList && info.fileList.length > 0) {
                      handlePreview(info.fileList[0]);
                    } else {
                      setPreviewImage(null);
                    }
                  }}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
                {error && <span style={{ color: 'red' }}>{error.message}</span>}
              </>
            )}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: '100%', marginTop: 10 }}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileForm;
