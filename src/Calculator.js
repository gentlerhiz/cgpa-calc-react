import React, { useEffect, useRef, useState } from "react";
import { BookOpen, Home, Plus, RotateCcw, Target, Trash2, X } from "lucide-react";

import "./Calculator.css";
import ConfirmDialog from "./ConfirmDialog";
import Dial from "./Dial";
import { CapMark, EmptySlip } from "./illustrations";
import {
  SCALES,
  getDegreeClass,
  getGradePoints,
  getLetterGrade,
  letterForAverage,
  planTarget,
  summarise,
} from "./grading";
import { load, newId, newSemester, save } from "./storage";

const tone = (letter) => `grade-${letter.toLowerCase()}`;

function Calculator() {
  const [data, setData] = useState(load);
  const [error, setError] = useState("");
  const [target, setTarget] = useState("");
  const [remaining, setRemaining] = useState("");
  const [confirm, setConfirm] = useState(null);
  const codeInputRef = useRef(null);

  useEffect(() => save(data), [data]);

  const { scale, semesters, activeId } = data;
  const scaleInfo = SCALES[scale];
  const active = semesters.find((s) => s.id === activeId) ?? semesters[0];
  const allCourses = semesters.flatMap((s) => s.courses);
  const overall = summarise(allCourses, scale);
  const hasCourses = allCourses.length > 0;
  const degreeClass = hasCourses ? getDegreeClass(overall.gpa, scale) : "Add a course to begin";
  const activeSummary = summarise(active.courses, scale);

  const gradeMix = Object.fromEntries(scaleInfo.bands.map(([, letter]) => [letter, 0]));
  allCourses.forEach((c) => {
    gradeMix[getLetterGrade(c.score, scale)] += 1;
  });

  const updateActive = (change) =>
    setData((d) => ({
      ...d,
      semesters: d.semesters.map((s) => (s.id === active.id ? change(s) : s)),
    }));

  const selectSemester = (id) => {
    setData((d) => ({ ...d, activeId: id }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target.elements;
    const courseCode = form.courseCode.value.trim().toUpperCase();
    if (active.courses.some((c) => c.courseCode === courseCode)) {
      setError(`${courseCode} is already in ${active.name}.`);
      return;
    }
    setError("");
    const course = {
      id: newId(),
      courseCode,
      courseUnit: parseInt(form.courseUnit.value, 10),
      score: parseInt(form.score.value, 10),
    };
    updateActive((s) => ({ ...s, courses: [...s.courses, course] }));
    event.target.reset();
    form.courseCode.focus();
  };

  const removeCourse = (id) =>
    updateActive((s) => ({ ...s, courses: s.courses.filter((c) => c.id !== id) }));

  const addSemester = () => {
    const semester = newSemester(semesters.length + 1);
    setData((d) => ({ ...d, semesters: [...d.semesters, semester], activeId: semester.id }));
    setError("");
  };

  const removeSemester = () => {
    const name = active.name || "this semester";
    const count = active.courses.length;
    setConfirm({
      title: `Remove ${name}?`,
      message: count
        ? `Its ${count} ${count === 1 ? "course goes" : "courses go"} with it. This can't be undone.`
        : "It has no courses yet.",
      confirmLabel: "Remove semester",
      cancelLabel: "Keep it",
      onConfirm: () =>
        setData((d) => {
          const rest = d.semesters.filter((s) => s.id !== active.id);
          const left = rest.length ? rest : [newSemester(1)];
          return { ...d, semesters: left, activeId: left[0].id };
        }),
    });
  };

  const clearAll = () =>
    setConfirm({
      title: "Clear everything?",
      message: `This removes all ${semesters.length === 1 ? "your courses" : `${semesters.length} semesters and their courses`}. This can't be undone.`,
      confirmLabel: "Clear everything",
      cancelLabel: "Keep my results",
      onConfirm: () => {
        const first = newSemester(1);
        setData((d) => ({ ...d, semesters: [first], activeId: first.id }));
        setError("");
      },
    });

  const plan =
    target !== "" && remaining !== ""
      ? planTarget({
          units: overall.units,
          points: overall.points,
          target: parseFloat(target),
          remainingUnits: parseInt(remaining, 10),
          scale,
        })
      : null;

  return (
    <div className="calc">
      <header className="calc-bar">
        <a className="brand" href="#/">
          <CapMark size={30} />
          <span>CGPA Calculator</span>
        </a>
        <div className="scale-switch" role="group" aria-label="Grading scale">
          {Object.values(SCALES).map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={scale === s.id}
              onClick={() => setData((d) => ({ ...d, scale: s.id }))}
            >
              {s.label}
            </button>
          ))}
        </div>
        <a className="btn btn-ghost bar-home" href="#/">
          <Home size={18} aria-hidden="true" />
          <span>Home</span>
        </a>
      </header>

      <main className="calc-grid">
        <section className="workbench" aria-labelledby="results-heading">
          <h1 id="results-heading">Your results</h1>

          <div className="semester-tabs" role="tablist" aria-label="Semesters">
            {semesters.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={s.id === active.id}
                onClick={() => selectSemester(s.id)}
              >
                <span>{s.name || "Untitled"}</span>
                <small>
                  {s.courses.length ? `GPA ${summarise(s.courses, scale).gpa.toFixed(2)}` : "No courses"}
                </small>
              </button>
            ))}
            <button type="button" className="add-semester" onClick={addSemester}>
              <Plus size={16} aria-hidden="true" />
              Add semester
            </button>
          </div>

          <div className="slip" role="tabpanel" aria-label={active.name || "Untitled"}>
            <div className="slip-head">
              <input
                className="slip-name"
                aria-label="Semester name"
                value={active.name}
                onChange={(e) => updateActive((s) => ({ ...s, name: e.target.value }))}
              />
              <p className="slip-gpa">
                <span>GPA</span>
                <b>{activeSummary.gpa.toFixed(2)}</b>
                <span>{activeSummary.units} units</span>
              </p>
            </div>

            <form className="add-row" onSubmit={handleSubmit}>
              <div className="field field-code">
                <label htmlFor="courseCode">Course code</label>
                <input ref={codeInputRef} type="text" id="courseCode" name="courseCode" placeholder="MTH101" autoComplete="off" required />
              </div>
              <div className="field">
                <label htmlFor="courseUnit">Course unit</label>
                <input type="number" id="courseUnit" name="courseUnit" min="1" max="6" placeholder="3" required />
              </div>
              <div className="field">
                <label htmlFor="score">Score</label>
                <input type="number" id="score" name="score" min="0" max="100" placeholder="72" required />
              </div>
              <button type="submit" className="btn btn-gold add-btn">
                <Plus size={18} aria-hidden="true" />
                Add course
              </button>
            </form>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}

            {active.courses.length === 0 ? (
              <div className="empty">
                <EmptySlip />
                <p>Add your first course for {active.name || "this semester"}. Its grade and points appear here.</p>
              </div>
            ) : (
              <table className="courses">
                <thead>
                  <tr>
                    <th scope="col">Course</th>
                    <th scope="col">Units</th>
                    <th scope="col">Score</th>
                    <th scope="col">Grade</th>
                    <th scope="col">Points</th>
                    <th scope="col">
                      <span className="visually-hidden">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {active.courses.map((course) => {
                    const letter = getLetterGrade(course.score, scale);
                    return (
                      <tr key={course.id}>
                        <td className="code">{course.courseCode}</td>
                        <td>{course.courseUnit}</td>
                        <td>{course.score}</td>
                        <td>
                          <span className={`grade ${tone(letter)}`}>{letter}</span>
                        </td>
                        <td>{getGradePoints(course.score, scale) * course.courseUnit}</td>
                        <td>
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`Remove ${course.courseCode}`}
                            onClick={() => removeCourse(course.id)}
                          >
                            <X size={18} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <div className="slip-foot">
              <button type="button" className="text-btn" onClick={removeSemester}>
                <Trash2 size={16} aria-hidden="true" />
                Remove semester
              </button>
            </div>
          </div>
        </section>

        <aside className="summary" aria-label="Summary">
          <Dial value={overall.gpa} max={scaleInfo.max} classes={scaleInfo.classes} label={degreeClass} />
          <p className="degree-class">{degreeClass}</p>

          <dl className="stats">
            <div>
              <dt>Total units</dt>
              <dd>{overall.units}</dd>
            </div>
            <div>
              <dt>Grade points</dt>
              <dd>{overall.points}</dd>
            </div>
            <div>
              <dt>Courses</dt>
              <dd>{allCourses.length}</dd>
            </div>
          </dl>

          {hasCourses && (
            <div className="mix">
              <h2>Grade mix</h2>
              <div className="mix-bar" aria-hidden="true">
                {Object.entries(gradeMix)
                  .filter(([, n]) => n)
                  .map(([letter, n]) => (
                    <span key={letter} className={tone(letter)} style={{ flexGrow: n }} />
                  ))}
              </div>
              <ul className="mix-legend">
                {Object.entries(gradeMix).map(([letter, n]) => (
                  <li key={letter}>
                    <span className={`dot ${tone(letter)}`} aria-hidden="true" />
                    {letter} <b>{n}</b>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form className="planner" onSubmit={(e) => e.preventDefault()}>
            <h2>
              <Target size={18} aria-hidden="true" />
              Plan a target
            </h2>
            <div className="planner-fields">
              <div className="field">
                <label htmlFor="target">Target CGPA</label>
                <input
                  id="target"
                  type="number"
                  step="0.01"
                  min="0"
                  max={scaleInfo.max}
                  placeholder={scale === "five" ? "4.50" : "3.50"}
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="remaining">Units left</label>
                <input
                  id="remaining"
                  type="number"
                  min="0"
                  placeholder="48"
                  value={remaining}
                  onChange={(e) => setRemaining(e.target.value)}
                />
              </div>
            </div>
            <p className="planner-result" aria-live="polite">
              {!plan && "Enter a target and the units you still have to take."}
              {plan?.status === "reached" && "You reach this target whatever you score in the units left."}
              {plan?.status === "possible" &&
                `You need an average of ${plan.average.toFixed(2)} grade points per unit, about ${letterForAverage(
                  plan.average,
                  scale
                )} or better, across those units.`}
              {plan?.status === "out-of-reach" &&
                `Out of reach with those units. The highest CGPA you can finish on is ${plan.best.toFixed(2)}.`}
            </p>
          </form>

          <p className="note">
            <BookOpen size={16} aria-hidden="true" />
            Class boundaries vary between schools. Check your student handbook.
          </p>

          {hasCourses && (
            <button type="button" className="text-btn on-dark" onClick={clearAll}>
              <RotateCcw size={16} aria-hidden="true" />
              Clear all
            </button>
          )}
        </aside>
      </main>

      {confirm && (
        <ConfirmDialog
          {...confirm}
          fallbackFocus={codeInputRef}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            confirm.onConfirm();
            setConfirm(null);
          }}
        />
      )}
    </div>
  );
}

export default Calculator;
