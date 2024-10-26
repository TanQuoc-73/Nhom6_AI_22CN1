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

    let currentLang = 'vi';
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    const synonyms = {
        "tác giả": ["người viết", "nhà văn", "author"],
        "nổi bật": ["được ưa thích", "quan tâm", "phổ biến", "bán chạy nhất", "top"],
        "nội dung": ["diễn biến", "mô tả", "câu chuyện", "cốt truyện", "plot"],
        "thể loại": ["loại sách", "category", "genre"],
        "sách": ["book", "ấn phẩm"]
    };

    const expandKeywords = (keywords) => {
        const expanded = new Set();
        keywords.forEach(keyword => {
            expanded.add(keyword.toLowerCase()); // Chuyển tất cả từ khóa thành chữ thường
            if (synonyms[keyword]) {
                synonyms[keyword].forEach(syn => expanded.add(syn.toLowerCase())); // Chuyển từ đồng nghĩa thành chữ thường
            }
        });
        return Array.from(expanded);
    };

    const countKeywordMatches = (text, keywords) => {
        let count = 0;
        const lowercaseText = text.toLowerCase(); // Chuyển text thành chữ thường
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, "gi");
            const matches = lowercaseText.match(regex);
            count += matches ? matches.length : 0;
        });
        return count;
    };

    const addSearchToHistory = (query, foundBooks) => {
        searchHistory.push({ query, foundBooks });
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        displaySearchHistory();
    };

    const displaySearchHistory = () => {
        chatHistory.innerHTML = "";
        searchHistory.slice().reverse().forEach(entry => {
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
            searchHistory.length = 0;
            localStorage.removeItem("searchHistory");
            displaySearchHistory();
        }
    };

    const translate = (vi, en) => {
        return currentLang === 'vi' ? vi : en;
    };

    const searchBooks = (query) => {
        const keywords = expandKeywords(query.toLowerCase().split(" ")); // Chuyển query thành chữ thường
        let primaryCriterion = "general";

        if (query.includes("tác giả") || query.includes("của người") || query.includes("người tên")) {
            primaryCriterion = "author";
        } else if (query.includes("tên sách") || query.includes("sách tên")) {
            primaryCriterion = "name";
        } else if (query.includes("nội dung") || query.includes("diễn biến") || query.includes("có nội dung")) {
            primaryCriterion = "description";
        } else if (query.includes("được ưa thích") || query.includes("nổi bật") || query.includes("quan tâm") || query.includes("bán chạy nhất")) {
            primaryCriterion = "popularity";
        } else if (query.includes("thể loại") || query.includes("loại sách")) {
            primaryCriterion = "category";
        }

        let filteredBooks = [];
        if (primaryCriterion === "author") {
            filteredBooks = books.filter(book =>
                keywords.some(keyword => book.author.toLowerCase().includes(keyword)) // So sánh với chữ thường
            );
        } else if (primaryCriterion === "name") {
            filteredBooks = books.filter(book =>
                keywords.some(keyword => book.name.toLowerCase().includes(keyword)) // So sánh với chữ thường
            );
        } else if (primaryCriterion === "description") {
            filteredBooks = books.filter(book =>
                keywords.some(keyword => book.description.toLowerCase().includes(keyword)) // So sánh với chữ thường
            ).sort((a, b) => countKeywordMatches(b.description, keywords) - countKeywordMatches(a.description, keywords));
        } else if (primaryCriterion === "popularity") {
            filteredBooks = books.sort((a, b) => b.clicks - a.clicks).slice(0, 1);
        } else if (primaryCriterion === "category") {
            const categoryKeyword = keywords.find(keyword => keyword);
            filteredBooks = books.filter(book =>
                book.category.toLowerCase().includes(categoryKeyword) // So sánh với chữ thường
            );
        } else {
            filteredBooks = books.filter(book =>
                book.name.toLowerCase().includes(query.toLowerCase()) || // So sánh với chữ thường
                book.author.toLowerCase().includes(query.toLowerCase()) ||
                book.description.toLowerCase().includes(query.toLowerCase()) ||
                book.category.toLowerCase().includes(query.toLowerCase())
            ).sort((a, b) => countKeywordMatches(b.description, keywords) - countKeywordMatches(a.description, keywords));
        }

        return filteredBooks;
    };

    const findSimilarBooks = (targetBook) => {
        return books.filter(book =>
            (book.author === targetBook.author || book.category === targetBook.category) && book.code !== targetBook.code
        ).slice(0, 3);
    };

    const displayBooks = (books) => {
        bookResults.innerHTML = "";
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
                bookDiv.addEventListener("click", () => openBookModal(book));
                bookResults.appendChild(bookDiv);
            });
        } else {
            bookResults.innerHTML = `<p>${translate('Không tìm thấy sách nào.', 'No books found.')}</p>`;
        }
    };

    const displaySimilarBooksInModal = (books) => {
        modalSimilarBooks.innerHTML = "";
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

        bookModal.style.display = "block";
    };

    closeModal.addEventListener("click", () => {
        bookModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === bookModal) {
            bookModal.style.display = "none";
        }
    });

    const handleUserInput = () => {
        const query = userInput.value.trim().toLowerCase();
        if (query) {
            const foundBooks = searchBooks(query);
            addSearchToHistory(query, foundBooks);
            displayBooks(foundBooks);
            userInput.value = "";
        }
    };

    sendBtn.addEventListener("click", handleUserInput);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleUserInput();
        }
    });

    clearChatBtn.addEventListener("click", clearSearchHistory);

    displaySearchHistory();
});
