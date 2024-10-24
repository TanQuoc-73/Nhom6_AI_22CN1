document.addEventListener("DOMContentLoaded", () => {
    const newBookList = document.getElementById("newBookList");
    const bookModal = document.getElementById("bookModal");
    const searchModal = document.getElementById("searchModal");
    const modalBookDetails = document.getElementById("modalBookDetails");
    const searchResults = document.getElementById("searchResults");
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("search");

    let bookClickCount = {}; 
    let bookClicks = JSON.parse(localStorage.getItem("bookClicks")) || {}; // Khôi phục từ localStorage

    const loadBooks = () => {
        const books = JSON.parse(localStorage.getItem("books")) || [];
        newBookList.innerHTML = '';

        books.forEach(book => {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book-item");
            bookDiv.innerHTML = `
                <img src="${book.cover}" alt="${book.name}" style="width: 100px; height: 150px;">
                <p>${book.name}</p>
                <p>${book.author}</p>
                <p><strong>Thể loại:</strong> ${book.category}</p>
            `;

            if (!bookClicks[book.code]) {
                bookClicks[book.code] = 0;  // Nếu chưa có trong localStorage, đặt giá trị ban đầu là 0
            }

            bookDiv.addEventListener("click", () => {
                bookClicks[book.code]++;
                localStorage.setItem("bookClicks", JSON.stringify(bookClicks)); // Lưu vào localStorage
                showBookDetails(book);
                displayFeaturedBooks(); // Hiển thị lại danh sách sách nổi bật sau khi click vào sách
            });

            newBookList.appendChild(bookDiv);
        });

        // Hiển thị sách nổi bật ngay sau khi tải sách
        displayFeaturedBooks();
    };

    const showBookDetails = (book) => {
        modalBookDetails.innerHTML = `
            <span class="close-modal">&times;</span>
            <h2>${book.name}</h2>
            <img src="${book.cover}" alt="${book.name}" style="width: 200px; height: 300px;">
            <p><strong>Tác giả:</strong> ${book.author}</p>
            <p><strong>Mã sách:</strong> ${book.code}</p>
            <p><strong>Số lượng:</strong> ${book.quantity}</p>
            <p><strong>Mô tả:</strong> ${book.description}</p>
            <p><strong>Thể loại:</strong> ${book.category}</p>
            <p><strong>Ngày thêm:</strong> ${book.dateAdded}</p>
            <h3>Sách cùng thể loại</h3>
            <div class="suggestions" id="suggestions"></div>
            <div class="interes_book" id="interes_book"></div>
        `;
        bookModal.style.display = "block";

        const books = JSON.parse(localStorage.getItem("books")) || [];
        const suggestions = books.filter(b => 
            (b.author === book.author || b.category === book.category) && b.code !== book.code
        );

        const suggestionsDiv = document.getElementById("suggestions");
        suggestions.forEach(suggestedBook => {
            const suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestion-item");
            suggestionItem.innerHTML = `
                <img src="${suggestedBook.cover}" alt="${suggestedBook.name}" style="width: 80px; height: 120px;">
                <p>${suggestedBook.name}</p>
            `;

            suggestionItem.addEventListener("click", () => {
                showBookDetails(suggestedBook);
            });

            suggestionsDiv.appendChild(suggestionItem);
        });

        const closeModal = document.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            bookModal.style.display = "none";
        });
    };

    const displayFeaturedBooks = () => {
        const similarBookDiv = document.getElementById("similarBookList");
        similarBookDiv.innerHTML = '';  // Xóa nội dung cũ trước khi thêm sách mới
    
        const books = JSON.parse(localStorage.getItem("books")) || [];

        // Kiểm tra nếu đã có lượt click và lấy thông tin các sách dựa vào số lượt click
        const sortedBooks = Object.keys(bookClicks)
            .map(code => {
                const book = books.find(b => b.code === code);
                return { book, clicks: bookClicks[code] };
            })
            .filter(item => item.book)
            .sort((a, b) => b.clicks - a.clicks);
    
        const topFeaturedBooks = sortedBooks.slice(0, 10);  // Hiển thị tối đa 10 sách nổi bật
    
        topFeaturedBooks.forEach(({ book }) => {
            const bookItem = document.createElement("div");
            bookItem.classList.add("featured-book-item");
            bookItem.innerHTML = `
                <img src="${book.cover}" alt="${book.name}" style="width: 80px; height: 120px;">
                <p>${book.name}</p>
                <p>${book.author}</p>
            `;
    
            // Thêm sự kiện click để hiển thị chi tiết sách
            bookItem.addEventListener("click", () => {
                showBookDetails(book);
            });
    
            similarBookDiv.appendChild(bookItem);  // Thêm sách vào div similarBookList
        });
    };

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        const books = JSON.parse(localStorage.getItem("books")) || [];
        
        const filteredBooks = books.filter(book => {
            const titleMatch = book.name.toLowerCase().includes(query);
            const authorMatch = book.author.toLowerCase().includes(query);
            const categoryMatch = book.category.toLowerCase().includes(query);
            const descriptionMatch = book.description.toLowerCase().includes(query);

            const keywords = query.split(" ");
            const descriptionWords = book.description.toLowerCase().split(" ");

            const similarMatch = keywords.some(keyword => 
                descriptionWords.some(word => word.includes(keyword))
            );

            return titleMatch || authorMatch || categoryMatch || similarMatch || descriptionMatch;
        });

        searchResults.innerHTML = '';

        if (filteredBooks.length > 0) {
            filteredBooks.forEach(book => {
                const resultDiv = document.createElement("div");
                resultDiv.classList.add("result-item");
                resultDiv.innerHTML = `
                    <img src="${book.cover}" alt="${book.name}" style="width: 50px; height: 75px;">
                    <p>${book.name}</p>
                    <p>${book.author}</p>
                    <p><strong>Thể loại:</strong> ${book.category}</p>
                `;

                resultDiv.addEventListener("click", () => {
                    showBookDetails(book);
                });

                searchResults.appendChild(resultDiv);
            });

            searchModal.style.display = "block";
        } else {
            searchResults.innerHTML = "<p>Không tìm thấy sách nào.</p>";
            searchModal.style.display = "block";
        }
    });

    window.addEventListener("click", (event) => {
        if (event.target === bookModal) {
            bookModal.style.display = "none";
        } else if (event.target === searchModal) {
            searchModal.style.display = "none";
        }
    });

    loadBooks();

    // Cuộn danh sách sách
    let isDown = false;
    let startX;
    let scrollLeft;

    newBookList.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định để không bôi đen văn bản
        isDown = true;
        newBookList.classList.add('active');
        startX = e.pageX - newBookList.offsetLeft;
        scrollLeft = newBookList.scrollLeft;
    });

    newBookList.addEventListener('mouseleave', () => {
        isDown = false;
        newBookList.classList.remove('active');
    });

    newBookList.addEventListener('mouseup', () => {
        isDown = false;
        newBookList.classList.remove('active');
    });

    newBookList.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - newBookList.offsetLeft;
        const walk = (x - startX) * 2;
        newBookList.scrollLeft = scrollLeft - walk;
    });

    // Ngăn chặn việc kéo hình ảnh khi nhấn chuột vào hình ảnh sách
    newBookList.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
});
