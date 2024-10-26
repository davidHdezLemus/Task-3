// Define a User class to represent a user with id, name, genre, icon, and spend properties
class User {
  constructor(id, name, genre, icon) {
    this.id = id;
    this.name = name;
    this.genre = genre;
    this.icon = icon;
    this.spend = 0; // Initialize spend to 0
  }
}

// Define an Expense class to represent an expense with user, amount, title, and date properties
class Expense {
  constructor(user, amount, title, date) {
    this.user = user;
    this.amount = amount;
    this.title = title;
    this.date = date;
  }
}

// Initialize empty arrays to store users and expenses
let users = [];
let expenses = [];

// Function to display a specific page by its ID
function displayPage(pageID) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active')); // Remove 'active' class from all pages
  document.getElementById(pageID).classList.add('active'); // Add 'active' class to the selected page

  // Update the content of the page based on the pageID
  if (pageID === 'users') {
    updateUsersList();
  } else if (pageID === 'home') {
    updateExpensesList();
  } else if (pageID === 'balances') {
    updateBalancesList();
  }
}

// Counter to assign unique IDs to users
let userIdCounter = 1;

// Event listener for add a new user
document.getElementById('myForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the values from the form inputs
  let genre = document.querySelector('input[name="genre"]:checked').value;
  let name = document.getElementById('name').value;
  let icon = document.querySelector('input[name="icon"]:checked').value;

  // Validate the name input using a regular expression
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    alert('Name must contain only letters and spaces.');
    return;
  }

  // Add the new user to the users array and display the users page
  users.push(new User(userIdCounter++, name, genre, icon));
  displayPage('users');
});

// Function to update the list of users displayed on the page
function updateUsersList() {
  const usersList = document.getElementById('usersList');
  usersList.innerHTML = ''; // Clear the current list

  // Create and append list items for each user
  users.forEach(user => {
    const userItem = document.createElement('li');
    userItem.classList.add('user-item');

    // Create the icon container and user icon elements
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');
    const userIcon = document.createElement('img');
    userIcon.src = `./src/images/${user.icon}.png`;
    userIcon.alt = `${user.name} icon`;
    userIcon.classList.add('user-icon');

    // Create the user name element
    const userName = document.createElement('span');
    userName.textContent = `${user.name}`;
    userName.classList.add('user-name');

    // Append the icon and name to the user item
    iconContainer.appendChild(userIcon);
    userItem.appendChild(iconContainer);
    userItem.appendChild(userName);
    usersList.appendChild(userItem);
  });
}

// Function to populate the user select dropdown for adding expenses
function populateUserSelect() {
  const selectUser = document.getElementById('userSelect');
  const confirmButton = document.getElementById('confirmExpenseButton');
  selectUser.innerHTML = '<option value="">-Select an option-</option>'; // Default option

  // If no users are available, disable the confirm button and add an empty option
  if (users.length === 0 || selectUser.value === "-Select an option-") {
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = 'empty';
    selectUser.add(emptyOption);
    confirmButton.disabled = true;
  } else {
    // Add options for each user
    users.forEach(user => {
      const userOption = document.createElement('option');
      userOption.value = user.id;
      userOption.text = user.name;
      selectUser.add(userOption);
    });
    confirmButton.disabled = false;
  }
}

// Function to clear the expense form inputs
function clearExpenseForm() {
  document.getElementById('userSelect').selectedIndex = 0;
  document.getElementById('amount').value = '';
  document.getElementById('title').value = '';
}

// Event listener for the add expense button to show the add expense page
document.getElementById('addExpenseButton').addEventListener('click', function (event) {
  event.preventDefault();
  populateUserSelect(); // Populate the user select dropdown
  displayPage('addExpense'); // Display the add expense page
});

// Event listener for the confirm expense button to add a new expense
document.getElementById('confirmExpenseButton').addEventListener('click', function (event) {
  event.preventDefault();

  // Get the values from the form inputs
  const userId = parseInt(document.getElementById('userSelect').value, 10);
  const amount = document.getElementById('amount').value;
  const title = document.getElementById('title').value;

  // Validate the amount and title inputs using regular expressions
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  const titleRegex = /^[A-Za-z\s]+$/;

  if (!userId) {
    alert('Please select a user.');
    return;
  }
  if (!amountRegex.test(amount)) {
    alert('Amount must be a valid number.');
    return;
  }
  if (!titleRegex.test(title)) {
    alert('Title must contain only letters and spaces.');
    return;
  }

  // Add the expense to the expenses array and update the user's spend
  const amountNum = parseFloat(amount);
  users.forEach(u => {
    if (u.id === userId) {
      u.spend += amountNum;
    }
  });
  const expense = new Expense(userId, amountNum, title, new Date());
  expenses.push(expense);

  // Clear the form and display the home page
  clearExpenseForm();
  displayPage('home');
});

// Event listener for the back to home button to show the home page
document.getElementById('backToHomeButton').addEventListener('click', function (event) {
  event.preventDefault();
  displayPage('home');
});

// Function to update the list of expenses displayed on the home page
function updateExpensesList() {
  const expensesList = document.querySelector('#home .size');
  expensesList.innerHTML = ''; // Clear the current list

  // If no expenses are available, display a message
  if (expenses.length === 0) {
    expensesList.innerHTML = '<p>No expenses added yet.</p>';
    return;
  }

  // Create and append expense items for each expense
  expenses.forEach(expense => {
    const user = users.find(u => u.id === expense.user); // Find the user by ID
    const userName = user ? user.name : 'Unknown user';
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-item');
    expenseItem.innerHTML = `
          <div class="expense-card">
              <p class="expense-date">${expense.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</p>
              <img src="./src/images/spend.png" alt="Expense Icon" class="expense-icon" />
              <div class="expense-detail">
                  <p class="expense-title">${expense.title}</p>
                  <p class="expense-details">${userName} paid ${expense.amount} €</p>
              </div>
          </div>
      `;
    expensesList.appendChild(expenseItem);
  });
}

// Function to calculate the balances for each user
function calculateBalances() {
  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0); // Calculate total expense
  const perPersonShare = totalExpense / users.length; // Calculate share per person
  const balances = [];

  // Calculate the balance for each user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const amountToReceive = user.spend - perPersonShare;
    balances.push({
      name: user.name,
      icon: user.icon,
      genre: user.genre,
      totalPaid: user.spend,
      amountToReceive: amountToReceive
    });
  }
  return balances;
}

// Function to update the list of balances displayed on the balances page
function updateBalancesList() {
  const balancesList = document.querySelector('#balances .size');
  balancesList.innerHTML = ''; // Clear the current list

  // If no users are available, display a message
  if (users.length === 0) {
    balancesList.innerHTML = '<p>No users added yet.</p>';
    return;
  }

  // Get the balances and create balance items for each user
  const balances = calculateBalances();
  balances.forEach(balance => {
    const balanceItem = document.createElement('div');
    balanceItem.classList.add('balance-item');

    // Determine the pronoun based on the user's genre
    let pronoun;
    if (balance.genre === 'female') {
      pronoun = 'She';
    } else {
      pronoun = 'He';
    }

    // Determine the color class based on the user's genre
    let colorClass;
    if (balance.genre === 'female') {
      colorClass = 'female-card';
    } else {
      colorClass = 'male-card';
    }

    // Construct the balance message
    let receiveMessage;
    if (balance.amountToReceive > 0) {
      // Format the amount to receive with two decimal places for accurate monetary representation (String)
      receiveMessage = `${pronoun} should receive ${balance.amountToReceive.toFixed(2)} €`;
    } else {
      receiveMessage = `${pronoun} should receive 0 €`;
    }

    // Create the balance item HTML and append it to the balances list
    balanceItem.innerHTML = `
          <div class="balance-card ${colorClass}">
              <div class="icon-container">
                  <img src="./src/images/${balance.icon}.png" alt="${balance.name} icon" class="user-icon">
              </div>
              <div class="balance-detail">
                  <p class="user-name">${balance.name}</p>
                  <p class="balance-paid">Total paid: ${balance.totalPaid.toFixed(2)} €</p>
                  <p class="balance-message">${receiveMessage}</p>
              </div>
          </div>
      `;
    balancesList.appendChild(balanceItem);
  });
}

// Function to settle up all balances
function settleUp() {
  // Get the current balances
  const balances = calculateBalances();

  // Calculate the total expense and share per person
  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
  const perPersonShare = totalExpense / users.length;

  // Adjust each user's spend to match their share
  users.forEach(user => {
    user.spend = perPersonShare;
  });

  // Update the balances list view
  updateBalancesList();
}
