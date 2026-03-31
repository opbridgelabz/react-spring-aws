package com.main.controller;

import com.main.entity.Book;
import com.main.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins="*")
@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService service;

    @Autowired
    public BookController(BookService service) {
        this.service = service;
    }

    @GetMapping
    public List<Book> getAll() {
        return service.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getById(@PathVariable int id) {
        return service.getBookById(id).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    @PostMapping
    public Book add(@Validated @RequestBody Book book) {
        return service.addBook(book);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.deleteBook(id);
    }

    @PatchMapping("/{id}")
    public Book updateAvailable(@PathVariable int id, @RequestBody Book b) {
        return service.updateAvailability(id, b.isAvailable());
    }
}
