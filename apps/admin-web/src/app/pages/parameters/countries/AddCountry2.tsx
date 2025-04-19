import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Upload, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

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

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      return axios.post('/api/upload', formData, {
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

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);

    if (data.profilePicture && data.profilePicture.length > 0) {
      formData.append('profilePicture', data.profilePicture[0].originFileObj);
    }

    mutation.mutate(formData);
  };

  const beforeUpload = (file) => {
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
        <Form.Item label="First Name">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} placeholder="Enter first name" />
                {error && <span style={{ color: 'red' }}>{error.message}</span>}
              </>
            )}
          />
        </Form.Item>

        <Form.Item label="Last Name">
          <Controller
            name="lastName"
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} placeholder="Enter last name" />
                {error && <span style={{ color: 'red' }}>{error.message}</span>}
              </>
            )}
          />
        </Form.Item>

        <Form.Item label="Profile Picture">
          <Controller
            name="profilePicture"
            control={control}
            rules={{
              required: 'Profile picture is required',
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
