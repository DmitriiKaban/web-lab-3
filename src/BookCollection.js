import React, {useState, useEffect} from 'react';
import './App.css';
import './App.dark.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar as faStarRegular} from '@fortawesome/free-regular-svg-icons';
import {
    faSun,
    faMoon,
    faSearch,
    faStar as faStarSolid,
    faStarHalfAlt,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import RatingFilter from './RatingFilter';
import BookDetail from './BookDetail';
import apiService from './ApiService';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function BookCollection() {
    // Use the auth context for authentication-related functionality
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Changed initial state to empty array since we'll load from API
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({title: '', author: '', year: '', pages: '', image: '', genre: ''});
    const [editingBookId, setEditingBookId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({
        readYear: 'all',
        sortBy: 'readYear',
        ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // All ratings selected by default
        genre: 'all' // Add genre filter
    });
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });
    const [collapsedYears, setCollapsedYears] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    // Add loading state for API operations
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch books from API on component mount
    useEffect(() => {
        fetchBooks();

        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }, []);

    // Function to fetch books from API
    const fetchBooks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiService.books.getAll();

            // Check if the response contains books
            if (data && Array.isArray(data.books)) {
                setBooks(data.books);
            } else if (data && Array.isArray(data)) {
                // Some APIs might return books directly as an array
                setBooks(data);
            } else {
                console.warn("Unexpected response structure:", data);
                setBooks([]);
            }
        } catch (err) {
            console.error("Failed to fetch books:", err);
            setError(err.message + " Failed to load books. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Modified to use API
    const addBook = async () => {
        if (newBook.title && newBook.author && newBook.year && newBook.readYear) {
            const bookToAdd = {
                ...newBook,
                // Don't set id, let the server do it
                image: newBook.image || '/api/placeholder/120/180',
                rating: newBook.rating || 5, // Default rating if not set
                genre: newBook.genre || 'Uncategorized' // Default genre if not set
            };

            setIsLoading(true);
            try {
                const addedBook = await apiService.books.add(bookToAdd);
                const currentBooks = Array.isArray(books) ? books : [];
                setBooks([...currentBooks, addedBook]);
                setNewBook({title: '', author: '', year: '', readYear: '', pages: '', image: '', rating: 5, comments: '', genre: ''});
            } catch (err) {
                alert(err.message + ' Failed to add book.');
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Please fill in all required book details (title, author, year published, and year read).');
        }
    };

    // Modified to use API
    const deleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            setIsLoading(true);
            try {
                await apiService.books.delete({ id }); // Send ID as object
                // Ensure books is treated as an array
                const currentBooks = Array.isArray(books) ? books : [];
                setBooks(currentBooks.filter((book) => book.id !== id));
                if (editingBookId === id) {
                    setEditingBookId(null);
                    setNewBook({
                        title: '',
                        author: '',
                        year: '',
                        readYear: '',
                        pages: '',
                        image: '',
                        rating: 5,
                        comments: '',
                        genre: ''
                    });
                }
            } catch (err) {
                console.error("Failed to delete book:", err);
                alert(err.messasge + ' Failed to delete book. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const startEdit = (book) => {
        setEditingBookId(book.id);
        setNewBook({...book});
    };

    const cancelEdit = () => {
        setEditingBookId(null);
        setNewBook({title: '', author: '', year: '', pages: '', image: '', genre: ''});
    };

    // Modified to use API
    const saveEdit = async () => {
        if (newBook.title && newBook.author && newBook.year && newBook.readYear) {
            const updatedBook = {
                ...newBook,
                image: newBook.image || '/api/placeholder/120/180',
                rating: newBook.rating || 5, // Default rating if not set
                genre: newBook.genre || 'Uncategorized' // Default genre if not set
            };

            setIsLoading(true);
            try {
                await apiService.books.update(updatedBook);
                // Ensure books is treated as an array
                const currentBooks = Array.isArray(books) ? books : [];
                setBooks(
                    currentBooks.map((book) =>
                        book.id === editingBookId ? updatedBook : book
                    )
                );
                setEditingBookId(null);
                setNewBook({title: '', author: '', year: '', readYear: '', pages: '', image: '', rating: 5, comments: '', genre: ''});
            } catch (err) {
                alert(err.message + ' Failed to update book. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Please fill in all required book details (title, author, year published, and year read).');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handleBookClick = (book) => {
        setSelectedBook(book);
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

    // Safely handle filtering with defensive checks
    const safeBooks = Array.isArray(books) ? books : [];

    // Filter and sort books
    const filteredBooks = safeBooks.filter(book => {
        // Apply search term filter
        const searchMatch =
            (book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (book.comments && book.comments.toLowerCase().includes(searchTerm.toLowerCase()));

        // Apply year filter
        const yearMatch = filterCriteria.readYear === 'all' ||
            book.readYear?.toString() === filterCriteria.readYear;

        // Apply rating filter (from checkboxes)
        const ratingMatch = filterCriteria.ratings.includes(book.rating);

        // Apply genre filter
        const genreMatch = filterCriteria.genre === 'all' ||
            book.genre === filterCriteria.genre;

        return searchMatch && yearMatch && ratingMatch && genreMatch;
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
            case 'genre':
                return a.genre.localeCompare(b.genre);
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
        const booksPerRow = 4; // Changed to 4 books per row
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
    const uniqueReadYears = [...new Set(safeBooks.map(book => book.readYear))].sort((a, b) => b - a);

    // Get unique genres for filter dropdown
    const uniqueGenres = [...new Set(safeBooks.map(book => book.genre || 'Uncategorized'))].sort();

    // Display loading indicator if fetching data
    if (isLoading && safeBooks.length === 0) {
        return (
            <div className={`app ${theme}`}>
                <div className="loading-spinner">Loading books...</div>
            </div>
        );
    }

    // Display error message if API failed
    if (error && safeBooks.length === 0) {
        return (
            <div className={`app ${theme}`}>
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchBooks}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`app ${theme}`}>
            <div className="header">
                <h1>
                    {/*{user ? `${user.username}'s` : "My"} Book Collection*/}
                     My Book Collection
                    (as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})
                </h1>
                <div className="user-actions">
                    <button className="logout-button" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
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
            </div>

            {/* Show loading indicator during operations */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Loading...</div>
                </div>
            )}

            <div className="search-filter-container">
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">
                        <FontAwesomeIcon icon={faSearch}/>
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
                        value={filterCriteria.genre}
                        onChange={(e) => setFilterCriteria({...filterCriteria, genre: e.target.value})}
                    >
                        <option value="all">All Genres</option>
                        {uniqueGenres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
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
                        <option value="genre">Sort by Genre</option>
                    </select>
                </div>

                {/* Rating filter component */}
                <RatingFilter
                    filterCriteria={filterCriteria}
                    setFilterCriteria={setFilterCriteria}
                />
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
                                                type="text"
                                                placeholder="Genre"
                                                value={newBook.genre || ''}
                                                onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
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
                                        <div key={item.id} className="book-item"
                                             onClick={() => handleBookClick(item)}
                                        >
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
                                            {item.genre && (
                                                <div className="book-genre">Genre: {item.genre}</div>
                                            )}
                                            <div className="book-year">Published: {item.year}</div>
                                            <div className="book-rating"> {renderStarRating(item.rating)} </div>
                                            <div className="book-actions">
                                                <button
                                                    className="edit-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEdit(item);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteBook(item.id);
                                                    }}
                                                >
                                                    Delete
                                                </button>
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
                                type="text"
                                placeholder="Genre"
                                value={newBook.genre || ''}
                                onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
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
            {selectedBook && (
                <div className="book-detail-overlay">
                    <BookDetail
                        book={selectedBook}
                        onClose={() => setSelectedBook(null)}
                    />
                </div>
            )}
        </div>
    );
}

export default BookCollection;