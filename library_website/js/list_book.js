document.addEventListener("DOMContentLoaded", () => {
    const newBookList = document.getElementById("newBookList");
    const bookModal = document.getElementById("bookModal");
    const searchModal = document.getElementById("searchModal");
    const modalBookDetails = document.getElementById("modalBookDetails");
    const searchResults = document.getElementById("searchResults");
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("search");

    // Biến để theo dõi số lần nhấn sách
    let bookClickCount = {};

    // Hàm load và hiển thị sách
    const loadBooks = () => {
        const books = JSON.parse(localStorage.getItem("books")) || [];
        newBookList.innerHTML = ''; // Xóa danh sách hiện tại

        books.forEach(book => {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book-item");
            bookDiv.innerHTML = `
                <img src="${book.cover}" alt="${book.name}" style="width: 100px; height: 150px;">
                <p>${book.name}</p>
                <p>${book.author}</p>
                <p><strong>Thể loại:</strong> ${book.category}</p>
            `;

            // Khởi tạo số lần nhấn cho sách này
            bookClickCount[book.code] = 0;

            // Mở modal hiển thị thông tin sách khi click
            bookDiv.addEventListener("click", () => {
                bookClickCount[book.code]++; // Tăng số lần nhấn khi click vào sách
                showBookDetails(book);
            });

            newBookList.appendChild(bookDiv);
        });
    };

    // Hàm hiển thị chi tiết sách và gợi ý sách liên quan
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
            <h3>Sách gợi ý</h3>
            <div class="suggestions" id="suggestions"></div>
        `;
        bookModal.style.display = "block"; // Hiển thị modal sách

        // Tìm sách gợi ý cùng tác giả và cùng thể loại
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

            // Mở modal hiển thị thông tin sách khi click vào sách gợi ý
            suggestionItem.addEventListener("click", () => {
                showBookDetails(suggestedBook);
            });

            suggestionsDiv.appendChild(suggestionItem);
        });

        // Thêm chức năng đóng modal khi nhấn vào nút "X"
        const closeModal = document.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            bookModal.style.display = "none";
        });
    };

    // Hàm tìm kiếm sách
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        const books = JSON.parse(localStorage.getItem("books")) || [];
        
        // Tìm kiếm theo tên, tác giả, thể loại và mô tả
        const filteredBooks = books.filter(book => {
            const titleMatch = book.name.toLowerCase().includes(query);
            const authorMatch = book.author.toLowerCase().includes(query);
            const categoryMatch = book.category.toLowerCase().includes(query);
            const descriptionMatch = book.description.toLowerCase().includes(query);

            // Kiểm tra từng từ trong mô tả sách
            const keywords = query.split(" ");
            const descriptionWords = book.description.toLowerCase().split(" ");

            const similarMatch = keywords.some(keyword => 
                descriptionWords.some(word => word.includes(keyword))
            );

            return titleMatch || authorMatch || categoryMatch || similarMatch || descriptionMatch;
        });

        // Hiển thị kết quả tìm kiếm trong modal
        searchResults.innerHTML = ''; // Xóa kết quả cũ

        if (filteredBooks.length > 0) {
            filteredBooks.forEach(book => {
                const resultDiv = document.createElement("div");
                resultDiv.classList.add("result-item");
                resultDiv.innerHTML = `
                    <img src="${book.cover}" alt="${book.name}" style="width: 50px; height: 75px;">
                    <p>${book.name}</p>
                    <p>${book.author}</p>
                    <p><strong>Thể loại:</strong> ${book.category}</p> <!-- Hiển thị thể loại -->
                `;

                // Mở modal hiển thị thông tin sách khi click
                resultDiv.addEventListener("click", () => {
                    showBookDetails(book);
                });

                searchResults.appendChild(resultDiv);
            });

            searchModal.style.display = "block"; // Hiển thị modal tìm kiếm
        } else {
            searchResults.innerHTML = "<p>Không tìm thấy sách nào.</p>";
            searchModal.style.display = "block"; // Hiển thị modal tìm kiếm
        }
    });

    // Đóng modal khi nhấn ra ngoài modal
    window.addEventListener("click", (event) => {
        if (event.target === bookModal) {
            bookModal.style.display = "none"; // Ẩn modal sách
        } else if (event.target === searchModal) {
            searchModal.style.display = "none"; // Ẩn modal tìm kiếm
        }
    });

    // Tải sách khi trang được tải
    loadBooks();

    // Cuộn danh sách sách
    let isDown = false;
    let startX;
    let scrollLeft;

    newBookList.addEventListener('mousedown', (e) => {
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
        if (!isDown) return; // Nếu không đang nhấn chuột
        e.preventDefault();
        const x = e.pageX - newBookList.offsetLeft;
        const walk = (x - startX) * 2; // Tốc độ cuộn
        newBookList.scrollLeft = scrollLeft - walk;
    });

    // Cuộn bằng chuột
    newBookList.addEventListener('wheel', (e) => {
        e.preventDefault();
        newBookList.scrollLeft += e.deltaY; // Cuộn theo hướng lăn chuột
    });

    // Ngăn chặn việc kéo hình ảnh khi nhấn chuột vào hình ảnh sách
    newBookList.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault(); // Ngăn chặn việc kéo hình ảnh
        }
    });
});
