import {
  getDegreeClass,
  getGradePoints,
  getLetterGrade,
  letterForAverage,
  planTarget,
  summarise,
} from './grading';

test.each([
  [100, 'A', 5], [70, 'A', 5], [69, 'B', 4], [60, 'B', 4], [59, 'C', 3],
  [50, 'C', 3], [49, 'D', 2], [45, 'D', 2], [44, 'E', 1], [40, 'E', 1],
  [39, 'F', 0], [0, 'F', 0],
])('on the 5.0 scale, %i is %s with %i points', (score, letter, points) => {
  expect(getLetterGrade(score, 'five')).toBe(letter);
  expect(getGradePoints(score, 'five')).toBe(points);
});

test.each([
  [100, 'A', 4], [70, 'A', 4], [69, 'B', 3], [60, 'B', 3], [59, 'C', 2],
  [50, 'C', 2], [49, 'D', 1], [45, 'D', 1], [44, 'F', 0], [0, 'F', 0],
])('on the 4.0 scale, %i is %s with %i points', (score, letter, points) => {
  expect(getLetterGrade(score, 'four')).toBe(letter);
  expect(getGradePoints(score, 'four')).toBe(points);
});

test('summarise weights grade points by units', () => {
  const courses = [
    { courseUnit: 3, score: 75 }, // A, 5 points
    { courseUnit: 2, score: 52 }, // C, 3 points
  ];
  expect(summarise(courses, 'five')).toEqual({ units: 5, points: 21, gpa: 4.2 });
  expect(summarise([], 'five').gpa).toBe(0);
});

test.each([
  [4.5, 'five', 'First class'], [4.49, 'five', 'Second class upper'],
  [2.4, 'five', 'Second class lower'], [1.5, 'five', 'Third class'],
  [1.0, 'five', 'Pass'], [0.9, 'five', 'Below pass'],
  [3.5, 'four', 'First class'], [3.0, 'four', 'Second class upper'],
  [0.5, 'four', 'Below pass'],
])('a CGPA of %f on the %s scale is %s', (cgpa, scale, name) => {
  expect(getDegreeClass(cgpa, scale)).toBe(name);
});

test('planTarget works out the average needed', () => {
  // 30 units at 3.5 = 105 points; 4.0 over 60 units needs 135 more in 30 units.
  const plan = planTarget({ units: 30, points: 105, target: 4, remainingUnits: 30, scale: 'five' });
  expect(plan.status).toBe('possible');
  expect(plan.average).toBeCloseTo(4.5);
  expect(letterForAverage(plan.average, 'five')).toBe('A');
});

test('planTarget spots goals that are reached or out of reach', () => {
  expect(planTarget({ units: 30, points: 150, target: 3.5, remainingUnits: 10, scale: 'five' }).status).toBe('reached');
  const far = planTarget({ units: 30, points: 30, target: 4.5, remainingUnits: 10, scale: 'five' });
  expect(far.status).toBe('out-of-reach');
  expect(far.best).toBeCloseTo(2);
});
