// TaskFlow - Frontend Application Logic

// Auxiliary data preserved for emergency views
const vols=[
{n:'Arjun K',sk:'Boat rescue',z:'Velachery',s:'available'},
{n:'Meena R',sk:'First aid',z:'Tambaram',s:'busy'},
{n:'Karthik S',sk:'Logistics',z:'Adyar',s:'available'},
{n:'Divya P',sk:'Counselling',z:'Mudichur',s:'available'},
{n:'Ravi M',sk:'Driver · truck',z:'Perungudi',s:'busy'},
{n:'Fathima A',sk:'Medical',z:'Pallikaranai',s:'available'}];
const camps=[
{n:'Govt. School Camp',z:'Velachery',c:400,o:352},
{n:'Community Hall',z:'Tambaram',c:250,o:140},
{n:'Church Shelter',z:'Mudichur',c:180,o:171},
{n:'College Auditorium',z:'Adyar',c:600,o:210}];
const pts=[
{x:190,y:250,k:'inc',l:'Flooding · Velachery',d:'Water level 1.4 m. Boats needed.'},
{x:340,y:170,k:'inc',l:'Road cut-off · Tambaram',d:'Medical request pending.'},
{x:110,y:180,k:'cmp',l:'Community Hall',d:'140 / 250 occupied.'},
{x:250,y:320,k:'cmp',l:'Govt. School Camp',d:'352 / 400 occupied. Nearly full.'},
{x:400,y:300,k:'cmp',l:'College Auditorium',d:'210 / 600 occupied.'},
{x:230,y:215,k:'vol',l:'Team Alpha (4)',d:'En route to Velachery.'},
{x:320,y:240,k:'vol',l:'Team Bravo (3)',d:'Standing by, Adyar.'}];
const col={inc:'#ff5d6c',cmp:'#35d39a',vol:'#4f9dff'};

const $ = s => document.querySelector(s);
const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));

// Cached current tasks
let currentTasks = [];

// ==========================================
// 1. Dashboard & Statistics (Spring Boot API)
// ==========================================
async function loadStats() {
    try {
        const stats = await api.getDashboardStats();
        setBackendStatus(true);

        // Stats cards
        $('#stats').innerHTML = [
            ['Total Tasks', stats.totalTasks, 'var(--acc)'],
            ['To Do', stats.pendingTasks, 'var(--red)'],
            ['In Progress', stats.inProgressTasks, 'var(--amb)'],
            ['Completed', stats.completedTasks, 'var(--grn)'],
            ['Overdue', stats.overdueTasks, 'var(--vio)']
        ].map(s => `
            <div class="card stat">
                <span>${s[0]}</span>
                <b style="color:${s[2]}">${s[1]}</b>
            </div>
        `).join('');

        // Overdue Alert Banner
        const alertEl = $('#overdue-alert');
        if (stats.overdueTasks > 0) {
            alertEl.style.display = 'flex';
            $('#overdue-title').textContent = `${stats.overdueTasks} Overdue Task(s) Detected!`;
            $('#overdue-desc').textContent = 'These tasks have passed their due date and need immediate follow-up.';
        } else {
            alertEl.style.display = 'none';
        }

        // Status breakdown bars
        const completedPct = pct(stats.completedTasks, stats.totalTasks);
        const inProgressPct = pct(stats.inProgressTasks, stats.totalTasks);
        const todoPct = pct(stats.pendingTasks, stats.totalTasks);

        $('#res').innerHTML = `
            <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between">
                    <span>Completed</span>
                    <span class="sub">${stats.completedTasks} / ${stats.totalTasks} (${completedPct}%)</span>
                </div>
                <div class="bar"><div style="width:${completedPct}%;background:var(--grn)"></div></div>
            </div>
            <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between">
                    <span>In Progress</span>
                    <span class="sub">${stats.inProgressTasks} / ${stats.totalTasks} (${inProgressPct}%)</span>
                </div>
                <div class="bar"><div style="width:${inProgressPct}%;background:var(--amb)"></div></div>
            </div>
            <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between">
                    <span>To Do (Pending)</span>
                    <span class="sub">${stats.pendingTasks} / ${stats.totalTasks} (${todoPct}%)</span>
                </div>
                <div class="bar"><div style="width:${todoPct}%;background:var(--red)"></div></div>
            </div>
        `;

        // Urgent / High priority list
        const highTasks = await api.getTasks({ priority: 'HIGH' });
        if (highTasks.length === 0) {
            $('#urgent').innerHTML = '<div class="sub">No high priority tasks pending.</div>';
        } else {
            $('#urgent').innerHTML = highTasks.slice(0, 5).map(t => `
                <div class="row">
                    <div>
                        <b>${escapeHtml(t.title)}</b>
                        <div class="sub">Due: ${t.dueDate || 'No date'} ${t.overdue ? '· <span style="color:var(--red);font-weight:bold">OVERDUE</span>' : ''}</div>
                    </div>
                    <span class="tag ${t.status.toLowerCase()}">${t.status.replace('_', ' ')}</span>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Failed to load stats:', err);
        setBackendStatus(false);
    }
}

// ==========================================
// 2. Task List, Filtering & Search (REST API)
// ==========================================
async function loadTasks() {
    try {
        const status = $('#fs').value;
        const priority = $('#ft').value;
        const search = $('#search-box').value;

        $('#rq').innerHTML = '<tr><td colspan="6" class="sub" style="text-align:center;padding:20px">Loading tasks from MySQL...</td></tr>';

        currentTasks = await api.getTasks({ status, priority, search });
        setBackendStatus(true);

        if (!currentTasks || currentTasks.length === 0) {
            $('#rq').innerHTML = '<tr><td colspan="6" class="sub" style="text-align:center;padding:24px">No tasks found matching current filters.</td></tr>';
            return;
        }

        $('#rq').innerHTML = currentTasks.map(t => {
            const statusClass = t.status.toLowerCase();
            const priorityClass = t.priority.toLowerCase();
            const statusLabel = t.status.replace('_', ' ');

            let actionBtn = '';
            if (t.status === 'TODO') {
                actionBtn = `<button class="btn ghost" style="padding:4px 8px;font-size:12px" data-action="start" data-id="${t.id}">Start</button>`;
            } else if (t.status === 'IN_PROGRESS') {
                actionBtn = `<button class="btn ghost" style="padding:4px 8px;font-size:12px;color:var(--grn)" data-action="complete" data-id="${t.id}">Complete</button>`;
            }

            return `
                <tr>
                    <td><b>#${t.id}</b></td>
                    <td>
                        <div style="font-weight:600">${escapeHtml(t.title)}</div>
                        ${t.description ? `<div class="sub" style="max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(t.description)}</div>` : ''}
                    </td>
                    <td><span class="tag ${priorityClass}">${t.priority}</span></td>
                    <td><span class="tag ${statusClass}">${statusLabel}</span></td>
                    <td>
                        <span>${t.dueDate || '—'}</span>
                        ${t.overdue ? '<br><span class="tag overdue" style="font-size:10px;margin-top:4px;display:inline-block">OVERDUE</span>' : ''}
                    </td>
                    <td>
                        <div style="display:flex;gap:6px;align-items:center">
                            ${actionBtn}
                            <button class="btn ghost" style="padding:4px 8px;font-size:12px" data-action="edit" data-id="${t.id}">Edit</button>
                            <button class="btn ghost" style="padding:4px 8px;font-size:12px;color:var(--red)" data-action="delete" data-id="${t.id}">✕</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Failed to load tasks:', err);
        setBackendStatus(false);
        $('#rq').innerHTML = `<tr><td colspan="6" class="sub" style="color:var(--red);text-align:center;padding:20px">Error connecting to Spring Boot backend: ${err.message}</td></tr>`;
    }
}

// ==========================================
// 3. Task Modal & CRUD Operations
// ==========================================
function openTaskModal(task = null) {
    const modal = $('#task-modal');
    const form = $('#task-form');
    form.reset();

    if (task) {
        $('#modal-task-title').textContent = 'Edit Task #' + task.id;
        $('#task-id').value = task.id;
        $('#task-title-input').value = task.title || '';
        $('#task-desc-input').value = task.description || '';
        $('#task-status-input').value = task.status || 'TODO';
        $('#task-priority-input').value = task.priority || 'MEDIUM';
        $('#task-due-input').value = task.dueDate || '';
    } else {
        $('#modal-task-title').textContent = 'Create New Task';
        $('#task-id').value = '';
        $('#task-status-input').value = 'TODO';
        $('#task-priority-input').value = 'MEDIUM';
        $('#task-due-input').value = '';
    }

    modal.classList.add('on');
}

function closeTaskModal() {
    $('#task-modal').classList.remove('on');
}

$('#task-form').onsubmit = async (e) => {
    e.preventDefault();
    const id = $('#task-id').value;
    const taskData = {
        title: $('#task-title-input').value.trim(),
        description: $('#task-desc-input').value.trim(),
        status: $('#task-status-input').value,
        priority: $('#task-priority-input').value,
        dueDate: $('#task-due-input').value || null
    };

    try {
        if (id) {
            await api.updateTask(id, taskData);
        } else {
            await api.createTask(taskData);
        }
        closeTaskModal();
        await loadTasks();
        await loadStats();
    } catch (err) {
        alert('Failed to save task: ' + err.message);
    }
};

$('#open-new-task-btn').onclick = () => openTaskModal();
$('#close-task-modal').onclick = closeTaskModal;
$('#cancel-task-btn').onclick = closeTaskModal;

// Task table row actions: edit, delete, status toggle
$('#rq').onclick = async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (!id || !action) return;

    const task = currentTasks.find(t => String(t.id) === String(id));

    if (action === 'edit') {
        openTaskModal(task);
    } else if (action === 'delete') {
        if (confirm(`Are you sure you want to delete task #${id} "${task ? task.title : ''}"?`)) {
            try {
                await api.deleteTask(id);
                await loadTasks();
                await loadStats();
            } catch (err) {
                alert('Failed to delete task: ' + err.message);
            }
        }
    } else if (action === 'start') {
        try {
            await api.updateTask(id, { ...task, status: 'IN_PROGRESS' });
            await loadTasks();
            await loadStats();
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        }
    } else if (action === 'complete') {
        try {
            await api.updateTask(id, { ...task, status: 'COMPLETED' });
            await loadTasks();
            await loadStats();
        } catch (err) {
            alert('Failed to complete task: ' + err.message);
        }
    }
};

// Filter & search listeners
let searchTimer = null;
$('#search-box').oninput = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadTasks, 300);
};
$('#fs').onchange = loadTasks;
$('#ft').onchange = loadTasks;

// ==========================================
// 4. User Authentication UI
// ==========================================
function updateAuthUI() {
    const user = api.getUser();
    if (user && user.username) {
        $('#user-display').textContent = user.username;
        $('#logged-user-info').innerHTML = `<b>Signed in as:</b> ${escapeHtml(user.username)}<br><span class="sub">${escapeHtml(user.email || '')}</span>`;
        $('#login-form').style.display = 'none';
        $('#register-form').style.display = 'none';
        $('#auth-tabs').style.display = 'none';
        $('#logged-in-panel').style.display = 'block';
    } else {
        $('#user-display').textContent = 'Guest (Sign In)';
        $('#auth-tabs').style.display = 'flex';
        $('#logged-in-panel').style.display = 'none';
        showAuthTab('login');
    }
}

function showAuthTab(tab) {
    if (tab === 'login') {
        $('#tab-login').classList.add('on');
        $('#tab-register').classList.remove('on');
        $('#login-form').style.display = 'block';
        $('#register-form').style.display = 'none';
        $('#login-msg').textContent = '';
    } else {
        $('#tab-register').classList.add('on');
        $('#tab-login').classList.remove('on');
        $('#register-form').style.display = 'block';
        $('#login-form').style.display = 'none';
        $('#reg-msg').textContent = '';
    }
}

$('#tab-login').onclick = () => showAuthTab('login');
$('#tab-register').onclick = () => showAuthTab('register');

$('#login-form').onsubmit = async (e) => {
    e.preventDefault();
    $('#login-msg').textContent = '';
    try {
        await api.login($('#login-user').value.trim(), $('#login-pass').value);
        updateAuthUI();
        $('#auth-modal').classList.remove('on');
        loadTasks();
        loadStats();
    } catch (err) {
        $('#login-msg').textContent = err.message;
    }
};

$('#register-form').onsubmit = async (e) => {
    e.preventDefault();
    $('#reg-msg').textContent = '';
    try {
        await api.register($('#reg-user').value.trim(), $('#reg-email').value.trim(), $('#reg-pass').value);
        updateAuthUI();
        $('#auth-modal').classList.remove('on');
        loadTasks();
        loadStats();
    } catch (err) {
        $('#reg-msg').textContent = err.message;
    }
};

$('#logout-btn').onclick = () => {
    api.clearSession();
    updateAuthUI();
    $('#auth-modal').classList.remove('on');
    loadTasks();
    loadStats();
};

$('#auth-btn').onclick = () => {
    updateAuthUI();
    $('#auth-modal').classList.add('on');
};
$('#close-auth-modal').onclick = () => $('#auth-modal').classList.remove('on');

// Backend Status helper
function setBackendStatus(online) {
    const pill = $('#conn-pill');
    const text = $('#conn-text');
    const dot = pill.querySelector('.dot');
    if (online) {
        text.textContent = 'Backend Online';
        dot.style.background = 'var(--grn)';
    } else {
        text.textContent = 'Backend Offline';
        dot.style.background = 'var(--red)';
    }
}

// HTML escape helper
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ==========================================
// 5. Existing Tabs & Navigation Handling
// ==========================================
const titles = {
    overview: 'Dashboard',
    requests: 'Task Management',
    map: 'GIS Incident Map',
    volunteers: 'Volunteers',
    camps: 'Relief Camps',
    comms: 'Broadcast Center'
};

function show(v) {
    document.querySelectorAll('.view').forEach(e => e.classList.toggle('on', e.id === v));
    document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
    $('#title').textContent = titles[v] || 'TaskFlow';
    if (v === 'requests') loadTasks();
    if (v === 'overview') loadStats();
    if (v === 'volunteers') vl();
    if (v === 'camps') cp();
    if (v === 'map') mp();
    if (v === 'comms') loadBroadcasts();
}

$('#nav').onclick = e => {
    const b = e.target.closest('button');
    if (b && b.dataset.v) show(b.dataset.v);
};

// Toast notification helper
function showToast(message, isError = false) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.borderColor = isError ? 'var(--red)' : 'var(--acc)';
    toast.style.background = isError ? '#3b1822' : '#16294a';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3500);
}

// ==========================================
// 6. Volunteers (Spring Boot REST API)
// ==========================================
let currentVolunteers = [];
async function vl() {
    try {
        const res = await api.getVolunteers();
        currentVolunteers = Array.isArray(res) ? res : (res.data || []);
        if (currentVolunteers.length === 0) {
            $('#vl').innerHTML = '<div class="sub" style="grid-column:1/-1;text-align:center;padding:24px">No volunteers registered yet. Click "+ Register Volunteer" to add personnel.</div>';
            return;
        }
        $('#vl').innerHTML = currentVolunteers.map(v => `
            <div class="card">
                <div style="display:flex;gap:12px;align-items:center">
                    <div class="av">${escapeHtml((v.name || 'V')[0].toUpperCase())}</div>
                    <div style="min-width:0;flex:1">
                        <b>${escapeHtml(v.name)}</b>
                        <div class="sub">${escapeHtml(v.skill || 'General Support')} · ${escapeHtml(v.zone || 'Unassigned')}</div>
                        ${v.phone ? `<div class="sub" style="font-size:11px;color:var(--acc)">📞 ${escapeHtml(v.phone)}</div>` : ''}
                    </div>
                </div>
                <div class="row" style="border:0;padding-bottom:0;margin-top:10px">
                    <span class="tag ${v.status === 'available' ? 'available' : 'busy'}">${escapeHtml(v.status || 'available')}</span>
                    <button class="btn ghost" data-action="toggle-vol" data-id="${v.id}">${v.status === 'available' ? 'Deploy' : 'Release'}</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load volunteers:', err);
        $('#vl').innerHTML = `<div class="sub" style="grid-column:1/-1;color:var(--red);padding:20px">Error loading volunteers: ${err.message}</div>`;
    }
}

$('#vl').onclick = async e => {
    const btn = e.target.closest('button');
    if (!btn || btn.dataset.action !== 'toggle-vol') return;
    const id = btn.dataset.id;
    if (!id) return;
    try {
        await api.toggleVolunteerStatus(id);
        showToast('Volunteer status updated');
        await vl();
    } catch (err) {
        showToast('Failed to update status: ' + err.message, true);
    }
};

$('#open-vol-modal').onclick = () => {
    $('#vol-form').reset();
    $('#vol-modal').classList.add('on');
};
$('#close-vol-modal').onclick = () => $('#vol-modal').classList.remove('on');
$('#cancel-vol-btn').onclick = () => $('#vol-modal').classList.remove('on');

$('#vol-form').onsubmit = async e => {
    e.preventDefault();
    const data = {
        name: $('#vol-name').value.trim(),
        skill: $('#vol-skill').value.trim(),
        zone: $('#vol-zone').value.trim(),
        phone: $('#vol-phone').value.trim(),
        status: 'available'
    };
    try {
        await api.createVolunteer(data);
        $('#vol-modal').classList.remove('on');
        showToast('Volunteer registered successfully');
        await vl();
    } catch (err) {
        showToast('Failed to register volunteer: ' + err.message, true);
    }
};

// ==========================================
// 7. Relief Camps (Spring Boot REST API)
// ==========================================
let currentCamps = [];
async function cp() {
    try {
        const res = await api.getCamps();
        currentCamps = Array.isArray(res) ? res : (res.data || []);
        if (currentCamps.length === 0) {
            $('#cp').innerHTML = '<div class="sub" style="grid-column:1/-1;text-align:center;padding:24px">No relief camps registered. Click "+ Register Shelter" to add one.</div>';
            return;
        }
        $('#cp').innerHTML = currentCamps.map(c => {
            const p = pct(c.occupied || 0, c.capacity || 1);
            const k = p > 85 ? 'var(--red)' : p > 60 ? 'var(--amb)' : 'var(--grn)';
            return `
                <div class="card">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                        <b>${escapeHtml(c.name)}</b>
                        <span class="tag ${p > 85 ? 'critical' : p > 60 ? 'high' : 'done'}">${p}% Full</span>
                    </div>
                    <div class="sub" style="margin-top:4px">${escapeHtml(c.zone)} · ${c.occupied} of ${c.capacity} beds occupied</div>
                    <div class="bar"><div style="width:${p}%;background:${k}"></div></div>
                    <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
                        <button class="btn ghost" style="padding:4px 8px;font-size:12px" data-action="adjust-occ" data-id="${c.id}" data-delta="-10">-10</button>
                        <button class="btn ghost" style="padding:4px 8px;font-size:12px" data-action="adjust-occ" data-id="${c.id}" data-delta="10">+10</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Failed to load camps:', err);
        $('#cp').innerHTML = `<div class="sub" style="grid-column:1/-1;color:var(--red);padding:20px">Error loading camps: ${err.message}</div>`;
    }
}

$('#cp').onclick = async e => {
    const btn = e.target.closest('button');
    if (!btn || btn.dataset.action !== 'adjust-occ') return;
    const id = btn.dataset.id;
    const delta = parseInt(btn.dataset.delta, 10);
    const camp = currentCamps.find(c => String(c.id) === String(id));
    if (!camp) return;

    const newOccupied = Math.max(0, Math.min(camp.capacity, (camp.occupied || 0) + delta));
    try {
        await api.updateCampOccupancy(id, newOccupied, camp.capacity);
        showToast(`Camp occupancy updated to ${newOccupied}`);
        await cp();
    } catch (err) {
        showToast('Failed to update camp occupancy: ' + err.message, true);
    }
};

$('#open-camp-modal').onclick = () => {
    $('#camp-form').reset();
    $('#camp-modal').classList.add('on');
};
$('#close-camp-modal').onclick = () => $('#camp-modal').classList.remove('on');
$('#cancel-camp-btn').onclick = () => $('#camp-modal').classList.remove('on');

$('#camp-form').onsubmit = async e => {
    e.preventDefault();
    const data = {
        name: $('#camp-name').value.trim(),
        zone: $('#camp-zone').value.trim(),
        capacity: parseInt($('#camp-cap').value, 10) || 100,
        occupied: parseInt($('#camp-occ').value, 10) || 0
    };
    try {
        await api.createCamp(data);
        $('#camp-modal').classList.remove('on');
        showToast('Relief camp registered successfully');
        await cp();
    } catch (err) {
        showToast('Failed to register camp: ' + err.message, true);
    }
};

// ==========================================
// 8. GIS Incident Map (Spring Boot REST API)
// ==========================================
let currentMapPoints = [];
async function mp() {
    try {
        const res = await api.getIncidents();
        currentMapPoints = Array.isArray(res) ? res : (res.data || []);
        if (currentMapPoints.length === 0) {
            // Fallback to static points if none returned
            currentMapPoints = pts;
        }
        $('#mks').innerHTML = currentMapPoints.map((p, i) => `
            <g class="mk" data-i="${i}" style="cursor:pointer">
                <circle cx="${p.x}" cy="${p.y}" r="16" fill="${col[p.kind] || col.inc}" opacity=".22"/>
                <circle cx="${p.x}" cy="${p.y}" r="7" fill="${col[p.kind] || col.inc}" stroke="#0b0f17" stroke-width="2"/>
            </g>
        `).join('');
    } catch (err) {
        console.error('Failed to load map incidents:', err);
        // Fallback gracefully
        $('#mks').innerHTML = pts.map((p, i) => `
            <g class="mk" data-i="${i}" style="cursor:pointer">
                <circle cx="${p.x}" cy="${p.y}" r="16" fill="${col[p.k]}" opacity=".22"/>
                <circle cx="${p.x}" cy="${p.y}" r="7" fill="${col[p.k]}" stroke="#0b0f17" stroke-width="2"/>
            </g>
        `).join('');
    }
}

$('#mks').onclick = e => {
    const g = e.target.closest('.mk');
    if (!g) return;
    const p = currentMapPoints[g.dataset.i] || pts[g.dataset.i];
    if (p) {
        $('#info').innerHTML = `<b>${escapeHtml(p.label || p.l)}</b><div class="sub">${escapeHtml(p.description || p.d)}</div>`;
    }
};

// ==========================================
// 9. Broadcast Center (Spring Boot REST API)
// ==========================================
async function loadBroadcasts() {
    try {
        const res = await api.getBroadcasts();
        const logs = Array.isArray(res) ? res : (res.data || []);
        const l = $('#log');
        if (!logs || logs.length === 0) {
            l.innerHTML = '<div class="sub">Nothing sent yet. Use the form on the left to broadcast alerts.</div>';
            return;
        }
        l.innerHTML = logs.map(msg => `
            <div class="msg">
                <div class="sub">${escapeHtml(msg.channel)} → ${escapeHtml(msg.audience)} · ${msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</div>
                <div>${escapeHtml(msg.message)}</div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load broadcasts:', err);
    }
}

$('#send').onclick = async () => {
    const t = $('#tx').value.trim();
    if (!t) {
        showToast('Please type a message before broadcasting', true);
        return;
    }
    const data = {
        audience: $('#aud').value,
        channel: $('#ch').value,
        message: t
    };
    try {
        await api.sendBroadcast(data);
        $('#tx').value = '';
        showToast('Broadcast dispatched successfully');
        await loadBroadcasts();
    } catch (err) {
        showToast('Failed to dispatch broadcast: ' + err.message, true);
    }
};

// Initialize
updateAuthUI();
loadStats();
loadTasks();
vl();
cp();
mp();
loadBroadcasts();
