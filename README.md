# CGPA Calculator

A React app for Nigerian university students to work out their GPA and CGPA. Add each course's code, units and score, semester by semester, and see your CGPA, degree class and what you need for a target.

**Try it:** [cgpa-calc-react.vercel.app](https://cgpa-calc-react.vercel.app/)

## Features

- A landing page that explains how CGPA is worked out, and the calculator at `#/calculator`
- Semesters on their own tabs, each with its own GPA, adding up to your CGPA
- The 5.0 scale (NUC) or the 4.0 scale, with degree classes for each
- A CGPA dial with a tick at each degree-class boundary
- A target planner: enter the CGPA you want and the units left, and see the average you need
- Your semesters, courses, scale and target are saved in your browser (localStorage), so they are there when you come back
- Fields are checked when you add a course, with a clear message under each one that goes as soon as you fix it
- Course codes are tidied (` mth101 ` becomes `MTH101`), and duplicates in a semester are refused
- Works from the keyboard and down to phone width

## Grading scales

| Score | 5.0 scale | 4.0 scale |
| --- | --- | --- |
| 70 to 100 | A, 5 points | A, 4 points |
| 60 to 69 | B, 4 points | B, 3 points |
| 50 to 59 | C, 3 points | C, 2 points |
| 45 to 49 | D, 2 points | D, 1 point |
| 40 to 44 | E, 1 point | F, 0 points |
| 0 to 39 | F, 0 points | F, 0 points |

CGPA is the sum of (grade points × units) divided by the total units. Class boundaries vary between schools, so check your student handbook. The scales and classes live in [`src/grading.js`](src/grading.js) if you need to change them.

## Run it locally

```bash
npm install
npm start      # opens http://localhost:3000
npm test       # runs the tests
npm run build  # production build in build/
```

Built with [Create React App](https://create-react-app.dev/).
