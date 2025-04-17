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
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';

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

export default function AddCountry({
  id,
  isModalOpen,
  handleCancel,
  handleOk,
  onSubmit,
}: AddCountryProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const [fileList, setFileList] = React.useState<File[]>([]);
  const [fileError, setFileError] = React.useState(false);

  const onFinish = (data: any) => {
    if (fileList.length === 0) {
      setFileError(true);
      return;
    }
    setFileError(false);
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('profilePicture', fileList[0]?.originFileObj);

    // axios
    //   .post('/api/submit', formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //   })
    //   .then((response: any) => {
    //     console.log('Success:', response);
    //     alert('Form submitted successfully!');
    //   })
    //   .catch((error: any) => {
    //     console.error('Error:', error);
    //     alert('Failed to submit form.');
    //   });
  };

  return (
    <Modal
      title={id ? 'Edit Country' : 'Add Country'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Profile Form</h1>
        <Form onFinish={handleSubmit(onFinish)} layout="vertical">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Form.Item
                label="First Name"
                validateStatus={errors.firstName ? 'error' : ''}
                help={errors.firstName && 'First name is required'}
              >
                <Input {...field} className="w-full" />
              </Form.Item>
            )}
          />
          <Controller
            name="lastName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Form.Item
                label="Last Name"
                validateStatus={errors.lastName ? 'error' : ''}
                help={errors.lastName && 'Last name is required'}
              >
                <Input {...field} className="w-full" />
              </Form.Item>
            )}
          />
          <Form.Item label="Profile Picture">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              accept="image/*"
            >
              {fileList.length < 1 && '+ Upload'}
            </Upload>
            {fileError && (
              <div className="text-red-500 mt-1">
                Profile picture is required
              </div>
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
