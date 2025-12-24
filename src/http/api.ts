import api from "./client";
import type { LoginFormValues } from "../types";

export const login = async (values: LoginFormValues) => api.post('/auth/login', values);
export const getSelf = async () => api.get('/auth/self');