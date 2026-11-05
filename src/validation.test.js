import { validateCourse, validatePlan } from './validation';

const draft = (courseCode, courseUnit, score) => ({ courseCode, courseUnit, score });

test('accepts a valid course and tidies the code', () => {
  expect(validateCourse(draft(' mth 101 ', '3', '72'))).toEqual({
    errors: {},
    course: { courseCode: 'MTH101', courseUnit: 3, score: 72 },
  });
  expect(validateCourse(draft('PHY101', '2', '0')).course.score).toBe(0);
});

test('asks for every empty field', () => {
  const { errors, course } = validateCourse(draft('', '', ''));
  expect(course).toBeNull();
  expect(errors).toEqual({
    courseCode: 'Enter a course code, like MTH101.',
    courseUnit: 'Enter the course units.',
    score: 'Enter your score.',
  });
});

test.each([
  ['MTH-101', 'Use only letters and numbers, like MTH101.'],
  ['M1', 'A course code is 3 to 10 letters and numbers, like MTH101.'],
  ['ABCDEFGHIJK', 'A course code is 3 to 10 letters and numbers, like MTH101.'],
])('rejects the course code %s', (code, message) => {
  expect(validateCourse(draft(code, '3', '50')).errors.courseCode).toBe(message);
});

test('rejects a code already in the semester', () => {
  expect(validateCourse(draft('gst101', '3', '50'), ['GST101'], 'Semester 1').errors.courseCode).toBe(
    'GST101 is already in Semester 1.'
  );
});

test.each(['0', '7', '2.5', 'three', '-1'])('rejects %s units', (units) => {
  expect(validateCourse(draft('MTH101', units, '50')).errors.courseUnit).toBe(
    'Units must be a whole number from 1 to 6.'
  );
});

test.each(['101', '65.5', 'abc', '-5'])('rejects a score of %s', (score) => {
  expect(validateCourse(draft('MTH101', '3', score)).errors.score).toBe(
    'Score must be a whole number from 0 to 100.'
  );
});

test('the planner waits for both fields and checks their ranges', () => {
  expect(validatePlan({ target: '', remaining: '' }, 5)).toMatchObject({ errors: {}, ready: false });
  expect(validatePlan({ target: '4.5', remaining: '' }, 5).ready).toBe(false);
  expect(validatePlan({ target: '4.5', remaining: '30' }, 5)).toMatchObject({
    errors: {}, ready: true, target: 4.5, remaining: 30,
  });
  expect(validatePlan({ target: '4.5', remaining: '30' }, 4).errors.target).toBe('Enter a CGPA from 0 to 4.00.');
  expect(validatePlan({ target: '3', remaining: '1.5' }, 5).errors.remaining).toBe(
    'Enter a whole number of units, up to 400.'
  );
});
