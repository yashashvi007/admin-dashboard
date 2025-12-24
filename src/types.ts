export type LoginFormValues = {
    email: string;
    password: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}