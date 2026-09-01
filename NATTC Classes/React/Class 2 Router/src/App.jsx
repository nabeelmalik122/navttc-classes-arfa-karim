import { useState } from "react";
import InputChild from "./components/InputChild";
import DisplayChild from "./components/DisplayChild";

function App() {
  // State ko Parent ke paas rakha (Lifting Up)
  const [text, setText] = useState("");

  return (
    <div style={{ padding: "20px 10px" }}>
      <h2>Parent Component</h2>

      {/* Child 1 ko function aur value di */}
      <InputChild text={text} setText={setText} />

      {/* Child 2 ko sirf display ke liye value di */}
      <DisplayChild text={text} />
    </div>
  );
}

export default App;
