document.addEventListener("DOMContentLoaded", () => {
  const createForm = document.getElementById("createForm");
  const joinForm = document.getElementById("joinForm");
  const goalForm = document.getElementById("goalForm");
  const memberList = document.getElementById("memberList");
  const goalList = document.getElementById("goalList");

  const members = [];

  function renderMembers() {
    memberList.innerHTML = "";
    members.forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      li.classList.add("list-group-item");
      memberList.appendChild(li);
    });
  }

  async function loadGoals() {
    try {
      const res = await fetch('/api/goal/all');
      const goals = await res.json();
      goalList.innerHTML = '';
      goals.forEach(g => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${g.email}: ${g.goal}`;
        goalList.appendChild(li);
      });
    } catch (err) {
      console.error('Failed to load goals', err);
    }
  }

  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("groupName").value.trim();
    if (name) {
      try {
        const res = await fetch("/api/group/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        const result = await res.json();
        alert(result.message || "Group created!");
        members.push("You (created " + name + ")");
        renderMembers();
        createForm.reset();
      } catch (err) {
        console.error(err);
        alert("Failed to create group.");
      }
    }
  });

  joinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = document.getElementById("inviteCode").value.trim();
    if (code) {
      try {
        const res = await fetch("/api/group/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteCode: code })
        });
        const result = await res.json();
        alert(result.message || "Joined group!");
        members.push("You (joined via code: " + code + ")");
        renderMembers();
        joinForm.reset();
      } catch (err) {
        console.error(err);
        alert("Failed to join group.");
      }
    }
  });

  goalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const goal = document.getElementById("goal").value.trim();
    if (email && goal) {
      try {
        const res = await fetch("/api/goal/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, goal })
        });
        const result = await res.json();
        alert(result.message || "Goal submitted!");
        goalForm.reset();
        await loadGoals(); 
      } catch (err) {
        console.error(err);
        alert("Failed to submit goal.");
      }
    }
  });


  loadGoals();
});
