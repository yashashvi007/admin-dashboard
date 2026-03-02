export type LoginFormValues = {
    email: string;
    password: string;
}

export interface Tenant {
    id: string;
    name: string;
    address: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    password?: string;
    email: string;
    role: string;
    tenant: Tenant | null;
}

export interface FieldData {
    name: string[],
    value: string
}

export interface CategoryData {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: CategoryData[]; // backend returns an array
    isPublished: boolean;
    createdAt: string;
    updatedAt?: string;
}