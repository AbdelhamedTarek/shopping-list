const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

const displayItems = () => {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
  checkUI();
};

const onAddItemSubmit = (e) => {
  e.preventDefault();
  const newItem = itemInput.value;
  if (newItem === "") {
    alert("please add some items");
    return;
  }

  // Check for Edit Mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      alert("That item already exist");
      return;
    }
  }

  // Create list Items

  addItemToDOM(newItem);

  // add item to local storage

  addItemToStorage(newItem);

  checkUI();

  itemInput.value = "";
};

const addItemToDOM = (item) => {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);
};

const addItemToStorage = (item) => {
  const itemsFromStorage = getItemFromStorage();

  itemsFromStorage.push(item);
  //Convert To Json string and set to localStorage

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const getItemFromStorage = (item) => {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
};

const createButton = (classes) => {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
};

const createIcon = (clasess) => {
  const icon = document.createElement("i");

  icon.className = clasess;
  return icon;
};

const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

const checkIfItemExist = (item) => {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
};

const setItemToEdit = (item) => {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class= "fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "#228b22";
  itemInput.value = item.textContent;
};

const removeItem = (item) => {
  if (confirm("Are you sure")) {
    item.remove();
    removeItemFromStorage(item.textContent);
    checkUI();
  }
};

const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemFromStorage();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const clearItems = () => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  localStorage.removeItem("items");
  checkUI();
};

const checkUI = () => {
  itemInput.value = "";
  const items = document.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = '<i class= "fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
};

const filterItems = (e) => {
  const items = document.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
    // console.log(itemName);
  });

  // console.log(text);
};

const init = () => {
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
};

init();
