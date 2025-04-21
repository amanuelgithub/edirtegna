import React from 'react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Modal, Select, Space, Empty, Spin } from 'antd';
import {
  stateCreateFormSchema,
  useCreateStateMutation,
  useGetStateById,
  useUpdateStateMutation,
  useListCountries,
} from '@/hooks/api/parameters';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce } from 'lodash';

const { PRESENTED_IMAGE_SIMPLE } = Empty;

type AddStateProps = {
  id: number | undefined;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  onSubmit: (isSaved: boolean) => void;
};

export default function EditState({
  id,
  isModalOpen,
  handleCancel,
  handleOk,
  onSubmit,
}: AddStateProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(stateCreateFormSchema),
  });

  const [fileList, setFileList] = useState<any[]>([]);

  const { data: stateData, isLoading: isFetching } = useGetStateById(id);
  const {
    mutate: createMutate,
    isPending: isCreationPending,
    isSuccess: isCreationSuccess,
  } = useCreateStateMutation();
  const {
    mutate: updateMutate,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
  } = useUpdateStateMutation();

  useEffect(() => {
    if (id && stateData) {
      reset({
        stateName: stateData.stateName,
        countryId: stateData.countryId,
      });
    }
  }, [id, stateData, reset]);

  const onFinish = (data) => {
    if (id) {
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

  const [searchCountryTxt, setSearchCountryTxt] = React.useState('');

  const { data: countriesData, isLoading: isCountriesLoading } =
    useListCountries({
      page: 1,
      limit: 100,
      search: searchCountryTxt,
    });

  const handleCountrySearch = React.useCallback((value: string) => {
    setSearchCountryTxt(value);
  }, []);

  const debouncedSearchCountry = React.useMemo(() => {
    return debounce(handleCountrySearch, 700);
  }, [handleCountrySearch]);

  return (
    <Modal
      title={id ? 'Edit State' : 'Add State'}
      open={isModalOpen}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
        <Form.Item
          label="Country"
          validateStatus={errors.countryId ? 'error' : ''}
          help={errors.countryId?.message}
        >
          <Controller
            name="countryId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                style={{ width: '100%' }}
                placeholder="select one country"
                onSearch={debouncedSearchCountry}
                notFoundContent={
                  isCountriesLoading ? (
                    <Space
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <Spin size="small" />
                    </Space>
                  ) : (
                    <Empty image={PRESENTED_IMAGE_SIMPLE} />
                  )
                }
                filterOption={(input, option) => {
                  return option
                    ? option.label.toLowerCase().includes(input.toLowerCase())
                    : false;
                }}
                options={countriesData?.data.map((country) => ({
                  label: `${country.countryName}`,
                  value: country.id,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="State Name"
          validateStatus={errors.stateName ? 'error' : ''}
          help={errors.stateName?.message}
        >
          <Controller
            name="stateName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter state name" />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreationPending || isUpdatePending}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
