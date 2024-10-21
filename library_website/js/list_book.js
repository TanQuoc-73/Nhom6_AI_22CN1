document.addEventListener("DOMContentLoaded", () => {
    const newBookList = document.getElementById("newBookList");
    const bookModal = document.getElementById("bookModal");
    const searchModal = document.getElementById("searchModal");
    const modalBookDetails = document.getElementById("modalBookDetails");
    const searchResults = document.getElementById("searchResults");
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("search");

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
            `;

            // Mở modal hiển thị thông tin sách khi click
            bookDiv.addEventListener("click", () => {
                modalBookDetails.innerHTML = `
                    <h2>${book.name}</h2>
                    <img src="${book.cover}" alt="${book.name}" style="width: 200px; height: 300px;">
                    <p><strong>Tác giả:</strong> ${book.author}</p>
                    <p><strong>Mã sách:</strong> ${book.code}</p>
                    <p><strong>Số lượng:</strong> ${book.quantity}</p>
                    <p><strong>Mô tả:</strong> ${book.description}</p>
                    <p><strong>Ngày thêm:</strong> ${book.dateAdded}</p>
                `;
                bookModal.style.display = "block"; // Hiển thị modal sách
            });

            newBookList.appendChild(bookDiv);
        });
    };

    // Hàm tìm kiếm sách
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        const books = JSON.parse(localStorage.getItem("books")) || [];
        const filteredBooks = books.filter(book =>
            book.name.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );

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
                `;

                // Mở modal hiển thị thông tin sách khi click
                resultDiv.addEventListener("click", () => {
                    modalBookDetails.innerHTML = `
                        <h2>${book.name}</h2>
                        <img src="${book.cover}" alt="${book.name}" style="width: 200px; height: 300px;">
                        <p><strong>Tác giả:</strong> ${book.author}</p>
                        <p><strong>Mã sách:</strong> ${book.code}</p>
                        <p><strong>Số lượng:</strong> ${book.quantity}</p>
                        <p><strong>Mô tả:</strong> ${book.description}</p>
                        <p><strong>Ngày thêm:</strong> ${book.dateAdded}</p>
                    `;
                    bookModal.style.display = "block"; // Hiển thị modal sách
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
});
