import React, { useState, useRef, useEffect } from 'react';

const RatingFilter = ({ filterCriteria, setFilterCriteria }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle clicking outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        // Only add listener when dropdown is open
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    // Toggle the dropdown
    const toggleDropdown = (e) => {
        e.preventDefault(); // Prevent any default behavior
        e.stopPropagation(); // Stop event bubbling
        setDropdownOpen(!dropdownOpen);
    };

    // Handle individual rating checkbox changes
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

    // Select all ratings
    const handleSelectAllRatings = (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Prevent event bubbling
        setFilterCriteria({
            ...filterCriteria,
            ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        });
    };

    // Clear all ratings
    const handleClearAllRatings = (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Prevent event bubbling
        setFilterCriteria({
            ...filterCriteria,
            ratings: []
        });
    };

    // Render stars for a given rating value (for the dropdown items)
    const renderRatingStars = (rating) => {
        const fullStars = Math.floor(rating / 2);
        const hasHalfStar = rating % 2 !== 0;
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<span key={i} className="dropdown-star">★</span>);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<span key={i} className="dropdown-star half">★</span>);
            } else {
                stars.push(<span key={i} className="dropdown-star empty">☆</span>);
            }
        }

        return stars;
    };

    // Prevent checkbox clicks from closing dropdown
    const handleCheckboxClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="rating-filter-container" ref={dropdownRef}>
            <button
                type="button" // Explicitly set button type
                className="rating-dropdown-button"
                onClick={toggleDropdown}
            >
                Rating Filter
                <div className="selected-ratings">
                    {filterCriteria.ratings.length > 0 && (
                        <span className="selected-rating-tag">
              {filterCriteria.ratings.length === 10 ? 'All' : `${filterCriteria.ratings.length} selected`}
            </span>
                    )}
                </div>
            </button>

            {dropdownOpen && (
                <div className="rating-dropdown-content">
                    <div className="rating-checkbox-group">
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => (
                            <div className="rating-checkbox-item" key={rating}>
                                <label onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        value={rating}
                                        checked={filterCriteria.ratings.includes(rating)}
                                        onChange={() => handleRatingCheckboxChange(rating)}
                                        onClick={handleCheckboxClick}
                                    />
                                    <div className="rating-star-display">
                                        {renderRatingStars(rating)}
                                        <span className="rating-number">{rating}/10</span>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="rating-dropdown-actions">
                        <button
                            type="button" // Explicitly set button type
                            className="select-all-ratings"
                            onClick={handleSelectAllRatings}
                        >
                            Select All
                        </button>
                        <button
                            type="button" // Explicitly set button type
                            className="clear-ratings"
                            onClick={handleClearAllRatings}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatingFilter;