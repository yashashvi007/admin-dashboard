import api from "./client";
import type { LoginFormValues, User } from "../types";

export const login = async (values: LoginFormValues) => api.post('/auth/login', values);
export const getSelf = async () => api.get('/auth/self');
export const logout = async () => api.post('/auth/logout');
export const getUsers = async (queryString: string) => api.get(`/users?${queryString}`);
export const getTenants = async () => api.get('/tenants');
export const createUser = async (values: User) => api.post('/users', values);
export const updateUser = async (user: User, id: number) => api.patch(`/users/${id}`, user);