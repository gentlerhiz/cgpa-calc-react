export const MAX_UNITS = 6;
export const MAX_UNITS_LEFT = 400;

const WHOLE = /^\d+$/;
const DECIMAL = /^\d+(\.\d+)?$/;

// Checks the add-course fields. Returns { errors, course }, where course is
// the cleaned-up course when every field is valid and null otherwise.
export function validateCourse(draft, existingCodes = [], semesterName = "this semester") {
  const errors = {};
  const code = draft.courseCode.replace(/\s+/g, "").toUpperCase();
  const units = draft.courseUnit.trim();
  const score = draft.score.trim();

  if (!code) {
    errors.courseCode = "Enter a course code, like MTH101.";
  } else if (!/^[A-Z0-9]+$/.test(code)) {
    errors.courseCode = "Use only letters and numbers, like MTH101.";
  } else if (code.length < 3 || code.length > 10) {
    errors.courseCode = "A course code is 3 to 10 letters and numbers, like MTH101.";
  } else if (existingCodes.includes(code)) {
    errors.courseCode = `${code} is already in ${semesterName}.`;
  }

  if (!units) {
    errors.courseUnit = "Enter the course units.";
  } else if (!WHOLE.test(units) || Number(units) < 1 || Number(units) > MAX_UNITS) {
    errors.courseUnit = `Units must be a whole number from 1 to ${MAX_UNITS}.`;
  }

  if (!score) {
    errors.score = "Enter your score.";
  } else if (!WHOLE.test(score) || Number(score) > 100) {
    errors.score = "Score must be a whole number from 0 to 100.";
  }

  const valid = Object.keys(errors).length === 0;
  return {
    errors,
    course: valid ? { courseCode: code, courseUnit: Number(units), score: Number(score) } : null,
  };
}

// Checks the target planner. Empty fields are not errors, just not ready yet.
export function validatePlan({ target = "", remaining = "" }, max) {
  const errors = {};
  const t = target.trim();
  const r = remaining.trim();

  if (t && (!DECIMAL.test(t) || Number(t) > max)) {
    errors.target = `Enter a CGPA from 0 to ${max.toFixed(2)}.`;
  }
  if (r && (!WHOLE.test(r) || Number(r) > MAX_UNITS_LEFT)) {
    errors.remaining = `Enter a whole number of units, up to ${MAX_UNITS_LEFT}.`;
  }

  const ready = Boolean(t && r) && Object.keys(errors).length === 0;
  return { errors, ready, target: Number(t), remaining: Number(r) };
}
