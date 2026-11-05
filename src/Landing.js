import React, { useEffect, useState } from "react";
import { Calculator as CalcIcon, Github, Layers, Lock, Scale, Target } from "lucide-react";

import "./Landing.css";
import Dial from "./Dial";
import { BookStack, CapMark, HeroCap } from "./illustrations";
import { SCALES } from "./grading";

const HERO_CGPA = 4.52;

const SLIP_ROWS = [
  ["MTH201", 3, "A", "a"],
  ["CSC205", 3, "A", "a"],
  ["STA211", 2, "B", "b"],
  ["GST221", 2, "C", "c"],
];

const FEATURES = [
  {
    icon: Layers,
    title: "Semester by semester",
    text: "Keep each semester on its own tab with its own GPA. Your CGPA adds them all up.",
  },
  {
    icon: Scale,
    title: "5.0 or 4.0 scale",
    text: "Switch scales and every grade, point and class is worked out again.",
  },
  {
    icon: Target,
    title: "Plan a target",
    text: "Enter the CGPA you want and the units you have left. See the average you need, or the best you can still reach.",
  },
  {
    icon: Lock,
    title: "Stays on your device",
    text: "No account and no sign-up. Your courses are saved in your browser, and nowhere else.",
  },
];

// Counts the hero dial up from zero once, unless the visitor prefers less motion.
function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof requestAnimationFrame !== "function") {
      setValue(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

function ScaleTable({ scale }) {
  return (
    <div className="scale-card">
      <h3>{scale.label}</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Score</th>
            <th scope="col">Grade</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
          {scale.bands.map(([min, letter, points], i) => {
            const top = i === 0 ? 100 : scale.bands[i - 1][0] - 1;
            return (
              <tr key={letter}>
                <td>
                  {min} to {top}
                </td>
                <td>
                  <span className={`grade grade-${letter.toLowerCase()}`}>{letter}</span>
                </td>
                <td>{points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ul className="class-list">
        {scale.classes.map(([min, name], i) => {
          const top = i === 0 ? scale.max : scale.classes[i - 1][0] - 0.01;
          return (
            <li key={name}>
              <span>{name}</span>
              <b>
                {min.toFixed(2)} to {top.toFixed(2)}
              </b>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Landing() {
  const heroValue = useCountUp(HERO_CGPA);
  const five = SCALES.five;

  return (
    <div className="landing">
      <header className="nav">
        <a className="brand" href="#top">
          <CapMark size={30} />
          <span>CGPA Calculator</span>
        </a>
        <nav aria-label="Sections">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#scales">Grading scales</a>
        </nav>
        <a className="btn btn-sky nav-cta" href="#/calculator">
          Open calculator
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <h1>See your CGPA, and the grades you need next.</h1>
            <p className="lede">
              Add your courses semester by semester. Your CGPA, degree class and the average you need for
              your target update as you type.
            </p>
            <div className="hero-actions">
              <a className="btn btn-sky btn-lg" href="#/calculator">
                <CalcIcon size={20} aria-hidden="true" />
                Open the calculator
              </a>
              <a className="btn btn-ghost btn-lg" href="#how">
                How it's worked out
              </a>
            </div>
            <p className="hero-note">Free, with no sign-up. Your results stay in your browser.</p>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-1" />
            <div className="orbit orbit-2" />
            <HeroCap className="hero-cap" />
            <BookStack className="hero-books" />

            <div className="hero-slip">
              <p className="hero-slip-title">200 level, first semester</p>
              {SLIP_ROWS.map(([code, units, letter, tone]) => (
                <div className="hero-slip-row" key={code}>
                  <span>{code}</span>
                  <span>{units} units</span>
                  <span className={`grade grade-${tone}`}>{letter}</span>
                </div>
              ))}
            </div>

            <div className="hero-dial">
              <Dial value={heroValue} max={five.max} classes={five.classes} label="First class" />
              <p>{heroValue >= 4.5 ? "First class" : " "}</p>
            </div>
          </div>
        </section>

        <section id="features" className="features" aria-labelledby="features-heading">
          <div className="features-intro">
            <h2 id="features-heading">Everything a results sheet needs, and a little more</h2>
            <p>
              Built for students on the Nigerian grading system, where a score of 70 or more is an A and
              units decide how much each course counts.
            </p>
          </div>
          <ul className="feature-list">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="feature-icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="how" className="how" aria-labelledby="how-heading">
          <h2 id="how-heading">How your CGPA is worked out</h2>
          <ol className="steps">
            <li>
              <h3>Turn each score into grade points</h3>
              <p>On the 5.0 scale, 75 is an A worth 5 points and 52 is a C worth 3.</p>
            </li>
            <li>
              <h3>Multiply by the course units</h3>
              <p>A 3-unit A gives 15 points. A 2-unit C gives 6.</p>
            </li>
            <li>
              <h3>Divide by the total units</h3>
              <p>21 points over 5 units is a CGPA of 4.20.</p>
            </li>
          </ol>

          <div className="worked">
            <div className="worked-row">
              <span className="code">MTH101</span>
              <span>
                <span className="grade grade-a">A</span> 5 × 3 units
              </span>
              <b>15</b>
            </div>
            <div className="worked-row">
              <span className="code">PHY101</span>
              <span>
                <span className="grade grade-c">C</span> 3 × 2 units
              </span>
              <b>6</b>
            </div>
            <div className="worked-total">
              <span>21 points ÷ 5 units</span>
              <b>4.20</b>
            </div>
          </div>
        </section>

        <section id="scales" className="scales" aria-labelledby="scales-heading">
          <h2 id="scales-heading">Grading scales</h2>
          <p className="scales-intro">
            Most universities use the 5.0 scale. Some, and many older results, use 4.0. Class boundaries
            vary between schools, so check your student handbook.
          </p>
          <div className="scale-grid">
            <ScaleTable scale={SCALES.five} />
            <ScaleTable scale={SCALES.four} />
          </div>
        </section>

        <section className="closer">
          <HeroCap className="closer-cap" />
          <h2>Know where you stand before results day.</h2>
          <a className="btn btn-sky btn-lg" href="#/calculator">
            <CalcIcon size={20} aria-hidden="true" />
            Open the calculator
          </a>
        </section>
      </main>

      <footer className="foot">
        <span className="brand">
          <CapMark size={24} />
          CGPA Calculator
        </span>
        <a href="https://github.com/gentlerhiz/cgpa-calc-react">
          <Github size={18} aria-hidden="true" />
          Source code on GitHub
        </a>
      </footer>
    </div>
  );
}
