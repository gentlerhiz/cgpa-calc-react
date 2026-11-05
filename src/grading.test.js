import { getGradePoints, getLetterGrade } from './grading';

test.each([
  [100, 'A', 4],
  [70, 'A', 4],
  [69, 'B', 3],
  [60, 'B', 3],
  [59, 'C', 2],
  [50, 'C', 2],
  [49, 'D', 1],
  [45, 'D', 1],
  [44, 'F', 0],
  [0, 'F', 0],
])('a score of %i is %s with %i grade points', (score, letter, points) => {
  expect(getLetterGrade(score)).toBe(letter);
  expect(getGradePoints(score)).toBe(points);
});
