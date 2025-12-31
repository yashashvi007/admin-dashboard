import { Card, Col, Form, Input, Row, Select, Space } from "antd";

export default function UserForm() {
  return (
    <Row>
        <Col span={24} >
         <Space direction="vertical" size={20}>
           <Card title="Basic Information" variant="borderless" >
              <Row gutter={16} >
              <Col span={12} >
                    <Form.Item  label="First Name" name="firstName" >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item  label="Last Name" name="lastName" >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item  label="Email" name="email" >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
              </Row>
           </Card>

           <Card title="Security Information" variant="borderless" >
             <Row gutter={16} >
                <Col span={12} >
                    <Form.Item  label="Password" name="password" >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item  label="Confirm Password" name="confirmPassword" >
                    <Input size="large" placeholder="Basic usage" />
                </Form.Item>
                </Col>
             </Row>
           </Card>

           <Card title="Role" variant="borderless" >
              <Row gutter={16} >
                 <Col span={12} >
                   <Form.Item  label="Role" name="role" >
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
                   <Form.Item  label="Tenant" name="tenant" > 
                        <Select
                          style={{width: '100%'}}
                          allowClear={true}
                          onChange={() => {}}
                          placeholder="Select Tenant"
                        >
                          <Select.Option value="1" >Tenant 1</Select.Option>
                          <Select.Option value="2" >Tenant 2</Select.Option>
                          <Select.Option value="3" >Tenant 3</Select.Option>
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
