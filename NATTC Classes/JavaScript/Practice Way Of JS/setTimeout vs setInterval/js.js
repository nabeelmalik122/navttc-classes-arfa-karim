// console.log("Hwllo 1");

// setTimeout(() => {
//   console.log("Hello 3");
// }, 2000);

// console.log("3");

// setInterval()
// console.log("Hwllo 1");
// setInterval(function () {
//   console.log("Hello");
// }, 1000);
// console.log("3");

// Ab setInterval() ko rokna clearInterva()

let timer = setInterval(function () {
  console.log("Malik");
}, 1000);

setTimeout(function () {
  clearInterval(timer);
}, 10000);
