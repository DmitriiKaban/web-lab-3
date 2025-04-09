# Book Management App

This React application allows users to manage a list of books. It provides functionalities to:

- **View a list of books:** Displays the title, author, year, and number of pages for each book.
- **Add new books:** Users can input the title, author, year, and number of pages to add a new book to the list.
- **Edit existing books:** Users can select a book to edit its details.
- **Delete books:** Users can remove books from the list.
- **Theme toggle:** Users can switch between a light and a dark theme for the application.
- **Local storage:** The list of books and the selected theme are persisted in the browser's local storage, so they are retained even after the browser is closed or refreshed.

## Flows

### Viewing Books

1.  **Initial Load:** When the application starts, it checks if there is any book data stored in the browser's `localStorage`.
2.  **Load from Local Storage:** If data exists, it is retrieved and used to populate the book list.
3.  **Initial Data:** If no data is found in `localStorage`, a predefined array of Dostoyevsky books (`initialBooks`) is used to populate the list.
4.  **Display:** The `books` state, which holds the array of book objects, is mapped over to render individual `Book` components. Each `Book` component displays the details of a single book.

### Adding a New Book

1.  **Input Fields:** The "Add New Book" section provides input fields for the title, author, year, and number of pages. These fields are controlled by the `newBook` state.
2.  **`addBook` Function:** When the "Add Book" button is clicked:
    - It checks if all the input fields in the `newBook` state have values.
    - If all fields are filled:
        - A new book object is created by spreading the `newBook` properties and adding a unique `id` using `Date.now()`.
        - The new book object is added to the `books` state using the spread operator to create a new array.
        - The `newBook` state is reset to its initial empty values.
    - If any field is empty, an alert message prompts the user to fill in all details.

### Editing a Book

1.  **"Edit" Button:** Each `Book` component has an "Edit" button.
2.  **`startEdit` Function:** When an "Edit" button is clicked:
    - The `editingBookId` state is set to the `id` of the book being edited.
    - The `newBook` state is updated with the details of the book to be edited, found by filtering the `books` array.
    - The "Add New Book" section's heading changes to "Edit Book", and the "Add Book" button changes to "Save Edit". A "Cancel Edit" button is also displayed.
3.  **Input Fields (Editing Mode):** The input fields in the "Edit Book" section are now populated with the details of the book being edited, controlled by the `newBook` state.
4.  **`saveEdit` Function:** When the "Save Edit" button is clicked:
    - It checks if all the input fields in the `newBook` state have values.
    - If all fields are filled:
        - The `books` state is updated by mapping over the existing books. If a book's `id` matches the `editingBookId`, its properties are updated with the values from the `newBook` state.
        - The `editingBookId` state is reset to `null`.
        - The `newBook` state is reset to its initial empty values.
    - If any field is empty, an alert message prompts the user to fill in all details.
5.  **`cancelEdit` Function:** When the "Cancel Edit" button is clicked:
    - The `editingBookId` state is reset to `null`.
    - The `newBook` state is reset to its initial empty values. The form reverts to the "Add New Book" state.

### Deleting a Book

1.  **"Delete" Button:** Each `Book` component has a "Delete" button.
2.  **`deleteBook` Function:** When a "Delete" button is clicked:
    - The `books` state is updated by filtering the existing books, keeping only the books whose `id` does not match the `id` of the book to be deleted.
    - The `editingBookId` state is reset to `null` to ensure no book is left in an editing state after deletion.

### Theme Toggle

1.  **Theme State:** The `theme` state controls the current theme of the application ('light' or 'dark'). It defaults to 'light'.
2.  **Theme Toggle Element:** A custom switch (`theme-switch-wrapper`) with a checkbox is used to toggle the theme.
3.  **`toggleTheme` Function:** When the checkbox's state changes:
    - The `toggleTheme` function is called.
    - It updates the `theme` state to the opposite of its current value.
4.  **Conditional Class:** The `app` div has a dynamic class name (`app ${theme}`). This allows applying different CSS styles based on the value of the `theme` state. The `App.css` file contains styles for the light theme, and `App.dark.css` contains styles that override the light theme for the dark theme.
5.  **Local Storage (Theme):**
    - On initial load, the application checks `localStorage` for a stored 'theme'. If found, it sets the `theme` state accordingly.
    - Whenever the `theme` state changes, it is saved to `localStorage` so that the user's preference is persisted across sessions.

### Local Storage Persistence

1.  **`useEffect` (Loading Books):** An effect runs once when the component mounts (`[]` as the dependency array). It attempts to retrieve book data from `localStorage` under the key 'books'. If data is found, it parses the JSON string and updates the `books` state. If not, it initializes the `books` state with the `initialBooks` array.
2.  **`useEffect` (Saving Books):** Another effect runs whenever the `books` state changes (`[books]` as the dependency array). If the `books` array has any elements, it converts the array to a JSON string and saves it to `localStorage` under the key 'books'. This ensures that any additions, edits, or deletions are saved.
3.  **`useEffect` (Loading Theme):** An effect runs once on mount to load the 'theme' from `localStorage`.
4.  **`useEffect` (Saving Theme):** An effect runs whenever the `theme` state changes to save the current theme to `localStorage`.