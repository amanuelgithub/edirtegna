import { useState } from 'react';
import { Button, Card, Input, Table, Flex, message, Avatar, Tag } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useListUsers } from '@/hooks/api/users';
import { User } from '@/core/models';
import { Order } from '@/core/enums';
import EditCompanyUser from './EditCompanyUser';
import { USER_STATUS } from '@/core/enums';

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
  const initialLimit = parseInt(searchUrlParams.get('limit') || '10');
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

  const { data, isLoading, error } = useListUsers({
    page: pagination.current,
    limit: pagination.pageSize,
    sort,
    order,
    search,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<User> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // const hasSelected = selectedRowKeys.length > 0;

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
      sorter: true,
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
      sorter: true,
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
        <Input.Search
          allowClear
          enterButton="Search"
          loading={isLoading}
          placeholder="Search countries"
          defaultValue={initialQ}
          onSearch={handleTableFullTextSearch}
        />
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
