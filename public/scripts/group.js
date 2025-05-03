document.addEventListener("DOMContentLoaded", () => {
    const createForm = document.getElementById("createForm");
    const joinForm = document.getElementById("joinForm");
    const memberList = document.getElementById("memberList");
  
    const members = [];
  
    function renderMembers() {
      memberList.innerHTML = "";
      members.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        memberList.appendChild(li);
      });
    }
  
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("groupName").value.trim();
      if (name) {
        members.push("You (created " + name + ")");
        renderMembers();
        createForm.reset();
      }
    });
  
    joinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = document.getElementById("inviteCode").value.trim();
      if (code) {
        members.push("You (joined via code: " + code + ")");
        renderMembers();
        joinForm.reset();
      }
    });
  });
  