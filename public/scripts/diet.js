document.addEventListener("DOMContentLoaded", () => {
  const dietForm = document.getElementById("dietForm");
  const dietList = document.getElementById("dietList");
  const totalCaloriesDisplay = document.getElementById("totalCalories");
  const customFoodForm = document.getElementById("customFoodForm");

  let allDietLogs = [];
  let totalCalories = 0;


  if (dietForm) {
    dietForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const food = document.getElementById("foodInput").value;
      const calories = parseInt(document.getElementById("caloriesInput").value);

      if (food && !isNaN(calories)) {
        try {
          const res = await fetch('/api/food/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: food, calories })
          });

          if (!res.ok) throw new Error('Failed to save food log');

          const savedItem = await res.json();
          allDietLogs.push(savedItem);
          renderDietLogs(allDietLogs);

          dietForm.reset();
        } catch (err) {
          console.error('Error saving food:', err);
          alert('Failed to save food log.');
        }
      }
    });
  }


  async function loadDietLogs() {
    try {
      const res = await fetch('/api/food/log');
      const data = await res.json();
      allDietLogs = data;
      renderDietLogs(allDietLogs);
    } catch (err) {
      console.error('Error loading diet logs:', err);
    }
  }


  function renderDietLogs(list) {
    dietList.innerHTML = '';
    totalCalories = 0;

    list.forEach(log => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${log.name} - ${log.calories} kcal`;
      dietList.appendChild(li);
      totalCalories += parseInt(log.calories);
    });

    totalCaloriesDisplay.textContent = totalCalories;
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

  loadDietLogs(); 
});
