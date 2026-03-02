import { EyeOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Flex, Form, Space, Table } from "antd";
import { Link } from "react-router-dom";
import ProductsFilters from "./ProductsFilters";
import { CURRENT_PAGE, PER_PAGE } from "../../constants";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import type { Product } from "../../types";


const columns = [
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    dataIndex: 'isPublished',
    key: 'isPublished',
  },
  {
    title: 'CreatedAt',
    dataIndex: 'createdAt',
    key: 'createdAt'
  }
];

type ProductsResponse = {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export default function Products() {
    const [filterForm] = Form.useForm();

    const [queryParams, setQueryParams] = useState({
      perPage: PER_PAGE,
      currentPage: CURRENT_PAGE
    })

    const {data: productsData, isFetching, isError, error} = useQuery({
      queryKey: ['products', queryParams],
      queryFn: async () => {
          const queryString = new URLSearchParams(queryParams as unknown as Record<string, string>).toString();
          const {data} = await getProducts(queryString);
          return data as ProductsResponse;
      }
  })

  return (
    <>
       <Space direction="vertical" size="large" style={{width: '100%'}} >
       <Flex justify='space-between' >
            <Breadcrumb separator={<RightOutlined/>} items={[{title: <Link to="/" >Dashboard</Link>}, {title: 'Products'}]} />
           
        </Flex>
        <Form form={filterForm} onFieldsChange={()=> {}} >
            <ProductsFilters>
                <Button type="primary" onClick={()=> {}} icon={<PlusOutlined />}>Add Product</Button>
            </ProductsFilters>
        </Form>

        {isError && <div>Error: {String((error as Error)?.message || error)}</div>}

        <Table
          loading={isFetching}
          dataSource={productsData?.data ?? []}
          columns={[
                ...columns,
                {
                    title: 'Actions',
                    render: () => {
                        return (
                            <Space>
                                <Button type='link' onClick={()=> {
                                }}  icon={<EyeOutlined />}>View</Button>
                            </Space>
                        )
                    },
                }
            ]}
          rowKey="_id"
          pagination={{
                total: productsData?.pagination?.total ?? 0,
                pageSize: productsData?.pagination?.limit ?? queryParams.perPage,
                current: productsData?.pagination?.page ?? queryParams.currentPage,
                onChange: (page, pageSize) => {
                    setQueryParams((prev) => {
                        return {
                            ...prev,
                            currentPage: page,
                            perPage: pageSize 
                        }
                    })
                },
                showTotal: (total: number, range: number[]) => {
                    return `Showing ${range[0]} to ${range[1]} of ${total} products`
                }
            }}
        />
       </Space>
    </>
  )
}
