// Hiển thị danh sách sách dạng ngang trên index.html
function displayBooksIndex() {
    const bookDisplay = document.getElementById('bookDisplay');
    bookDisplay.innerHTML = ''; // Xóa danh sách cũ

    const books = JSON.parse(localStorage.getItem('books')) || [];
    books.forEach((book, index) => {
        const bookDiv = document.createElement('div');
        bookDiv.style.display = 'inline-block';
        bookDiv.style.margin = '10px';
        bookDiv.style.border = '1px solid #ccc';
        bookDiv.style.padding = '10px';
        bookDiv.style.textAlign = 'center';
        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="Bìa sách" style="width: 100px; height: 150px; cursor: pointer;" onclick="openModal(${index})">
            <p><strong>${book.name}</strong></p>
            <p>Tác giả: ${book.author}</p>
        `;
        bookDisplay.appendChild(bookDiv);
    });
}

// Hiển thị modal với thông tin chi tiết sách
function openModal(index) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books[index];

    const modalDetails = document.getElementById('modalDetails');
    modalDetails.innerHTML = `
        <img src="${book.cover}" alt="Bìa sách" style="width: 150px; height: 200px;">
        <p><strong>Tên sách:</strong> ${book.name}</p>
        <p><strong>Tác giả:</strong> ${book.author}</p>
        <p><strong>Mã sách:</strong> ${book.id}</p>
        <p><strong>Mô tả:</strong> ${book.description}</p>
    `;

    const modal = document.getElementById('bookModal');
    modal.style.display = 'block';

    const closeModal = document.querySelector('.close');
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Gọi hàm hiển thị khi trang được tải
window.onload = displayBooksIndex;