import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from 'antd'
import { Link, Navigate } from 'react-router-dom'
import { createUser, getUsers } from '../../http/api'
import type { User } from '../../types'
import { useAuthStore } from '../../store'
import UserFilters from './UserFilters'
import { useState } from 'react'
import UserForm from './forms/UserForm'
import { CURRENT_PAGE, PER_PAGE } from '../../constants'

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

    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: CURRENT_PAGE
    })
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const {data: usersData, isLoading, isError, error} = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const queryString = new URLSearchParams(queryParams as unknown as Record<string, string>).toString();
            const {data} = await getUsers(queryString);
            return data;
        }
      })
   const {user} = useAuthStore();

   const {mutate: userMutation} = useMutation({
    mutationKey: ['user'],
    mutationFn: async (values: User) => {
        const {data} = await createUser(values);
        return data;
    },
    onSuccess: () => {
        form.resetFields();
        setDrawerOpen(false);
        queryClient.invalidateQueries({queryKey: ['users']});
        return;
    }
   })

   const onHandleSubmit = async () => {
    try {
      await form.validateFields();
      userMutation(form.getFieldsValue());
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo);
    }
   }
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
            <Table dataSource={usersData.data} columns={columns} rowKey="id" pagination={{
                total: usersData.total,
                pageSize: queryParams.perPage,
                current: queryParams.currentPage,
                onChange: (page, pageSize) => {
                    setQueryParams((prev) => {
                        return {
                            ...prev,
                            currentPage: page,
                            perPage: pageSize 
                        }
                    })
                }
            }} />
        )}

        <Drawer
          title="Add User"
          width={720}
          styles={{body: {backgroundColor: colorBgElevated }}}
          destroyOnHidden={true}
          open={drawerOpen}
          onClose={()=> {
            form.resetFields();
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button onClick={() => {
                form.resetFields();
                setDrawerOpen(false);
              }}>Cancel</Button>
              <Button type="primary" onClick={onHandleSubmit}>Submit</Button>
            </Space>
          }
        >
          <Form form={form} layout="vertical">
           <UserForm />
          </Form>
        </Drawer>
       </Space>
    </> 
  )
}
