import { gql, useMutation } from '@apollo/client';

// Query to fetch all books
export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      year
      rating
      readYear
      comments
      image
    }
  }
`;

// Mutation to add a new book
export const ADD_BOOK = gql`
  mutation AddBook($book: BookInput!) {
    addBook(book: $book) {
      id
      title
      author
      year
      rating
      readYear
      comments
      image
    }
  }
`;

// Mutation to update an existing book
export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $book: BookInput!) {
    updateBook(id: $id, book: $book) {
      id
      title
      author
      year
      rating
      readYear
      comments
      image
    }
  }
`;

// Mutation to delete a book
export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

// Hook to add a book
export const useAddBook = () => {
    const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
        refetchQueries: [{ query: GET_BOOKS }],
    });

    const addNewBook = async (bookData) => {
        try {
            const { data } = await addBook({
                variables: { book: bookData }
            });
            return data.addBook;
        } catch (error) {
            console.error("Error adding book:", error);
            throw error;
        }
    };

    return { addNewBook, loading, error };
};

// Hook to update a book
export const useUpdateBook = () => {
    const [updateBook, { loading, error }] = useMutation(UPDATE_BOOK, {
        refetchQueries: [{ query: GET_BOOKS }],
    });

    const updateExistingBook = async (id, bookData) => {
        try {
            const { data } = await updateBook({
                variables: { id, book: bookData }
            });
            return data.updateBook;
        } catch (error) {
            console.error("Error updating book:", error);
            throw error;
        }
    };

    return { updateExistingBook, loading, error };
};

// Hook to delete a book
export const useDeleteBook = () => {
    const [deleteBook, { loading, error }] = useMutation(DELETE_BOOK, {
        refetchQueries: [{ query: GET_BOOKS }],
    });

    const removeBook = async (id) => {
        try {
            const { data } = await deleteBook({
                variables: { id }
            });
            return data.deleteBook;
        } catch (error) {
            console.error("Error deleting book:", error);
            throw error;
        }
    };

    return { removeBook, loading, error };
};