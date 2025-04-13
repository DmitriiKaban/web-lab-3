import React, { useState } from 'react';
import './Book.css';

function Book({ book, onDelete, onEdit }) {
    // State to track if details are expanded
    const [expanded, setExpanded] = useState(false);

    // Default image if none is provided
    const coverImage = book.image || '/api/placeholder/120/180';

    // Toggle expanded section
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="book-item">
            <div className="book-cover">
                <img
                    src={coverImage}
                    alt={`Cover of ${book.title}`}
                    className="book-image"
                />
            </div>
            <div className="book-info">
                <div className="book-title">
                    {book.title}
                </div>
                <div>Author: {book.author}</div>
                <div>Published: {book.year}</div>
                <div>Rating: {book.rating || 'Not rated'}/10</div>

                <div className="book-actions">
                    <button onClick={() => onEdit(book.id)}>Edit</button>
                    <button onClick={() => onDelete(book.id)}>Delete</button>
                </div>

                <div
                    className="expand-arrow"
                    onClick={toggleExpanded}
                >
                    {expanded ? '▲' : '▼'}
                </div>

                {expanded && (
                    <div className="expanded-section">
                        <div className="read-info">Read in: {book.readYear || 'Not specified'}</div>
                        <div className="comments-section">
                            <h4>Comments:</h4>
                            {book.comments ? (
                                <p>{book.comments}</p>
                            ) : (
                                <p>No comments available.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Book;