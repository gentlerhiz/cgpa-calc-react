// Score bands, highest first: [minimum score, letter, grade points].
const BANDS = [
  [70, "A", 4],
  [60, "B", 3],
  [50, "C", 2],
  [45, "D", 1],
  [0, "F", 0],
];

const bandFor = (score) => BANDS.find(([min]) => score >= min) ?? BANDS[BANDS.length - 1];

export const getLetterGrade = (score) => bandFor(score)[1];

export const getGradePoints = (score) => bandFor(score)[2];
