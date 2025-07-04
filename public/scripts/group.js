document.addEventListener('DOMContentLoaded', () => {
  let selectedId = null;
  const createForm    = document.getElementById('createForm');
  const joinForm      = document.getElementById('joinForm');
  const myGroupsList  = document.getElementById('myGroups');
  const memberList    = document.getElementById('memberList');
  const leaveBtn      = document.getElementById('leaveGroupBtn');
  const deleteBtn     = document.getElementById('deleteGroupBtn');

  async function loadGroups() {
    let groups = [];
    try {
      const res = await fetch('/api/group/mine');
      if (!res.ok) {
        const err = await res.json();
        console.error('Load groups failed:', err);
      } else {
        groups = await res.json();   
      }
    } catch (e) {
      console.error('Network error loading groups:', e);
    }
  
    // reset UI
    myGroupsList.innerHTML = '';
    memberList.innerHTML   = '';
    selectedId             = null;
    leaveBtn.disabled      = true;
    deleteBtn.disabled     = true;
  
    // repopulate
    groups.forEach(g => {
      const li = document.createElement('li');
      li.textContent           = g.name;
      li.dataset.id            = g._id;
      li.dataset.canDelete     = g.canDelete; 
      li.className             = 'list-group-item list-group-item-action';
      li.onclick               = () => selectGroup(li);
      myGroupsList.appendChild(li);
    });
  }
  function selectGroup(li) {
    document.querySelectorAll('#myGroups li')
      .forEach(n => n.classList.remove('active'));
    li.classList.add('active');
    selectedId     = li.dataset.id;
    leaveBtn.disabled  = false;
    deleteBtn.disabled = li.dataset.canDelete !== 'true';
    loadMembers();
  }

  async function loadMembers() {
    if (!selectedId) return;
    const res = await fetch(`/api/group/members/${selectedId}`);
    const members = await res.json();
    memberList.innerHTML = '';
    members.forEach(m => {
      const li = document.createElement('li');
      li.textContent = m.username;
      li.className = 'list-group-item';
      memberList.appendChild(li);
    });
  }

  createForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('groupName').value.trim();
    if (!name) return alert('Enter a group name');
    await fetch('/api/group/create', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name })
    });
    createForm.reset();
    loadGroups();
  });

  joinForm.addEventListener('submit', async e => {
    e.preventDefault();
    const identifier = document.getElementById('groupIdentifier').value.trim();
    if (!identifier) return alert('Enter a group name or code');
  
    try {
      const res = await fetch('/api/group/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await res.json();
  
      if (!res.ok) {
        if (res.status === 404)      return alert('No group matches that name or code.');
        if (res.status === 400)      return alert(data.error);
        return alert('Error joining group: ' + data.error);
      }
  
      joinForm.reset();
      loadGroups();
    } catch (err) {
      console.error('Network error joining group:', err);
      alert('Network error — please try again.');
    }
  });
  



  leaveBtn.addEventListener('click', async () => {
    if (!selectedId) return;
    await fetch(`/api/group/leave/${selectedId}`, { method: 'POST' });
    loadGroups();
  });

  deleteBtn.addEventListener('click', async () => {
    if (!selectedId) return;
    if (!confirm('Really delete this group?')) return;
    await fetch(`/api/group/delete/${selectedId}`, { method: 'DELETE' });
    loadGroups();
  });

  loadGroups();
});
