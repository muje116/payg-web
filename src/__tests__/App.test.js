import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Admin Panel heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Admin Panel/i);
  expect(headingElement).toBeInTheDocument();
});
