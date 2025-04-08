import React from 'react';
import './Book.css';

function Book({ book, onDelete, onEdit }) {
    return (
        <div className="book-item">
            <div><strong>Title:</strong> {book.title}</div>
            <div><strong>Author:</strong> {book.author}</div>
            <div><strong>Year:</strong> {book.year}</div>
            <div><strong>Pages:</strong> {book.pages}</div>
        </div>
    );
}

export default Book;