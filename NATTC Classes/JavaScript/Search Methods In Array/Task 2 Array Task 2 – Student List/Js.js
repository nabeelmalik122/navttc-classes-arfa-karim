let students = ["Ali", "Ahmed", "Sara"];

students.push("Hamza");
students.sort();

console.log(students.indexOf("Sara"));

if (students.includes("Sara")) {
  console.log("Sara is enrolled.");
} else {
  console.log(`Sara is not enrolled.`);
}

console.log(`Total Student: ${students.length}`);
