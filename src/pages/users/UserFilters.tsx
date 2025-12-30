import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Select } from "antd";

type UserFilterProps = {
    onFilterChange: (filterName: string, filterValue: string) => void
}

export default function UserFilters({onFilterChange}: UserFilterProps) {
  return (
    <Card>
        <Row justify="space-between" >
            <Col span={16} >
               <Row gutter={16} >
                <Col span={8} >
                  <Input.Search placeholder="Search" onChange={(e) => onFilterChange('UserSearchQuery', e.target.value)} />
                </Col>
                <Col span={8} >
                  <Select style={{width: '100%'}} allowClear placeholder="Select Role" onChange={(selectedItem) => onFilterChange('roleFilter', selectedItem)} >
                    <Select.Option value="admin" >Admin</Select.Option>
                    <Select.Option value="manager" >Manager</Select.Option>
                    <Select.Option value="customer" >Customers</Select.Option>
                  </Select>
                </Col>
                <Col span={8} >
                    <Select style={{width: '100%'}} allowClear placeholder="Select Status" onChange={(selectedItem) => onFilterChange('statusFilter', selectedItem)} >
                        <Select.Option value="ban" >Ban</Select.Option>
                        <Select.Option value="active" >Active</Select.Option>
                    </Select>
                </Col>
               </Row>
            </Col>
            <Col span={8} style={{display: 'flex', justifyContent: 'flex-end'}} >
               <Button type="primary" icon={<PlusOutlined />}>Add User</Button>
            </Col>
        </Row>
    </Card>
  )
}
