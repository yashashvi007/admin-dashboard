import api from "./client";
import type { LoginFormValues, User } from "../types";

export const AUTH_SERVICE = 'api/auth';
export const CATALOG_SERVICE = 'api/catalog';
export const USERS_SERVICE = 'api/users';

// auth services
export const login = async (values: LoginFormValues) => api.post(`${AUTH_SERVICE}/login`, values);
export const getSelf = async () => api.get(`${AUTH_SERVICE}/self`);
export const logout = async () => api.post(`${AUTH_SERVICE}/logout`);
export const getUsers = async (queryString: string) => api.get(`${USERS_SERVICE}?${queryString}`);
export const getTenants = async () => api.get(`${AUTH_SERVICE}/tenants`);
export const createUser = async (values: User) => api.post(`${USERS_SERVICE}`, values);
export const updateUser = async (user: User, id: number) => api.patch(`${USERS_SERVICE}/${id}`, user);


// catalog services
