import React, {useState, useEffect} from 'react';
import './App.css';
import './App.dark.css';
import './ThemeToggle.css';
import initialBooks from "./data/initialBooks.json";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar as faStarRegular} from '@fortawesome/free-regular-svg-icons';
import {
    faSun,
    faMoon,
    faSearch,
    faStar as faStarSolid,
    faStarHalfAlt
} from '@fortawesome/free-solid-svg-icons'

function App() {

    const [books, setBooks] = useState(initialBooks);
    const [newBook, setNewBook] = useState({title: '', author: '', year: '', pages: '', image: ''});
    const [editingBookId, setEditingBookId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({
        readYear: 'all',
        sortBy: 'readYear',
        ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // All ratings selected by default
    });
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });
    const [collapsedYears, setCollapsedYears] = useState([]);

    useEffect(() => {
        // const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        setBooks(initialBooks);

        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
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
            // If no image provided, use a placeholder
            const bookToAdd = {
                ...newBook,
                id: Date.now(),
                image: newBook.image || '/api/placeholder/120/180'
            };
            setBooks([...books, bookToAdd]);
            setNewBook({title: '', author: '', year: '', pages: '', image: ''});
        } else {
            alert('Please fill in all required book details.');
        }
    };

    const deleteBook = (id) => {
        setBooks(books.filter((book) => book.id !== id));
        setEditingBookId(null);
    };

    const startEdit = (id) => {
        setEditingBookId(id);
        const bookToEdit = books.find((book) => book.id === id);
        setNewBook({...bookToEdit});
    };

    const cancelEdit = () => {
        setEditingBookId(null);
        setNewBook({title: '', author: '', year: '', pages: '', image: ''});
    };

    const saveEdit = () => {
        if (newBook.title && newBook.author && newBook.year && newBook.pages) {
            // Make sure image exists or use placeholder
            const updatedBook = {
                ...newBook,
                id: editingBookId,
                image: newBook.image || '/api/placeholder/120/180'
            };

            setBooks(
                books.map((book) =>
                    book.id === editingBookId ? updatedBook : book
                )
            );
            setEditingBookId(null);
            setNewBook({title: '', author: '', year: '', pages: '', image: ''});
        } else {
            alert('Please fill in all required book details.');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is already reactive with the searchTerm state
    };

    const handleRatingCheckboxChange = (rating) => {
        const currentRatings = [...filterCriteria.ratings];
        if (currentRatings.includes(rating)) {
            // Remove rating if already selected
            setFilterCriteria({
                ...filterCriteria,
                ratings: currentRatings.filter(r => r !== rating)
            });
        } else {
            // Add rating if not selected
            setFilterCriteria({
                ...filterCriteria,
                ratings: [...currentRatings, rating].sort((a, b) => a - b)
            });
        }
    };

    const handleSelectAllRatings = () => {
        setFilterCriteria({
            ...filterCriteria,
            ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        });
    };

    const handleClearAllRatings = () => {
        setFilterCriteria({
            ...filterCriteria,
            ratings: []
        });
    };

    // Render star rating based on number (1-10)
    const renderStarRating = (rating) => {
        // Convert rating from 1-10 scale to 0-5 scale
        const normalizedRating = rating / 2;
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(normalizedRating)) {
                // Full star
                stars.push(
                    <FontAwesomeIcon
                        key={i}
                        icon={faStarSolid}
                        className="star filled"
                    />
                );
            } else if (i === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0) {
                // Half star
                stars.push(
                    <span key={i} className="star half-filled">
                        <FontAwesomeIcon icon={faStarRegular}/>
                        <span className="half">
                            <FontAwesomeIcon icon={faStarSolid}/>
                        </span>
                    </span>
                );
            } else {
                // Empty star
                stars.push(
                    <FontAwesomeIcon
                        key={i}
                        icon={faStarRegular}
                        className="star"
                    />
                );
            }
        }

        return (
            <div className="star-rating">
                {stars}
            </div>
        );
    };

    // Filter and sort books
    const filteredBooks = books.filter(book => {
        // Apply search term filter
        const searchMatch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.comments && book.comments.toLowerCase().includes(searchTerm.toLowerCase()));

        // Apply year filter
        const yearMatch = filterCriteria.readYear === 'all' ||
            book.readYear.toString() === filterCriteria.readYear;

        // Apply rating filter (from checkboxes)
        const ratingMatch = filterCriteria.ratings.includes(book.rating);

        return searchMatch && yearMatch && ratingMatch;
    });

    // Sort filtered books
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        switch (filterCriteria.sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'author':
                return a.author.localeCompare(b.author);
            case 'rating':
                return b.rating - a.rating;
            case 'year':
                return b.year - a.year;
            case 'readYear':
            default:
                return b.readYear - a.readYear;
        }
    });

    // Get unique read years for organizing books
    const readYears = [...new Set(sortedBooks.map(book => book.readYear))].sort((a, b) => b - a);

    // Group books by read year
    const groupedBooks = readYears.reduce((acc, year) => {
        acc[year] = sortedBooks.filter(book => book.readYear === year);
        return acc;
    }, {});

    // Calculate rows per year (including form in the first row)
    const getBooksInRows = (booksForYear, yearIndex) => {
        const booksPerRow = 4; // Changed to 5 books per row
        const rows = [];
        const booksCopy = [...booksForYear];

        // Insert form in the first row of the current year if editing a book from this year
        // or if this is the newest year and not editing any book
        const showFormInYear =
            (editingBookId && booksForYear.some(book => book.id === editingBookId)) ||
            (!editingBookId && yearIndex === 0);

        // First row with possible form
        if (showFormInYear) {
            const firstRowBooks = booksCopy.splice(0, booksPerRow - 1);
            rows.push([...firstRowBooks, 'form']);
        } else {
            const firstRowBooks = booksCopy.splice(0, booksPerRow);
            rows.push(firstRowBooks);
        }

        // Remaining rows
        while (booksCopy.length > 0) {
            rows.push(booksCopy.splice(0, booksPerRow));
        }

        return rows;
    };

    // Get unique read years for filter dropdown
    const uniqueReadYears = [...new Set(books.map(book => book.readYear))].sort((a, b) => b - a);
    return (
        <div className={`app ${theme}`}>
            <div className="header">
                <h1>My Book Collection</h1>
                <div className="theme-switch-wrapper">
                    <label className="theme-switch">
                        <input
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        />
                        <span className="slider">
                            <FontAwesomeIcon icon={faSun} className="switch-sun"/>
                            <FontAwesomeIcon icon={faMoon} className="switch-moon"/>
                        </span>
                    </label>
                </div>
            </div>

            <div className="search-filter-container">
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </form>

                <div className="filter-options">
                    <select
                        value={filterCriteria.readYear}
                        onChange={(e) => setFilterCriteria({...filterCriteria, readYear: e.target.value})}
                    >
                        <option value="all">All Years</option>
                        {uniqueReadYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <select
                        value={filterCriteria.sortBy}
                        onChange={(e) => setFilterCriteria({...filterCriteria, sortBy: e.target.value})}
                    >
                        <option value="readYear">Sort by Read Year</option>
                        <option value="title">Sort by Title</option>
                        <option value="author">Sort by Author</option>
                        <option value="rating">Sort by Rating</option>
                        <option value="year">Sort by Published Year</option>
                    </select>

                    <div className="rating-filter">
                        <div className="rating-filter-title">Rating:</div>
                        <div className="rating-checkbox-group">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                                <label key={rating} className="rating-checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={filterCriteria.ratings.includes(rating)}
                                        onChange={() => handleRatingCheckboxChange(rating)}
                                    />
                                    {rating}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="book-grid-container">
                {readYears.map((year, yearIndex) => (
                    <div key={year}>
                        <div className="year-divider"></div>
                        <h2 className="year-heading">{year}</h2>

                        {getBooksInRows(groupedBooks[year], yearIndex).map((row, rowIndex) => (
                            <div key={`${year}-row-${rowIndex}`} className="book-row">
                                {row.map((item, itemIndex) =>
                                    item === 'form' ? (
                                        <div key="add-book-form" className="add-book-item">
                                            <h3>{editingBookId ? 'Edit Book' : 'Add New Book'}</h3>
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={newBook.title}
                                                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Author"
                                                value={newBook.author}
                                                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Year Published"
                                                value={newBook.year}
                                                onChange={(e) => setNewBook({
                                                    ...newBook,
                                                    year: parseInt(e.target.value) || ''
                                                })}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Year Read"
                                                value={newBook.readYear}
                                                onChange={(e) => setNewBook({
                                                    ...newBook,
                                                    readYear: parseInt(e.target.value) || ''
                                                })}
                                            />
                                            <div className="rating-input">
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    value={newBook.rating || 5}
                                                    onChange={(e) => setNewBook({
                                                        ...newBook,
                                                        rating: parseInt(e.target.value)
                                                    })}
                                                />
                                                <span className="rating-value">{newBook.rating || 5}</span>
                                            </div>
                                            <textarea
                                                placeholder="Comments"
                                                value={newBook.comments || ''}
                                                onChange={(e) => setNewBook({...newBook, comments: e.target.value})}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Cover Image URL"
                                                value={newBook.image || ''}
                                                onChange={(e) => setNewBook({...newBook, image: e.target.value})}
                                            />
                                            <div className="form-actions">
                                                <button onClick={editingBookId ? saveEdit : addBook}>
                                                    {editingBookId ? 'Save' : 'Add'}
                                                </button>
                                                {editingBookId && (
                                                    <button onClick={cancelEdit}>Cancel</button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={item.id} className="book-item">
                                            <div className="book-title">
                                                {item.title}
                                                <div className="book-title-tooltip">{item.title}</div>
                                            </div>
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={`Cover for ${item.title}`}
                                                    className="book-image"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-book.png'
                                                    }}
                                                />
                                            )}
                                            <div className="book-author">{item.author}</div>
                                            {/*<div className="book-year">Published: {item.year}</div>*/}
                                            <div className="book-rating"> {renderStarRating(item.rating)} </div>
                                            <div className="book-actions">
                                                <button onClick={() => startEdit(item)}>Edit</button>
                                                <button onClick={() => deleteBook(item.id)}>Delete</button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                ))}

                {/* Show form at the bottom if no books or all years filtered out */}
                {readYears.length === 0 && (
                    <div className="book-row">
                        <div className="add-book-item">
                            <h3>Add New Book</h3>
                            <input
                                type="text"
                                placeholder="Title"
                                value={newBook.title}
                                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Author"
                                value={newBook.author}
                                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                            />
                            <input
                                type="number"
                                placeholder="Year Published"
                                value={newBook.year}
                                onChange={(e) => setNewBook({...newBook, year: parseInt(e.target.value) || ''})}
                            />
                            <input
                                type="number"
                                placeholder="Year Read"
                                value={newBook.readYear}
                                onChange={(e) => setNewBook({...newBook, readYear: parseInt(e.target.value) || ''})}
                            />
                            <div className="rating-input">
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={newBook.rating || 5}
                                    onChange={(e) => setNewBook({...newBook, rating: parseInt(e.target.value)})}
                                />
                                <span className="rating-value">{newBook.rating || 5}</span>
                            </div>
                            <textarea
                                placeholder="Comments"
                                value={newBook.comments || ''}
                                onChange={(e) => setNewBook({...newBook, comments: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Cover Image URL"
                                value={newBook.image || ''}
                                onChange={(e) => setNewBook({...newBook, image: e.target.value})}
                            />
                            <button onClick={addBook}>Add Book</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;