import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the calculator heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /cgpa calculator/i })
  ).toBeInTheDocument();
});
