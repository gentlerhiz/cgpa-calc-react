const KEY = "cgpa-data-v2";
const OLD_KEY = "cgpa-courses";

let counter = 0;
export const newId = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

export const newSemester = (number) => ({
  id: newId(),
  name: `Semester ${number}`,
  courses: [],
});

const fresh = () => {
  const first = newSemester(1);
  return { scale: "five", semesters: [first], activeId: first.id };
};

// Loads saved data, moving a list saved by the first version of the app
// (a plain array of courses on the 4.0 scale) into a first semester.
export function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Array.isArray(saved.semesters) && saved.semesters.length) {
      return saved;
    }
    const old = JSON.parse(localStorage.getItem(OLD_KEY));
    if (Array.isArray(old) && old.length) {
      const data = fresh();
      data.scale = "four";
      data.semesters[0].courses = old.map(({ courseCode, courseUnit, score }) => ({
        id: newId(),
        courseCode,
        courseUnit,
        score,
      }));
      return data;
    }
  } catch {
    // Unreadable or blocked storage: start fresh.
  }
  return fresh();
}

export function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage can be full or blocked; the calculator still works without it.
  }
}
