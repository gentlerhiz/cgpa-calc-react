import React, { useEffect, useRef, useState } from "react";
import { BookOpen, Home, Plus, RotateCcw, Target, Trash2, X } from "lucide-react";

import "./Calculator.css";
import ConfirmDialog from "./ConfirmDialog";
import Dial from "./Dial";
import Field from "./Field";
import { validateCourse, validatePlan } from "./validation";
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

const EMPTY_DRAFT = { courseCode: "", courseUnit: "", score: "" };

function Calculator() {
  const [data, setData] = useState(load);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [fieldErrors, setFieldErrors] = useState({});
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
    setFieldErrors({});
  };

  const checkDraft = (next) =>
    validateCourse(
      next,
      active.courses.map((c) => c.courseCode),
      active.name || "this semester"
    );

  // Once a field shows an error, it is checked again as the user types,
  // so the message goes as soon as the value is fixed.
  const changeDraft = (key) => (value) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    if (fieldErrors[key]) {
      const { errors } = checkDraft(next);
      setFieldErrors((current) => ({ ...current, [key]: errors[key] }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { errors, course } = checkDraft(draft);
    setFieldErrors(errors);
    if (!course) {
      document.getElementById(Object.keys(errors)[0])?.focus();
      return;
    }
    updateActive((s) => ({ ...s, courses: [...s.courses, { id: newId(), ...course }] }));
    setDraft(EMPTY_DRAFT);
    codeInputRef.current?.focus();
  };

  const planner = data.planner ?? { target: "", remaining: "" };
  const changePlanner = (key) => (value) =>
    setData((d) => ({ ...d, planner: { ...(d.planner ?? {}), [key]: value } }));
  const planCheck = validatePlan(planner, scaleInfo.max);

  const removeCourse = (id) =>
    updateActive((s) => ({ ...s, courses: s.courses.filter((c) => c.id !== id) }));

  const addSemester = () => {
    const semester = newSemester(semesters.length + 1);
    setData((d) => ({ ...d, semesters: [...d.semesters, semester], activeId: semester.id }));
    setFieldErrors({});
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
        setFieldErrors({});
      },
    });

  const plan = planCheck.ready
    ? planTarget({
        units: overall.units,
        points: overall.points,
        target: planCheck.target,
        remainingUnits: planCheck.remaining,
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

            <form className="add-row" onSubmit={handleSubmit} noValidate>
              <Field
                id="courseCode"
                label="Course code"
                className="field-code"
                placeholder="MTH101"
                autoCapitalize="characters"
                inputRef={codeInputRef}
                value={draft.courseCode}
                onChange={changeDraft("courseCode")}
                error={fieldErrors.courseCode}
              />
              <Field
                id="courseUnit"
                label="Course unit"
                placeholder="3"
                inputMode="numeric"
                value={draft.courseUnit}
                onChange={changeDraft("courseUnit")}
                error={fieldErrors.courseUnit}
              />
              <Field
                id="score"
                label="Score"
                placeholder="72"
                inputMode="numeric"
                value={draft.score}
                onChange={changeDraft("score")}
                error={fieldErrors.score}
              />
              <button type="submit" className="btn btn-gold add-btn">
                <Plus size={18} aria-hidden="true" />
                Add course
              </button>
            </form>

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

          <form className="planner" onSubmit={(e) => e.preventDefault()} noValidate>
            <h2>
              <Target size={18} aria-hidden="true" />
              Plan a target
            </h2>
            <div className="planner-fields">
              <Field
                id="target"
                label="Target CGPA"
                inputMode="decimal"
                placeholder={scale === "five" ? "4.50" : "3.50"}
                value={planner.target}
                onChange={changePlanner("target")}
                error={planCheck.errors.target}
              />
              <Field
                id="remaining"
                label="Units left"
                inputMode="numeric"
                placeholder="48"
                value={planner.remaining}
                onChange={changePlanner("remaining")}
                error={planCheck.errors.remaining}
              />
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
