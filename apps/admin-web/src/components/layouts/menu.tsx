import {
  //   AppstoreOutlined,
  //   ContainerOutlined,
  //   DesktopOutlined,
  // MailOutlined,
  //   PieChartOutlined,
  UsergroupAddOutlined,
  //   MediumWorkmarkOutlined,
  DashboardFilled,
  SettingOutlined,
  //   AccountBookOutlined,
  ProfileOutlined,
  LineChartOutlined,
  NotificationOutlined,
  BookOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardFilled />,
    label: <Link to="/dashboard">Dashboard</Link>,
  },
  {
    key: 'manageUsers',
    label: 'Manage Users',
    icon: <UsergroupAddOutlined />,
    children: [
      {
        key: '/users/company-users',
        label: <Link to="/users/company-users">Company Users</Link>,
      },
      {
        key: '/users/customer-users',
        label: <Link to="/users/customer-users">Customer Users</Link>,
      },
    ],
  },
  // {
  //   key: 'mangeTutors',
  //   label: 'Manage Tutors',
  //   icon: <UsergroupAddOutlined />,
  //   children: [
  //     {
  //       key: '/tutors',
  //       label: <Link to="/tutors">Tutors List</Link>,
  //     },
  //   ],
  // },
  // {
  //   key: 'manageStudent',
  //   label: 'Manage Students',
  //   icon: <UsergroupAddOutlined />,
  //   children: [
  //     {
  //       key: '/students',
  //       label: <Link to="/students">Students List</Link>,
  //     },
  //   ],
  // },
  // {
  //   key: 'manageBookings',
  //   label: 'Manage Bookings',
  //   icon: <BookOutlined />,
  //   children: [
  //     {
  //       key: '/bookings',
  //       label: <Link to="/bookings">Bookings List</Link>,
  //     },
  //   ],
  // },
  {
    key: 'manageParameters',
    label: 'Manage Parameters',
    icon: <ToolOutlined />,
    children: [
      {
        key: '/countries',
        label: <Link to="/countries">Country List</Link>,
      },
      {
        key: '/states',
        label: <Link to="/states">States List</Link>,
      },
      {
        key: '/cities',
        label: <Link to="/cities">Cities List</Link>,
      },
      {
        key: '/subjects',
        label: <Link to="/subjects">Subjects List</Link>,
      },
    ],
  },
  {
    key: '/notifications',
    icon: <NotificationOutlined />,
    label: <Link to="/notifications">Notifications</Link>,
  },
  {
    key: 'manageReports',
    label: 'Manage Reports',
    icon: <LineChartOutlined />,
    children: [
      {
        key: '/reports',
        label: <Link to="/reports">Sample Reports</Link>,
      },
    ],
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: <Link to="/settings">Settings</Link>,
  },
  {
    key: '/profile',
    icon: <ProfileOutlined />,
    label: <Link to="/profile">Profile</Link>,
  },
];

// export const items: MenuItem[] = [
//   { key: '1', icon: <PieChartOutlined />, label: 'Option 1' },
//   { key: '2', icon: <DesktopOutlined />, label: 'Option 2' },
//   { key: '3', icon: <ContainerOutlined />, label: 'Option 3' },
//   {
//     key: 'sub1',
//     label: 'Navigation One',
//     icon: <MailOutlined />,
//     children: [
//       { key: '5', label: 'Option 5' },
//       { key: '6', label: 'Option 6' },
//       { key: '7', label: 'Option 7' },
//       { key: '8', label: 'Option 8' },
//     ],
//   },
//   {
//     key: 'sub2',
//     label: 'Navigation Two',
//     icon: <AppstoreOutlined />,
//     children: [
//       { key: '9', label: 'Option 9' },
//       { key: '10', label: 'Option 10' },
//       {
//         key: 'sub3',
//         label: 'Submenu',
//         children: [
//           { key: '11', label: 'Option 11' },
//           { key: '12', label: 'Option 12' },
//         ],
//       },
//     ],
//   },
//   {
//     key: 'sub4',
//     label: 'Navigation Three',
//     icon: <AppstoreOutlined />,
//     children: [
//       { key: '13', label: 'Option 13' },
//       { key: '14', label: 'Option 14' },
//       {
//         key: 'sub5',
//         label: 'Submenu',
//         children: [
//           { key: '16', label: 'Option 16' },
//           { key: '17', label: 'Option 17' },
//         ],
//       },
//     ],
//   },
// ];
