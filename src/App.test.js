import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the calculator', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /your results/i })).toBeInTheDocument();
});
