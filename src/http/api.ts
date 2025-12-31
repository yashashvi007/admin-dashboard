import api from "./client";
import type { LoginFormValues } from "../types";

export const login = async (values: LoginFormValues) => api.post('/auth/login', values);
export const getSelf = async () => api.get('/auth/self');
export const logout = async () => api.post('/auth/logout');
export const getUsers = async () => api.get('/users');
export const getTenants = async () => api.get('/tenants');