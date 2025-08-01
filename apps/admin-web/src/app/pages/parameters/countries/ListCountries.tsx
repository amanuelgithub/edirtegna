import { useState } from 'react';
import { Avatar, Button, Card, Input, Table, Flex, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  EditFilled,
  EyeFilled,
} from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useListCountries } from '@/hooks/api/parameters/country';
import {
  Country,
  IDatasourceFilter,
  IDatasourceOrder,
  IDatasourceParameters,
} from '@/core/models';
import { Order } from '@/core/enums';
import EditCountry from './EditCountry';
import { parseUrlParams } from '@/hooks/api/base/url-builder';

const info = () => {
  message.info('This is a normal message');
};

export default function ListCountries() {
  // Read URL search parameters
  // const [searchUrlParams] = useSearchParams();
  // const initialPage = parseInt(searchUrlParams.get('page') || '1');
  // const initialLimit = parseInt(searchUrlParams.get('limit') || '20');
  // const initialSortBy = searchUrlParams.get('sortBy') || 'id';
  // const initialSort = initialSortBy.split(':')[0] || 'id';
  // const initialOrder = (initialSortBy.split(':')[1] || 'DESC') as Order;
  // const initialQ = searchUrlParams.get('search') || '';

  // const [sort, setSort] = useState(initialSort);
  // const [order, setOrder] = useState<Order>(initialOrder);
  // const [search, setSearch] = useState(initialQ);

  const initialParams = parseUrlParams(window.location.search);

  const [orders, setOrders] = useState<IDatasourceOrder[]>(
    initialParams?.orders || [{ name: 'id', dir: 'desc' }],
  );
  const [filters, setFilters] = useState<IDatasourceFilter[]>(
    initialParams.filters || [],
  );
  const [search, setSearch] = useState(initialParams.fullTextFilter || '');

  // Initialize pagination state from URL
  // Initialize pagination state from URL
  const [pagination, setPagination] = useState({
    current: initialParams.page || 1,
    pageSize: initialParams.take || 20,
  });

  const [id, setId] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useListCountries({
    page: pagination.current,
    take: pagination.pageSize,
    orders: orders,
    fullTextFilter: search,
    filters: filters,
  } as IDatasourceParameters);

  const [messageApi, contextHolder] = message.useMessage();

  const handleTableChange = (
    paginationData: any,
    filters: any,
    sorter: any,
  ) => {
    setPagination(paginationData);
    setOrders(() =>
      sorter.field
        ? [
            {
              name: sorter.field,
              dir: sorter.order === 'ascend' ? 'asc' : 'desc',
            },
          ]
        : [],
    );
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
    setIsModalOpen(false);
    setId(undefined);
    messageApi.open({
      type: 'success',
      content: 'Country saved successfully',
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setId(undefined);
  };

  const columns: TableProps<Country>['columns'] = [
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
        const fullSrc = src ? `http://localhost/${src}` : null; // Ensure full URL is constructed
        return fullSrc ? (
          <Avatar src={fullSrc} alt="Country Icon" />
        ) : (
          <span>🌍</span>
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
            variant="text"
            color="blue"
            onClick={() => showModal(record.id)}
          >
            <EditFilled style={{ fontSize: '18px' }} />
          </Button>
          <Button
            size="small"
            type="link"
            variant="text"
            color="cyan"
            onClick={() => showModal(record.id)}
          >
            <EyeFilled style={{ fontSize: '18px' }} />
          </Button>
          {/* <Button
            size="small"
            type="link"
            variant="outlined"
            color="blue"
            onClick={() => showModal(record.id)}
          >
            <EditOutlined />
          </Button> */}
          {/* <Button
            size="small"
            type="link"
            variant="outlined"
            color="cyan"
            onClick={() => showModal(record.id)}
          >
            <EyeOutlined />
          </Button> */}
        </Flex>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

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
          defaultValue={search}
          onSearch={handleTableFullTextSearch}
        />
      </Card>

      <Table<Country>
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
        rowClassName={(_, index) => (index % 2 === 0 ? '' : 'bg-gray-50')}
        scroll={{ x: 'max-content' }}
      />

      {isModalOpen && (
        <EditCountry
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
