const dialog = document.querySelector("#dialog");
const openModal = document.querySelector("#add-open-modal");
const closeButton = document.querySelector("#close-button");
const form = document.querySelector("form");
const BooksContainer = document.querySelector(".Books");

class Book {
  constructor(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  updateRead() {
    this.read = !this.read;
  }
}

const myLibrary = [
  new Book("Pride and Prejudice", "Jane Austen", 279, true),
  new Book("1984", "George Orwell", 298, false),
  new Book("Hamlet", "William Shakespeare", 289, true),
];

function addBookToLibrary({ title, author, pages, read = false }) {
  const book = new Book(title, author, pages, read == "on" ? true : read);
  myLibrary.push(book);
  createBookElement(book);
}

function cleanInputs() {
  [...form.elements].forEach((element) => {
    element.attributes.type.value == "checkbox"
      ? (element.checked = false)
      : (element.value = "");
  });
}

function setStyleReadButton(button, read) {
  button.textContent = read ? "Read" : "Not Read";
  button.setAttribute("class", `Button Button--${read ? "success" : "light"}`);
}

function readButtonLogic(book) {
  const readButton = document.createElement("button");
  setStyleReadButton(readButton, book.read);
  readButton.addEventListener("click", () => {
    book.updateRead();
    setStyleReadButton(readButton, book.read);
  });

  return readButton;
}

function deleteButtonLogic(book) {
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.setAttribute("class", "Button Button--danger");
  removeButton.addEventListener("click", () => {
    const bookIndex = myLibrary.findIndex(
      (bookFind) => bookFind.id === book.id
    );

    myLibrary.splice(bookIndex, 1);
    displayBooks();
  });

  return removeButton;
}

function createBookElement(book) {
  const bookContainer = document.createElement("div");
  const title = document.createElement("p");
  const author = document.createElement("p");
  const pages = document.createElement("p");
  const readButton = readButtonLogic(book);
  const removeButton = deleteButtonLogic(book);

  bookContainer.setAttribute("class", "Book");

  title.textContent = book.title;
  author.textContent = book.author;
  pages.textContent = book.pages + " pages";

  bookContainer.appendChild(title);
  bookContainer.appendChild(author);
  bookContainer.appendChild(pages);
  bookContainer.appendChild(readButton);
  bookContainer.appendChild(removeButton);

  BooksContainer.appendChild(bookContainer);
}

function displayBooks() {
  BooksContainer.innerHTML = "";
  myLibrary.forEach((book) => {
    createBookElement(book);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const formObj = Object.fromEntries(formData.entries());
  addBookToLibrary(formObj);
  cleanInputs();
  dialog.close();
});

openModal.addEventListener("click", () => dialog.showModal());
closeButton.addEventListener("click", () => dialog.close());
displayBooks();
