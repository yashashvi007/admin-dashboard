import { RightOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Space, Table } from 'antd'
import { Link } from 'react-router-dom'
import { getUsers } from '../../http/api'
import type { User } from '../../types'

  
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
  const {data: usersData, isLoading, isError, error} = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
        const {data} = await getUsers();
        return data;
    }
  })

  return (
    <>
       <Space direction='vertical' size='large' style={{width: '100%'}} >
        <Breadcrumb separator={<RightOutlined/>} items={[{title: <Link to="/" >Dashboard</Link>}, {title: 'Users'}]} />
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}
        {usersData && (
            <Table dataSource={usersData} columns={columns} />
        )}
       </Space>
    </> 
  )
}
