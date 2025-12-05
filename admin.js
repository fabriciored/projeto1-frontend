const userForm = document.getElementById('userForm');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userList = document.getElementById('userList');
const clearFormBtn = document.getElementById('clearFormBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const searchInput = document.getElementById('searchInput');

const STORAGE_KEY = 'euamoestudar_users';

function getUsers() {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function createUserListItem(user, index) {
    const li = document.createElement('li');
    li.className = 'user-item';
    
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'user-date';
    dateSpan.textContent = formatDate(user.date);
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'user-name';
    nameSpan.textContent = `Nome: ${user.name}`;
    
    const emailSpan = document.createElement('span');
    emailSpan.className = 'user-email';
    emailSpan.textContent = `E-mail: ${user.email}`;
    
    userInfo.appendChild(dateSpan);
    userInfo.appendChild(nameSpan);
    userInfo.appendChild(emailSpan);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.addEventListener('click', () => deleteUser(index));
    
    li.appendChild(userInfo);
    li.appendChild(deleteBtn);
    
    return li;
}

function renderUsers(usersToRender = null) {
    const users = usersToRender !== null ? usersToRender : getUsers();
    userList.innerHTML = '';
    
    if (users.length === 0) {
        const noUsersAvailableMessage = document.createElement('li');
        noUsersAvailableMessage.className = 'empty-message';
        noUsersAvailableMessage.textContent = 'Nenhum usuário cadastrado.';
        userList.appendChild(noUsersAvailableMessage);
        return;
    }
    
    users.forEach((user, index) => {
        const li = createUserListItem(user, index);
        userList.appendChild(li);
    });
}

function addUser(name, email) {
    const users = getUsers();
    const newUser = {
        name: name,
        email: email,
        date: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    renderUsers();
}

function deleteUser(index) {
    const users = getUsers();
    users.splice(index, 1);
    saveUsers(users);
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        searchUsers(searchTerm);
    } else {
        renderUsers();
    }
}

function deleteAllUsers() {
    if (confirm('Tem certeza que deseja excluir todos os usuários?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderUsers();
        searchInput.value = '';
    }
}

function clearForm() {
    userName.value = '';
    userEmail.value = '';
    userName.focus();
}

function searchUsers(searchTerm) {
    const users = getUsers();
    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm) || 
               user.email.toLowerCase().includes(searchTerm);
    });
    renderUsers(filteredUsers);
}

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = userName.value.trim();
    const email = userEmail.value.trim();
    
    if (name && email) {
        addUser(name, email);
        clearForm();
    }
});

clearFormBtn.addEventListener('click', clearForm);

clearAllBtn.addEventListener('click', deleteAllUsers);

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (searchTerm) {
        searchUsers(searchTerm);
    } else {
        renderUsers();
    }
});

renderUsers();
