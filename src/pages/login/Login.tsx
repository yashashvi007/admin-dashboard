import {Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space} from 'antd';
import { LockFilled, UserOutlined } from '@ant-design/icons';
import Logo from '../../components/icons/Logo';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { LoginFormValues, User } from '../../types';
import { getSelf, login } from '../../http/api';
import { useAuthStore } from '../../store';

const loginFunction =async (values: LoginFormValues) => {
    const {data} = await login(values);
    return data;
}

export default function LoginPage() {
    const setUser = useAuthStore((state) => state.setUser);

    const { refetch: refetchSelf } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        enabled: false,
    })

    const {mutate, isPending, isError, error} = useMutation({
        mutationKey: ['login'],
        mutationFn: loginFunction,
        onSuccess: async () => {
            const selfResponse = await refetchSelf();
            setUser(selfResponse?.data as unknown as User);
        }
    })
   
  return (
    <>
        <Layout  style={{height: '100vh', display: 'grid', placeItems: 'center'}} >
            <Space direction='vertical'  align='center' size='large' >
            <Layout.Content style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <Logo/>           
            </Layout.Content>
            <Card 
              style={{width: 300}}
              title={
                <Space style={{ width: '100%'}} >
                    <LockFilled/>
                    'Sign in'
                </Space>
              }>
                <Form onFinish={(values) => mutate({email: values.username, password: values.password})} >
                    {isError && <Alert style={{marginBottom: 16}} message={error.message} type='error' />}
                    <Form.Item name='username' rules={[{required: true, message: 'Please input your username!'}, {type: 'email', message: 'Please enter a valid email address!'}]} >
                        <Input prefix={<UserOutlined/>} placeholder='Username' />
                    </Form.Item>
                    <Form.Item name='password' rules={[{required: true, message: 'Please input your password!'}, {min: 8, message: 'Password must be at least 8 characters long!'}]} >
                        <Input.Password prefix={<LockFilled/>} placeholder='Password' />
                    </Form.Item>
                    <Flex justify='space-between' >
                        <Form.Item name='remember' valuePropName='checked' >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a href="" id='login-form-forgot' >Forgot</a>
                    </Flex>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' style={{width: '100%'}} loading={isPending}>
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            </Space>
        </Layout>
    </>
  )
}
