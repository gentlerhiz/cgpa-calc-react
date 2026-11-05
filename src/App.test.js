import { act, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.location.hash = '';
  window.scrollTo = jest.fn();
});

test('opens on the landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /see your cgpa/i })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /open (the )?calculator/i })[0]).toHaveAttribute('href', '#/calculator');
});

test('shows the calculator on #/calculator and returns home', () => {
  render(<App />);
  act(() => {
    window.location.hash = '#/calculator';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('heading', { name: /your results/i })).toBeInTheDocument();
  act(() => {
    window.location.hash = '#/';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('heading', { level: 1, name: /see your cgpa/i })).toBeInTheDocument();
});

test('lists both grading scales on the landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: '5.0 scale' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '4.0 scale' })).toBeInTheDocument();
});
