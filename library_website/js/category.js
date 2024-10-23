document.addEventListener("DOMContentLoaded", () => {
    const categoryItems = document.querySelectorAll('.category-item');
    const bookList = document.getElementById('bookList');
    const modal = document.getElementById('myModal');
    const closeModal = document.getElementsByClassName("close")[0];
    const modalBookName = document.getElementById("modalBookName");
    const modalBookCover = document.getElementById("modalBookCover");
    const modalAuthorName = document.getElementById("modalAuthorName");
    const modalBookCode = document.getElementById("modalBookCode");
    const modalBookCategory = document.getElementById("modalBookCategory");
    const modalBookQuantity = document.getElementById("modalBookQuantity");
    const modalBookDescription = document.getElementById("modalBookDescription");
    const relatedBooks = document.getElementById("relatedBooks");
    let activeCategory = null;

    // Hàm load sách từ localStorage
    const loadBooksByCategory = (category) => {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const filteredBooks = books.filter(book => book.category === category);
        
        bookList.innerHTML = ''; // Clear list
        if (filteredBooks.length === 0) {
            bookList.innerHTML = '<p>Không có sách nào trong thể loại này.</p>';
        } else {
            filteredBooks.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.className = 'book-item';
                bookItem.innerHTML = `
                    <img src="${book.cover}" alt="Bìa sách">
                    <div>
                        <h3>${book.name}</h3>
                        <p><strong>Tác giả:</strong> ${book.author}</p>
                    </div>
                `;
                // Thêm sự kiện click vào sách
                bookItem.addEventListener('click', () => openModal(book, filteredBooks));
                bookList.appendChild(bookItem);
            });
        }
    };

    // Mở modal khi click vào sách
    const openModal = (book, allBooks) => {
        modalBookName.textContent = book.name;
        modalBookCover.src = book.cover;
        modalAuthorName.textContent = book.author;
        modalBookCode.textContent = book.code;
        modalBookCategory.textContent = book.category;
        modalBookQuantity.textContent = book.quantity;
        modalBookDescription.textContent = book.description;

        // Load sách liên quan
        relatedBooks.innerHTML = ''; // Clear previous related books
        const related = allBooks.filter(b => b.name !== book.name);
        const randomBooks = related.sort(() => 0.5 - Math.random()).slice(0, 3); // Chọn 3 sách ngẫu nhiên
        randomBooks.forEach(relatedBook => {
            const relatedBookItem = document.createElement('div');
            relatedBookItem.className = 'related-book-item';
            relatedBookItem.innerHTML = `
                <img src="${relatedBook.cover}" alt="Bìa sách">
                <div>
                    <h3>${relatedBook.name}</h3>
                    <p><strong>Tác giả:</strong> ${relatedBook.author}</p>
                </div>
            `;
            relatedBookItem.addEventListener('click', () => openModal(relatedBook, allBooks));
            relatedBooks.appendChild(relatedBookItem);
        });

        modal.style.display = "block"; // Hiển thị modal
    };

    // Thêm sự kiện khi click vào thể loại
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');
            loadBooksByCategory(category);

            // Xóa lớp active từ thể loại trước đó
            if (activeCategory) {
                activeCategory.classList.remove('active');
            }
            
            // Thêm lớp active cho thể loại hiện tại
            item.classList.add('active');
            activeCategory = item; // Cập nhật thể loại hiện tại
        });
    });

    // Đóng modal khi nhấn nút đóng
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // Đóng modal khi nhấn ra ngoài modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});
