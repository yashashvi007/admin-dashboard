import { describe, it, expect } from 'vitest';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import LoginPage from './Login';

describe('Login Page', () => {
    it('should render with required fields', ()=> {
        render(<LoginPage/>);
        expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log in'})).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Remember me'})).toBeInTheDocument();
    });
});
