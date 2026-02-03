import axios from "axios";
import { useAuthStore } from "../store";
import { AUTH_SERVICE } from "./api";

const baseURL = import.meta.env.VITE_BACKEND_API_URL || '';

// Debug logging
if (import.meta.env.DEV) {
    console.log('🔧 API Configuration:', {
        baseURL: baseURL || '(empty - using relative URLs)',
        envVar: import.meta.env.VITE_BACKEND_API_URL || '(not set)',
        fullExample: baseURL ? `${baseURL}/api/auth/login` : '/api/auth/login (relative)'
    });
}

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        if (import.meta.env.DEV) {
            console.log('📤 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                baseURL: config.baseURL || '(none)',
                fullURL: `${config.baseURL || ''}${config.url}`
            });
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

const refreshToken = async () => {
    const response = await axios.post(`${baseURL}/${AUTH_SERVICE}/refresh`,{}, {
        withCredentials: true,
    });
    return response.data;
}

api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log('✅ API Response:', {
                status: response.status,
                url: response.config.url,
                method: response.config.method?.toUpperCase()
            });
        }
        return response;
    },
    async (error) => {
        if (import.meta.env.DEV) {
            console.error('❌ API Error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                url: error.config?.url,
                method: error.config?.method?.toUpperCase(),
                baseURL: error.config?.baseURL,
                fullURL: `${error.config?.baseURL || ''}${error.config?.url}`,
                message: error.message,
                responseData: error.response?.data
            });
        }
        
        const originalRequest = error.config;
        if(error.response?.status === 401 &&  !originalRequest._isRetry) {
            try {
                originalRequest._isRetry = true;
                const headers = {...originalRequest.headers};
                await refreshToken();
                return api.request({...originalRequest, headers});
            } catch (error) {
                console.error("Token refresh error", error);
                useAuthStore.getState().logoutFromStore();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
)

export default api;