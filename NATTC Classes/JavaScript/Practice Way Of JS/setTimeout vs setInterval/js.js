console.log("Hwllo 1");

setTimeout(() => {
  console.log("Hello 3");
}, 2000);

console.log("3");

setInterval()
console.log("Hwllo 1");
setInterval(function () {
  console.log("Hello");
}, 1000);
console.log("3");

// Ab setInterval() ko rokna clearInterva()

let timer = setInterval(function () {
  console.log("Malik");
}, 1000);

setTimeout(function () {
  clearInterval(timer);
}, 10000);

// Promises

let pizza = new Promise(function (resolve, reject) {
  resolve("Pizza mil gaya");
});
pizza.then(function (result) {
  console.log(result);
});

//Ab async / await

let promise = new Promise(function (resolve, reject) {
  resolve("Pizza mil gaya");
});

async function getData() {
  let result = await promise;
  console.log(result);
}

getData();

// Ek Complete Example
console.log(1);
let promise = new Promise(function (resolve) {
  setTimeout(function () {
    resolve("Data mil gaya");
  }, 2000);
});

async function getData() {
  let result = await promise;
  console.log(result);
}
console.log(3);

getData();

// Ab next topic: Destructuring
let student = ["Malik", 24, "Peshawar"];

let [ name, age, city ] = student;
console.log(name);

let age = 15;

let result = age >= 18 ? "Adult" : "Child";

console.log(result);
