import {Button, Card, Checkbox, Flex, Form, Input, Layout, Space} from 'antd';
import { LockFilled, UserOutlined } from '@ant-design/icons';
import Logo from '../../components/icons/Logo';
export default function LoginPage() {
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
                <Form>
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
                        <Button type='primary' htmlType='submit' style={{width: '100%'}} >
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
