import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Upload, message, Modal, Checkbox } from 'antd';
import {
  countryCreateFormSchema,
  useCreateCountryMutation,
  useGetCountryById,
  useUpdateCountryMutation,
} from '@/hooks/api/parameters';
import { zodResolver } from '@hookform/resolvers/zod';

type AddCountryProps = {
  id: number | undefined;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  onSubmit: (isSaved: boolean) => void;
};

export default function EditCountry({
  id,
  isModalOpen,
  handleCancel,
  handleOk,
  onSubmit,
}: AddCountryProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(
      countryCreateFormSchema,
      // countryUpdateFormSchema,
      // id ? countryUpdateFormSchema : countryCreateFormSchema,
    ),
  });

  const [fileList, setFileList] = useState<any[]>([]);

  const { data: countryData, isLoading: isFetching } = useGetCountryById(id);
  const {
    mutate: createMutate,
    isPending: isCreationPending,
    isSuccess: isCreationSuccess,
  } = useCreateCountryMutation();
  const {
    mutate: updateMutate,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
  } = useUpdateCountryMutation();

  useEffect(() => {
    if (id && countryData) {
      reset({
        countryName: countryData.countryName,
        shortName: countryData.shortName,
        phonePrefix: countryData.phonePrefix,
        isActive: countryData.isActive || false, // Ensure isActive is set to a boolean value
        // icon: (() => {
        //   const arr = countryData.icon
        //     ? [
        //         {
        //           uid: '-1',
        //           name: 'Uploaded Image',
        //           status: 'done',
        //           url: (() => {
        //             const fullSrc = countryData.icon
        //               ? `http://localhost/${countryData.icon}`
        //               : null; // Ensure full URL is constructed
        //             return fullSrc;
        //           })(),
        //         },
        //       ]
        //     : ([] as any[]);

        //   setFileList(arr);

        //   return arr;
        // })(),
      });

      if (countryData.icon) {
        const arr = [
          {
            uid: '-1',
            name: 'Uploaded Image',
            status: 'done',
            url: `http://localhost/${countryData.icon}`,
          },
        ];
        setFileList(arr);
      }
    }
  }, [id, countryData, reset]);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (data) => {
    if (id) {
      console.log('onFinish data: ', data);
      updateMutate({ id, ...data });
    } else {
      createMutate(data);
    }

    onSubmit(true);
  };

  useEffect(() => {
    if (isCreationSuccess) {
      handleOk();
      onSubmit(true);
    }
    if (isUpdateSuccess) {
      handleOk();
      onSubmit(true);
    }
  }, [isCreationSuccess, isUpdateSuccess]);

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      messageApi.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M ? false : Upload.LIST_IGNORE;
  };

  return (
    <>
      {contextHolder}

      <Modal
        title={id ? 'Edit Country' : 'Add Country'}
        open={isModalOpen}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
          <div className="flex justify-center items-center">
            <Form.Item
              validateStatus={errors.icon ? 'error' : ''}
              help={errors.icon?.message}
            >
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <Upload
                    listType="picture-circle"
                    beforeUpload={beforeUpload}
                    accept="image/*"
                    fileList={fileList}
                    maxCount={1}
                    onChange={({ fileList }) => {
                      setFileList(fileList);
                      field.onChange(fileList);
                    }}
                  >
                    {fileList.length < 1 && '+ Upload Logo/Flag'}
                  </Upload>
                )}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Country Name"
            validateStatus={errors.countryName ? 'error' : ''}
            help={errors.countryName?.message}
          >
            <Controller
              name="countryName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter country name" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Short Name"
            validateStatus={errors.shortName ? 'error' : ''}
            help={errors.shortName?.message}
          >
            <Controller
              name="shortName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter short name" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Phone Prefix"
            validateStatus={errors.phonePrefix ? 'error' : ''}
            help={errors.phonePrefix?.message}
          >
            <Controller
              name="phonePrefix"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter phone prefix" />
              )}
            />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={field.value}>
                  Is Active
                </Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreationPending || isUpdatePending}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
