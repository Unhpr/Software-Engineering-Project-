document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('dietForm');
  const list = document.getElementById('dietList');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('foodInput').value.trim();
    const calories = document.getElementById('caloriesInput').value;
    const mealType = document.getElementById('mealType').value;

    if (!name || !calories || !mealType) return alert('Fill all fields');

    const res = await fetch('/api/food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, calories, mealType })
    });
    if (res.ok) {
      form.reset();
      loadFood();
    } else {
      alert('Failed to add food');
    }
  });

  async function loadFood() {
    const res = await fetch('/api/food');
    const foods = await res.json();
    list.innerHTML = '';
    foods.forEach(item => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `${item.name} (${item.mealType}) - ${item.calories} kcal
        <button class="btn btn-sm btn-danger ms-2" data-id="${item._id}">Delete</button>`;
      list.appendChild(li);
    });

    list.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await fetch(`/api/food/${id}`, { method: 'DELETE' });
        loadFood();
      });
    });
  }

  loadFood();
});