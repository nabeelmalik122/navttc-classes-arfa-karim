let cart = ["Milk", "Bread", "Eggs"];

cart.unshift("Butter");
cart.shift();
console.log(cart);
console.log(cart.includes("Eggs"));

// cart = "Eggs"

if (cart.includes("Eggs")) {
  console.log("Eggs available in cart.");
} else {
  console.log("Eggs not available.");
}

console.log(cart);
