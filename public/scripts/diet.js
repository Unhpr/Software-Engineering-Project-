document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("dietForm");
    const foodList = document.getElementById("foodList");
    const totalCaloriesSpan = document.getElementById("totalCalories");
  
    let total = 0;
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const name = document.getElementById("foodName").value;
      const cal = parseInt(document.getElementById("calories").value);
  
      if (!name || isNaN(cal)) return;
  
      const li = document.createElement("li");
      li.textContent = `${name} - ${cal} kcal`;
      foodList.appendChild(li);
  
      total += cal;
      totalCaloriesSpan.textContent = `${total} kcal`;
  
      form.reset();
    });
  });
  