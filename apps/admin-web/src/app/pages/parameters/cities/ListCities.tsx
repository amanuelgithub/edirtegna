import { useState } from 'react';
import { Button, Card, Input, Table, Flex, message } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useListCities } from '@/hooks/api/parameters';
import { City } from '@/core/models';
import { Order } from '@/core/enums';
import EditCity from './EditCity';

export default function ListCities() {
  // Read URL search parameters
  const [searchUrlParams] = useSearchParams();
  const initialPage = parseInt(searchUrlParams.get('page') || '1');
  const initialLimit = parseInt(searchUrlParams.get('limit') || '20');
  const initialSortBy = searchUrlParams.get('sortBy') || 'id';
  const initialSort = initialSortBy.split(':')[0] || 'id';
  const initialOrder = (initialSortBy.split(':')[1] || 'DESC') as Order;
  const initialQ = searchUrlParams.get('search') || '';

  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState<Order>(initialOrder);
  const [search, setSearch] = useState(initialQ);

  // Initialize pagination state from URL
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialLimit,
  });
  const [id, setId] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useListCities({
    page: pagination.current,
    limit: pagination.pageSize,
    sort,
    order,
    search,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const handleTableChange = (
    paginationData: any,
    filters: any,
    sorter: any,
  ) => {
    console.log('table sorter: ', sorter);
    setPagination(paginationData);
    setSort(sorter.field ?? 'id');

    setOrder(sorter?.order === 'ascend' ? 'ASC' : 'DESC');
  };

  const handleTableFullTextSearch = (value: string) => {
    setSearch(value);
  };

  if (error) {
    return <div>Error loading countries</div>;
  }

  const showModal = (id?: number) => {
    setId(id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log('handle ok');
    setIsModalOpen(false);
    setId(undefined);
    messageApi.open({
      type: 'success',
      content: 'City saved successfully',
    });
  };

  const handleCancel = () => {
    console.log('handle cancel');
    setIsModalOpen(false);
    setId(undefined);
  };

  const columns: TableProps<City>['columns'] = [
    {
      title: 'City Name',
      dataIndex: 'cityName',
      sorter: true,
      key: 'cityName',
      render: (value) => <span>{value ?? '-'}</span>,
    },
    {
      title: 'Country Name',
      dataIndex: 'country',
      sorter: true,
      key: 'country.countryName',
      render: (country) => <span>{country?.countryName ?? '-'}</span>,
    },
    {
      title: 'State Name',
      dataIndex: 'state',
      sorter: true,
      key: 'state.stateName',
      render: (state) => <span>{state?.stateName ?? '-'}</span>,
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
      {contextHolder}

      <Card
        title="Cities"
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

      <Table<City>
        columns={columns}
        rowKey={(record) => record.id}
        loading={isLoading}
        dataSource={data?.data}
        components={components}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.meta?.totalItems,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
          showTotal: (total) => `Total ${total} items`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />

      {isModalOpen && (
        <EditCity
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
          paddingTop: '8px',
          paddingBottom: '8px',
        }}
      >
        {children}
      </td>
    ),
  },
};
