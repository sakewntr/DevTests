const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});
loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
});

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const authContainer = document.getElementById('authContainer');
const dashboard = document.getElementById('dashboard');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = registerForm.username.value;
  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const user = { username, email, password };
  localStorage.setItem('harvestLinkUser', JSON.stringify(user));
  alert('Registration successful! You can now login.');
  container.classList.remove('active');
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;
  const storedUser = JSON.parse(localStorage.getItem('harvestLinkUser'));
  if (storedUser && storedUser.username === username && storedUser.password === password) {
    alert('Login successful!');
    authContainer.style.display = 'none';
    dashboard.style.display = 'block';

    if (!localStorage.getItem('taskList')) localStorage.setItem('taskList', JSON.stringify([]));
    if (!localStorage.getItem('inventoryList')) localStorage.setItem('inventoryList', JSON.stringify([]));
    if (!localStorage.getItem('cropList')) localStorage.setItem('cropList', JSON.stringify([]));
    
    renderTaskCards();
    renderInventoryCards();
    renderCropCards();
  } else {
    alert('Invalid username or password. Please try again.');
  }
});

const homeLink = document.getElementById('homeLink');
const taskListLink = document.getElementById('taskListLink');
const inventoryListLink = document.getElementById('inventoryListLink');
const cropListLink = document.getElementById('cropListLink');

const homeSection = document.getElementById('homeSection');
const taskListSection = document.getElementById('taskListSection');
const inventoryListSection = document.getElementById('inventoryListSection');
const cropListSection = document.getElementById('cropListSection');

homeLink.addEventListener('click', () => showSection('home'));
taskListLink.addEventListener('click', () => showSection('task'));
inventoryListLink.addEventListener('click', () => showSection('inventory'));
cropListLink.addEventListener('click', () => showSection('crop'));

function showSection(section) {
  homeSection.style.display = 'none';
  taskListSection.style.display = 'none';
  inventoryListSection.style.display = 'none';
  cropListSection.style.display = 'none';
  
  if (section === 'home') {
    homeSection.style.display = 'block';
  } else if (section === 'task') {
    taskListSection.style.display = 'block';
  } else if (section === 'inventory') {
    inventoryListSection.style.display = 'block';
  } else if (section === 'crop') {
    cropListSection.style.display = 'block';
  }
}

function showModal(modalElement) {
  modalElement.style.display = 'block';
  setTimeout(() => {
    modalElement.classList.add('show');
  }, 10);
}

function hideModal(modalElement) {
  modalElement.classList.remove('show');
  setTimeout(() => {
    modalElement.style.display = 'none';
  }, 300);
}

function animateDeletion(card, callback) {
  card.classList.add('fade-out');
  setTimeout(callback, 300);
}

const addTaskBtn = document.getElementById('addTaskBtn');
const taskFormContainer = document.getElementById('taskFormContainer');
const taskForm = document.getElementById('taskForm');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const taskCardContainer = document.getElementById('taskCardContainer');
const taskSearch = document.getElementById('taskSearch');

addTaskBtn.addEventListener('click', () => {
  showModal(taskFormContainer);
});
cancelTaskBtn.addEventListener('click', () => {
  hideModal(taskFormContainer);
  taskForm.reset();
});
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTask = {
    taskType: taskForm.taskType.value,
    assignedDate: taskForm.assignedDate.value,
    assignedBy: taskForm.assignedBy.value,
    assignedTo: taskForm.assignedTo.value,
    dueOn: taskForm.dueOn.value,
    completionDate: taskForm.completionDate.value
  };
  let tasks = JSON.parse(localStorage.getItem('taskList')) || [];
  tasks.push(newTask);
  localStorage.setItem('taskList', JSON.stringify(tasks));
  renderTaskCards();
  hideModal(taskFormContainer);
  taskForm.reset();
});

function renderTaskCards() {
  const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
  taskCardContainer.innerHTML = '';
  tasks.forEach((t, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${t.taskType}</h3>
      <p><strong>Assigned:</strong> ${t.assignedDate || 'N/A'}</p>
      <p><strong>By:</strong> ${t.assignedBy || 'N/A'}</p>
      <p><strong>To:</strong> ${t.assignedTo || 'N/A'}</p>
      <p><strong>Due:</strong> ${t.dueOn || 'N/A'}</p>
      <p><strong>Completed:</strong> ${t.completionDate || 'N/A'}</p>
      <button class="delete-btn" data-index="${index}" data-type="task">Delete</button>
    `;
    taskCardContainer.appendChild(card);
  });
}

taskSearch.addEventListener('input', () => {
  const searchTerm = taskSearch.value.toLowerCase();
  const cards = taskCardContainer.querySelectorAll('.card');
  cards.forEach((card) => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(searchTerm) ? '' : 'none';
  });
});

taskCardContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    const card = e.target.parentElement;
    animateDeletion(card, () => {
      let tasks = JSON.parse(localStorage.getItem('taskList')) || [];
      tasks.splice(index, 1);
      localStorage.setItem('taskList', JSON.stringify(tasks));
      renderTaskCards();
    });
  }
});

const addInventoryBtn = document.getElementById('addInventoryBtn');
const inventoryFormContainer = document.getElementById('inventoryFormContainer');
const inventoryForm = document.getElementById('inventoryForm');
const cancelInventoryBtn = document.getElementById('cancelInventoryBtn');
const inventoryCardContainer = document.getElementById('inventoryCardContainer');
const inventorySearch = document.getElementById('inventorySearch');

addInventoryBtn.addEventListener('click', () => {
  showModal(inventoryFormContainer);
});
cancelInventoryBtn.addEventListener('click', () => {
  hideModal(inventoryFormContainer);
  inventoryForm.reset();
});
inventoryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newInventory = {
    name: inventoryForm.name.value,
    category: inventoryForm.category.value,
    quantity: inventoryForm.quantity.value,
    reorderLevel: inventoryForm.reorderLevel.value
  };
  let inventories = JSON.parse(localStorage.getItem('inventoryList')) || [];
  inventories.push(newInventory);
  localStorage.setItem('inventoryList', JSON.stringify(inventories));
  renderInventoryCards();
  hideModal(inventoryFormContainer);
  inventoryForm.reset();
});

function renderInventoryCards() {
  const inventories = JSON.parse(localStorage.getItem('inventoryList')) || [];
  inventoryCardContainer.innerHTML = '';
  inventories.forEach((inv, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${inv.name}</h3>
      <p><strong>Category:</strong> ${inv.category}</p>
      <p><strong>Quantity:</strong> ${inv.quantity}</p>
      <p><strong>Reorder Level:</strong> ${inv.reorderLevel}</p>
      <button class="delete-btn" data-index="${index}" data-type="inventory">Delete</button>
    `;
    inventoryCardContainer.appendChild(card);
  });
}

inventorySearch.addEventListener('input', () => {
  const searchTerm = inventorySearch.value.toLowerCase();
  const cards = inventoryCardContainer.querySelectorAll('.card');
  cards.forEach((card) => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(searchTerm) ? '' : 'none';
  });
});

inventoryCardContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    const card = e.target.parentElement;
    animateDeletion(card, () => {
      let inventories = JSON.parse(localStorage.getItem('inventoryList')) || [];
      inventories.splice(index, 1);
      localStorage.setItem('inventoryList', JSON.stringify(inventories));
      renderInventoryCards();
    });
  }
});

const addCropBtn = document.getElementById('addCropBtn');
const cropFormContainer = document.getElementById('cropFormContainer');
const cropForm = document.getElementById('cropForm');
const cancelCropBtn = document.getElementById('cancelCropBtn');
const cropCardContainer = document.getElementById('cropCardContainer');
const cropSearch = document.getElementById('cropSearch');

addCropBtn.addEventListener('click', () => {
  showModal(cropFormContainer);
});
cancelCropBtn.addEventListener('click', () => {
  hideModal(cropFormContainer);
  cropForm.reset();
});
cropForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newCrop = {
    name: cropForm.name.value,
    plantingDate: cropForm.plantingDate.value,
    expectedYield: cropForm.expectedYield.value,
    pestDisease: cropForm.pestDisease.value
  };
  let crops = JSON.parse(localStorage.getItem('cropList')) || [];
  crops.push(newCrop);
  localStorage.setItem('cropList', JSON.stringify(crops));
  renderCropCards();
  hideModal(cropFormContainer);
  cropForm.reset();
});

function renderCropCards() {
  const crops = JSON.parse(localStorage.getItem('cropList')) || [];
  cropCardContainer.innerHTML = '';
  crops.forEach((c, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${c.name}</h3>
      <p><strong>Planting Date:</strong> ${c.plantingDate || 'N/A'}</p>
      <p><strong>Expected Yield:</strong> ${c.expectedYield || 'N/A'}</p>
      <p><strong>Pest/Disease:</strong> ${c.pestDisease || 'N/A'}</p>
      <button class="delete-btn" data-index="${index}" data-type="crop">Delete</button>
    `;
    cropCardContainer.appendChild(card);
  });
}

cropSearch.addEventListener('input', () => {
  const searchTerm = cropSearch.value.toLowerCase();
  const cards = cropCardContainer.querySelectorAll('.card');
  cards.forEach((card) => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(searchTerm) ? '' : 'none';
  });
});

cropCardContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    const card = e.target.parentElement;
    animateDeletion(card, () => {
      let crops = JSON.parse(localStorage.getItem('cropList')) || [];
      crops.splice(index, 1);
      localStorage.setItem('cropList', JSON.stringify(crops));
      renderCropCards();
    });
  }
});
