// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// User Database Simulation
const userDatabase = {
    users: [],
    
    // Default demo users
    init() {
        const savedUsers = localStorage.getItem('anonsenUserDatabase');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        } else {
            // Add some demo users
            this.users = [
                {
                    id: 1,
                    username: 'demo_user',
                    email: 'demo@anonsen.com',
                    password: 'demo123456',
                    profilePicture: null,
                    joinDate: new Date().toISOString(),
                    isVerified: true
                },
                {
                    id: 2,
                    username: 'test_user',
                    email: 'test@example.com',
                    password: 'test123456',
                    profilePicture: null,
                    joinDate: new Date().toISOString(),
                    isVerified: true
                }
            ];
            this.save();
        }
    },
    
    save() {
        localStorage.setItem('anonsenUserDatabase', JSON.stringify(this.users));
    },
    
    findByEmail(email) {
        return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    },
    
    findByUsername(username) {
        return this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
    },
    
    addUser(userData) {
        const newUser = {
            id: this.users.length + 1,
            ...userData,
            joinDate: new Date().toISOString(),
            isVerified: true,
            profilePicture: null
        };
        this.users.push(newUser);
        this.save();
        return newUser;
    },
    
    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            this.save();
            return this.users[userIndex];
        }
        return null;
    },
    
    authenticateUser(emailOrUsername, password) {
        const user = this.findByEmail(emailOrUsername) || this.findByUsername(emailOrUsername);
        if (user && user.password === password) {
            return { ...user };
        }
        return null;
    }
};

// Auth Modal Elements
const authModal = document.getElementById('authModal');
const welcomeScreen = document.getElementById('welcomeScreen');
const registerScreen = document.getElementById('registerScreen');
const loginScreen = document.getElementById('loginScreen');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const laterBtn = document.getElementById('laterBtn');
const backFromRegister = document.getElementById('backFromRegister');
const backFromLogin = document.getElementById('backFromLogin');
const switchToRegister = document.getElementById('switchToRegister');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

// Sidebar Toggle Functionality
function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : 'auto';
}

function closeSidebarFn() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event Listeners
menuBtn.addEventListener('click', toggleSidebar);
closeSidebar.addEventListener('click', closeSidebarFn);
sidebarOverlay.addEventListener('click', closeSidebarFn);

// Close sidebar on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebarFn();
    }
    if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
        closeAuthModal();
    }
});

// Authentication Modal Functions
function showAuthModal() {
    authModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    authModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    showWelcomeScreen();
}

function showWelcomeScreen() {
    welcomeScreen.classList.remove('hidden');
    registerScreen.classList.add('hidden');
    loginScreen.classList.add('hidden');
}

function showRegisterScreen() {
    welcomeScreen.classList.add('hidden');
    registerScreen.classList.remove('hidden');
    registerScreen.classList.add('slide-in-left');
    setTimeout(() => registerScreen.classList.remove('slide-in-left'), 300);
    loginScreen.classList.add('hidden');
}

function showLoginScreen() {
    welcomeScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    loginScreen.classList.add('slide-in-left');
    setTimeout(() => loginScreen.classList.remove('slide-in-left'), 300);
    registerScreen.classList.add('hidden');
}

function switchToRegisterFromLogin() {
    loginScreen.classList.add('hidden');
    registerScreen.classList.remove('hidden');
    registerScreen.classList.add('slide-in-right');
    setTimeout(() => registerScreen.classList.remove('slide-in-right'), 300);
}

// Authentication Event Listeners
registerBtn.addEventListener('click', showRegisterScreen);
loginBtn.addEventListener('click', showLoginScreen);
laterBtn.addEventListener('click', closeAuthModal);
backFromRegister.addEventListener('click', showWelcomeScreen);
backFromLogin.addEventListener('click', showWelcomeScreen);
switchToRegister.addEventListener('click', switchToRegisterFromLogin);

// Close modal when clicking outside
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

// Form Validation and Submission
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateUsername(username) {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

// Registration Form Handler
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!validateUsername(username)) {
        showNotification('Benutzername muss mindestens 3 Zeichen lang sein und darf nur Buchstaben, Zahlen und _ enthalten', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('Passwort muss mindestens 8 Zeichen lang sein', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwörter stimmen nicht überein', 'error');
        return;
    }
    
    // Check if user already exists
    if (userDatabase.findByEmail(email)) {
        showNotification('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits', 'error');
        return;
    }
    
    if (userDatabase.findByUsername(username)) {
        showNotification('Dieser Benutzername ist bereits vergeben', 'error');
        return;
    }
    
    // Register new user
    const submitBtn = registerForm.querySelector('.auth-btn.primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Wird erstellt...</span>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        try {
            const newUser = userDatabase.addUser({
                username: username,
                email: email,
                password: password
            });
            
            showNotification('Konto erfolgreich erstellt! Willkommen bei Anonsen!', 'success');
            
            // Set current user session
            localStorage.setItem('anonsenCurrentUser', JSON.stringify({
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            }));
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            closeAuthModal();
            updateUIForLoggedInUser(newUser);
        } catch (error) {
            showNotification('Fehler bei der Registrierung. Bitte versuchen Sie es erneut.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
});

// Login Form Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const usernameOrEmail = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!usernameOrEmail || !password) {
        showNotification('Bitte füllen Sie alle Felder aus', 'error');
        return;
    }
    
    // Authenticate user
    const submitBtn = loginForm.querySelector('.auth-btn.primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Wird angemeldet...</span>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const user = userDatabase.authenticateUser(usernameOrEmail, password);
        
        if (user) {
            showNotification('Erfolgreich angemeldet! Willkommen zurück!', 'success');
            
            // Set current user session
            localStorage.setItem('anonsenCurrentUser', JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email,
                isLoggedIn: true,
                rememberMe: rememberMe,
                loginTime: new Date().toISOString()
            }));
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            closeAuthModal();
            updateUIForLoggedInUser(user);
        } else {
            showNotification('Ungültige E-Mail/Benutzername oder Passwort', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
});

// Social Login Handlers
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = btn.classList.contains('google') ? 'Google' : 'Apple';
        
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            showNotification(`${provider} Login wird in der Vollversion verfügbar sein`, 'info');
        }, 150);
    });
});

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const userObj = typeof user === 'string' ? { username: user, profilePicture: null } : user;
    
    // Update profile button with picture or default
    const headerAvatar = document.getElementById('headerAvatar');
    if (userObj.profilePicture) {
        headerAvatar.style.backgroundImage = `url(${userObj.profilePicture})`;
        headerAvatar.style.backgroundSize = 'cover';
        headerAvatar.style.backgroundPosition = 'center';
        headerAvatar.innerHTML = '';
    } else {
        headerAvatar.style.background = 'var(--accent-primary)';
        headerAvatar.style.backgroundImage = 'none';
        headerAvatar.innerHTML = `<i class="fas fa-user" style="color: white; font-size: 0.8rem;"></i>`;
    }
    
    // Store current user globally
    window.currentUser = userObj;
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : 'var(--accent-primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 11000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 500;
        max-width: 350px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Check if user is already logged in on page load
function checkAuthStatus() {
    const currentUserSession = localStorage.getItem('anonsenCurrentUser');
    if (currentUserSession) {
        const userData = JSON.parse(currentUserSession);
        if (userData.isLoggedIn) {
            // Get full user data from database
            const fullUser = userDatabase.users.find(u => u.id === userData.id);
            if (fullUser) {
                updateUIForLoggedInUser(fullUser);
                return true;
            }
        }
    }
    return false;
}

// Profile Management Functions
function showProfileModal() {
    const profileModal = document.getElementById('profileModal');
    profileModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Load current user data
    if (window.currentUser) {
        document.getElementById('profileUsername').value = window.currentUser.username;
        document.getElementById('profileEmail').value = window.currentUser.email;
        document.getElementById('profileBio').value = window.currentUser.bio || '';
        
        // Update profile picture
        updateProfilePicture(window.currentUser.profilePicture);
    }
}

function closeProfileModal() {
    const profileModal = document.getElementById('profileModal');
    profileModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function updateProfilePicture(pictureUrl) {
    const profilePicture = document.getElementById('profilePicture');
    const profilePicturePlaceholder = document.getElementById('profilePicturePlaceholder');
    const removePictureBtn = document.getElementById('removePictureBtn');
    
    if (pictureUrl) {
        profilePicture.src = pictureUrl;
        profilePicture.classList.remove('hidden');
        profilePicturePlaceholder.classList.add('hidden');
        removePictureBtn.style.display = 'flex';
    } else {
        profilePicture.classList.add('hidden');
        profilePicturePlaceholder.classList.remove('hidden');
        removePictureBtn.style.display = 'none';
    }
}

function handleProfilePictureUpload(file) {
    if (file && file.type.startsWith('image/')) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Bild ist zu groß. Maximale Dateigröße: 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            updateProfilePicture(imageUrl);
            
            // Update current user data
            if (window.currentUser) {
                window.currentUser.profilePicture = imageUrl;
            }
        };
        reader.readAsDataURL(file);
    } else {
        showNotification('Bitte wählen Sie eine gültige Bilddatei aus', 'error');
    }
}

function saveProfile() {
    if (!window.currentUser) {
        showNotification('Kein Benutzer angemeldet', 'error');
        return;
    }
    
    const bio = document.getElementById('profileBio').value.trim();
    const profilePicture = window.currentUser.profilePicture;
    
    // Update user in database
    const updatedUser = userDatabase.updateUser(window.currentUser.id, {
        bio: bio,
        profilePicture: profilePicture
    });
    
    if (updatedUser) {
        window.currentUser = updatedUser;
        updateUIForLoggedInUser(updatedUser);
        showNotification('Profil erfolgreich gespeichert!', 'success');
        closeProfileModal();
    } else {
        showNotification('Fehler beim Speichern des Profils', 'error');
    }
}

function logout() {
    localStorage.removeItem('anonsenCurrentUser');
    window.currentUser = null;
    showNotification('Erfolgreich abgemeldet', 'success');
    closeProfileModal();
    
    // Reset UI
    const headerAvatar = document.getElementById('headerAvatar');
    headerAvatar.style.background = 'var(--accent-primary)';
    headerAvatar.style.backgroundImage = 'none';
    headerAvatar.innerHTML = '';
    
    // Show auth modal after logout
    setTimeout(() => {
        showAuthModal();
    }, 1500);
}

// Post interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user database
    userDatabase.init();
    
    // Check auth status and show modal if not logged in
    if (!checkAuthStatus()) {
        setTimeout(() => {
            showAuthModal();
        }, 1000); // Show after 1 second for better UX
    }
    
    // Profile modal event listeners
    document.getElementById('profileBtn').addEventListener('click', showProfileModal);
    document.getElementById('profileNavLink').addEventListener('click', (e) => {
        e.preventDefault();
        showProfileModal();
        if (window.innerWidth <= 768) {
            closeSidebarFn();
        }
    });
    document.getElementById('closeProfileModal').addEventListener('click', closeProfileModal);
    
    // Profile picture upload
    document.getElementById('uploadPictureBtn').addEventListener('click', () => {
        document.getElementById('profilePictureInput').click();
    });
    
    document.getElementById('profilePictureInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleProfilePictureUpload(file);
        }
    });
    
    document.getElementById('removePictureBtn').addEventListener('click', () => {
        updateProfilePicture(null);
        if (window.currentUser) {
            window.currentUser.profilePicture = null;
        }
        document.getElementById('profilePictureInput').value = '';
    });
    
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Close profile modal when clicking outside
    document.getElementById('profileModal').addEventListener('click', (e) => {
        if (e.target.id === 'profileModal') {
            closeProfileModal();
        }
    });
    // Like button functionality
    const likeButtons = document.querySelectorAll('.action-btn:first-child');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('span');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#1e26fc';
                this.style.color = '#1e26fc';
                
                // Increment count
                let count = parseInt(countSpan.textContent);
                countSpan.textContent = count + 1;
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                this.style.color = '';
                
                // Decrement count
                let count = parseInt(countSpan.textContent);
                countSpan.textContent = count - 1;
            }
        });
    });

    // Save button functionality
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#1e26fc';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });

    // Smooth scroll for nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                closeSidebarFn();
            }
        });
    });

    // Story click functionality
    const stories = document.querySelectorAll('.story');
    stories.forEach(story => {
        story.addEventListener('click', function() {
            // Add a subtle animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Infinite scroll simulation
    let isLoading = false;
    
    function loadMorePosts() {
        if (isLoading) return;
        isLoading = true;
        
        // Simulate loading delay
        setTimeout(() => {
            const feed = document.querySelector('.feed');
            const newPost = createNewPost();
            feed.appendChild(newPost);
            isLoading = false;
        }, 1000);
    }

    function createNewPost() {
        const post = document.createElement('article');
        post.className = 'post';
        
        const usernames = ['shadow_walker', 'void_speaker', 'cipher_soul', 'echo_mind', 'ghost_writer'];
        const contents = [
            'In der Stille zwischen den Worten finden wir die tiefsten Wahrheiten. 🌌',
            'Anonym bedeutet nicht unsichtbar. Es bedeutet frei. ✨',
            'Hinter jeder Maske wartet eine Geschichte darauf, erzählt zu werden.',
            'Manchmal finden die ehrlichsten Gespräche im Dunkeln statt.',
            'Wir sind alle Fremde, bis wir uns entscheiden, es nicht zu sein. 🎭'
        ];
        
        const username = usernames[Math.floor(Math.random() * usernames.length)];
        const content = contents[Math.floor(Math.random() * contents.length)];
        const likes = Math.floor(Math.random() * 500) + 10;
        const comments = Math.floor(Math.random() * 50) + 1;
        
        post.innerHTML = `
            <div class="post-header">
                <div class="post-avatar"></div>
                <div class="post-info">
                    <h3>${username}</h3>
                    <span>vor ${Math.floor(Math.random() * 12) + 1} Stunden</span>
                </div>
                <button class="post-options">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            
            <div class="post-content">
                <p>${content}</p>
            </div>
            
            <div class="post-actions">
                <button class="action-btn">
                    <i class="far fa-heart"></i>
                    <span>${likes}</span>
                </button>
                <button class="action-btn">
                    <i class="far fa-comment"></i>
                    <span>${comments}</span>
                </button>
                <button class="action-btn">
                    <i class="far fa-paper-plane"></i>
                </button>
                <button class="action-btn save-btn">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        `;
        
        // Add event listeners to new post
        const likeBtn = post.querySelector('.action-btn:first-child');
        likeBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('span');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#1e26fc';
                this.style.color = '#1e26fc';
                
                let count = parseInt(countSpan.textContent);
                countSpan.textContent = count + 1;
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                this.style.color = '';
                
                let count = parseInt(countSpan.textContent);
                countSpan.textContent = count - 1;
            }
        });
        
        const saveBtn = post.querySelector('.save-btn');
        saveBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#1e26fc';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
            }
        });
        
        return post;
    }

    // Infinite scroll detection
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
            loadMorePosts();
        }
    });

    // Create post button functionality
    const createPostBtn = document.querySelector('.create-post-btn');
    createPostBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            // Here you would open a create post modal
            console.log('Beitrag erstellen Modal würde hier geöffnet');
        }, 150);
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
        closeSidebarFn();
    }
});