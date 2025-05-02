import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faEdit,
    faTrashAlt,
    faCalendarAlt,
    faBookOpen,
    faLayerGroup,
    faQuoteRight,
    faStar as faStarSolid,
    faComment
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import './BookDetail.css';

const BookDetail = ({ book, onClose, onEdit, onDelete, theme }) => {
    if (!book) return null;

    // Render star rating (reusing from App.js)
    const renderStarRating = (rating) => {
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
            <FontAwesomeIcon icon={faStarRegular} />
            <span className="half">
              <FontAwesomeIcon icon={faStarSolid} />
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
                {stars} <span className="rating-number">({rating}/10)</span>
            </div>
        );
    };

    return (
        <div className={`book-detail-overlay ${theme}`}>
            <div className="book-detail-container">
                <div className="book-detail-header">
                    <button className="back-button" onClick={onClose}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Collection
                    </button>
                    <div className="book-detail-actions">
                        <button className="edit-button" onClick={() => onEdit(book)}>
                            <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                        <button className="delete-button" onClick={() => onDelete(book.id)}>
                            <FontAwesomeIcon icon={faTrashAlt} /> Delete
                        </button>
                    </div>
                </div>

                <div className="book-detail-content">
                    <div className="book-detail-image-container">
                        <img
                            src={book.image || '/api/placeholder/240/360'}
                            alt={`Cover for ${book.title}`}
                            className="book-detail-image"
                            onError={(e) => { e.target.src = '/placeholder-book.png' }}
                        />
                    </div>

                    <div className="book-detail-info">

                        <h1 className="book-detail-title" style={{ textAlign: 'left' }}>{book.title}</h1>
                        <h2 className="book-detail-author">by {book.author}</h2>

                        <div className="book-detail-metadata">
                            <div className="metadata-item">
                                <FontAwesomeIcon icon={faCalendarAlt} className="metadata-icon" />
                                <span>Published: {book.year}</span>
                            </div>

                            <div className="metadata-item">
                                <FontAwesomeIcon icon={faBookOpen} className="metadata-icon" />
                                <span>Read in: {book.readYear}</span>
                            </div>

                            {book.genre && (
                                <div className="metadata-item">
                                    <FontAwesomeIcon icon={faLayerGroup} className="metadata-icon" />
                                    <span>Genre: {book.genre}</span>
                                </div>
                            )}

                                <div className="metadata-item">

                                    {renderStarRating(book.rating)}
                                </div>
                        </div>

                        {book.comments && (
                            <div className="book-detail-comments">
                                <h3>
                                    <FontAwesomeIcon icon={faComment} className="comments-icon" />
                                    My Notes
                                </h3>
                                <div className="comments-content">
                                    <FontAwesomeIcon icon={faQuoteRight} className="quote-icon" />
                                    <p>{book.comments}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;