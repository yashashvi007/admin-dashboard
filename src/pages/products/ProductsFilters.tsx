import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from 'antd'
import React from 'react'

type ProductsFiltersProps = {
  children?: React.ReactNode
}

export default function ProductsFilters({children}: ProductsFiltersProps) {
  return (
    <Card>
      <Row justify="space-between" >
        <Col span={16} >
          <Row gutter={16} >
          <Col span={6} >
            <Form.Item name="q" >
               <Input.Search allowClear placeholder="Search" />
            </Form.Item>
          </Col>
          <Col span={6} >
            <Form.Item name="category" >
               <Select style={{width: '100%'}} allowClear placeholder="Select Category" >
                <Select.Option value="pizza" >Pizza</Select.Option>
                <Select.Option value="burger" >Burger</Select.Option>
               </Select>
            </Form.Item>
          </Col>

          <Col span={6} >
            <Form.Item name="role" >
               <Select style={{width: '100%'}} allowClear placeholder="Select restaurant" >
                <Select.Option value="pizza" >Pizza Hub</Select.Option>
                <Select.Option value="beverages" >Softy Corner</Select.Option>
               </Select>
            </Form.Item>         
          </Col>

          <Col span={6} >
              <Space>
                <Switch defaultChecked onChange={()=> {}} />
                <Typography.Text>Show only published</Typography.Text>
              </Space>
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
