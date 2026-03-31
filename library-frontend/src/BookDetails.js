import { useEffect, useState } from "react";
import { getBook } from "./api";

function BookDetails({ bookId }) {
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (bookId) {
      getBook(bookId).then((res) => setBook(res.data));
    }
  }, [bookId]);

  if (!book) return null;

  return (
    <div>
      <h3>Book Details</h3>
      <p><b>Title:</b> {book.title}</p>
      <p><b>Author:</b> {book.author}</p>
      <p><b>ISBN:</b> {book.isbn}</p>
      <p><b>Status:</b> {book.available ? "Available" : "Unavailable"}</p>
    </div>
  );
}

export default BookDetails;
