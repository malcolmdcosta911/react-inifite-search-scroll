// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useCallback, useRef } from "react";
import "./App.css";
import { useState } from "react";
import useBookSearch from "./hooks/useBookSearch";


//------------ removed strict mode
function App() {
  //
  const [query, setQuery] = useState("");
  const [pageNo, setPageNo] = useState(1);
  // const [books, setBooks] = useState([1, 2, 3, 4, 5]);
  const observerRef = useRef();

  const { books, loading, hasMore, error } = useBookSearch(query, pageNo);
  // console.log("hasMore", hasMore);
  const lastChildChange = useCallback(
    (node) => {
      if (loading) return; //wait until load complete
      // console.log("yes");
      // if (node) { observerRef.current.observe(node); } //cannot use here as not defined
      observerRef.current = new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting && hasMore) {
          observer.unobserve(entries[0].target);
          setPageNo((pageNo) => pageNo + 1);
          // setBooks(data => [...data, data.length])
        }
      });
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [hasMore, loading]
  );

  // Initially, myRef.current will be null.
  // //When React creates a DOM node for this <div>, React will put a reference to this node into myRef.current
  //
  //
  // function lastChildChange(node) {
  //   console.log("yes", node);
  // }
  //
  //
  return (
    <>
      <nav className="nav">
        <form
          action=" "
          className="search"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h1>Books.com</h1>
          <input
            type="text"
            className="search__input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPageNo(1);
            }}
          />
          <button className="search__btn" type="submit">
            search
          </button>
        </form>
      </nav>
      <main>
        <section>
          <div className="container">
            {books.map((book, index) => {
              if (books.length === index + 1) {
                return (
                  <div ref={lastChildChange} key={book}>
                    {book}
                  </div>
                );
              } else {
                return <div key={book}>{book}</div>;
              }
            })}
            {error && <div>Error</div>}
            {loading && <div>Loading...</div>}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
