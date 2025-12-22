import api from "./client";
import type { LoginFormValues } from "../types";

export const login = async (values: LoginFormValues) => api.post('/auth/login', values);