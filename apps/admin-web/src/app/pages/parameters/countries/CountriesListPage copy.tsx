import React, { useState } from 'react';
import { Avatar, Button, Card, Input, Table, Flex, Tag } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { axiosInstance } from '@/config';
import AddCountry from './AddCountry';

// Define interfaces
interface IBaseModel {
  id: number;
  createdAt: string;
  updatedAt: string;
}

interface ICountry extends IBaseModel {
  countryName: string;
  shortName: string;
  icon?: string;
  phonePrefix: string;
  isActive: boolean;
}

export default function CountriesListPage() {
  // Read URL search parameters
  // const searchUrlParams = useSearchParams();
  const [searchUrlParams] = useSearchParams();
  const navigate = useNavigate();
  // const initialPage = parseInt(searchUrlParams.get('page') || '1');
  const initialPage = parseInt(searchUrlParams.get('page') || '1');
  const initialTake = parseInt(searchUrlParams.get('take') || '5');
  const initialSort = searchUrlParams.get('sort') || 'id';
  const initialOrder = searchUrlParams.get('order') || 'DESC';
  const initialQ = searchUrlParams.get('search') || '';

  // Initialize pagination state from URL
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialTake,
  });
  const [search, setSearch] = useState(initialQ);
  const [id, setId] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch countries using tanstack query
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['countries', pagination, search],

    queryFn: async () => {
      const response = await axiosInstance.get(
        `/manage/countries?page=${pagination.current}&take=${pagination.pageSize}&sort=${initialSort}&order=${initialOrder}&search=${search}`,
      );
      // return response.json();
      return response.data;
    },
    // {
    //   keepPreviousData: true,
    // },
  });

  const handleTableChange = (
    paginationData: any,
    filters: any,
    sorter: any,
  ) => {
    setPagination(paginationData);
    navigate(
      `?page=${paginationData.current}&take=${paginationData.pageSize}&sort=${
        sorter.field ?? 'id'
      }&order=${sorter?.order === 'ascend' ? 'ASC' : 'DESC'}&search=${search}`,
    );
    queryClient.invalidateQueries({ queryKey: ['countries'] });
  };

  const handleTableFullTextSearch = (value: string) => {
    setSearch(value);
    navigate(
      `?page=${pagination.current}&take=${pagination.pageSize}&sort=${initialSort}&order=${initialOrder}&search=${value}`,
    );
    queryClient.invalidateQueries({ queryKey: ['countries'] });
  };

  if (error) {
    return <div>Error loading countries</div>;
  }

  const showModal = (id?: number) => {
    setId(id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setId(undefined);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setId(undefined);
  };

  const columns: TableProps<ICountry>['columns'] = [
    {
      title: 'Country Name',
      dataIndex: 'countryName',
      sorter: true,
      key: 'countryName',
      render: (value) => <span>{value ?? '-'}</span>,
    },
    {
      title: 'Short Name',
      dataIndex: 'shortName',
      key: 'shortName',
      render: (value) => <span>{value ?? '-'}</span>,
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (src) => {
        const lowerSrc = src?.toString().toLowerCase();
        return (
          <>
            {src &&
            (lowerSrc?.endsWith('.png') ||
              lowerSrc?.endsWith('.jpg') ||
              lowerSrc?.endsWith('.jpeg')) ? (
              <Avatar src={src} />
            ) : src ? (
              src
            ) : (
              '🌍'
            )}
          </>
        );
      },
    },
    {
      title: 'Phone Prefix',
      dataIndex: 'phonePrefix',
      key: 'phonePrefix',
      render: (value) => <span>{value ?? '-'}</span>,
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (value) => (
        <Tag color={value ? 'green' : 'red'}>{value ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true,
      key: 'createdAt',
      render: (value) => (
        <span>{dayjs(value).format('MMM D, YYYY').toString()}</span>
      ),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      sorter: true,
      key: 'updatedAt',
      render: (value) => (
        <span>{dayjs(value).format('MMM D, YYYY').toString()}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex gap="small" key={record.id}>
          <Button
            size="small"
            type="link"
            variant="outlined"
            color="blue"
            onClick={() => showModal(record.id)}
          >
            <EditOutlined />
          </Button>
          <Button
            size="small"
            type="link"
            variant="outlined"
            color="cyan"
            onClick={() => showModal(record.id)}
          >
            <EyeOutlined />
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Countries"
        extra={
          <Flex vertical justify="end" align="end">
            <Button
              icon={<PlusOutlined />}
              variant="solid"
              color="green"
              onClick={() => showModal()}
            >
              Add
            </Button>
          </Flex>
        }
      >
        <Input.Search
          allowClear
          enterButton="Search"
          loading={isLoading}
          placeholder="Search countries"
          defaultValue={initialQ}
          onSearch={handleTableFullTextSearch}
        />
      </Card>

      <Table<ICountry>
        columns={columns}
        rowKey={(record) => record.id}
        loading={isLoading}
        dataSource={data?.data}
        components={components}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.meta.count,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
          showTotal: (total) => `Total ${total} items`,
        }}
        onChange={handleTableChange}
      />

      {isModalOpen && (
        <AddCountry
          id={id}
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          handleOk={handleOk}
          onSubmit={handleOk}
        />
      )}
    </>
  );
}

// Custom table cell component for extra styling
const components = {
  body: {
    cell: ({ children, ...restProps }: any) => (
      <td
        {...restProps}
        style={{
          paddingTop: '12px',
          paddingBottom: '12px',
        }}
      >
        {children}
      </td>
    ),
  },
};
