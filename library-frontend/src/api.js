import axios from "axios";

const BASE_URL = "/api/books";
<<<<<<< HEAD
// const BASE_URL = "http://localhost:8080/books"; // Change if needed for backend
=======
>>>>>>> 0f8f26f1d8ce9c722e742bfe634d078a785cb4fc

export const getBooks = () => axios.get(BASE_URL);

export const getBook = (id) => axios.get(`${BASE_URL}/${id}`);

export const addBook = (book) => axios.post(BASE_URL, book);

export const deleteBook = (id) => axios.delete(`${BASE_URL}/${id}`);

export const updateAvailability = (id, available) =>
  axios.patch(`${BASE_URL}/${id}`, { available });
