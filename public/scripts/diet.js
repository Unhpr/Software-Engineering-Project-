document.addEventListener("DOMContentLoaded", () => {
  const dietForm = document.getElementById("dietForm");
  const dietList = document.getElementById("dietList");
  const totalCaloriesDisplay = document.getElementById("totalCalories");
  const customFoodForm = document.getElementById("customFoodForm");

  let totalCalories = 0;

  if (dietForm) {
    dietForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const food = document.getElementById("foodInput").value;
      const calories = parseInt(document.getElementById("caloriesInput").value);

      if (food && !isNaN(calories)) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${food} - ${calories} kcal`;
        dietList.appendChild(li);

        totalCalories += calories;
        totalCaloriesDisplay.textContent = totalCalories;

        dietForm.reset();
      }
    });
  }

  if (customFoodForm) {
    customFoodForm.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('foodName').value;
      const calories = document.getElementById('calories').value;

      if (name && calories) {
        try {
          const res = await fetch('/api/food/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, calories })
          });
          const result = await res.json();
          alert(result.message || 'Food added to database!');
          customFoodForm.reset();
        } catch (err) {
          console.error(err);
          alert('Failed to save food to database.');
        }
      }
    };
  }
});
