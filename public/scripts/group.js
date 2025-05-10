document.addEventListener("DOMContentLoaded", () => {
  const createForm = document.getElementById("createForm");
  const joinForm = document.getElementById("joinForm");
  const goalForm = document.getElementById("goalForm");
  const memberList = document.getElementById("memberList");
  const goalList = document.getElementById("goalList");
  const groupList = document.getElementById("myGroups");
  const leaveGroupBtn = document.getElementById("leaveGroupBtn");
  const deleteGroupBtn = document.getElementById("deleteGroupBtn");

  async function loadGoals() {
    try {
      const res = await fetch('/api/goal');
      const goals = await res.json();
      goalList.innerHTML = '';
      goals.forEach(g => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${g.goalType || "Goal"}: ${g.target || g.goal || "No value"}`;
        goalList.appendChild(li);
      });
    } catch (err) {
      console.error('Failed to load goals', err);
    }
  }

  async function loadMyGroups() {
    try {
      const res = await fetch("/api/group/mine");
      const groups = await res.json();
      const container = document.getElementById("myGroups");
      if (container) {
        container.innerHTML = '';
        groups.forEach(g => {
          const li = document.createElement("li");
          li.textContent = `${g.name} (Code: ${g.inviteCode})`;
          li.classList.add("list-group-item");
          container.appendChild(li);
        });
      }
    } catch (err) {
      console.error("Failed to load user groups", err);
    }
  }

  async function loadMembers() {
    try {
      const res = await fetch("/api/group/members");
      const users = await res.json();
      memberList.innerHTML = '';
      users.forEach(u => {
        const li = document.createElement("li");
        li.textContent = `${u.username} (${u.email})`;
        li.classList.add("list-group-item");
        memberList.appendChild(li);
      });
    } catch (err) {
      console.error("Failed to load members", err);
    }
  }

  if (createForm) {
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
          alert(result.message || "Group created successfully!");
          loadMyGroups();
          loadMembers();
          createForm.reset();
        } catch (err) {
          console.error(err);
          alert("Failed to create group.");
        }
      }
    });
  }

  if (joinForm) {
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
          alert(result.message || "Joined group successfully!");
          loadMyGroups();
          loadMembers();
          joinForm.reset();
        } catch (err) {
          console.error(err);
          alert("Failed to join group.");
        }
      }
    });
  }

  if (goalForm) {
    goalForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const goalType = document.getElementById("goalType").value.trim();
      const target = document.getElementById("goalTarget").value.trim();
      const deadline = document.getElementById("goalDeadline").value;

      if (goalType && target) {
        try {
          const res = await fetch("/api/goal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ goalType, target, deadline })
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
  }

  if (leaveGroupBtn) {
    leaveGroupBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to leave the group?")) {
        try {
          await fetch("/api/group/leave", { method: "POST" });
          alert("You left the group.");
          loadMyGroups();
          loadMembers();
        } catch (err) {
          console.error(err);
          alert("Failed to leave group.");
        }
      }
    });
  }

  if (deleteGroupBtn) {
    deleteGroupBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete the group? This cannot be undone.")) {
        try {
          await fetch("/api/group/delete", { method: "DELETE" });
          alert("Group deleted.");
          loadMyGroups();
          loadMembers();
        } catch (err) {
          console.error(err);
          alert("Failed to delete group.");
        }
      }
    });
  }

  loadGoals();
  loadMyGroups();
  loadMembers();
});
