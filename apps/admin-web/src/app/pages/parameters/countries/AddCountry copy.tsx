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
  // const queryClient = useQueryClient();
  // const [form] = Form.useForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    getValues,
  } = useForm<any>();

  // Fetch country data for editing
  const { data: countryData, isLoading: isFetching } = useGetCountryById(id);
  const { mutate: createMutate, isPending: isCreationPending } =
    useCreateCountryMutation();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateCountryMutation();

  const [fileList, setFileList] = React.useState<any[]>([]);
  const [fileError, setFileError] = React.useState(false);

  const onFinish = (values: CountryFormValues) => {
    if (fileList.length === 0) {
      setFileError(true);
      return;
    }
    setFileError(false);
    // give icon value from fileList

    // values.icon = fileList[0]?.url;
    values.icon = fileList[0]?.originFileObj?.name;

    // mutation.mutate(values);
    if (id) {
      updateMutate(values);
    } else {
      console.log('create country: ', values);
      createMutate(values);
    }
  };

  // Populate form fields when editing
  useEffect(() => {
    if (id && countryData) {
      // console.log('found form data value: ', countryData);
      // form.setFieldsValue({
      //   countryName: countryData?.data?.countryName, // Ensure the field matches the API response
      //   phonePrefix: countryData?.data?.phonePrefix,
      //   icon: countryData?.data?.icon,
      //   isActive: countryData?.data?.isActive,
      // });

      setValue('countryName', countryData?.data?.countryName);
      setValue('phonePrefix', countryData?.data?.phonePrefix);
      setValue('icon', countryData?.data?.icon);
      setValue('isActive', countryData?.data?.isActive);
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: countryData?.data?.icon,
        },
      ]);
    } else {
      // form.resetFields();
    }
  }, [id, countryData]);

  return (
    <Modal
      title={id ? 'Edit Country' : 'Add Country'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <Form
        // form={form}
        // name="add_country"
        layout="vertical"
        onFinish={handleSubmit(onFinish)}
        // initialValues={{
        //   countryName: '',
        //   phonePrefix: '',
        //   icon: '',
        //   isActive: false,
        // }}
      >
        <Controller
          name="countryName"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Form.Item
              label="Country Name"
              validateStatus={errors.countryName ? 'error' : ''}
              help={errors.countryName && 'Please input country name!'}
            >
              <Input
                {...field}
                placeholder="Enter country name"
                className="w-full"
              />
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
              help={errors.phonePrefix && 'Please input the phone prefix!'}
            >
              <Input
                {...field}
                placeholder="Enter phone prefix"
                className="w-full"
              />
            </Form.Item>
          )}
        />

        <Controller
          name="icon"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Form.Item
              label="Country Flag"
              validateStatus={errors.icon ? 'error' : ''}
              help={errors.icon && 'Please input the icon!'}
            >
              <Upload
                {...field}
                // name="icon"
                listType="picture-circle"
                fileList={fileList}
                // onChange={({ fileList }) => setFileList(fileList)}
                onChange={({ fileList }) => {
                  setFileList(fileList);
                  if (fileList.length > 0) {
                    setValue('icon', fileList[0]?.fileName);
                  } else {
                    setValue('icon', undefined);
                  }
                }}
                beforeUpload={() => false}
                accept="image/*"
              >
                {fileList.length < 1 && '+ Upload'}
              </Upload>
            </Form.Item>
          )}
        />

        {/* <Form.Item
          name="icon"
          label="Icon"
          rules={[{ required: false, message: 'Please input the icon!' }]}
        >
          <Upload
            name="avatar"
            listType="picture-circle"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            accept="image/*"
          >
            {fileList.length < 1 && '+ Upload'}
          </Upload>
          {fileError && (
            <div className="text-red-500 mt-1">Profile picture is required</div>
          )}
        </Form.Item> */}
        {/* <Form.Item label="Profile Picture">
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
            <div className="text-red-500 mt-1">Profile picture is required</div>
          )}
        </Form.Item> */}
        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Is Active</Checkbox>
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
