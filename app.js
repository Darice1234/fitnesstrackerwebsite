let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
let goal = localStorage.getItem("goal") || 0;

function addWorkout() {
  let workoutInput = document.getElementById("workout");
  let minsInput = document.getElementById("mins");

  if (!workoutInput || !minsInput) return;

  let w = workoutInput.value;
  let m = Number(minsInput.value);

  if (w === "" || m === 0 || isNaN(m)) return;

  let cal = m * 8;

  workouts.push({ w: w, m: m, cal: cal });

  localStorage.setItem("workouts", JSON.stringify(workouts));

  workoutInput.value = "";
  minsInput.value = "";

  updateToday();
  renderHistory();
  drawChart();
}

function updateToday() {
  let total = 0;

  for (let i = 0; i < workouts.length; i++) {
    total += workouts[i].cal;
  }

  let el = document.getElementById("today");
  if (el) el.innerText = "🔥 " + total + " kcal burned";
}

function renderHistory() {
  let el = document.getElementById("history");
  if (!el) return;

  el.innerHTML = "";

  for (let i = 0; i < workouts.length; i++) {
    let x = workouts[i];

    el.innerHTML +=
      "<div class='card'>" +
      "<b>" + (i + 1) + ". " + x.w + "</b><br>" +
      "⏱ " + x.m + " mins<br>" +
      "🔥 " + x.cal + " kcal" +
      "</div>";
  }
}

function setGoal() {
  let g = document.getElementById("goal");
  if (!g) return;

  if (g.value === "") return;

  localStorage.setItem("goal", g.value);

  let show = document.getElementById("showGoal");
  if (show) show.innerText = "🎯 Goal: " + g.value + " kcal/day";
}

function loadProfile() {
  let p = document.getElementById("userData");
  if (!p) return;

  let user = localStorage.getItem("user");

  if (!user) {
    p.innerText = "👋 Welcome Guest";
  } else {
    p.innerText = "👋 Welcome " + user;
  }
}

let chartInstance = null;

function drawChart() {
  let canvas = document.getElementById("chart");
  if (!canvas) return;

  let ctx = canvas.getContext("2d");

  let labels = [];
  let data = [];

  for (let i = 0; i < workouts.length; i++) {
    labels.push("W" + (i + 1));
    data.push(workouts[i].cal);
  }

  if (chartInstance !== null) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Calories",
        data: data,
        borderColor: "#ff4fd8",
        backgroundColor: "rgba(255,79,216,0.2)",
        fill: true,
        tension: 0.4
      }]
    }
  });
}

window.onload = function () {
  updateToday();
  renderHistory();
  drawChart();
  loadProfile();
};
