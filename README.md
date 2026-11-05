# CGPA Calculator

A small React app that works out your CGPA from your courses. Add each course's code, unit and score, and the table shows its letter grade and grade points. The total units and CGPA update as you go.

## Features

- Letter grade and grade points for each course
- Courses are saved in your browser, so a refresh keeps them
- Course codes are tidied (` mth101 ` becomes `MTH101`), and duplicates are refused
- Remove one course, or clear the whole list
- Works from the keyboard

## Grading scale

| Score | Grade | Points |
| --- | --- | --- |
| 70 to 100 | A | 4 |
| 60 to 69 | B | 3 |
| 50 to 59 | C | 2 |
| 45 to 49 | D | 1 |
| 0 to 44 | F | 0 |

CGPA is the sum of (grade points × units) divided by the total units. The scale lives in [`src/grading.js`](src/grading.js) if you need to change it.

## Run it locally

```bash
npm install
npm start      # opens http://localhost:3000
npm test       # runs the tests
npm run build  # production build in build/
```

Built with [Create React App](https://create-react-app.dev/).
