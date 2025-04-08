import React, { useState } from 'react';
import Book from './Book';
import './App.css'; // You might want to add some global styles

function App() {
  const [books, setBooks] = useState([
    { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: 1954, pages: 1178 },
    { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, pages: 432 },
  ]);

  const deleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
      <div className="app">
        <h1>Book Management</h1>

        {/* Book List */}
        <div className="book-list">
          <h2>Book List</h2>
          {books.map((book) => (
              <Book
                  key={book.id}
                  book={book}
                  onDelete={deleteBook}
              />
          ))}
        </div>
      </div>
  );
}

export default App;