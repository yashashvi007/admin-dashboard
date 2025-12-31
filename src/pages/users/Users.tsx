import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Button, Drawer, Space, Table, theme } from 'antd'
import { Link, Navigate } from 'react-router-dom'
import { getUsers } from '../../http/api'
import type { User } from '../../types'
import { useAuthStore } from '../../store'
import UserFilters from './UserFilters'
import { useState } from 'react'
import UserForm from './forms/UserForm'

const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (_text: string, record: User) => {
        return  (
            <Link to={`/users/${record.id}`}>
                {record.firstName} {record.lastName}
            </Link>
        )
      }
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
    {
        title: 'Action',
        key: 'action',
        render: () => {
            return (
                <div>
                    <Link to="/users/edit" >Edit</Link>
                </div>
            )
        }
    }
  ];

export default function Users() {
    const {
        token: { colorBgElevated }
    } = theme.useToken();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const {data: usersData, isLoading, isError, error} = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const {data} = await getUsers();
            return data;
        }
      })
   const {user} = useAuthStore();
   if(user?.role !== 'admin') {
    return <Navigate to="/" replace={true} />
   }

  return (
    <>
       <Space direction='vertical' size='large' style={{width: '100%'}} >
        <Breadcrumb separator={<RightOutlined/>} items={[{title: <Link to="/" >Dashboard</Link>}, {title: 'Users'}]} />
        <UserFilters onFilterChange={(filterName, filterValue)=> {
            console.log(filterName, filterValue);
        }}>
            <Button type="primary" onClick={()=> setDrawerOpen(true)} icon={<PlusOutlined />}>Add User</Button>
        </UserFilters>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}
        {usersData && (
            <Table dataSource={usersData} columns={columns} />
        )}

        <Drawer
          title="Add User"
          width={720}
          styles={{body: {backgroundColor: colorBgElevated }}}
          destroyOnHidden={true}
          open={drawerOpen}
          onClose={()=> {
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button>Cancel</Button>
              <Button type="primary" >Submit</Button>
            </Space>
          }
        >
          <UserForm />
        </Drawer>
       </Space>
    </> 
  )
}
