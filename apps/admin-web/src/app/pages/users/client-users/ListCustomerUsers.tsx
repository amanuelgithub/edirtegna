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
  Breadcrumb,
  Dropdown,
  Menu,
} from 'antd';
import type { TableProps } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  EyeFilled,
  EditFilled,
  DownOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useListCustomerUsers } from '@/hooks/api/users';
import {
  FilterOperator,
  IDatasourceFilter,
  IDatasourceOrder,
  IDatasourceParameters,
  User,
} from '@/core/models';
import { ROLES_SEED, USER_STATUS, UserStatus } from '@/core/enums';
import { parseUrlParams } from '@/hooks/api/base/url-builder';
import { Link } from 'react-router-dom';
import { axiosInstance } from '@/config';
import { useQueryClient } from '@tanstack/react-query';

const handleStatusChange = async (
  userId: number,
  newStatus: UserStatus,
  refetch: () => void,
) => {
  try {
    await axiosInstance.put(`/web/customer-users/${userId}/status`, {
      status: newStatus,
    });
    message.success('Status updated successfully');
    // Refetch the user list data
    refetch();
  } catch (error) {
    message.error('Failed to update status');
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return 'green';
    case USER_STATUS.PENDING:
      return 'orange';
    case USER_STATUS.BLOCKED:
      return 'red';
    case USER_STATUS.SUSPENDED:
      return 'purple';
    case USER_STATUS.SELF_REG:
      return 'blue';
    default:
      return 'default';
  }
};

const renderAccountStatusWithDropdown = (
  status: string,
  userId: number,
  refetch: () => void,
) => {
  const menu = (
    <Menu
      onClick={({ key }) =>
        handleStatusChange(userId, key as UserStatus, refetch)
      }
      items={['ACTIVE', 'BLOCKED'].map((value) => ({
        key: value,
        label: value,
      }))}
    />
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Tag color={getStatusColor(status)}>
        {status} <DownOutlined />
      </Tag>
    </Dropdown>
  );
};

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

export default function ListCustomerUsers() {
  const queryClient = useQueryClient();
  const initialParams = parseUrlParams(window.location.search);

  const [orders, setOrders] = useState<IDatasourceOrder[]>(
    initialParams?.orders || [{ name: 'id', dir: 'desc' }],
  );
  const [filters, setFilters] = useState<IDatasourceFilter[]>(
    initialParams.filters || [],
  );
  const [search, setSearch] = useState(initialParams.fullTextFilter || '');

  // Initialize pagination state from URL
  const [pagination, setPagination] = useState({
    current: initialParams.page || 1,
    pageSize: initialParams.take || 20,
  });
  const [id, setId] = useState<number | undefined>(undefined);

  const { data, isLoading, error, refetch } = useListCustomerUsers({
    page: pagination.current,
    take: pagination.pageSize,
    orders: orders,
    fullTextFilter: search,
    filters: filters,
  } as IDatasourceParameters);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

  const onTableRowSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<User> = {
    selectedRowKeys,
    onChange: onTableRowSelectChange,
  };

  const handleFilterByStatusChange = (value: UserStatus) => {
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
  const handleFilterByRoleChange = (value: UserStatus) => {
    setFilters((prev) => {
      const newFilters = [...prev];
      const index = newFilters.findIndex((f) => f.name === 'roleId');
      if (index > -1) {
        newFilters[index].value = value;
      } else {
        newFilters.push({ name: 'roleId', value, operator: FilterOperator.EQ });
      }
      return newFilters;
    });
  };

  if (error) {
    return <div>Error loading countries</div>;
  }

  const showModal = (id?: number) => {
    setId(id);
  };

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Customer User',
      dataIndex: 'userProfile',
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
      render: (value, record) =>
        renderAccountStatusWithDropdown(value, record.id, refetch),
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
        <Flex key={record.id}>
          <Button
            size="small"
            type="link"
            variant="text"
            color="danger"
            onClick={() => showModal(record.id)}
          >
            <EditFilled style={{ fontSize: '18px' }} />
          </Button>
          <Button
            size="small"
            type="link"
            variant="text"
            color="primary"
            onClick={() => showModal(record.id)}
          >
            <EyeFilled style={{ fontSize: '18px' }} />
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      {/* Breadcrumb */}
      <div
        style={{
          padding: '4px',
          paddingLeft: '16px',
          paddingRight: '16px',
          marginBottom: '16px',
          background: '#f0f2f5',
        }}
      >
        <Breadcrumb
          items={[
            { key: '1', title: <Link to="/dashboard">Dashboard</Link> },
            { key: '2', title: 'Customer Users' },
          ]}
        />
      </div>

      <Card
        title="Customer Users"
        extra={
          <Flex vertical justify="end" align="end">
            <Button
              icon={<PlusOutlined />}
              variant="dashed"
              color="green"
              onClick={() => showModal()}
            >
              Add
            </Button>
          </Flex>
        }
      >
        <div className="flex flex-wrap gap-2 justify-between align-items-center mb-3">
          <Input.Search
            allowClear
            enterButton
            size="middle"
            style={{ width: 300 }}
            loading={isLoading}
            placeholder="search by name, email, phone..."
            defaultValue={search}
            onSearch={handleTableFullTextSearch}
          />

          <div className="flex gap-2">
            {/* filtering options */}
            <Select
              style={{ width: 200 }}
              size="middle"
              allowClear
              options={ROLES_SEED.map((role) => ({
                value: role.id,
                label: role.name,
              }))}
              placeholder="Filter by role..."
              onChange={handleFilterByRoleChange}
            />

            <Select
              style={{ width: 140 }}
              size="middle"
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

        {selectedRowKeys.length > 0 && (
          <div className="flex justify-start gap-4 align-items-center mb-3 px-2 py-1 bg-red-50 rounded-md">
            <div className="text-gray-500 flex items-end justify-start">
              <span>{selectedRowKeys.length} user(s) selected</span>
            </div>
            <Select
              // style={{ width: 200, backgroundColor: '#1890ff', color: '#fff' }}
              style={{
                width: 200,
              }}
              // variant="filled"
              size="small"
              placeholder="Batch update status..."
              options={['ACTIVE', 'BLOCKED'].map((value) => ({
                value: value,
                label: value,
              }))}
              onChange={async (newStatus) => {
                try {
                  await Promise.all(
                    selectedRowKeys.map((userId) =>
                      axiosInstance.put(
                        `/web/customer-users/${userId}/status`,
                        {
                          status: newStatus,
                        },
                      ),
                    ),
                  );
                  message.success('Batch status update successful');
                  refetch();
                  setSelectedRowKeys([]);
                } catch (error) {
                  message.error('Batch status update failed');
                }
              }}
            />
          </div>
        )}
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
        scroll={{ x: 'max-content' }}
      />
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
