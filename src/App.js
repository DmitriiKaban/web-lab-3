import React, { useState } from 'react';
import Book from './Book';
import './App.css'; // You might want to add some global styles

function App() {
    const [books, setBooks] = useState([
        { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: 1954, pages: 1178 },
        { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, pages: 432 },
        { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, pages: 281 },
        { id: 4, title: '1984', author: 'George Orwell', year: 1949, pages: 328 },
        { id: 5, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, pages: 180 },
        { id: 6, title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', year: 1967, pages: 417 },
        { id: 7, title: 'Moby Dick', author: 'Herman Melville', year: 1851, pages: 635 },
        { id: 8, title: 'Hamlet', author: 'William Shakespeare', year: 1603, pages: 342 },
        { id: 9, title: 'The Odyssey', author: 'Homer', year: -800, pages: 374 },
        { id: 10, title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', year: 1890, pages: 254 },
        { id: 11, title: 'Jane Eyre', author: 'Charlotte Brontë', year: 1847, pages: 532 },
        { id: 12, title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951, pages: 234 },
        { id: 13, title: 'Brave New World', author: 'Aldous Huxley', year: 1932, pages: 311 },
        { id: 14, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, pages: 310 },
        { id: 15, title: 'Little Women', author: 'Louisa May Alcott', year: 1868, pages: 449 },
        { id: 16, title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', year: 1892, pages: 309 },
    ]);
    const [newBook, setNewBook] = useState({ title: '', author: '', year: '', pages: '' });
    const [editingBookId, setEditingBookId] = useState(null);

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
        setEditingBookId(null);
    };

    const startEdit = (id) => {
        setEditingBookId(id);
        const bookToEdit = books.find((book) => book.id === id);
        setNewBook({ ...bookToEdit });
    };

    const saveEdit = () => {
        if (newBook.title && newBook.author && newBook.year && newBook.pages) {
            setBooks(
                books.map((book) =>
                    book.id === editingBookId ? { ...newBook, id: editingBookId } : book
                )
            );
            setEditingBookId(null);
            setNewBook({ title: '', author: '', year: '', pages: '' });
        } else {
            alert('Please fill in all book details.');
        }
    };

    return (
        <div className="app">
            <h1>Book Management</h1>
            <div className="content-wrapper">
                <div className="book-list-container">
                    <h2>Book List</h2>
                    <div className="book-grid">
                        {books.map((book) => (
                            <Book
                                key={book.id}
                                book={book}
                                onDelete={deleteBook}
                                onEdit={startEdit}
                            />
                        ))}
                    </div>
                </div>
                <div className="add-new-book-container">
                    <h2>{editingBookId ? 'Edit Book' : 'Add New Book'}</h2>
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
                    <button onClick={editingBookId ? saveEdit : addBook}>
                        {editingBookId ? 'Save Edit' : 'Add Book'}
                    </button>
                    {editingBookId && <button onClick={() => setEditingBookId(null)}>Cancel Edit</button>}
                </div>
            </div>
        </div>
    );
}

export default App;