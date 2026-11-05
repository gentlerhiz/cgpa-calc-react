import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the calculator heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /cgpa calculator/i })
  ).toBeInTheDocument();
});

beforeEach(() => localStorage.clear());

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

test('keeps added courses after a reload', () => {
  const { unmount } = render(<App />);
  fireEvent.change(screen.getByLabelText(/course code/i), { target: { value: 'PHY101' } });
  fireEvent.change(screen.getByLabelText(/course unit/i), { target: { value: '2' } });
  fireEvent.change(screen.getByLabelText(/score/i), { target: { value: '55' } });
  fireEvent.click(screen.getByRole('button', { name: /add course/i }));
  unmount();
  render(<App />);
  expect(screen.getByText('PHY101')).toBeInTheDocument();
});

test('clears every course after confirming', () => {
  jest.spyOn(window, 'confirm').mockReturnValue(true);
  render(<App />);
  fireEvent.change(screen.getByLabelText(/course code/i), { target: { value: 'CHM101' } });
  fireEvent.change(screen.getByLabelText(/course unit/i), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText(/score/i), { target: { value: '65' } });
  fireEvent.click(screen.getByRole('button', { name: /add course/i }));
  fireEvent.click(screen.getByRole('button', { name: /clear all/i }));
  expect(screen.queryByText('CHM101')).not.toBeInTheDocument();
});

test('tidies course codes and refuses duplicates', () => {
  render(<App />);
  const add = (code) => {
    fireEvent.change(screen.getByLabelText(/course code/i), { target: { value: code } });
    fireEvent.change(screen.getByLabelText(/course unit/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/score/i), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /add course/i }));
  };
  add(' gst101 ');
  add('GST101');
  expect(screen.getAllByText('GST101')).toHaveLength(1);
  expect(screen.getByRole('alert')).toHaveTextContent('GST101 is already in the list.');
});
