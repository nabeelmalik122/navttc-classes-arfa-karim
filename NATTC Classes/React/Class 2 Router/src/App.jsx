// import { useState, useEffect } from "react";

// function ProductList() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // 1. Page load hotay hi API se data mangwaya
//     fetch("https://jsonplaceholder.typicode.com/posts/1")
//       .then((res) => res.json())
//       .then((result) => {
//         setData(result); // 2. State update kar di
//       });
//   }, []); // [] ka matlab: Sirf ek baar API call hogi

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>API Result:</h2>
//       <p>{data.title ? data.title : "Loading..."}</p>
//     </div>
//   );
// }

// export default ProductList;
import { useState, useEffect } from "react";

function ProductList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 1. Page load hotay hi API se data mangwaya
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => res.json())
      .then((result) => {
        setData(result); // 2. State update kar di
      });
  }, []); // [] ka matlab: Sirf ek baar API call hogi

  return (
    <div style={{ padding: "20px" }}>
      <h2>API Result:</h2>
      <p>{data.title ? data.title : "Loading..."}</p>
    </div>
  );
}

export default ProductList;
