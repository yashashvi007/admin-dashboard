import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { Link } from "react-router-dom";
import ProductsFilters from "./ProductsFilters";

export default function Products() {
    const [filterForm] = Form.useForm();

  return (
    <>
       <Space direction="vertical" size="large" style={{width: '100%'}} >
       <Flex justify='space-between' >
            <Breadcrumb separator={<RightOutlined/>} items={[{title: <Link to="/" >Dashboard</Link>}, {title: 'Users'}]} />
           
        </Flex>
        <Form form={filterForm} onFieldsChange={()=> {}} >
            <ProductsFilters>
                <Button type="primary" onClick={()=> {}} icon={<PlusOutlined />}>Add Product</Button>
            </ProductsFilters>
        </Form>
       </Space>
    </>
  )
}
