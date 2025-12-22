import { describe, it, expect, afterEach } from 'vitest';
import {render, screen, fireEvent, waitFor, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import LoginPage from './Login';

describe('Login Page', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render with required fields', ()=> {
        render(<LoginPage/>);
        expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log In'})).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Remember me'})).toBeInTheDocument();
    });

    describe('Validation Rules', () => {
        it('should show error when username is empty on submit', async () => {
            render(<LoginPage/>);
            const submitButton = screen.getByRole('button', { name: 'Log In'});
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Please input your username!')).toBeInTheDocument();
            });
        });

        it('should show error when username is not a valid email', async () => {
            render(<LoginPage/>);
            const usernameInput = screen.getByPlaceholderText('Username');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(usernameInput, { target: { value: 'invalid-email' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Please enter a valid email address!')).toBeInTheDocument();
            });
        });

        it('should show error when password is empty on submit', async () => {
            render(<LoginPage/>);
            const submitButton = screen.getByRole('button', { name: 'Log In'});
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Please input your password!')).toBeInTheDocument();
            });
        });

        it('should show error when password is less than 8 characters', async () => {
            render(<LoginPage/>);
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button', { name: 'Log In'});

            fireEvent.change(passwordInput, { target: { value: 'short' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Password must be at least 8 characters long!')).toBeInTheDocument();
            });
        });

        it('should show multiple validation errors when both fields are invalid', async () => {
            render(<LoginPage/>);
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
            render(<LoginPage/>);
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
            render(<LoginPage/>);
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
            render(<LoginPage/>);
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
});
