import React, { useEffect, useState } from "react";

import Calculator from "./Calculator";
import Landing from "./Landing";

const CALCULATOR = "#/calculator";

const onCalculator = () => window.location.hash.startsWith(CALCULATOR);

// Two views on hash routes, so the app works on any static host.
// "#/calculator" opens the calculator; anything else is the landing page,
// whose section links (#features, #how) scroll within it.
function App() {
  const [calculator, setCalculator] = useState(onCalculator);

  useEffect(() => {
    const sync = () => {
      const next = onCalculator();
      setCalculator((was) => {
        if (was !== next || window.location.hash === "#/") window.scrollTo?.(0, 0);
        return next;
      });
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    document.title = calculator
      ? "Your results | CGPA Calculator"
      : "CGPA Calculator: 5.0 and 4.0 scale, with degree class";
  }, [calculator]);

  return calculator ? <Calculator /> : <Landing />;
}

export default App;
