// ================================
// Life Tracker App - COMPLETE VERSION
// All features fully implemented
// ================================

// -------- Configuration --------
const GOOGLE_CONFIG = {
    CLIENT_ID: '31374902699-vd8icu45ha7uden93k8kl8mc6bsbql3l.apps.googleusercontent.com',
    API_KEY: 'AIzaSyCQUVzf1r3kvGKZ5VTjKF-7tX6j3C6R0xY', // Replace with your API key from Google Cloud Console
    DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    SCOPES: 'https://www.googleapis.com/auth/drive.file'
};

// -------- Global State --------
let appData = {
    personal: {
        education: [],
        visa: [],
        license: [],
        custom: {}
    },
    health: {
        dailyHabits: {
            wokeUp: false,
            drankWater: false,
            ateVeg: false,
            lastReset: new Date().toDateString()
        },
        notes: []
    },
    professional: {
        school: [],
        video: [],
        family: [],
        website: [],
        social: [],
        lessonPlans: {
            grade9: [],
            grade8: [],
            grade7: []
        },
        reminders: []
    }
};

let gapiInited = false;
let gisInited = false;
let tokenClient;
let currentModal = null;

// -------- Initialization --------
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Life Tracker App...');
    
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Render all sections
    renderAll();
    
    // Check if daily habits need reset
    checkDailyReset();
    
    // Load Google API
    loadGoogleAPI();
    
    // Register service worker
    registerServiceWorker();
    
    // Check for pending reminders
    setInterval(checkReminders, 60000); // Check every minute
    checkReminders();
    
    console.log('✅ App initialized successfully!');
});

// -------- Service Worker --------
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('✅ Service Worker registered'))
            .catch(err => console.error('❌ Service Worker error:', err));
    }
}

// -------- Google API Loading --------
function loadGoogleAPI() {
    // Load Google Identity Services
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CONFIG.CLIENT_ID,
            scope: GOOGLE_CONFIG.SCOPES,
            callback: handleAuthCallback
        });
        gisInited = true;
        console.log('✅ Google Identity Services loaded');
    };
    document.head.appendChild(gisScript);
    
    // Load Google API Client
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
        gapi.load('client', async () => {
            await gapi.client.init({
                apiKey: GOOGLE_CONFIG.API_KEY,
                discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS
            });
            gapiInited = true;
            console.log('✅ Google API Client loaded');
        });
    };
    document.head.appendChild(gapiScript);
}

// -------- Event Listeners Setup --------
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Notification button
    const notifBtn = document.getElementById('enable-notifications');
    if (notifBtn) notifBtn.addEventListener('click', enableNotifications);
    
    // Google Drive sync button
    const syncBtn = document.getElementById('sync-drive');
    if (syncBtn) syncBtn.addEventListener('click', syncWithDrive);
    
    // Install app button
    const installBtn = document.getElementById('install-app');
    if (installBtn) installBtn.addEventListener('click', installApp);
    
    // Personal tab buttons
    addButtonListener('add-education', () => openModal('education'));
    addButtonListener('add-visa', () => openModal('visa'));
    addButtonListener('add-license', () => openModal('license'));
    addButtonListener('add-custom-category', addCustomCategory);
    
    // Health tab
    addCheckboxListener('habit-wakeup', 'wokeUp');
    addCheckboxListener('habit-water', 'drankWater');
    addCheckboxListener('habit-veg', 'ateVeg');
    addButtonListener('add-health-note', () => openModal('healthNote'));
    
    // Professional tab buttons
    addButtonListener('add-school-task', () => openModal('school'));
    addButtonListener('add-video-task', () => openModal('video'));
    addButtonListener('add-family-task', () => openModal('family'));
    addButtonListener('add-website-task', () => openModal('website'));
    addButtonListener('add-social-task', () => openModal('social'));
    addButtonListener('add-lesson-g9', () => openModal('lessonG9'));
    addButtonListener('add-lesson-g8', () => openModal('lessonG8'));
    addButtonListener('add-lesson-g7', () => openModal('lessonG7'));
    addButtonListener('add-reminder', () => openModal('reminder'));
    
    // Modal close button
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) closeModal();
    });
}

function addButtonListener(id, handler) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', handler);
    } else {
        console.warn(`Button not found: ${id}`);
    }
}

function addCheckboxListener(id, habitKey) {
    const checkbox = document.getElementById(id);
    if (checkbox) {
        checkbox.checked = appData.health.dailyHabits[habitKey];
        checkbox.addEventListener('change', function() {
            appData.health.dailyHabits[habitKey] = this.checked;
            saveToLocalStorage();
        });
    }
}

// -------- Tab Switching --------
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to selected tab
    const btn = document.querySelector(`[data-tab="${tabName}"]`);
    if (btn) btn.classList.add('active');
    
    const content = document.getElementById(tabName);
    if (content) content.classList.add('active');
}

// -------- Modal Management --------
function openModal(type) {
    currentModal = type;
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    
    if (!modal || !title || !body) {
        console.error('Modal elements not found!');
        return;
    }
    
    const templates = {
        education: {
            title: 'Add Education Item',
            html: `
                <input type="text" id="input-title" placeholder="Title (e.g., Complete Master's Degree)" required>
                <textarea id="input-details" placeholder="Details..." rows="3"></textarea>
                <input type="date" id="input-deadline">
                <button onclick="submitModal('education')" class="btn-primary">Add Education Item</button>
            `
        },
        visa: {
            title: 'Add Visa Process Item',
            html: `
                <input type="text" id="input-title" placeholder="Title (e.g., Submit Documents)" required>
                <textarea id="input-details" placeholder="Details..." rows="3"></textarea>
                <select id="input-status">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <input type="date" id="input-deadline">
                <button onclick="submitModal('visa')" class="btn-primary">Add Visa Item</button>
            `
        },
        license: {
            title: 'Add License Item',
            html: `
                <input type="text" id="input-title" placeholder="Title (e.g., Book Road Test)" required>
                <textarea id="input-details" placeholder="Details..." rows="3"></textarea>
                <input type="date" id="input-deadline">
                <button onclick="submitModal('license')" class="btn-primary">Add License Item</button>
            `
        },
        healthNote: {
            title: 'Add Health Note',
            html: `
                <textarea id="input-note" placeholder="Health note (e.g., Weight: 70kg, Felt energetic today)" rows="4" required></textarea>
                <input type="date" id="input-date" value="${new Date().toISOString().split('T')[0]}">
                <button onclick="submitModal('healthNote')" class="btn-primary">Add Note</button>
            `
        },
        school: {
            title: 'Add School Task',
            html: `
                <input type="text" id="input-title" placeholder="Task title" required>
                <textarea id="input-details" placeholder="Details..." rows="3"></textarea>
                <input type="date" id="input-deadline">
                <button onclick="submitModal('school')" class="btn-primary">Add Task</button>
            `
        },
        video: {
            title: 'Add Video Creation Task',
            html: `
                <input type="text" id="input-title" placeholder="Video title" required>
                <textarea id="input-details" placeholder="Video description, script notes..." rows="3"></textarea>
                <input type="date" id="input-deadline">
                <button onclick="submitModal('video')" class="btn-primary">Add Video Task</button>
            `
        },
        family: {
            title: 'Update Family Information',
            html: `
                <input type="text" id="input-title" placeholder="What to update" required>
                <textarea id="input-details" placeholder="Details..." rows="3"></textarea>
                <button onclick="submitModal('family')" class="btn-primary">Add Family Task</button>
            `
        },
        website: {
            title: 'Add Website Update Task',
            html: `
                <input type="text" id="input-title" placeholder="Website task" required>
                <textarea id="input-details" placeholder="What needs to be updated..." rows="3"></textarea>
                <button onclick="submitModal('website')" class="btn-primary">Add Website Task</button>
            `
        },
        social: {
            title: 'Add Social Media Task',
            html: `
                <input type="text" id="input-title" placeholder="Social media task" required>
                <textarea id="input-details" placeholder="Platform, content idea..." rows="3"></textarea>
                <button onclick="submitModal('social')" class="btn-primary">Add Social Task</button>
            `
        },
        lessonG9: {
            title: 'Add Grade 9 Lesson Plan',
            html: `
                <input type="text" id="input-title" placeholder="Lesson title" required>
                <textarea id="input-details" placeholder="Lesson content, objectives..." rows="4"></textarea>
                <input type="date" id="input-date" value="${new Date().toISOString().split('T')[0]}">
                <button onclick="submitModal('lessonG9')" class="btn-primary">Add Lesson Plan</button>
            `
        },
        lessonG8: {
            title: 'Add Grade 8 Lesson Plan',
            html: `
                <input type="text" id="input-title" placeholder="Lesson title" required>
                <textarea id="input-details" placeholder="Lesson content, objectives..." rows="4"></textarea>
                <input type="date" id="input-date" value="${new Date().toISOString().split('T')[0]}">
                <button onclick="submitModal('lessonG8')" class="btn-primary">Add Lesson Plan</button>
            `
        },
        lessonG7: {
            title: 'Add Grade 7 Lesson Plan',
            html: `
                <input type="text" id="input-title" placeholder="Lesson title" required>
                <textarea id="input-details" placeholder="Lesson content, objectives..." rows="4"></textarea>
                <input type="date" id="input-date" value="${new Date().toISOString().split('T')[0]}">
                <button onclick="submitModal('lessonG7')" class="btn-primary">Add Lesson Plan</button>
            `
        },
        reminder: {
            title: 'Add Schedule Reminder',
            html: `
                <input type="text" id="input-title" placeholder="Reminder title (e.g., Grade 9 Class)" required>
                <textarea id="input-details" placeholder="Details (e.g., Room 204, Topic: Algebra)" rows="2"></textarea>
                <input type="datetime-local" id="input-datetime" required>
                <select id="input-repeat">
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                <button onclick="submitModal('reminder')" class="btn-primary">Add Reminder</button>
            `
        }
    };
    
    const template = templates[type];
    if (template) {
        title.textContent = template.title;
        body.innerHTML = template.html;
        modal.style.display = 'block';
    } else {
        console.error('Unknown modal type:', type);
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
    currentModal = null;
}

function submitModal(type) {
    const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    };
    
    const item = {
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    
    // Add type-specific fields
    switch(type) {
        case 'education':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.deadline = getVal('input-deadline');
            item.completed = false;
            if (!item.title) return alert('Please enter a title');
            appData.personal.education.push(item);
            break;
            
        case 'visa':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.status = getVal('input-status');
            item.deadline = getVal('input-deadline');
            item.completed = false;
            if (!item.title) return alert('Please enter a title');
            appData.personal.visa.push(item);
            break;
            
        case 'license':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.deadline = getVal('input-deadline');
            item.completed = false;
            if (!item.title) return alert('Please enter a title');
            appData.personal.license.push(item);
            break;
            
        case 'healthNote':
            item.note = getVal('input-note');
            item.date = getVal('input-date');
            if (!item.note) return alert('Please enter a note');
            appData.health.notes.push(item);
            break;
            
        case 'school':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.deadline = getVal('input-deadline');
            item.completed = false;
            if (!item.title) return alert('Please enter a title');
            appData.professional.school.push(item);
            break;
            
        case 'video':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.deadline = getVal('input-deadline');
            item.completed = false;
            if (!item.title) return alert('Please enter a title');
            appData.professional.video.push(item);
            break;
            
        case 'family':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.completed = false;
            if (!item.title) return alert('Please enter a title');
            appData.professional.family.push(item);
            break;
            
        case 'website':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.completed = false;
            if (!item.title) return alert('Please enter a title');
            appData.professional.website.push(item);
            break;
            
        case 'social':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.completed = false;
            if (!item.title) return alert('Please enter a title');
            appData.professional.social.push(item);
            break;
            
        case 'lessonG9':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.date = getVal('input-date');
            if (!item.title) return alert('Please enter a title');
            appData.professional.lessonPlans.grade9.push(item);
            break;
            
        case 'lessonG8':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.date = getVal('input-date');
            if (!item.title) return alert('Please enter a title');
            appData.professional.lessonPlans.grade8.push(item);
            break;
            
        case 'lessonG7':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.date = getVal('input-date');
            if (!item.title) return alert('Please enter a title');
            appData.professional.lessonPlans.grade7.push(item);
            break;
            
        case 'reminder':
            item.title = getVal('input-title');
            item.details = getVal('input-details');
            item.datetime = getVal('input-datetime');
            item.repeat = getVal('input-repeat');
            item.active = true;
            if (!item.title || !item.datetime) return alert('Please fill in all required fields');
            appData.professional.reminders.push(item);
            scheduleNotification(item);
            break;
            
        default:
            console.error('Unknown submit type:', type);
            return;
    }
    
    saveToLocalStorage();
    renderAll();
    closeModal();
}

// -------- Custom Category --------
function addCustomCategory() {
    const name = prompt('Enter custom category name:');
    if (!name || !name.trim()) return;
    
    const key = name.toLowerCase().replace(/\s+/g, '-');
    if (appData.personal.custom[key]) {
        alert('Category already exists!');
        return;
    }
    
    appData.personal.custom[key] = {
        name: name,
        items: []
    };
    
    saveToLocalStorage();
    renderCustomCategories();
}

// -------- Rendering Functions --------
function renderAll() {
    // Personal tab
    renderItemList('education-list', appData.personal.education, 'personal.education');
    renderItemList('visa-list', appData.personal.visa, 'personal.visa');
    renderItemList('license-list', appData.personal.license, 'personal.license');
    renderCustomCategories();
    
    // Health tab
    renderHealthNotes();
    
    // Professional tab
    renderItemList('school-list', appData.professional.school, 'professional.school');
    renderItemList('video-list', appData.professional.video, 'professional.video');
    renderItemList('family-list', appData.professional.family, 'professional.family');
    renderItemList('website-list', appData.professional.website, 'professional.website');
    renderItemList('social-list', appData.professional.social, 'professional.social');
    renderLessonPlans();
    renderReminders();
}

function renderItemList(containerId, items, dataPath) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = '<p class="empty-state">No items yet. Click the + button to add one!</p>';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="item ${item.completed ? 'completed' : ''}">
            <input type="checkbox" 
                   ${item.completed ? 'checked' : ''} 
                   onchange="toggleComplete('${dataPath}', ${item.id})"
                   class="item-checkbox">
            <div class="item-content">
                <div class="item-title">${escapeHtml(item.title)}</div>
                ${item.details ? `<div class="item-details">${escapeHtml(item.details)}</div>` : ''}
                ${item.status ? `<div class="item-status">Status: ${item.status}</div>` : ''}
                ${item.deadline ? `<div class="item-deadline">📅 ${formatDate(item.deadline)}</div>` : ''}
            </div>
            <button onclick="deleteItem('${dataPath}', ${item.id})" class="btn-delete">🗑️</button>
        </div>
    `).join('');
}

function renderHealthNotes() {
    const container = document.getElementById('health-notes-list');
    if (!container) return;
    
    const notes = appData.health.notes;
    if (notes.length === 0) {
        container.innerHTML = '<p class="empty-state">No health notes yet.</p>';
        return;
    }
    
    container.innerHTML = notes.map(note => `
        <div class="health-note">
            <div class="note-date">${formatDate(note.date)}</div>
            <div class="note-content">${escapeHtml(note.note)}</div>
            <button onclick="deleteHealthNote(${note.id})" class="btn-delete-small">Delete</button>
        </div>
    `).join('');
}

function renderCustomCategories() {
    const container = document.getElementById('custom-categories');
    if (!container) return;
    
    const custom = appData.personal.custom;
    const keys = Object.keys(custom);
    
    if (keys.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = keys.map(key => {
        const category = custom[key];
        return `
            <div class="category-section">
                <h3>${escapeHtml(category.name)} <button onclick="deleteCategory('${key}')" class="btn-delete-small">Delete Category</button></h3>
                <div id="custom-${key}-list"></div>
                <button onclick="addCustomItem('${key}')" class="btn-secondary">+ Add ${escapeHtml(category.name)} Item</button>
            </div>
        `;
    }).join('');
    
    // Render items for each custom category
    keys.forEach(key => {
        renderItemList(`custom-${key}-list`, custom[key].items, `personal.custom.${key}.items`);
    });
}

function renderLessonPlans() {
    ['grade9', 'grade8', 'grade7'].forEach(grade => {
        const container = document.getElementById(`lesson-${grade}-list`);
        if (!container) return;
        
        const lessons = appData.professional.lessonPlans[grade];
        if (lessons.length === 0) {
            container.innerHTML = '<p class="empty-state">No lesson plans yet.</p>';
            return;
        }
        
        container.innerHTML = lessons.map(lesson => `
            <div class="lesson-plan">
                <div class="lesson-title">${escapeHtml(lesson.title)}</div>
                ${lesson.date ? `<div class="lesson-date">📅 ${formatDate(lesson.date)}</div>` : ''}
                ${lesson.details ? `<div class="lesson-details">${escapeHtml(lesson.details)}</div>` : ''}
                <button onclick="deleteLessonPlan('${grade}', ${lesson.id})" class="btn-delete-small">Delete</button>
            </div>
        `).join('');
    });
}

function renderReminders() {
    const container = document.getElementById('reminders-list');
    if (!container) return;
    
    const reminders = appData.professional.reminders;
    if (reminders.length === 0) {
        container.innerHTML = '<p class="empty-state">No reminders set.</p>';
        return;
    }
    
    container.innerHTML = reminders.map(reminder => `
        <div class="reminder ${!reminder.active ? 'inactive' : ''}">
            <div class="reminder-title">${escapeHtml(reminder.title)}</div>
            ${reminder.details ? `<div class="reminder-details">${escapeHtml(reminder.details)}</div>` : ''}
            <div class="reminder-time">⏰ ${formatDateTime(reminder.datetime)}</div>
            <div class="reminder-repeat">🔁 ${reminder.repeat}</div>
            ${!reminder.active ? '<div class="reminder-inactive">Inactive</div>' : ''}
            <button onclick="deleteReminder(${reminder.id})" class="btn-delete-small">Delete</button>
        </div>
    `).join('');
}

// -------- Item Actions --------
function toggleComplete(dataPath, id) {
    const item = findItemByPath(dataPath, id);
    if (item) {
        item.completed = !item.completed;
        saveToLocalStorage();
        renderAll();
    }
}

function deleteItem(dataPath, id) {
    const parts = dataPath.split('.');
    let current = appData;
    
    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }
    
    const arrayName = parts[parts.length - 1];
    current[arrayName] = current[arrayName].filter(item => item.id !== id);
    
    saveToLocalStorage();
    renderAll();
}

function deleteHealthNote(id) {
    appData.health.notes = appData.health.notes.filter(note => note.id !== id);
    saveToLocalStorage();
    renderHealthNotes();
}

function deleteLessonPlan(grade, id) {
    appData.professional.lessonPlans[grade] = appData.professional.lessonPlans[grade].filter(lesson => lesson.id !== id);
    saveToLocalStorage();
    renderLessonPlans();
}

function deleteReminder(id) {
    appData.professional.reminders = appData.professional.reminders.filter(reminder => reminder.id !== id);
    saveToLocalStorage();
    renderReminders();
}

function deleteCategory(key) {
    if (confirm(`Delete entire category "${appData.personal.custom[key].name}"?`)) {
        delete appData.personal.custom[key];
        saveToLocalStorage();
        renderCustomCategories();
    }
}

function addCustomItem(categoryKey) {
    const title = prompt('Enter item title:');
    if (!title || !title.trim()) return;
    
    const details = prompt('Enter details (optional):');
    
    const item = {
        id: Date.now(),
        title: title,
        details: details || '',
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    appData.personal.custom[categoryKey].items.push(item);
    saveToLocalStorage();
    renderCustomCategories();
}

function findItemByPath(dataPath, id) {
    const parts = dataPath.split('.');
    let current = appData;
    
    for (const part of parts) {
        current = current[part];
    }
    
    return current.find(item => item.id === id);
}

// -------- Daily Reset --------
function checkDailyReset() {
    const today = new Date().toDateString();
    if (appData.health.dailyHabits.lastReset !== today) {
        appData.health.dailyHabits.wokeUp = false;
        appData.health.dailyHabits.drankWater = false;
        appData.health.dailyHabits.ateVeg = false;
        appData.health.dailyHabits.lastReset = today;
        
        // Update checkboxes
        ['habit-wakeup', 'habit-water', 'habit-veg'].forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = false;
        });
        
        saveToLocalStorage();
    }
}

// -------- Notifications --------
function enableNotifications() {
    if (!('Notification' in window)) {
        alert('This browser does not support notifications');
        return;
    }
    
    if (Notification.permission === 'granted') {
        alert('✅ Notifications are already enabled!');
        return;
    }
    
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            new Notification('🎉 Notifications Enabled!', {
                body: 'You will now receive reminders for your scheduled tasks.',
                icon: 'icon-192.png'
            });
        } else {
            alert('❌ Notifications blocked. Please enable them in browser settings.');
        }
    });
}

function scheduleNotification(reminder) {
    if (Notification.permission !== 'granted') return;
    
    const reminderTime = new Date(reminder.datetime).getTime();
    const now = Date.now();
    const timeUntil = reminderTime - now;
    
    if (timeUntil > 0) {
        setTimeout(() => {
            new Notification(`⏰ ${reminder.title}`, {
                body: reminder.details || 'Time for your scheduled task!',
                icon: 'icon-192.png',
                tag: `reminder-${reminder.id}`
            });
        }, timeUntil);
    }
}

function checkReminders() {
    const now = Date.now();
    
    appData.professional.reminders.forEach(reminder => {
        if (!reminder.active) return;
        
        const reminderTime = new Date(reminder.datetime).getTime();
        
        // Check if reminder time has passed
        if (reminderTime <= now && reminderTime > (now - 60000)) { // Within last minute
            if (Notification.permission === 'granted') {
                new Notification(`⏰ ${reminder.title}`, {
                    body: reminder.details || 'Reminder!',
                    icon: 'icon-192.png',
                    tag: `reminder-${reminder.id}`
                });
            }
            
            // Handle repeat
            if (reminder.repeat === 'once') {
                reminder.active = false;
            } else {
                const date = new Date(reminder.datetime);
                if (reminder.repeat === 'daily') {
                    date.setDate(date.getDate() + 1);
                } else if (reminder.repeat === 'weekly') {
                    date.setDate(date.getDate() + 7);
                } else if (reminder.repeat === 'monthly') {
                    date.setMonth(date.getMonth() + 1);
                }
                reminder.datetime = date.toISOString().slice(0, 16);
            }
            
            saveToLocalStorage();
            renderReminders();
        }
    });
}

// -------- Storage --------
function saveToLocalStorage() {
    try {
        localStorage.setItem('lifeTrackerData', JSON.stringify(appData));
        console.log('✅ Data saved to localStorage');
    } catch (e) {
        console.error('❌ Error saving to localStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('lifeTrackerData');
        if (data) {
            appData = JSON.parse(data);
            console.log('✅ Data loaded from localStorage');
        }
    } catch (e) {
        console.error('❌ Error loading from localStorage:', e);
    }
}

// -------- Google Drive Sync --------
function syncWithDrive() {
    if (!gapiInited || !gisInited) {
        alert('⏳ Google API is still loading. Please try again in a few seconds.');
        return;
    }
    
    if (GOOGLE_CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        alert('❌ Please configure your Google API Key first!\n\nEdit app.js and replace YOUR_API_KEY_HERE with your actual API key from Google Cloud Console.');
        return;
    }
    
    tokenClient.requestAccessToken();
}

function handleAuthCallback(response) {
    if (response.error) {
        console.error('Auth error:', response);
        alert('❌ Failed to authenticate with Google Drive');
        return;
    }
    
    uploadToGoogleDrive();
}

async function uploadToGoogleDrive() {
    try {
        const fileName = 'life-tracker-backup.json';
        const content = JSON.stringify(appData, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        
        const metadata = {
            name: fileName,
            mimeType: 'application/json'
        };
        
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', blob);
        
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + gapi.client.getToken().access_token
            },
            body: form
        });
        
        if (response.ok) {
            alert('✅ Data synced successfully to Google Drive!');
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Drive sync error:', error);
        alert('❌ Failed to sync with Google Drive');
    }
}

// -------- PWA Install --------
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installBtn = document.getElementById('install-app');
    if (installBtn) {
        installBtn.style.display = 'inline-block';
    }
});

function installApp() {
    if (!deferredPrompt) {
        alert('App is already installed or cannot be installed on this device.');
        return;
    }
    
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('App installed');
        }
        deferredPrompt = null;
    });
}

// -------- Utility Functions --------
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

console.log('📱 Life Tracker App loaded successfully!');
