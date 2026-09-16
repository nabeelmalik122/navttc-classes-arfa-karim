function addRecommendation() {
  let recommendation = document.getElementById("new_recommendation");

  if (recommendation.value != null && recommendation.value.trim() !== "") {
    console.log("New recommendation added");

    // Show Popup
    showPopup(true);

    // Create element
    let element = document.createElement("div");
    element.setAttribute("class", "recommendation");
    element.innerHTML =
      "<span>&#8220;</span>" + recommendation.value + "<span>&#8221;</span>";

    // Add to list
    document.getElementById("all_recommendations").appendChild(element);

    // Clear textarea
    recommendation.value = "";
  }
}

function showPopup(bool) {
  let popup = document.getElementById("popup");
  if (bool) {
    popup.style.display = "block";
  } else {
    popup.style.display = "none";
  }
}
