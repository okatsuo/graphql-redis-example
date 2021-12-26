import { Book, books } from './db-books';
import { cache } from './redis';

class BooksService {
  getAllBooks(): Book[] {
    return books
  }

  async getById(bookId: number): Promise<Book | undefined> {
    const book = cache.getOrSetCache({
      key: `book:${bookId}`,
      callback: () => {
        const book = books.find((book) => book.id === bookId)
        if (!book) return;
        return book;
      }
    })
    return book
  }

  async bookUpdate(bookId: number, fields: any): Promise<Book | undefined> {
    const bookIndex = books.map((book) => book.id).indexOf(bookId)
    if (bookIndex < 0) return;

    books[bookIndex] = { ...books[bookIndex], ...fields }

    cache.setCache({
      key: `book:${bookId}`,
      data: books[bookIndex]
    })

    return books[bookIndex]
  }

  async bookRemove(bookId: number): Promise<Book | undefined> {
    const indexToRemove = books.map((book) => book.id).indexOf(bookId)
    if (indexToRemove < 0) return;
    const removedBook = books.splice(indexToRemove, 1)[0]

    cache.deleteCache(`book:${bookId}`)

    return removedBook
  }
}

export const booksService = new BooksService()