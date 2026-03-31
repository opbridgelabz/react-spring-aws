package com.main.service;

import com.main.entity.Book;
import com.main.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository repo;

    @Autowired
    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    public List<Book> getAllBooks() {
        return repo.findAll();
    }

    public Optional<Book> getBookById(int id) {
        return repo.findById(id);
    }

    public Book addBook(Book book) {
        return repo.save(book);
    }

    public void deleteBook(int id) {
        repo.deleteById(id);
    }

    public Book updateAvailability(int id, boolean available) {
        Book book = repo.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        book.setAvailable(available);
        return repo.save(book);
    }
}
