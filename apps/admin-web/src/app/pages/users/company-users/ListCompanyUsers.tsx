import { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Table,
  Flex,
  message,
  Avatar,
  Tag,
  Select,
} from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useListUsers } from '@/hooks/api/users';
import {
  FilterOperator,
  IDatasourceFilter,
  IDatasourceOrder,
  User,
} from '@/core/models';
import EditCompanyUser from './EditCompanyUser';
import { USER_STATUS, UserStatus } from '@/core/enums';

const renderAccountStatus = (status: string) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return <Tag color="green">Active</Tag>;
    case USER_STATUS.PENDING:
      return <Tag color="orange">Pending</Tag>;
    case USER_STATUS.BLOCKED:
      return <Tag color="red">Blocked</Tag>;
    case USER_STATUS.SUSPENDED:
      return <Tag color="purple">Suspended</Tag>;
    case USER_STATUS.SELF_REG:
      return <Tag color="blue">Self Registered</Tag>;
    default:
      return <Tag>Unknown</Tag>;
  }
};

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

export default function ListCompanyUsers() {
  // Read URL search parameters
  const [searchUrlParams] = useSearchParams();
  const initialPage = parseInt(searchUrlParams.get('page') || '1');
  const initialLimit = parseInt(searchUrlParams.get('limit') || '20');
  // const initialSortBy = searchUrlParams.get('sortBy') || 'id';
  // const initialSort = initialSortBy.split(':')[0] || 'id';
  // const initialOrder = (initialSortBy.split(':')[1] || 'DESC') as Order;
  const initialQ = searchUrlParams.get('search') || '';

  // const [sortBy, setSortBy] = useState(initialSort);
  const [orders, setOrders] = useState<IDatasourceOrder[]>([
    { name: 'id', dir: 'desc' },
  ]);
  const [filters, setFilters] = useState<IDatasourceFilter[]>([]);
  const [search, setSearch] = useState(initialQ);

  // Initialize pagination state from URL
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialLimit,
  });
  const [id, setId] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useListUsers({
    page: pagination.current,
    take: pagination.pageSize,
    // sort: sortBy,
    orders: orders,
    fullTextFilter: search,
    filters: filters,
    // search,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const handleTableChange = (
    paginationData: any,
    filters: any,
    sorter: any,
  ) => {
    // console.log('table sorter: ', sorter);
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
    // filters
    console.log('table filters: ', filters);
  };

  const handleTableFullTextSearch = (value: string) => {
    setSearch(value);
  };

  const onTableRowSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<User> = {
    selectedRowKeys,
    onChange: onTableRowSelectChange,
  };

  // const hasSelected = selectedRowKeys.length > 0;

  const handleFilterByStatusChange = (value: UserStatus) => {
    console.log('filter by status: ', value);
    setFilters((prev) => {
      const newFilters = [...prev];
      const index = newFilters.findIndex((f) => f.name === 'status');
      if (index > -1) {
        newFilters[index].value = value;
      } else {
        newFilters.push({ name: 'status', value, operator: FilterOperator.EQ });
      }
      return newFilters;
    });
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
      content: 'User saved successfully',
    });
  };

  const handleCancel = () => {
    console.log('handle cancel');
    setIsModalOpen(false);
    setId(undefined);
  };

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Company User',
      dataIndex: 'userProfile',
      // sorter: true,
      key: 'userProfile.firstName',
      render: (userProfile) => (
        <Flex align="center" gap="small">
          <Avatar
            src={userProfile?.profilePic}
            alt={`${userProfile?.firstName ?? ''} ${
              userProfile?.lastName ?? ''
            }`}
          />

          <span>
            {userProfile?.firstName ?? '-'} {userProfile?.lastName ?? '-'}
          </span>
        </Flex>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
      key: 'email',
      render: (value) => <span>{value ?? '-'}</span>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: true,
      key: 'phone',
      render: (value) => <span>{value ?? '-'}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role.name',
      render: (role) => <span>{role?.name ?? '-'}</span>,
    },
    {
      title: 'Account Status',
      dataIndex: 'status',
      sorter: true,
      key: 'status',
      render: (value) => renderAccountStatus(value),
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
        title="Users"
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
        <div className="flex justify-between align-items-center mb-3">
          <Input.Search
            allowClear
            // enterButton="Search"
            // width={150}
            style={{ width: 300 }}
            loading={isLoading}
            placeholder="search by name, email, phone..."
            defaultValue={initialQ}
            onSearch={handleTableFullTextSearch}
          />

          <div className="flex gap-2">
            {/* filtering options */}
            <Select
              style={{ width: 220 }}
              allowClear
              options={Object.entries(USER_STATUS).map(([key, value]) => ({
                value: value,
                label: key,
              }))}
              placeholder="Filter by status..."
              onChange={handleFilterByStatusChange}
            />
          </div>
        </div>
      </Card>

      <Table<User>
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
        rowSelection={rowSelection}
        rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-gray-50')}
        // rowSelection={{ type: selectionType, ...rowSelection }}
      />

      {isModalOpen && (
        <EditCompanyUser
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
