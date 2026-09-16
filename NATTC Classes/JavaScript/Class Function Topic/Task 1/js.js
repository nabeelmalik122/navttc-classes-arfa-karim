// Task 1
function add(a, b) {
  console.log(`Sum of both is : ${a + b}`);
}
add(9, 9);

// Task 2
function square(a) {
  console.log(`Sqaure of 10 is : ${a * a}`);
}
square(10);

// Task 3
function checkEvenOdd(num) {
  if (num % 2 === 0) {
    return num + " is even Number";
  } else {
    return num + " is odd Number";
  }
}
let eveOdd = checkEvenOdd(805);
console.log(eveOdd);
