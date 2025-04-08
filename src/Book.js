import React from 'react';
import './Book.css';

function Book({ book, onDelete, onEdit }) {
    return (
        <div className="book-item">
            <div className="book-title">
                <strong>{book.title}</strong>
            </div>
            <div>Author: {book.author}</div>
            <div>Year: {book.year}</div>
            <div>Pages: {book.pages}</div>
            <div className="book-actions">
                <button onClick={() => onEdit(book.id)}>Edit</button>
                <button onClick={() => onDelete(book.id)}>Delete</button>
            </div>
        </div>
    );
}

export default Book;