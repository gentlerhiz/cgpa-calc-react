// Grading scales. Bands run highest first: [minimum score, letter, grade points].
// Degree classes run highest first: [minimum CGPA, name].
export const SCALES = {
  five: {
    id: "five",
    label: "5.0 scale",
    max: 5,
    bands: [
      [70, "A", 5],
      [60, "B", 4],
      [50, "C", 3],
      [45, "D", 2],
      [40, "E", 1],
      [0, "F", 0],
    ],
    classes: [
      [4.5, "First class"],
      [3.5, "Second class upper"],
      [2.4, "Second class lower"],
      [1.5, "Third class"],
      [1.0, "Pass"],
    ],
  },
  four: {
    id: "four",
    label: "4.0 scale",
    max: 4,
    bands: [
      [70, "A", 4],
      [60, "B", 3],
      [50, "C", 2],
      [45, "D", 1],
      [0, "F", 0],
    ],
    classes: [
      [3.5, "First class"],
      [3.0, "Second class upper"],
      [2.0, "Second class lower"],
      [1.0, "Third class"],
    ],
  },
};

const scaleFor = (scale) => SCALES[scale] ?? SCALES.four;

const bandFor = (score, scale) => {
  const { bands } = scaleFor(scale);
  return bands.find(([min]) => score >= min) ?? bands[bands.length - 1];
};

export const getLetterGrade = (score, scale = "four") => bandFor(score, scale)[1];

export const getGradePoints = (score, scale = "four") => bandFor(score, scale)[2];

// Totals for a list of { courseUnit, score } on a scale.
export const summarise = (courses, scale) => {
  const units = courses.reduce((total, c) => total + c.courseUnit, 0);
  const points = courses.reduce(
    (total, c) => total + getGradePoints(c.score, scale) * c.courseUnit,
    0
  );
  return { units, points, gpa: units ? points / units : 0 };
};

export const getDegreeClass = (cgpa, scale) => {
  const match = scaleFor(scale).classes.find(([min]) => cgpa >= min);
  return match ? match[1] : "Below pass";
};

// The average grade points needed over the remaining units to finish on target.
// Returns { status: "reached" | "possible" | "out-of-reach", average, best }.
export const planTarget = ({ units, points, target, remainingUnits, scale }) => {
  const { max } = scaleFor(scale);
  const totalUnits = units + remainingUnits;
  const best = totalUnits ? (points + max * remainingUnits) / totalUnits : 0;
  if (!remainingUnits) {
    const current = units ? points / units : 0;
    return { status: current >= target ? "reached" : "out-of-reach", average: 0, best };
  }
  const average = (target * totalUnits - points) / remainingUnits;
  if (average <= 0) return { status: "reached", average: 0, best };
  if (average > max) return { status: "out-of-reach", average, best };
  return { status: "possible", average, best };
};

// The lowest letter whose grade points meet an average.
export const letterForAverage = (average, scale) => {
  const { bands } = scaleFor(scale);
  const fit = [...bands].reverse().find(([, , pts]) => pts >= average);
  return fit ? fit[1] : bands[0][1];
};
