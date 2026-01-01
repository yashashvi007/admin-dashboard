import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import type { Tenant } from "../../../types";

export default function UserForm() {
    const {data: tenantsData, isLoading: isTenantsLoading} = useQuery({
        queryKey: ['tenants'],
        queryFn: async ()  => {
            const {data} = await getTenants();
            return data;
        }
    });
  return (
    <Row>
        <Col span={24} >
         <Space direction="vertical" size={20}>
           <Card title="Basic Information" variant="borderless" >
              <Row gutter={16} >
              <Col span={12} >
                    <Form.Item  label="First Name" name="firstName" rules={[
                        {
                            required: true,
                            message: 'Please input your first name!'
                        }
                    ]} >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item  label="Last Name" name="lastName" rules={[
                        {
                            required: true,
                            message: 'Please input your last name!'
                        }
                    ]} >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item  label="Email" name="email" rules={[
                        {
                            required: true,
                            message: 'Please input your email!'
                        },
                        {
                            type: 'email',
                            message: 'Please enter a valid email address!'
                        }
                    ]} >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
              </Row>
           </Card>

           <Card title="Security Information" variant="borderless" >
             <Row gutter={16} >
                <Col span={12} >
                    <Form.Item  label="Password" name="password" rules={[
                        {
                            required: true,
                            message: 'Please input your password!'
                        },
                        {
                            min: 8,
                            message: 'Password must be at least 8 characters long!'
                        }
                    ]} >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item  label="Confirm Password" name="confirmPassword" rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!'
                        }
                    ]} >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
             </Row>
           </Card>

           <Card title="Role" variant="borderless" >
              <Row gutter={16} >
                 <Col span={12} >
                   <Form.Item  label="Role" name="role" rules={[
                    {
                        required: true,
                        message: 'Please select a role!'
                    }
                   ]} >
                      <Select
                        style={{width: '100%'}}
                        allowClear={true}
                        onChange={() => {}}
                        placeholder="Select Role"
                      >
                        <Select.Option value="admin" >Admin</Select.Option>
                        <Select.Option value="manager" >Manager</Select.Option>
                        <Select.Option value="customer" >Customers</Select.Option>
                      </Select>
                   </Form.Item>
                 </Col>
                 <Col span={12} >
                   <Form.Item  label="Tenant" name="tenant" rules={[
                    {
                        required: true,
                        message: 'Please select a tenant!'
                    }
                   ]} > 
                        <Select
                          style={{width: '100%'}}
                          allowClear={true}
                          onChange={() => {}}
                          placeholder="Select Tenant"
                          loading={isTenantsLoading}
                        >
                          {tenantsData && tenantsData.map((tenant: Tenant) => (
                            <Select.Option key={tenant.id} value={tenant.id}>{tenant.name}</Select.Option>
                          ))}
                        </Select>
                   </Form.Item>
                 </Col>
              </Row>
           </Card>
           </Space>
        </Col>
    </Row>
  )
}
