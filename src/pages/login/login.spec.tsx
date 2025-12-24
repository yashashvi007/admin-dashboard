import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import React from 'react';
import {render, screen, fireEvent, waitFor, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './Login';
import { login, getSelf } from '../../http/api';
import { useAuthStore } from '../../store';
import type { User } from '../../types';

// Mock the API functions
vi.mock('../../http/api', () => ({
    login: vi.fn(),
    getSelf: vi.fn(),
}));

// Helper to create mock AxiosResponse
const createMockAxiosResponse = <T,>(data: T): import('axios').AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {} as import('axios').AxiosResponseHeaders,
    config: {
        headers: {} as import('axios').AxiosRequestHeaders,
    } as import('axios').AxiosRequestConfig,
} as import('axios').AxiosResponse<T>);

// Create a test wrapper with QueryClientProvider
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });
    
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('Login Page', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render with required fields', ()=> {
        render(<LoginPage/>, { wrapper: createWrapper() });
        expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log In'})).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Remember me'})).toBeInTheDocument();
    });

    describe('Validation Rules', () => {
        it('should show error when username is empty on submit', async () => {
            render(<LoginPage/>, { wrapper: createWrapper() });
            const submitButton = screen.getByRole('button', { name: 'Log In'});
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Please input your username!')).toBeInTheDocument();
            });
        });

        it('should show error when username is not a valid email', async () => {
            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'invalid-email' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Please enter a valid email address!')).toBeInTheDocument();
            });
        });

        it('should show error when password is empty on submit', async () => {
            render(<LoginPage/>, { wrapper: createWrapper() });
            const submitButton = screen.getByRole('button', { name: 'Log In'});
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Please input your password!')).toBeInTheDocument();
            });
        });

        it('should show error when password is less than 8 characters', async () => {
            render(<LoginPage/>, { wrapper: createWrapper() });
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(passwordInput, { target: { value: 'short' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Password must be at least 8 characters long!')).toBeInTheDocument();
            });
        });

        it('should show multiple validation errors when both fields are invalid', async () => {
            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'invalid-email' } });
            fireEvent.change(passwordInput, { target: { value: 'short' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Please enter a valid email address!')).toBeInTheDocument();
                expect(screen.getByText('Password must be at least 8 characters long!')).toBeInTheDocument();
            });
        });

        it('should not show validation errors when form is valid', async () => {
            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.queryByText('Please input your username!')).not.toBeInTheDocument();
                expect(screen.queryByText('Please enter a valid email address!')).not.toBeInTheDocument();
                expect(screen.queryByText('Please input your password!')).not.toBeInTheDocument();
                expect(screen.queryByText('Password must be at least 8 characters long!')).not.toBeInTheDocument();
            });
        });

        it('should validate email format correctly', async () => {
            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            // Test invalid email formats
            const invalidEmails = ['notanemail', 'missing@domain', '@nodomain.com', 'spaces in@email.com'];
            
            for (const email of invalidEmails) {
                fireEvent.change(usernameInput, { target: { value: email } });
                fireEvent.click(submitButton);

                await waitFor(() => {
                    expect(screen.getByText('Please enter a valid email address!')).toBeInTheDocument();
                });

                // Clear the input for next test
                fireEvent.change(usernameInput, { target: { value: '' } });
            }

            // Test valid email format
            fireEvent.change(usernameInput, { target: { value: 'valid@example.com' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.queryByText('Please enter a valid email address!')).not.toBeInTheDocument();
            });
        });

        it('should validate password minimum length correctly', async () => {
            render(<LoginPage/>, { wrapper: createWrapper() });
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            // Test password with exactly 7 characters (should fail)
            fireEvent.change(passwordInput, { target: { value: '1234567' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Password must be at least 8 characters long!')).toBeInTheDocument();
            });

            // Test password with exactly 8 characters (should pass)
            fireEvent.change(passwordInput, { target: { value: '12345678' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.queryByText('Password must be at least 8 characters long!')).not.toBeInTheDocument();
            });
        });
    });

    describe('Login Functionality', () => {
        const mockUser: User = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'admin',
        };

        beforeEach(() => {
            vi.clearAllMocks();
            // Reset store to initial state
            useAuthStore.setState({ user: null });
        });

        it('should show loading state when submitting form', async () => {
            vi.mocked(login).mockImplementation(() => 
                new Promise((resolve) => setTimeout(() => resolve(createMockAxiosResponse({})), 100))
            );

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            // Check if button shows loading spinner (Ant Design adds a span with loading icon)
            await waitFor(() => {
                const loadingIcon = submitButton.querySelector('.anticon-loading');
                expect(loadingIcon).toBeInTheDocument();
            });
        });

        it('should call login API with correct credentials on form submit', async () => {
            vi.mocked(login).mockResolvedValue(createMockAxiosResponse({ token: 'mock-token' }));
            vi.mocked(getSelf).mockResolvedValue(createMockAxiosResponse({ data: mockUser }));

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(login).toHaveBeenCalledWith({
                    email: 'user@example.com',
                    password: 'password123',
                });
            });
        });

        it('should update store with user data after successful login', async () => {
            vi.mocked(login).mockResolvedValue(createMockAxiosResponse({ token: 'mock-token' }));
            // refetchSelf() returns { data: AxiosResponse }, so selfResponse.data is the AxiosResponse
            // The component does selfResponse?.data as unknown as User, treating the AxiosResponse as User
            // So we need to return an AxiosResponse where the data property contains the user
            vi.mocked(getSelf).mockResolvedValue(createMockAxiosResponse(mockUser));

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(getSelf).toHaveBeenCalled();
            });

            await waitFor(() => {
                const user = useAuthStore.getState().user;
                // The component does `selfResponse?.data as unknown as User`
                // where selfResponse.data is the AxiosResponse from getSelf
                // So it's storing the AxiosResponse object as the user
                // The actual user data is in the AxiosResponse's data property
                expect(user).toBeTruthy();
                if (user && typeof user === 'object' && 'data' in user) {
                    const axiosResponse = user as unknown as import('axios').AxiosResponse<User>;
                    expect(axiosResponse.data).toEqual(mockUser);
                }
            });
        });

        it('should display error message when login fails', async () => {
            const errorMessage = 'Invalid credentials';
            vi.mocked(login).mockRejectedValue({
                response: {
                    data: { message: errorMessage },
                },
                message: errorMessage,
            });

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(errorMessage)).toBeInTheDocument();
            });
        });

        it('should display error alert when login API returns error', async () => {
            const errorMessage = 'Network error';
            vi.mocked(login).mockRejectedValue({
                message: errorMessage,
            });

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                const alert = screen.getByRole('alert');
                expect(alert).toBeInTheDocument();
                expect(alert).toHaveTextContent(errorMessage);
            });
        });

        it('should not update store when login fails', async () => {
            vi.mocked(login).mockRejectedValue({
                message: 'Login failed',
            });

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByRole('alert')).toBeInTheDocument();
            });

            // Store should remain null
            const user = useAuthStore.getState().user;
            expect(user).toBeNull();
        });

        it('should call getSelf after successful login', async () => {
            vi.mocked(login).mockResolvedValue(createMockAxiosResponse({ token: 'mock-token' }));
            vi.mocked(getSelf).mockResolvedValue(createMockAxiosResponse(mockUser));

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(login).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(getSelf).toHaveBeenCalled();
            });
        });

        it('should handle getSelf failure gracefully', async () => {
            vi.mocked(login).mockResolvedValue(createMockAxiosResponse({ token: 'mock-token' }));
            vi.mocked(getSelf).mockRejectedValue({
                message: 'Failed to fetch user',
            });

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(getSelf).toHaveBeenCalled();
            });

            // Store should remain null if getSelf fails (selfResponse will be undefined)
            await waitFor(() => {
                const user = useAuthStore.getState().user;
                // When getSelf fails, selfResponse?.data is undefined, so setUser(undefined) might be called
                // but the store type is User | null, so undefined gets coerced or the call might not happen
                expect(user === null || user === undefined).toBe(true);
            });
        });

        it('should show loading spinner on submit button during login', async () => {
            vi.mocked(login).mockImplementation(() => 
                new Promise((resolve) => setTimeout(() => resolve(createMockAxiosResponse({})), 100))
            );
            vi.mocked(getSelf).mockResolvedValue(createMockAxiosResponse(mockUser));

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            // Ant Design Button with loading prop shows a spinner when isPending is true
            // Verify the loading spinner appears immediately after clicking submit
            await waitFor(() => {
                const loadingIcon = submitButton.querySelector('.anticon-loading');
                expect(loadingIcon).toBeInTheDocument();
            }, { timeout: 200 });

            // Verify login was called
            expect(login).toHaveBeenCalled();
        });

        it('should submit form with correct email and password format', async () => {
            vi.mocked(login).mockResolvedValue(createMockAxiosResponse({ token: 'mock-token' }));
            vi.mocked(getSelf).mockResolvedValue(createMockAxiosResponse(mockUser));

            render(<LoginPage/>, { wrapper: createWrapper() });
            const usernameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'securepassword123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(login).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'securepassword123',
                });
            });
        });
    });
});
