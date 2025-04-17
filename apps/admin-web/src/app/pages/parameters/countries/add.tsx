import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Upload, message, Modal, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
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
  onSubmit: (isSaved: boolean) => void;
};

export default function Add({
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
  } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  // new

  const [fileList, setFileList] = useState<any[]>([]);
  const [fileError, setFileError] = useState(false);

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
    console.log('ID:', id);
    console.log('Country Data:', countryData);
  }, [countryData, id]);

  const onFinish = (data) => {
    if (id) {
      updateMutate({ id, ...data });
    } else {
      createMutate(data);
    }
  };

  useEffect(() => {
    if (isCreationSuccess) {
      message.success('Country created successfully!');
      handleOk();
      onSubmit(true);
    }
    if (isUpdateSuccess) {
      message.success('Country updated successfully!');
      handleOk();
      onSubmit(true);
    }
  }, [isCreationSuccess, isUpdateSuccess]);

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
      onOk={handleOk} // hidden, but required
      onCancel={handleCancel} // hidden, but required
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
        <Form.Item label="Logo /Flag">
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
                  listType="picture-circle"
                  // beforeUpload={() => false}
                  beforeUpload={beforeUpload}
                  accept="image/*"
                  fileList={fileList}
                  maxCount={1}
                  onChange={({ fileList }) => {
                    setFileList(fileList);
                    field.onChange(fileList);
                  }}
                >
                  {fileList.length < 1 && '+ Upload'}
                </Upload>
                {error && <span style={{ color: 'red' }}>{error.message}</span>}
              </>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Country Name"
          validateStatus={errors.countryName ? 'error' : ''}
          help={errors.countryName && 'Country Name is required'}
        >
          <Controller
            name="countryName"
            control={control}
            rules={{ required: 'Country name is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input {...field} placeholder="Enter country name" />
                {/* {error && <span style={{ color: 'red' }}>{error.message}</span>} */}
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

        {/* <Form.Item label="Logo">
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
        </Form.Item> */}

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
  );
}
