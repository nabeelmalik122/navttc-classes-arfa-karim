import { useMemo, useState } from "react";

function App() {
  const [count, setCount] = useState(0);


  function expensiveTask(num) {
    console.log("Expensive Task Running for num:", num);


    for (let i = 0; i <= 100000000; i++) { }

    return num * 2;
  }
  const doubleValue = useMemo(() => {
    return expensiveTask(count);
  }, [count]);

  return (
    <div>
      <h1>React useMemo Hook</h1>

      <button
        onClick={() => setCount(count + 1)}

      >
        Increment Count
      </button>

      <p>Count: <strong>{count}</strong></p>
      <p>
        Double Value: {doubleValue}
      </p>
    </div>
  );
}

export default App;
