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
    email: string;
    role: string;
    tenant: Tenant | null;
}

export interface FieldData {
    name: string[],
    value: string
}