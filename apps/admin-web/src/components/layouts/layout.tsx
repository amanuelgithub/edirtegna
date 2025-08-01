import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Breadcrumb,
  Drawer,
  Button,
  Grid,
  Dropdown,
  message,
} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { menuItems } from './menu';
import { useLocation } from 'react-router-dom'; // Updated import

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

// Define the dropdown menu items.
const menu = (
  <Menu onClick={({ key }) => console.log(`Clicked on ${key}`)}>
    <Menu.Item key="profile">Profile</Menu.Item>
    <Menu.Item key="settings">Settings</Menu.Item>
    <Menu.Item key="logout">Logout</Menu.Item>
  </Menu>
);

export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false); // For collapsible sidebar
  const [drawerVisible, setDrawerVisible] = useState(false); // For responsive drawer
  const screens = useBreakpoint(); // Access screen breakpoints
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation(); // Replaced usePathname
  const selectedKey = location.pathname; // Get current path for highlighting active menu item

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <>
      {contextHolder}

      <Layout style={{ minHeight: '100vh' }}>
        {/* Sidebar for Larger Screens */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={250}
          breakpoint="md"
          collapsedWidth={screens.md ? (collapsed ? 80 : 200) : 0}
          trigger={null}
          style={{
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            bottom: 0,
            display: screens.md ? 'block' : 'none', // Hide on smaller screens
            overflow: 'auto',
            insetInlineStart: 0,
            scrollbarWidth: 'thin',
            scrollbarGutter: 'stable',
          }}
        >
          <div
            className="logo"
            style={{
              height: '32px',
              margin: '16px',
              background: '#000',
              textAlign: 'center',
              lineHeight: '32px',
              borderRadius: '8px',
              color: '#fff',
              textAlignLast: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            {collapsed ? 'Idir' : 'Idirtegna'}
          </div>
          <Menu
            selectedKeys={[selectedKey]} // Highlight the active menu item
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            items={menuItems}
          />
        </Sider>

        {/* Drawer for Smaller Screens */}
        <Drawer
          title="Menu"
          placement="left"
          closable
          onClose={toggleDrawer}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          <Menu mode="inline" theme="dark" items={menuItems} />
        </Drawer>

        {/* Main Layout */}
        <Layout
          style={{
            marginLeft: screens.md ? (collapsed ? 80 : 250) : 0,
            transition: 'margin-left 0.2s',
          }}
        >
          {/* Fixed Header */}
          <Header
            style={{
              position: 'fixed',
              top: 0,
              zIndex: 1,
              width: screens.md
                ? `calc(100% - ${collapsed ? 73 : 255}px)`
                : '100vw',
              background: 'rgba(255, 255, 255, 0.8)', // Transparent white background
              backdropFilter: 'blur(10px)', // Apply blur effect
              padding: '0 16px',
              margin: 0,
              transition: 'width 0.2s',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Toggle Buttons */}
            {screens.md ? (
              <span
                onClick={toggleCollapse}
                style={{
                  cursor: 'pointer',
                  marginRight: '16px',
                  fontSize: '18px',
                }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </span>
            ) : (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={toggleDrawer}
                style={{ marginRight: '16px' }}
              />
            )}
            <div style={{ flex: 1 }}>Admin Dashboard</div>
            {/* <Avatar icon={<UserOutlined />} /> */}
            {/* Right side: Avatar with dropdown */}
            <Dropdown overlay={menu} trigger={['click']}>
              <Avatar
                icon={<UserOutlined />}
                style={styles.avatar}
                alt="User Avatar"
              />
            </Dropdown>
          </Header>

          {/* Breadcrumb and Content */}
          <div style={{ paddingTop: 64 }}>
            {/* Content */}
            <Content
              style={{
                padding: '0 16px',
              }}
            >
              {children}
            </Content>
          </div>
        </Layout>
      </Layout>
    </>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: '60px',
    background: '#001529',
    color: '#fff',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  avatar: {
    cursor: 'pointer',
  },
};
