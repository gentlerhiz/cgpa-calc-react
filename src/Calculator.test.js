import { fireEvent, render, screen, within } from '@testing-library/react';
import Calculator from './Calculator';

beforeEach(() => localStorage.clear());

const addCourse = (code, units, score) => {
  fireEvent.change(screen.getByLabelText(/course code/i), { target: { value: code } });
  fireEvent.change(screen.getByLabelText(/course unit/i), { target: { value: String(units) } });
  fireEvent.change(screen.getByLabelText(/^score$/i), { target: { value: String(score) } });
  fireEvent.click(screen.getByRole('button', { name: /add course/i }));
};

test('adds a course, shows its grade and removes it', () => {
  render(<Calculator />);
  addCourse('MTH101', 3, 72);
  expect(screen.getByText('MTH101')).toBeInTheDocument();
  expect(screen.getByRole('row', { name: /mth101/i })).toHaveTextContent('MTH101372A15');
  fireEvent.click(screen.getByRole('button', { name: /remove mth101/i }));
  const dialog = screen.getByRole('alertdialog', { name: /remove mth101\?/i });
  expect(dialog).toHaveTextContent('It comes out of Semester 1');
  fireEvent.click(within(dialog).getByRole('button', { name: /remove course/i }));
  expect(screen.queryByText('MTH101')).not.toBeInTheDocument();
  expect(screen.getByLabelText(/course code/i)).toHaveFocus();
});

test('keeps a course when its removal is cancelled', () => {
  render(<Calculator />);
  addCourse('MTH101', 3, 72);
  fireEvent.click(screen.getByRole('button', { name: /remove mth101/i }));
  fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: /keep it/i }));
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  expect(screen.getByText('MTH101')).toBeInTheDocument();
});

test('works out the CGPA and degree class on the 5.0 scale', () => {
  render(<Calculator />);
  addCourse('MTH101', 3, 75); // A, 5 points
  addCourse('PHY101', 2, 52); // C, 3 points
  expect(screen.getByRole('img', { name: /cgpa 4\.20 out of 5, second class upper/i })).toBeInTheDocument();
});

test('switching to the 4.0 scale recalculates', () => {
  render(<Calculator />);
  addCourse('MTH101', 3, 75);
  fireEvent.click(screen.getByRole('button', { name: '4.0 scale' }));
  expect(screen.getByRole('img', { name: /cgpa 4\.00 out of 4, first class/i })).toBeInTheDocument();
});

test('keeps courses separate per semester and adds them up overall', () => {
  render(<Calculator />);
  addCourse('MTH101', 3, 75);
  fireEvent.click(screen.getByRole('button', { name: /add semester/i }));
  expect(screen.getByRole('tab', { name: /semester 2/i })).toHaveAttribute('aria-selected', 'true');
  expect(screen.queryByText('MTH101')).not.toBeInTheDocument();
  addCourse('MTH102', 3, 35); // F
  expect(screen.getByRole('img', { name: /cgpa 2\.50/i })).toBeInTheDocument();
});

test('keeps courses after a reload', () => {
  const { unmount } = render(<Calculator />);
  addCourse('PHY101', 2, 55);
  unmount();
  render(<Calculator />);
  expect(screen.getByText('PHY101')).toBeInTheDocument();
});

test('moves a list saved by the old version into the first semester', () => {
  localStorage.setItem('cgpa-courses', JSON.stringify([{ courseCode: 'OLD101', courseUnit: 2, score: 65, gradePoints: 3 }]));
  render(<Calculator />);
  expect(screen.getByText('OLD101')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '4.0 scale' })).toHaveAttribute('aria-pressed', 'true');
});

test('tidies course codes and refuses duplicates in a semester', () => {
  render(<Calculator />);
  addCourse(' gst101 ', 3, 50);
  addCourse('GST101', 3, 50);
  expect(screen.getAllByText('GST101')).toHaveLength(1);
  expect(screen.getByLabelText(/course code/i)).toHaveAccessibleDescription('GST101 is already in Semester 1.');
});

test('clears everything after confirming in the dialog', () => {
  render(<Calculator />);
  addCourse('CHM101', 3, 65);
  fireEvent.click(screen.getByRole('button', { name: /clear all/i }));
  const dialog = screen.getByRole('alertdialog', { name: /clear everything/i });
  expect(within(dialog).getByRole('button', { name: /keep my results/i })).toHaveFocus();
  fireEvent.click(within(dialog).getByRole('button', { name: /clear everything/i }));
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  expect(screen.queryByText('CHM101')).not.toBeInTheDocument();
});

test('keeps the semester when the dialog is cancelled with Escape', () => {
  render(<Calculator />);
  addCourse('CHM101', 3, 65);
  const trigger = screen.getByRole('button', { name: /remove semester/i });
  trigger.focus();
  fireEvent.click(trigger);
  const dialog = screen.getByRole('alertdialog', { name: /remove semester 1/i });
  expect(dialog).toHaveTextContent('Its 1 course goes with it.');
  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  expect(screen.getByText('CHM101')).toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('removes a semester after confirming', () => {
  render(<Calculator />);
  addCourse('CHM101', 3, 65);
  fireEvent.click(screen.getByRole('button', { name: /add semester/i }));
  fireEvent.click(screen.getByRole('button', { name: /remove semester/i }));
  fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: /remove semester/i }));
  expect(screen.queryByRole('tab', { name: /semester 2/i })).not.toBeInTheDocument();
  expect(screen.getByText('CHM101')).toBeInTheDocument();
});

test('plans the average needed for a target', () => {
  render(<Calculator />);
  addCourse('MTH101', 5, 65); // B: 4 points
  addCourse('PHY101', 5, 65); // B: 4 points, so 40 points over 10 units
  fireEvent.change(screen.getByLabelText(/target cgpa/i), { target: { value: '4.5' } });
  fireEvent.change(screen.getByLabelText(/units left/i), { target: { value: '10' } });
  expect(screen.getByText(/average of 5\.00 grade points per unit, about A/i)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/target cgpa/i), { target: { value: '4.9' } });
  expect(screen.getByText(/out of reach.*finish on is 4\.50/i)).toBeInTheDocument();
});

test('shows an error under each invalid field and adds nothing', () => {
  render(<Calculator />);
  fireEvent.click(screen.getByRole('button', { name: /add course/i }));
  expect(screen.getByLabelText(/course code/i)).toHaveAccessibleDescription('Enter a course code, like MTH101.');
  expect(screen.getByLabelText(/course unit/i)).toHaveAccessibleDescription('Enter the course units.');
  expect(screen.getByLabelText(/^score$/i)).toHaveAccessibleDescription('Enter your score.');
  expect(screen.getByLabelText(/course code/i)).toHaveFocus();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('clears a field error as soon as the value is fixed', () => {
  render(<Calculator />);
  addCourse('MTH101', 9, 150);
  const units = screen.getByLabelText(/course unit/i);
  expect(units).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Score must be a whole number from 0 to 100.')).toBeInTheDocument();
  fireEvent.change(units, { target: { value: '3' } });
  expect(units).not.toHaveAttribute('aria-invalid');
  expect(screen.queryByText(/units must be/i)).not.toBeInTheDocument();
  expect(screen.getByText('Score must be a whole number from 0 to 100.')).toBeInTheDocument();
});

test('checks the planner fields and keeps them after a reload', () => {
  const { unmount } = render(<Calculator />);
  fireEvent.change(screen.getByLabelText(/target cgpa/i), { target: { value: '6' } });
  expect(screen.getByLabelText(/target cgpa/i)).toHaveAccessibleDescription('Enter a CGPA from 0 to 5.00.');
  fireEvent.change(screen.getByLabelText(/target cgpa/i), { target: { value: '4.5' } });
  fireEvent.change(screen.getByLabelText(/units left/i), { target: { value: '40' } });
  unmount();
  render(<Calculator />);
  expect(screen.getByLabelText(/target cgpa/i)).toHaveValue('4.5');
  expect(screen.getByLabelText(/units left/i)).toHaveValue('40');
});
