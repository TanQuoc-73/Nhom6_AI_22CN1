document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const bookList = document.getElementById("bookList").getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById("searchInput");
    let editIndex = -1; // Khai báo biến để theo dõi chỉ số của sách đang chỉnh sửa

    // Load books from localStorage
    const loadBooks = () => {
        const books = JSON.parse(localStorage.getItem("books")) || [];
        bookList.innerHTML = ''; // Clear current list

        books.forEach((book, index) => {
            const row = bookList.insertRow();
            row.innerHTML = `
                <td><img src="${book.cover}" alt="Book Cover" style="width: 50px; height: 50px;"></td>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.code}</td>
                <td>${book.category}</td>
                <td>${book.quantity}</td>
                <td>${book.description}</td>
                <td>${book.dateAdded}</td>
                <td>
                    <button onclick="editBook(${index})">Sửa</button>
                    <button onclick="deleteBook(${index})">Xóa</button>
                </td>
            `;
        });
    };

    // Add or Edit book
    bookForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("bookName").value;
        const author = document.getElementById("authorName").value;
        const code = document.getElementById("bookCode").value;
        const quantity = document.getElementById("bookQuantity").value;
        const category = document.getElementById("bookCategory").value;
        const description = document.getElementById("bookDescription").value;
        const dateAdded = new Date().toLocaleDateString(); // Lấy ngày hiện tại
        const coverFile = document.getElementById("bookCover").files[0];

        const reader = new FileReader();
        reader.onloadend = function () {
            const cover = reader.result; // Convert image to base64

            const books = JSON.parse(localStorage.getItem("books")) || [];
            
            if (editIndex === -1) {
                // Thêm sách mới
                books.push({ name, author, code, category, quantity, description, dateAdded, cover });
            } else {
                // Cập nhật sách đã chỉnh sửa
                books[editIndex] = { name, author, code, category, quantity, description, dateAdded, cover };
                editIndex = -1; // Reset chỉ số sau khi chỉnh sửa
            }
            
            localStorage.setItem("books", JSON.stringify(books));

            bookForm.reset();
            loadBooks();
        };

        if (coverFile) {
            reader.readAsDataURL(coverFile);
        } else if (editIndex !== -1) {
            // Nếu không chọn ảnh mới khi chỉnh sửa, giữ ảnh cũ
            const books = JSON.parse(localStorage.getItem("books")) || [];
            const cover = books[editIndex].cover; // Lấy ảnh cũ
            books[editIndex] = { name, author, code, category, quantity, description, dateAdded, cover };
            localStorage.setItem("books", JSON.stringify(books));

            editIndex = -1; // Reset chỉ số sau khi chỉnh sửa
            bookForm.reset();
            loadBooks();
        } else {
            alert("Vui lòng chọn ảnh bìa sách."); // Thông báo nếu không có ảnh bìa cho sách mới
        }
    });

    // Edit book
    window.editBook = (index) => {
        const books = JSON.parse(localStorage.getItem("books"));
        const book = books[index];

        // Điền thông tin sách vào form
        document.getElementById("bookName").value = book.name;
        document.getElementById("authorName").value = book.author;
        document.getElementById("bookCode").value = book.code;
        document.getElementById("bookQuantity").value = book.quantity;
        document.getElementById("bookCategory").value = book.category; // Điền thể loại sách
        document.getElementById("bookDescription").value = book.description;
        
        // Không yêu cầu tải lại ảnh bìa khi chỉnh sửa
        document.getElementById("bookCover").required = false;

        editIndex = index; // Lưu chỉ số sách đang chỉnh sửa
    };

    // Delete book
    window.deleteBook = (index) => {
        const books = JSON.parse(localStorage.getItem("books"));
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books));
        loadBooks();
    };

    // Search books
    document.getElementById("searchBtn").addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        const books = JSON.parse(localStorage.getItem("books")) || [];
        const filteredBooks = books.filter(book =>
            book.name.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.code.toLowerCase().includes(query) ||
            book.category.toLowerCase().includes(query) ||
            book.dateAdded.includes(query)
        );

        bookList.innerHTML = ''; // Clear current list
        filteredBooks.forEach((book, index) => {
            const row = bookList.insertRow();
            row.innerHTML = `
                <td><img src="${book.cover}" alt="Book Cover" style="width: 50px; height: 50px;"></td>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.code}</td>
                <td>${book.category}</td>
                <td>${book.quantity}</td>
                <td>${book.description}</td>
                <td>${book.dateAdded}</td>
                <td>
                    <button onclick="editBook(${index})">Sửa</button>
                    <button onclick="deleteBook(${index})">Xóa</button>
                </td>
            `;
        });
    });

    loadBooks();
});
