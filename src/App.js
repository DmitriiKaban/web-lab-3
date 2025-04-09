import React, { useState, useEffect } from 'react';
import Book from './Book';
import './App.css';
import './App.dark.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './ThemeToggle.css';

function App() {
    const initialBooks = [
        { id: 1, title: 'Crime and Punishment', author: 'Fyodor Dostoyevsky', year: 1866, pages: 671 },
        { id: 2, title: 'The Brothers Karamazov', author: 'Fyodor Dostoyevsky', year: 1880, pages: 824 },
        { id: 3, title: 'The Idiot', author: 'Fyodor Dostoyevsky', year: 1869, pages: 656 },
        { id: 4, title: 'Demons', author: 'Fyodor Dostoyevsky', year: 1872, pages: 768 },
        { id: 5, title: 'Notes from Underground', author: 'Fyodor Dostoyevsky', year: 1864, pages: 128 },
        { id: 6, title: 'The Gambler', author: 'Fyodor Dostoyevsky', year: 1867, pages: 256 },
        { id: 7, title: 'Poor Folk', author: 'Fyodor Dostoyevsky', year: 1846, pages: 208 },
        { id: 8, title: 'The Double', author: 'Fyodor Dostoyevsky', year: 1846, pages: 160 },
        { id: 9, title: 'The House of the Dead', author: 'Fyodor Dostoyevsky', year: 1861, pages: 320 },
        { id: 10, title: 'A Raw Youth', author: 'Fyodor Dostoyevsky', year: 1875, pages: 608 },
        { id: 11, title: 'White Nights', author: 'Fyodor Dostoyevsky', year: 1848, pages: 80 },
        { id: 12, title: 'The Eternal Husband', author: 'Fyodor Dostoyevsky', year: 1870, pages: 176 },
        { id: 13, title: 'The Village of Stepanchikovo', author: 'Fyodor Dostoyevsky', year: 1859, pages: 352 },
        { id: 14, title: 'Uncle\'s Dream', author: 'Fyodor Dostoyevsky', year: 1859, pages: 128 },
        { id: 15, title: 'An Honest Thief', author: 'Fyodor Dostoyevsky', year: 1848, pages: 64 },
        { id: 16, title: 'The Landlady', author: 'Fyodor Dostoyevsky', year: 1847, pages: 128 },
    ];

    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', year: '', pages: '' });
    const [editingBookId, setEditingBookId] = useState(null);
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });


    // Load books from localStorage on component mount
    useEffect(() => {
        const storedBooks = localStorage.getItem('books');
        if (storedBooks) {
            setBooks(JSON.parse(storedBooks));
        } else {
            setBooks(initialBooks);
        }

        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);


    useEffect(() => {
        if (books.length > 0) {
            localStorage.setItem('books', JSON.stringify(books));
        }
    }, [books]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

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

    const cancelEdit = () => {
        setEditingBookId(null);
        setNewBook({ title: '', author: '', year: '', pages: '' });
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
        <div className={`app ${theme}`}>
            <div className="header">
                <h1>Book Management</h1>
                <div className="theme-switch-wrapper">
                    <label className="theme-switch" htmlFor="checkbox">
                        <input
                            type="checkbox"
                            id="checkbox"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        />
                        <span className="slider round">
                            <FontAwesomeIcon icon={faSun} className="switch-sun" />
                            <FontAwesomeIcon icon={faMoon} className="switch-moon" />
                        </span>
                    </label>
                </div>
            </div>
            <div className="content-wrapper">
                <div className="book-list-container">
                    <div className="book-list-header">
                        <h2>Book List</h2>
                    </div>
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
                    <div className="form-actions">
                        <button onClick={editingBookId ? saveEdit : addBook}>
                            {editingBookId ? 'Save Edit' : 'Add Book'}
                        </button>
                        {editingBookId && (
                            <button onClick={cancelEdit}>Cancel Edit</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;