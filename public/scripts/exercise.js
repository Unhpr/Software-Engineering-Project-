document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("exerciseForm");
    const nameInput = document.getElementById("exerciseName");
    const list = document.getElementById("exerciseList");
    const completedList = document.getElementById("completedList");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      if (!name) return;
  
      const li = document.createElement("li");
      li.textContent = name;
  
      const btn = document.createElement("button");
      btn.textContent = "Mark as done";
      btn.style.marginLeft = "10px";
      btn.addEventListener("click", () => {
        li.removeChild(btn);
        completedList.appendChild(li);
      });
  
      li.appendChild(btn);
      list.appendChild(li);
      nameInput.value = "";
    });
  });
  