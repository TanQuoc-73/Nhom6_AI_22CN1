document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chatWindow");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const clearChatBtn = document.getElementById("clearChatBtn");
    const bookResults = document.getElementById("bookResults");
    const similarBooks = document.getElementById("similarBooks");
    const chatHistory = document.getElementById("chatHistory");
    const header = document.getElementById("header");
    const bookModal = document.getElementById("bookModal");
    const closeModal = document.getElementById("closeModal");
    const modalBookTitle = document.getElementById("modalBookTitle");
    const modalBookCover = document.getElementById("modalBookCover");
    const modalBookAuthor = document.getElementById("modalBookAuthor");
    const modalBookCategory = document.getElementById("modalBookCategory");
    const modalBookDescription = document.getElementById("modalBookDescription");
    const modalSimilarBooks = document.getElementById("modalSimilarBooks");
    const toggleLangBtn = document.getElementById("toggleLangBtn");

    let currentLang = 'vi'; // Ngôn ngữ mặc định là tiếng Việt
    const books = JSON.parse(localStorage.getItem("books")) || []; // Dữ liệu sách từ localStorage
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || []; // Lịch sử tìm kiếm

    const addSearchToHistory = (query, foundBooks) => {
        searchHistory.push({ query, foundBooks });
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        displaySearchHistory(); // Hiển thị lịch sử tìm kiếm sau khi thêm
    };

    const displaySearchHistory = () => {
    chatHistory.innerHTML = ""; // Xóa lịch sử hiển thị trước đó
    // Duyệt lịch sử từ mới nhất đến cũ nhất
    searchHistory.reverse().forEach(entry => {
        const historyElem = document.createElement("div");
        historyElem.classList.add("search-history-item");
        historyElem.innerHTML = `
            <strong>Tìm kiếm:</strong> ${entry.query} <br>
            ${entry.foundBooks.map(book => `
                <div class="book-item">
                    <img src="${book.cover}" alt="${book.name}" class="book-cover">
                    <p><strong>${book.name}</strong></p>
                </div>
            `).join('')}
        `;
        chatHistory.appendChild(historyElem);
    });
};


    const clearSearchHistory = () => {
        if (confirm("Bạn có chắc chắn muốn xóa lịch sử tìm kiếm?")) {
            searchHistory.length = 0; // Xóa lịch sử
            localStorage.removeItem("searchHistory"); // Xóa khỏi localStorage
            displaySearchHistory(); // Cập nhật hiển thị
        }
    };

    const translate = (vi, en) => {
        return currentLang === 'vi' ? vi : en;
    };

    const searchBooks = (query) => {
        const keywords = query.toLowerCase().split(" ");
        let primaryCriterion = "general"; // Tiêu chí tìm kiếm mặc định

        // Kiểm tra các từ khóa để xác định tiêu chí ưu tiên
        if (query.includes("tác giả") || query.includes("của người") || query.includes("người tên")) {
            primaryCriterion = "author"; // Ưu tiên theo tác giả
        } else if (query.includes("tên sách") || query.includes("sách tên")) {
            primaryCriterion = "name"; // Ưu tiên theo tên sách
        } else if (query.includes("nội dung") || query.includes("diễn biến") || query.includes("có nội dung")) {
            primaryCriterion = "description"; // Ưu tiên theo mô tả
        } else if (query.includes("được ưa thích") || query.includes("nổi bật") || query.includes("quan tâm") || query.includes("bán chạy nhất")) {
            primaryCriterion = "popularity"; // Ưu tiên theo độ phổ biến
        } else if (query.includes("thể loại") || query.includes("loại sách")) {
            primaryCriterion = "category"; // Ưu tiên theo thể loại
        }

        let filteredBooks = [];
        if (primaryCriterion === "author") {
            // Tìm kiếm theo tác giả
            filteredBooks = books.filter(book => 
                keywords.some(keyword => book.author.toLowerCase().includes(keyword))
            );
        } else if (primaryCriterion === "name") {
            // Tìm kiếm theo tên sách
            filteredBooks = books.filter(book => 
                keywords.some(keyword => book.name.toLowerCase().includes(keyword))
            );
        } else if (primaryCriterion === "description") {
            // Tìm kiếm theo mô tả
            filteredBooks = books.filter(book =>
                keywords.some(keyword => book.description.toLowerCase().includes(keyword))
            );
        } else if (primaryCriterion === "popularity") {
            // Sắp xếp theo độ phổ biến và lấy sách nổi bật nhất
            filteredBooks = books.sort((a, b) => b.clicks - a.clicks).slice(0, 1);
        } else if (primaryCriterion === "category") {
            // Tìm kiếm theo thể loại
            const categoryKeyword = keywords.find(keyword => keyword);
            filteredBooks = books.filter(book =>
                book.category.toLowerCase().includes(categoryKeyword)
            );
        } else {
            // Tìm kiếm tổng quát
            filteredBooks = books.filter(book =>
                book.name.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.description.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query)
            );
        }

        return filteredBooks;
    };

    const findSimilarBooks = (targetBook) => {
        return books.filter(book => 
            (book.author === targetBook.author || book.category === targetBook.category) && book.code !== targetBook.code
        ).slice(0, 3);  // Trả về 3 sách tương tự
    };

    const displayBooks = (books) => {
        bookResults.innerHTML = "";  // Xóa kết quả trước đó
        if (books.length > 0) {
            books.forEach(book => {
                const bookDiv = document.createElement("div");
                bookDiv.classList.add("book-item");
                bookDiv.innerHTML = `
                    <img src="${book.cover}" alt="${book.name}" class="book-cover">
                    <p><strong>${book.name}</strong></p>
                    <p>${book.author}</p>
                    <p><strong>${translate('Thể loại', 'Category')}:</strong> ${book.category}</p>
                `;
                bookDiv.addEventListener("click", () => openBookModal(book)); // Thêm sự kiện click để mở modal
                bookResults.appendChild(bookDiv);
            });
        } else {
            bookResults.innerHTML = `<p>${translate('Không tìm thấy sách nào.', 'No books found.')}</p>`;
        }
    };

    const displaySimilarBooksInModal = (books) => {
        modalSimilarBooks.innerHTML = ""; // Xóa sách liên quan trước đó
        books.forEach(book => {
            const similarDiv = document.createElement("div");
            similarDiv.classList.add("book-item");
            similarDiv.innerHTML = `
                <img src="${book.cover}" alt="${book.name}" class="book-cover">
                <p><strong>${book.name}</strong></p>
                <p>${book.author}</p>
            `;
            modalSimilarBooks.appendChild(similarDiv);
        });
    };

    const openBookModal = (book) => {
        modalBookTitle.innerText = book.name;
        modalBookCover.src = book.cover;
        modalBookAuthor.innerText = book.author;
        modalBookCategory.innerText = book.category;
        modalBookDescription.innerText = book.description;

        const similarBooksList = findSimilarBooks(book);
        displaySimilarBooksInModal(similarBooksList);

        bookModal.style.display = "block"; // Hiển thị modal
    };

    closeModal.addEventListener("click", () => {
        bookModal.style.display = "none"; // Đóng modal
    });

    window.addEventListener("click", (event) => {
        if (event.target === bookModal) {
            bookModal.style.display = "none"; // Đóng modal nếu nhấp bên ngoài
        }
    });

    const handleUserInput = () => {
        const query = userInput.value.trim().toLowerCase();
        if (query) {
            addSearchToHistory(query, searchBooks(query)); // Lưu lịch sử tìm kiếm
            const foundBooks = searchBooks(query);

            // Hiển thị sách tìm thấy
            displayBooks(foundBooks);
            userInput.value = ""; // Xóa ô nhập
        }
    };

    sendBtn.addEventListener("click", handleUserInput);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleUserInput();
        }
    });

    clearChatBtn.addEventListener("click", clearSearchHistory); // Nút xóa lịch sử tìm kiếm

    displaySearchHistory(); // Hiển thị lịch sử tìm kiếm khi tải trang
});