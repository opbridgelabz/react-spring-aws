import { useEffect, useState } from "react";
import { getBooks, deleteBook, updateAvailability } from "./api";

function BookList({ onSelect, refreshFlag }) {
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const res = await getBooks();
    setBooks(res.data);
  };

  useEffect(() => {
    loadBooks();
  }, [refreshFlag]);

  const handleDelete = async (id) => {
    await deleteBook(id);
    loadBooks();
  };

  const toggleAvailability = async (id, current) => {
    await updateAvailability(id, !current);
    loadBooks();
  };

  return (
    <div>
      <h3>Book List</h3>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            <strong>{b.title}</strong> by {b.author} [{b.available ? "Available" : "Unavailable"}]
            <button onClick={() => onSelect(b.id)}>Details</button>
            <button onClick={() => toggleAvailability(b.id, b.available)}>Toggle</button>
            <button onClick={() => handleDelete(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
