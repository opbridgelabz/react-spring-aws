import { useState } from "react";
import { addBook } from "./api";

function BookForm({ onAdd }) {
  const [book, setBook] = useState({
    title: "",
    author: "",
    isbn: "",
    available: true,
  });

  const handleChange = (e) =>
    setBook({ ...book, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!book.title.trim()) return alert("Title is required");
    await addBook(book);
    setBook({ title: "", author: "", isbn: "", available: true });
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Book</h3>
      <input name="title" value={book.title} onChange={handleChange} placeholder="Title" required />
      <input name="author" value={book.author} onChange={handleChange} placeholder="Author" />
      <input name="isbn" value={book.isbn} onChange={handleChange} placeholder="ISBN" />
      <button type="submit">Add Book</button>
    </form>
  );
}

export default BookForm;
