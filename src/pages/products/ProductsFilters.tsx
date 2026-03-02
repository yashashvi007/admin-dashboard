import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from 'antd'
import React from 'react'
import { getCategories, getTenants } from '../../http/api'
import type { CategoryData, Tenant } from '../../types'

type ProductsFiltersProps = {
  children?: React.ReactNode
}

export default function ProductsFilters({children}: ProductsFiltersProps) {
  const {data: restaurants} = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => {
      return getTenants(`perPage=10&currentPage=1`)
    },
    placeholderData: keepPreviousData
  });


  const {data: categories} = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return getCategories(`perPage=10&currentPage=1`)
    },
    placeholderData: keepPreviousData
  });

  console.log(categories?.data);
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
                {
                  categories?.data?.map((category: CategoryData) => (
                    <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                  ))
                }
               </Select>
            </Form.Item>
          </Col>

          <Col span={6} >
            <Form.Item name="role" >
               <Select style={{width: '100%'}} allowClear placeholder="Select restaurant" >
                {
                  restaurants?.data[0]?.map((restaurant: Tenant) => (
                    <Select.Option key={restaurant.id} value={restaurant.id}>{restaurant.name}</Select.Option>
                  ))
                }
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
