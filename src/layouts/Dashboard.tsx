import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store'
import { Avatar, Dropdown, Layout, Menu, Space, theme } from 'antd';
import {  useState } from 'react';
import Logo from '../components/icons/Logo';
import Icon, { BellFilled } from '@ant-design/icons';
import Home from '../components/icons/Home';
import UserIcon from '../components/icons/UserIcon';
import { foodIcon } from '../components/icons/FoodIcon';
import GiftIcon from '../components/icons/GiftIcon';
import BasketIcon from '../components/icons/BasketIcon';
import { Badge, Flex } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../http/api';

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
      key: '/',
      icon:  <Icon component={Home} /> ,
      label: <NavLink to="/" >Home</NavLink>
  },
  {
      key: '/restaurants',
      icon: <Icon component={foodIcon} />,
      label: <NavLink to="/restaurants" >Restaurants</NavLink>
  },
  {
    key: '/products',
    icon: <Icon component={BasketIcon} />,
    label: <NavLink to="/products" >Products</NavLink>
  },
  {
    key: '/promos',
    icon: <Icon component={GiftIcon} />,
    label: <NavLink to="/promos" >Promos</NavLink>
  }
]

const getMenuItems = (role: string) => {
  if(role === 'admin') {  
    const usersItem = {
      key: '/users',
      icon: <Icon component={UserIcon} />,
      label: <NavLink to="/users" >Users</NavLink>
    };
    return [...items.slice(0, 1),usersItem, ...items.slice(1, items.length)]
  }
  return items;
}


export default function Dashboard() {
    const {logoutFromStore, user}  = useAuthStore();
    const {mutate: logoutMutate} = useMutation({
      mutationKey: ['logout'],
      mutationFn: logout,
      onSuccess: () => {
        logoutFromStore();
        return;
      }
    })
    const [collapsed,setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    const menuItems = getMenuItems(user?.role ||  '');
    if(!user){
        return <Navigate to="/auth/login" replace={true} />
    }
  return (
    <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo">
            <Logo/>
        </div>
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ paddingLeft: '16px', paddingRight: '16px', background: colorBgContainer }}>
        <Flex gap="middle" align="start" justify='space-between'>
         <Badge text={user.role === 'admin' ? "You're admin": user.tenant?.name } status="success" />
         <Space size={20} >
          <Badge dot={true} >
            <BellFilled/>
          </Badge>
            <Dropdown menu={{ items: [
              {
                key: 'logout',
                label: 'Logout',
                onClick: () => logoutMutate()
              }
            ] }} placement='bottomRight' >
              <Avatar
                style={{backgroundColor: '#fde3df', color: '#f56a00'}}
              >
                U
              </Avatar>
            </Dropdown>
         </Space>
        </Flex>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              margin: 24,
            }}
          >
            <Outlet/>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Yashashvi Pizza app
        </Footer>
      </Layout>
    </Layout>
  )
}
