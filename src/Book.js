import React from 'react';
import './Book.css';

function Book({ book, onDelete, onEdit }) {
    // Default image if none is provided
    const coverImage = book.image || '/api/placeholder/120/180';

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
                <div>Year: {book.year}</div>
                <div>Pages: {book.pages}</div>
                <div className="book-actions">
                    <button onClick={() => onEdit(book.id)}>Edit</button>
                    <button onClick={() => onDelete(book.id)}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default Book;