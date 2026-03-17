// Core State Management
const initialState = {
    user: {
        name: "David T. Becker",
        email: "beckeralice323@gmail.com'",
        phone: "+1 547 567 890",
        accountNo: "8822446600",
        balance: 5620400.50,
        nextOfKin: "Alice Becker",
        address: "Passeig de Gràcia, 43, 08007, Barcelona, Spain",
        cardNumber: "4532 8822 4466 0012",
        cvv: "321",
        expiry: "09/28"
    },
    goals: [
        { name: "Investment Portfolio", target: 5000000, current: 3200000, icon: "📈" },
        { name: "Mediterranean Villa", target: 8000000, current: 5620400, icon: "🏝️" },
        { name: "Charity Foundation", target: 1000000, current: 150000, icon: "🤝" }
    ],
    transactions: [
        { id: 1, type: 'credit', amount: 4500.00, description: 'Monthly Salary - Mar 2014', date: '2014-03-01', status: 'completed' },
        { id: 2, type: 'debit', amount: 85.50, description: 'Electricity Bill', date: '2014-02-28', status: 'completed' },
        { id: 3, type: 'debit', amount: 45.00, description: 'Restaurant Dinner', date: '2014-02-20', status: 'completed' },
        { id: 4, type: 'credit', amount: 150.00, description: 'Cash Deposit', date: '2014-02-15', status: 'completed' },
        { id: 5, type: 'debit', amount: 1200.00, description: 'Apartment Rent', date: '2014-02-01', status: 'completed' },
        { id: 6, type: 'credit', amount: 4500.00, description: 'Monthly Salary - Feb 2014', date: '2014-02-01', status: 'completed' },
        { id: 7, type: 'debit', amount: 60.00, description: 'Amazon.com Purchase', date: '2014-01-15', status: 'completed' },
        { id: 8, type: 'credit', amount: 4500.00, description: 'Monthly Salary - Jan 2014', date: '2014-01-01', status: 'completed' },
        { id: 9, type: 'debit', amount: 300.00, description: 'Holiday Gift shopping', date: '2013-12-20', status: 'completed' },
        { id: 10, type: 'credit', amount: 500.00, description: 'Annual Bonus', date: '2013-12-15', status: 'completed' },
        { id: 11, type: 'debit', amount: 1200.00, description: 'Apartment Rent', date: '2013-12-01', status: 'completed' },
        { id: 12, type: 'credit', amount: 4500.00, description: 'Monthly Salary - Dec 2013', date: '2013-12-01', status: 'completed' },
        { id: 13, type: 'debit', amount: 55.20, description: 'Supermarket', date: '2025-11-10', status: 'completed' },
        { id: 14, type: 'credit', amount: 4500.00, description: 'Monthly Salary - Nov 2013', date: '2013-11-01', status: 'completed' },
        { id: 15, type: 'debit', amount: 200.00, description: 'Car Maintenance', date: '2013-10-05', status: 'completed' },
        { id: 16, type: 'credit', amount: 4500.00, description: 'Monthly Salary - Oct 2013', date: '2013-10-01', status: 'completed' },
        { id: 17, type: 'debit', amount: 150.00, description: 'Flight Ticket', date: '2013-08-20', status: 'completed' },
        { id: 18, type: 'credit', amount: 4500.00, description: 'Monthly Salary - Sep 2013', date: '2013-09-01', status: 'completed' },
        { id: 19, type: 'debit', amount: 40.00, description: 'Movie Night', date: '2013-06-15', status: 'completed' },
        { id: 20, type: 'credit', amount: 4500.00, description: 'Monthly Salary - May 2013', date: '2013-05-01', status: 'completed' },
        { id: 21, type: 'debit', amount: 30.00, description: 'Coffee Shop', date: '2013-04-10', status: 'completed' },
        { id: 22, type: 'credit', amount: 4500.00, description: 'Monthly Salary - Apr 2013', date: '2013-04-01', status: 'completed' },
        { id: 23, type: 'debit', amount: 100.00, description: 'Pharmacy', date: '2013-03-20', status: 'completed' },
        { id: 24, type: 'credit', amount: 4500.00, description: 'Monthly Salary - Mar 2013', date: '2013-03-01', status: 'completed' }
    ]
};

// Initialize State
function initStore() {
    if (!localStorage.getItem('bank_app_data')) {
        localStorage.setItem('bank_app_data', JSON.stringify(initialState));
    }
}

function getStore() {
    return JSON.parse(localStorage.getItem('bank_app_data'));
}

function updateStore(data) {
    localStorage.setItem('bank_app_data', JSON.stringify(data));
}

// Auth Helpers
function checkAuth() {
    const session = sessionStorage.getItem('bank_session');
    if (!session && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
}

function login(username, password) {
    if (username === 'beckeralice323@gmail.com' && password === 'janicemylove1') {
        sessionStorage.setItem('bank_session', JSON.stringify({ username, loggedInAt: new Date() }));
        return true;
    }
    return false;
}

function logout() {
    sessionStorage.removeItem('bank_session');
    window.location.href = 'index.html';
}

// Transaction Logic
function addTransaction(type, amount, description) {
    const store = getStore();
    const newTransaction = {
        id: Date.now(),
        type,
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
    };

    if (type === 'debit') {
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes('transfer')) {
            return { success: false, message: 'Account Restricted: Transfers are currently disabled for this account. Please contact support.' };
        }
        if (store.user.balance < amount) return { success: false, message: 'Insufficient balance' };
        store.user.balance -= amount;
    } else {
        store.user.balance += amount;
    }

    store.transactions.unshift(newTransaction);
    updateStore(store);
    return { success: true, message: 'Transaction successful' };
}

// UI Helpers
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount);
}

// Theme Management
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Chart Helper (Simple Canvas Bar Chart)
function drawTrendChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const store = getStore();
    const data = store.transactions.slice(0, 7).reverse().map(t => t.amount);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 20;
    const width = canvas.width - margin * 2;
    const height = canvas.height - margin * 2;
    const barWidth = width / data.length - 10;
    const maxVal = Math.max(...data, 100);

    data.forEach((val, i) => {
        const barHeight = (val / maxVal) * height;
        const x = margin + i * (barWidth + 10);
        const y = canvas.height - margin - barHeight;

        ctx.fillStyle = '#4F46E5';
        ctx.fillRect(x, y, barWidth, barHeight);
    });
}

// Toast Notifications
function showToast(message, type = 'primary') {
    const container = document.getElementById('toast-container') || (() => {
        const div = document.createElement('div');
        div.id = 'toast-container';
        document.body.appendChild(div);
        return div;
    })();

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'success') toast.style.borderLeftColor = 'var(--secondary)';
    if (type === 'danger') toast.style.borderLeftColor = 'var(--danger)';
    toast.innerText = message;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Mobile Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.querySelector('.top-bar .hamburger');
    
    const isActive = sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active', isActive);
    
    if (hamburger) {
        hamburger.innerText = isActive ? '✕' : '☰';
        // In mobile mode, if sidebar is active (full screen), make hamburger white to stand out
        if (window.innerWidth <= 1024) {
            hamburger.style.color = isActive ? 'white' : 'var(--text-main)';
        }
    }
}

// Global auto-init for navigation
function initNavigation() {
    // Add overlay to body if not exists
    if (!document.getElementById('sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.className = 'sidebar-overlay';
        overlay.onclick = toggleSidebar;
        document.body.appendChild(overlay);
    }
    
    // Close sidebar on link click (mobile)
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                toggleSidebar();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initStore();
    initTheme();
    initNavigation();
});
