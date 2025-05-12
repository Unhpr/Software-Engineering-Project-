document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("exerciseForm");
  const nameInput = document.getElementById("exerciseInput");
  const exerciseList = document.getElementById("exerciseList"); 
  const searchInput = document.getElementById("exerciseSearch");

  let allExercises = [];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;

    try {
      const res = await fetch('/api/exercise/items', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error('Failed to save exercise');

      const savedItem = await res.json();
      allExercises.push(savedItem);
      renderExerciseList(allExercises);
      nameInput.value = "";
    } catch (err) {
      console.error('Error adding exercise:', err);
    }
  });

  async function loadExercises() {
    try {
      const res = await fetch('/api/exercise/items');
      if (!res.ok) throw new Error('Failed to load');
      allExercises = await res.json();
      renderExerciseList(allExercises);
    } catch (err) {
      console.error('Failed to load exercises:', err);
    }
  }

  function renderExerciseList(list) {
    if (!exerciseList) return;
    exerciseList.innerHTML = '';
    list.forEach(item => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      // name
      const span = document.createElement('span');
      span.textContent = item.name;

      // delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-sm btn-danger';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', async () => {
        if (!confirm('Delete this exercise?')) return;
        try {
          const res = await fetch(`/api/exercise/items/${item._id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Delete failed');
          // remove from local array + re-render
          allExercises = allExercises.filter(e => e._id !== item._id);
          renderExerciseList(allExercises);
        } catch (err) {
          console.error('Failed to delete:', err);
          alert('Could not delete exercise');
        }
      });

      li.appendChild(span);
      li.appendChild(delBtn);
      exerciseList.appendChild(li);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = allExercises.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
      renderExerciseList(filtered);
    });
  }

  loadExercises();
});
