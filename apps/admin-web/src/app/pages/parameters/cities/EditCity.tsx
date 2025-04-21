import React from 'react';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Modal, Select, Space, Empty, Spin } from 'antd';
import {
  cityCreateFormSchema,
  useCreateCityMutation,
  useGetCityById,
  useUpdateCityMutation,
  createGetCountriesQueryOptions,
  createGetStatesQueryOptions,
} from '@/hooks/api/parameters';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce, filter, set } from 'lodash';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FilterOperator } from '@/core/models';
import { stateKeys } from '@/hooks/api/parameters/state/query-keys';
import { countryKeys } from '@/hooks/api/parameters/country/query-keys';

const { PRESENTED_IMAGE_SIMPLE } = Empty;

type AddCityProps = {
  id: number | undefined;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  onSubmit: (isSaved: boolean) => void;
};

export default function EditCity({
  id,
  isModalOpen,
  handleCancel,
  handleOk,
  onSubmit,
}: AddCityProps) {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(cityCreateFormSchema),
  });

  const { data: cityData, isLoading: isFetching } = useGetCityById(id);
  const {
    mutate: createMutate,
    isPending: isCreationPending,
    isSuccess: isCreationSuccess,
  } = useCreateCityMutation();
  const {
    mutate: updateMutate,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
  } = useUpdateCityMutation();

  useEffect(() => {
    if (id && cityData) {
      setSelectedCountry(cityData.countryId);
      reset({
        cityName: cityData.cityName,
        countryId: cityData.countryId,
        stateId: cityData.stateId,
      });
    }
  }, [id, cityData, reset]);

  const onFinish = (data) => {
    if (id) {
      updateMutate({ id, ...data });
    } else {
      createMutate(data);
    }

    onSubmit(true);
  };

  useEffect(() => {
    if (isCreationSuccess || isUpdateSuccess) {
      handleOk();
      onSubmit(true);
      reset(); // Reset the form after saving data
      setSelectedCountry(undefined); // Reset the selected country
      setSearchCountryTxt(''); // Reset the search country text
      setSearchStateTxt(''); // Reset the search state text
    }
  }, [isCreationSuccess, isUpdateSuccess, handleOk, onSubmit, reset]);

  const [searchCountryTxt, setSearchCountryTxt] = React.useState('');
  const [selectedCountry, setSelectedCountry] = React.useState<
    number | undefined
  >(undefined);
  const [searchStateTxt, setSearchStateTxt] = React.useState('');
  const [selectedState, setSelectedState] = React.useState<number | undefined>(
    undefined,
  );

  const {
    data: countriesData,
    isLoading: isCountriesLoading,
    refetch: refetchCountries,
  } = useQuery({
    ...createGetCountriesQueryOptions({
      page: 1,
      take: 100,
      fullTextFilter: searchCountryTxt,
    }),
  });

  const {
    data: statesData,
    isLoading: isStatesLoading,
    refetch: refetchStates,
  } = useQuery({
    ...createGetStatesQueryOptions({
      page: 1,
      take: 100,
      fullTextFilter: searchStateTxt,
      filters: [
        {
          name: 'countryId',
          value: selectedCountry,
          operator: FilterOperator.EQ,
        },
      ],
    }),
    enabled: !!selectedCountry,
  });

  useEffect(() => {
    refetchCountries(); // Refetch countries when search text changes
  }, [searchCountryTxt, refetchCountries]);

  useEffect(() => {
    if (selectedCountry) {
      refetchStates(); // Refetch states when search text or selected country changes
    }
  }, [searchStateTxt, selectedCountry, refetchStates]);

  useEffect(() => {
    if (selectedCountry) {
      setSelectedState(undefined); // Reset the selected state when the selected country changes
    }
  }, [selectedCountry]);

  // Handle on component unmount
  useEffect(() => {
    // on component unmount, remove the cache state data
    return () => {
      reset(); // Reset all form states when the modal is closed
      setSelectedCountry(undefined);
      setSearchCountryTxt('');
      setSearchStateTxt('');

      queryClient.removeQueries({
        queryKey: stateKeys.getAllStates(),
      });
    };
  }, []);

  const handleCountrySearch = React.useCallback((value: string) => {
    setSearchCountryTxt(value);
  }, []);

  const handleStateSearch = React.useCallback((value: string) => {
    setSearchStateTxt(value);
  }, []);

  const debouncedSearchCountry = React.useMemo(() => {
    return debounce(handleCountrySearch, 700);
  }, [handleCountrySearch]);

  const debouncedSearchState = React.useMemo(() => {
    return debounce(handleStateSearch, 700);
  }, [handleStateSearch]);

  const handleCountryChange = (value: number) => {
    setSelectedCountry(value);
  };

  return (
    <Modal
      title={id ? 'Edit City' : 'Add City'}
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
                onChange={(value) => {
                  field.onChange(value);
                  handleCountryChange(value);
                }}
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
          label="State"
          validateStatus={errors.stateId ? 'error' : ''}
          help={errors.stateId?.message}
        >
          <Controller
            name="stateId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                style={{ width: '100%' }}
                placeholder="select one state"
                onSearch={debouncedSearchState}
                notFoundContent={
                  isStatesLoading ? (
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
                options={statesData?.data.map((state) => ({
                  label: `${state.stateName}`,
                  value: state.id,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="City Name"
          validateStatus={errors.cityName ? 'error' : ''}
          help={errors.cityName?.message}
        >
          <Controller
            name="cityName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter city name" />
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
