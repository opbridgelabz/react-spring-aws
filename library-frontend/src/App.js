import { useState } from "react";
import BookForm from "./BookForm";
import BookList from "./BookList";
import BookDetails from "./BookDetails";

function App() {
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refresh = () => setRefreshFlag(!refreshFlag);

  return (
    <div className="App">
      <h1>📚 Library Catalog</h1>
      <BookForm onAdd={refresh} />
      <BookList onSelect={setSelectedBookId} refreshFlag={refreshFlag} />
      <BookDetails bookId={selectedBookId} />
    </div>
  );
}

export default App;
