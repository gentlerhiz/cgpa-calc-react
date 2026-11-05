import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the calculator heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /cgpa calculator/i })
  ).toBeInTheDocument();
});

test('adds a course and removes it with the remove button', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/course code/i), { target: { value: 'MTH101' } });
  fireEvent.change(screen.getByLabelText(/course unit/i), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText(/score/i), { target: { value: '72' } });
  fireEvent.click(screen.getByRole('button', { name: /add course/i }));
  expect(screen.getByText('MTH101')).toBeInTheDocument();
  expect(screen.getByText('A')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /remove mth101/i }));
  expect(screen.queryByText('MTH101')).not.toBeInTheDocument();
});
