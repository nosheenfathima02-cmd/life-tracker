// ================================
// Life Tracker App - FINAL FIXED JS
// ================================

// -------- Global State --------
let appData = {
    personal: { education: [], visa: [], license: [], customPersonal: [] },
    health: { dailyChecks: {}, notes: [] },
    professional: {
        schoolTasks: [],
        videoTasks: [],
        familyTasks: [],
        websiteTasks: [],
        socialTasks: [],
        lessonPlans: [],
        reminders: []
    }
};

let currentModal = null;
let deferredPrompt = null;

// -------- Google Drive Config (MODERN) --------
const CLIENT_ID =
  "31374902699-vd8icu45ha7uden93k8kl8mc6bsbql3l.apps.googleusercontent.com";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
let accessToken = null;

// -------- App Init --------
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderAll();
    checkDailyReset();

    // PWA install
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const el = document.getElementById('installPrompt');
        if (el) el.style.display = 'block';
    });

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.error('SW error', err));
    }

    setInterval(checkReminders, 60000);
    checkReminders();

    // Drive button
    const driveBtn = document.getElementById("driveSyncBtn");
    if (driveBtn) {
        driveBtn.addEventListener("click", requestDriveBackup);
    }
});

// -------- Tabs --------
function switchTab(tabName, event) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    if (event) event.target.classList.add('active');
    const target = document.getElementById(tabName);
    if (target) target.classList.add('active');
}

// -------- Modal --------
function openModal(type) {
    currentModal = type;
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body) return;

    const templates = {
        education: `
            <h3>Add Education</h3>
            <input id="edu-title" placeholder="Title">
            <textarea id="edu-details"></textarea>
            <input type="date" id="edu-deadline">
            <button onclick="addItem('education')">Add</button>
        `,
        reminders: `
            <h3>Add Reminder</h3>
            <input id="reminder-title" placeholder="Title">
            <textarea id="reminder-details"></textarea>
            <input type="datetime-local" id="reminder-time">
            <select id="reminder-repeat">
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
            <button onclick="addItem('reminders')">Add</button>
        `
    };

    body.innerHTML = templates[type] || '<p>Not implemented</p>';
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
    currentModal = null;
}

// -------- Add Items --------
function addItem(type) {
    const id = Date.now();
    let item;

    if (type === 'education') {
        item = {
            id,
            title: val('edu-title'),
            details: val('edu-details'),
            deadline: val('edu-deadline'),
            completed: false
        };
        appData.personal.education.push(item);
    }

    if (type === 'reminders') {
        item = {
            id,
            title: val('reminder-title'),
            details: val('reminder-details'),
            time: val('reminder-time'),
            repeat: val('reminder-repeat'),
            active: true
        };
        appData.professional.reminders.push(item);
    }

    saveToLocalStorage();
    renderAll();
    closeModal();
}

// -------- Render --------
function renderAll() {
    renderList('education-list', appData.personal.education, 'education');
    renderList('reminders-list', appData.professional.reminders, 'reminders', true);
}

function renderList(id, list, type, isReminder = false) {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = list.map(item => `
        <div class="item ${item.completed ? 'completed' : ''}">
            ${!isReminder ? `
                <input type="checkbox" ${item.completed ? 'checked' : ''}
                    onchange="toggleComplete('${type}', ${item.id})">
            ` : ''}
            <div>
                <strong>${item.title}</strong><br>
                ${item.details || ''}
                ${item.time ? `<br><small>${new Date(item.time).toLocaleString()}</small>` : ''}
            </div>
            <button onclick="deleteItem('${type}', ${item.id})">Delete</button>
        </div>
    `).join('');
}

// -------- Update / Delete --------
function toggleComplete(type, id) {
    const item = findItem(type, id);
    if (!item) return;
    item.completed = !item.completed;
    saveToLocalStorage();
    renderAll();
}

function deleteItem(type, id) {
    const map = {
        education: appData.personal.education,
        reminders: appData.professional.reminders
    };
    map[type] = map[type].filter(i => i.id !== id);
    saveToLocalStorage();
    renderAll();
}

function findItem(type, id) {
    const map = {
        education: appData.personal.education,
        reminders: appData.professional.reminders
    };
    return map[type].find(i => i.id === id);
}

// -------- Local Storage --------
function saveToLocalStorage() {
    localStorage.setItem('lifeTrackerData', JSON.stringify(appData));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('lifeTrackerData');
    if (data) appData = JSON.parse(data);
}

// -------- Health Reset --------
function checkDailyReset() {
    const today = new Date().toDateString();
    if (localStorage.getItem('lastHealthCheck') !== today) {
        localStorage.setItem('lastHealthCheck', today);
    }
}

// -------- Notifications --------
function checkReminders() {
    const now = new Date();
    appData.professional.reminders.forEach(r => {
        if (!r.active) return;
        if (new Date(r.time) <= now) {
            sendNotification(r);
            if (r.repeat === 'once') r.active = false;
            saveToLocalStorage();
        }
    });
}

function sendNotification(reminder) {
    if (Notification.permission === 'granted') {
        new Notification(`⏰ ${reminder.title}`, {
            body: reminder.details,
            tag: reminder.id
        });
    }
}

// -------- PWA Install --------
function installApp() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(() => {
        deferredPrompt = null;
        const el = document.getElementById('installPrompt');
        if (el) el.style.display = 'none';
    });
}

// -------- GOOGLE DRIVE BACKUP (SAFE & MODERN) --------
function requestDriveBackup() {
    const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: DRIVE_SCOPE,
        callback: (response) => {
            if (response.error) {
                alert("❌ Google login failed");
                return;
            }
            accessToken = response.access_token;
            backupToDrive();
        },
    });

    tokenClient.requestAccessToken();
}

async function backupToDrive() {
    const data = localStorage.getItem("lifeTrackerData");
    if (!data) {
        alert("⚠️ No data to back up");
        return;
    }

    const metadata = {
        name: "life-tracker-backup.json",
        parents: ["appDataFolder"],
    };

    const boundary = "-------314159265358979323846";
    const body =
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        JSON.stringify(metadata) +
        `\r\n--${boundary}\r\n` +
        `Content-Type: application/json\r\n\r\n` +
        data +
        `\r\n--${boundary}--`;

    await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": `multipart/related; boundary=${boundary}`,
            },
            body,
        }
    );

    alert("✅ Backup saved safely to Google Drive");
}

// -------- Helpers --------
function val(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}
