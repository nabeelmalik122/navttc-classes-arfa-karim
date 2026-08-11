// // forEach()
// const fruits = ["Apple", "Banana", "Mango", "Orange"];

// fruits.forEach(function (e) {
//   console.log(e);
// });

// // Map()
// let square = [2, 4, 6, 8];

// let result = square.map(function (square) {
//   return square * square;
// });
// console.log(result);

// const names = ["Ali", "Ahmed", "Sara"];

// let finalName = names.map(function (name) {
//   return name + " Khan";
// });
// console.log(finalName);

// //filter()
// const ages = [12, 18, 25, 15, 30, 17, 22];

// let conditionFinal = ages.filter(function (name) {
//   return name > 17;
// });
// console.log(conditionFinal);

// // find()

// const numbers = [10, 25, 40, 55, 70];

// let pehlaItem = numbers.find(function (number) {
//   return number >= 40;
// });
// console.log(pehlaItem);

// //findIndex()
// const colors = ["red", "blue", "green", "yellow"];

// let indesPosition = colors.findIndex(function (color) {
//   return color === "yellow";
// });
// console.log(indesPosition);

// //some()

// const marks = [45, 62, 38, 71, 55];
// let condtion = marks.some(function (number) {
//   return number > 60;
// });
// console.log(condtion);

// // every()
// const numbers12 = [10, 20, 3, 40];

// let failItem = numbers12.every(function (ture) {
//   return ture > 3;
// });
// console.log(failItem);

// // reduce()

// const prices = [500, 1200, 800, 1500];

// let totalPrice = prices.reduce(function (sum, price) {
//   return sum + price;
// }, 0);
// console.log(totalPrice);

// //Spread Operator ...

// const frontend = ["HTML", "CSS", "JavaScript"];

// const backend = ["Node.js", "Express", "MongoDB", "PHP"];

// const fullStack = [...frontend, ...backend];
// console.log(fullStack);

// //Ab Spread with Object
// const user = {
//   name: "Ahmed",
//   age: 22,
// };

// let _spread = {
//   ...user,
//   city: "Peshawar",
// };
// console.log(_spread);

//Rest Operator
// function add(...numbers) {
//   return numbers.reduce(function (sum, number) {
//     return sum + number;
//   }, 0);
// }
// console.log(add(10, 20, 30, 40));

// // Ab Default Parameters

// function greet(name = "Nabeel") {
//   console.log("Hello " + name);
// }
// greet("Malik");

// //Ab Optional Chaining ?.
// const user = {
//   name: "Ali",
//   address: {
//     city: "Peshawar",
//   },
// };
// console.log(user.address?.city);

// // Nullish Coalescing Operator ??
// const name = 10;

// // const result = name ?? "MNK";

// console.log(name || 100);

// Program 6 Assigment

// 1. forEach()
const fruits = ["Apple", "Banana", "Mango", "Orange"];

fruits.forEach(function (fruit) {
  console.log(fruit);
});

//2. map()
const numbers0 = [2, 4, 6, 8, 10];

const squaredNumbers = numbers0.map(function (num) {
  return num * num;
});

console.log(squaredNumbers);

//3. filter()
const ages = [12, 18, 25, 15, 30, 17, 22];

const adults = ages.filter(function (age) {
  return age >= 18;
});

console.log(adults);

//4. find()

const numbers1 = [10, 25, 40, 55, 70];

const firstNumberAbove50 = numbers1.find(function (num) {
  return num > 50;
});

console.log(firstNumberAbove50);

//5. findIndex()

const colors = ["red", "blue", "green", "yellow"];

const greenIndex = colors.findIndex(function (color) {
  return color === "green";
});

console.log(greenIndex);

//6. some()

const marks = [45, 62, 38, 71, 55];

const highScorer = marks.some(function (mark) {
  return mark >= 70;
});

console.log(highScorer);

//7. every()
const numbers2 = [10, 20, 3, 40, 50];

const allGreaterThanFive = numbers2.every(function (num) {
  return num > 5;
});

console.log(allGreaterThanFive);

//8. reduce()

const prices = [500, 1200, 800, 1500];

const totalPrice = prices.reduce(function (acc, currentPrice) {
  return acc + currentPrice;
}, 0);

console.log(totalPrice);

// 9. Object Destructuring
const student = {
  name: "Nabeel",
  age: 21,
  course: "MERN",
  city: "Nowshera",
};

const { name, age, course } = student;

console.log(name, age, course);

//10. Array Destructuring
const subjects = ["HTML", "CSS", "JavaScript", "React"];

const [first, second, third] = subjects;

console.log(first, second, third);

//11. Spread Operator (Arrays)
const frontend = ["HTML", "CSS", "JavaScript"];
const backend = ["Node.js", "Express", "MongoDB"];

const fullStack = [...frontend, ...backend];

console.log(fullStack);

// 12. Spread Operator (Objects)

const user = {
  name: "Ahmed",
  age: 22,
};

const updatedUser = {
  ...user,
  city: "Peshawar",
};

console.log(updatedUser);

//13. Rest Operator
function calculateSum(...numbers) {
  return numbers.reduce(function (total, num) {
    return total + num;
  }, 0);
}

console.log(calculateSum(10, 20, 30, 40, 50));

//14. Default Parameters

function greet(name = "Guest") {
  console.log("Hello, " + name);
}

greet("Nabeel");
greet();

//15. Optional Chaining

const user0 = {
  name: "Ali",
  address: {
    city: "Peshawar",
  },
};

const city = user0?.address?.city;
const phone = user0?.contact?.phone;

console.log(city);
console.log(phone);

//16. Nullish Coalescing (??)
const user1 = {
  name: null,
  city: "Peshawar",
};

const userName = user1.name ?? "Unknown";
const userCity = user1.city ?? "Unknown";

console.log(userName);
console.log(userCity);
