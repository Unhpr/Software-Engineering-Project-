document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("exerciseForm");
  const nameInput = document.getElementById("exerciseInput");
  const typeInput = document.getElementById("type");
  const durationInput = document.getElementById("duration");
  const distanceInput = document.getElementById("distance");
  const exerciseList = document.getElementById("exerciseList");

  async function loadExercises() {
    try {
      const res = await fetch('/api/exercise/items');
      const exercises = await res.json();
      exerciseList.innerHTML = '';
      exercises.forEach(ex => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${ex.name} (${ex.type}) - ${ex.duration || 0}min, ${ex.distance || 0}km`;
        exerciseList.appendChild(li);
      });
    } catch (err) {
      console.error("Failed to load exercises:", err);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const type = typeInput.value;
    const duration = Number(durationInput.value);
    const distance = Number(distanceInput.value);

    if (!name || !type) return alert("Please complete all fields.");

    try {
      const res = await fetch('/api/exercise/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, duration, distance })
      });

      const result = await res.json();
      alert(result.message || 'Exercise added!');
      await loadExercises();
      form.reset();
    } catch (err) {
      console.error("Error submitting exercise:", err);
      alert("Failed to submit exercise.");
    }
  });

  loadExercises();
});
