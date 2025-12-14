const text = document.getElementById("text");
const amount = document.getElementById("amount");
const form = document.getElementById("form");
const balance = document.getElementById("balance");
const income = document.getElementById("money-plus");
const expense = document.getElementById("money-minus");
const list = document.getElementById("list");
const pagination = document.getElementById("pagination");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const pageNumbers = document.getElementById("page-numbers");
const pageLinks = document.querySelectorAll(".page-link");

const incomeList = JSON.parse(localStorage.getItem("income")) || [];
const expenseList = JSON.parse(localStorage.getItem("expense")) || [];

const listPerPage = 5;
let currentPage = 1;
let totalPages = 1;
let listItems;

// Function to display list for a specific page
function displayPage(page) {
  const startIndex = (page - 1) * listPerPage;
  const endIndex = startIndex + listPerPage;

  listItems.forEach((list, index) => {
    list.style.display =
      index >= startIndex && index < endIndex ? "list-item" : "none";
  });
}

// Function to update pagination buttons and page numbers
function updatePagination() {
  pageNumbers.textContent = `Page ${currentPage} of ${totalPages}`;

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  pageLinks.forEach((link) => {
    const page = parseInt(link.getAttribute("data-page"));
    link.classList.toggle("active", page === currentPage);
  });
}

// Event listener for "Previous" button
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    setupPagination();
  }
});

// Event listener for "Next" button
nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    setupPagination();
  }
});

// Event listener for page number buttons
pageLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = parseInt(link.getAttribute("data-page"));
    if (page !== currentPage) {
      currentPage = page;
      displayPage(currentPage);
      updatePagination();
    }
  });
});

function setupPagination() {
  listItems = Array.from(list.children);

  totalPages = Math.ceil(listItems.length / listPerPage) || 1;

  if (currentPage > totalPages) currentPage = totalPages;

  displayPage(currentPage, listItems);
  updatePagination();
}

// Form submission handler
function onSubmit(e) {
  e.preventDefault();
  const message = text.value;
  const expenseData = { date: new Date(), message: "", amount: 0 };
  const incomeData = { date: new Date(), message: "", amount: 0 };

  if (message.trim() === "") {
    alert("Please enter a message");
    return;
  }
  const value = parseFloat(amount.value);

  if (isNaN(value)) {
    alert("Please enter a valid number");
    return;
  }
  const formattedValue = value.toFixed(2);

  /* Expense */
  if (value < 0) {
    expenseData.message = message;
    expenseData.amount = formattedValue;

    expenseList.push(expenseData);
    localStorage.setItem("expense", JSON.stringify(expenseList));
  } else {
    /* Income */
    incomeData.message = message;
    incomeData.amount = formattedValue;

    incomeList.push(incomeData);
    localStorage.setItem("income", JSON.stringify(incomeList));
  }
  text.value = "";
  amount.value = "";

  updateIncomeExpense();
  renderTransactions();
}

// Update income, expense, and balance
function updateIncomeExpense() {
  const totalIncome = incomeList.reduce(
    (acc, curr) => acc + parseFloat(curr.amount),
    0
  );

  const totalExpense = expenseList.reduce(
    (acc, curr) => acc + parseFloat(curr.amount),
    0
  );

  income.innerText = `₹${totalIncome.toFixed(2)}`;
  expense.innerText = `₹${Math.abs(totalExpense).toFixed(2)}`;

  const totalBalance = totalIncome + totalExpense;
  balance.innerText = `₹${totalBalance.toFixed(2)}`;
}

// Render transactions in the list
function renderTransactions() {
  list.innerHTML = "";

  [...incomeList, ...expenseList].forEach((item) => {
    const date = new Date(item.date)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    const li = document.createElement("li");
    li.classList.add(item.amount < 0 ? "minus" : "plus");
    li.innerHTML = `${item.message}: <span>₹${item.amount} • Date: ${date}</span>`;
    list.appendChild(li);
  });

  setupPagination();
}

form.addEventListener("submit", onSubmit);
renderTransactions();
updateIncomeExpense();
displayPage(currentPage);
updatePagination();
