document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("exerciseForm");
  const nameInput = document.getElementById("exerciseInput");
  const activeList = document.getElementById("activeList");
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
    btn.className = "btn btn-sm btn-outline-secondary";
    btn.addEventListener("click", () => {
      li.removeChild(btn);
      completedList.appendChild(li);
    });

    li.appendChild(btn);
    activeList.appendChild(li);
    nameInput.value = "";
  });

  let allExercises = [];

  async function loadExercises() {
    try {
      const res = await fetch('/api/exercise/items');
      allExercises = await res.json();
      renderExerciseList(allExercises);
    } catch (err) {
      console.error('Failed to load exercises:', err);
    }
  }

  function renderExerciseList(list) {
    const container = document.getElementById('exerciseList');
    if (!container) return;
    container.innerHTML = '';
    list.forEach(item => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = item.name;
      container.appendChild(li);
    });
  }

  const searchInput = document.getElementById('exerciseSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = allExercises.filter(item => item.name.toLowerCase().includes(keyword));
      renderExerciseList(filtered);
    });
  }

  loadExercises();
});
