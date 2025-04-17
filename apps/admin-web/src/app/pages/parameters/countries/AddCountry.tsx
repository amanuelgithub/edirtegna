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

type AddCountryProps = {
  id: number | undefined;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  onSubmit: (isSaved: boolean) => void;
};

interface CountryFormValues {
  countryName: string;
  shortName?: string;
  phonePrefix?: string;
  // icon?: string;
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
  } = useForm<CountryFormValues>();
  // } = useForm<any>();
  const [fileList, setFileList] = React.useState<any[]>([]);
  const [fileError, setFileError] = React.useState(false);

  // Fetch country data for editing
  const { data: countryData, isLoading: isFetching } = useGetCountryById(id);
  const { mutate: createMutate, isPending: isCreationPending } =
    useCreateCountryMutation();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateCountryMutation();

  const onFinish = (data: any) => {
    if (fileList.length === 0) {
      setFileError(true);
      return;
    }
    setFileError(false);
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('icon', fileList[0]?.originFileObj);
    // formData.append('icon', fileList[0]?.originFileObj);

    console.log('Form Data:', formData);
    console.log('Data:', data);
    console.log('File List:', fileList);
    if (id) {
      updateMutate({
        id: id,
        // data: {
        //   ...data,
        //   // icon: fileList[0]?.originFileObj,
        // },
      });
    } else {
      createMutate({
        ...data,
        // icon: fileList[0]
        icon: fileList[0]?.originFileObj,
      });
    }
  };

  return (
    <Modal
      title={id ? 'Edit Country' : 'Add Country'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      {/* <div className="space-y-4"> */}
      {/* <h1 className="text-2xl font-bold text-center">County Form</h1> */}
      <Form onFinish={handleSubmit(onFinish)} layout="vertical">
        <div className="flex items-center justify-center">
          <Form.Item label="Country Flag">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              // accept="file"
              maxCount={1}
              accept="image/*"
            >
              {fileList.length < 1 && '+ Upload'}
            </Upload>
            {fileError && (
              <div className="text-red-500 mt-1">Country Flag is required</div>
            )}
          </Form.Item>
        </div>

        <Controller
          name="countryName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Form.Item
              label="Country Name"
              validateStatus={errors.countryName ? 'error' : ''}
              help={errors.countryName && 'Country Name is required'}
            >
              <Input {...field} className="w-full" />
            </Form.Item>
          )}
        />

        <Controller
          name="shortName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Form.Item
              label="Short Name"
              validateStatus={errors.shortName ? 'error' : ''}
              help={errors.shortName && 'Short name is required'}
            >
              <Input {...field} className="w-full" />
            </Form.Item>
          )}
        />

        <Controller
          name="phonePrefix"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Form.Item
              label="Phone Prefix"
              validateStatus={errors.phonePrefix ? 'error' : ''}
              help={errors.phonePrefix && 'Phone Prefix is required'}
            >
              <Input {...field} className="w-full" />
            </Form.Item>
          )}
        />

        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Is Active</Checkbox>
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
      {/* </div> */}
    </Modal>
  );
}
