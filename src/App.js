import React, { useState } from 'react';
import Book from './Book';
import './App.css';

function App() {
  const [books] = useState([
    { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: 1954, pages: 1178 },
    { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, pages: 432 },
  ]);

  return (
      <div className="app">
        <h1>Book Management</h1>

        <div className="book-list">
          <h2>Book List</h2>
          {books.map((book) => (
              <Book
                  key={book.id}
                  book={book}
              />
          ))}
        </div>
      </div>
  );
}

export default App;