import React, { useEffect, useState } from "react";

import "./App.css";

const STORAGE_KEY = "cgpa-courses";

function loadCourses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Calculator() {
  const [courses, setCourses] = useState(loadCourses);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch {
      // Storage can be full or blocked; the calculator still works without it.
    }
  }, [courses]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const courseCode = event.target.elements.courseCode.value.trim().toUpperCase();
    if (courses.some((course) => course.courseCode === courseCode)) {
      setError(`${courseCode} is already in the list.`);
      return;
    }
    setError("");
    const courseUnit = parseInt(event.target.elements.courseUnit.value);
    const score = parseInt(event.target.elements.score.value);
    const gradePoints = getGradePoints(score);
    const newCourse = { courseCode, courseUnit, score, gradePoints };
    setCourses([...courses, newCourse]);
    event.target.reset();
  };

  const handleDelete = (index) => {
    setCourses(courses.filter((course, i) => i !== index));
  };

  const getGradePoints = (score) => {
    if (score >= 70) {
      return 4;
    } else if (score >= 60) {
      return 3;
    } else if (score >= 50) {
      return 2;
    } else if (score >= 45) {
      return 1;
    } else {
      return 0;
    }
  };

  const getLetterGrade = (score) => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    return "F";
  };

  const getTotalUnits = () => {
    return courses.reduce((total, course) => total + course.courseUnit, 0);
  };

  const getTotalGradePoints = () => {
    return courses.reduce(
      (total, course) => total + course.gradePoints * course.courseUnit,
      0
    );
  };

  const getCGPA = () => {
    const totalUnits = getTotalUnits();
    const totalGradePoints = getTotalGradePoints();
    const cgpa = totalGradePoints / totalUnits;
    return cgpa.toFixed(2);
  };

  return (
    <div className="calculator">
      <h1>CGPA Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="courseCode">Course Code</label>
        <input type="text" id="courseCode" name="courseCode" required />

        <label htmlFor="courseUnit">Course Unit</label>
        <input type="number" id="courseUnit" name="courseUnit" min="1" max="6" required />

        <label htmlFor="score">Score</label>
        <input type="number" id="score" name="score" min="0" max="100" required />

        <button type="submit">Add Course</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      {courses.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Unit</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Grade Points</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.courseCode}</td>
                <td>{course.courseUnit}</td>
                <td>{course.score}</td>
                <td>{getLetterGrade(course.score)}</td>
                <td>{course.gradePoints}</td>
                <td>
                  <button
                    type="button"
                    className="del"
                    aria-label={`Remove ${course.courseCode}`}
                    onClick={() => handleDelete(index)}
                  >
                    <ion-icon name="close-circle" aria-hidden="true"></ion-icon>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {courses.length > 0 && (
        <div className="cgpa">
          <p>Total Units: <b>{getTotalUnits()}</b> CGPA: <b>{getCGPA()}</b></p>
          <button
            type="button"
            className="clear"
            onClick={() => {
              if (window.confirm("Remove every course?")) setCourses([]);
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

export default Calculator;
