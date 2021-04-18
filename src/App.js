import React, { useState, useRef, useCallback } from "react";
import useBooksSearch from "./hooks/useBooksSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBooksSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch} />
      <table>
        {books.map((book, index) => {
          if (books.length === index + 1)
            return (
              <tr ref={lastBookElementRef} key={book}>
                <td>{`${index + 1}`}</td>
                <td>{`${book}`}</td>
              </tr>
            );
          return (
            <tr key={book}>
              <td>{`${index + 1}`}</td>
              <td>{`${book}`}</td>
            </tr>
          );
        })}
      </table>
      <div style={{ color: "blue", fontWeight: "bold" }}>
        {loading && "Loading..."}
      </div>
      <div style={{ color: "red", fontWeight: "bold" }}>{error && "Error"}</div>
    </>
  );
}

export default App;
