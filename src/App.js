import React, { useState } from 'react';
import Book from './Book';
import './App.css'; // You might want to add some global styles

function App() {
    const [books, setBooks] = useState([
        { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: 1954, pages: 1178 },
        { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, pages: 432 },
    ]);
    const [newBook, setNewBook] = useState({ title: '', author: '', year: '', pages: '' });

    const addBook = () => {
        if (newBook.title && newBook.author && newBook.year && newBook.pages) {
            setBooks([...books, { ...newBook, id: Date.now() }]);
            setNewBook({ title: '', author: '', year: '', pages: '' });
        } else {
            alert('Please fill in all book details.');
        }
    };

    const deleteBook = (id) => {
        setBooks(books.filter((book) => book.id !== id));
    };

    return (
        <div className="app">
            <h1>Book Management</h1>

            {/* Add New Book Form */}
            <div className="add-new-book">
                <h2>{'Add New Book'}</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={newBook.year}
                    onChange={(e) => setNewBook({ ...newBook, year: parseInt(e.target.value) || '' })}
                />
                <input
                    type="number"
                    placeholder="Number of Pages"
                    value={newBook.pages}
                    onChange={(e) => setNewBook({ ...newBook, pages: parseInt(e.target.value) || '' })}
                />
                <button onClick={addBook}>
                    {'Add Book'}
                </button>
            </div>

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