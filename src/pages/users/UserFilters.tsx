
import { Card, Col, Form, Input, Row, Select } from "antd";

type UserFilterProps = {
    children?: React.ReactNode
}

export default function UserFilters({ children}: UserFilterProps) {
  return (
    <Card>
        <Row justify="space-between" >
            <Col span={16} >
               <Row gutter={16} >
                <Col span={8} >
                  <Form.Item name="q">
                    <Input.Search allowClear placeholder="Search" />
                  </Form.Item>
                </Col>
                <Col span={8} >
                  <Form.Item  name="role" >
                    <Select style={{width: '100%'}} allowClear placeholder="Select Role"  >
                        <Select.Option value="admin" >Admin</Select.Option>
                        <Select.Option value="manager" >Manager</Select.Option>
                        <Select.Option value="customer" >Customers</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8} >
                    <Select style={{width: '100%'}} allowClear placeholder="Select Status"  >
                        <Select.Option value="ban" >Ban</Select.Option>
                        <Select.Option value="active" >Active</Select.Option>
                    </Select>
                </Col>
               </Row>
            </Col>
            <Col span={8} style={{display: 'flex', justifyContent: 'flex-end'}} >
               {children}
            </Col>
        </Row>
    </Card>
  )
}
