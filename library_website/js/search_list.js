// Hàm lấy dữ liệu sách từ localStorage
function getBooks() {
    let books = localStorage.getItem('books');
    return books ? JSON.parse(books) : [];
}

// Hàm tìm kiếm sách
function searchBooks() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const books = getBooks(); // Hàm lấy sách từ localStorage
    const results = books.filter(book => 
        book.name.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm) || 
        book.id.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(results);
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = ''; // Xóa kết quả cũ

    if (results.length > 0) {
        results.forEach(book => {
            const resultItem = document.createElement('div');
            resultItem.innerHTML = `
                <img src="${book.cover}" alt="Bìa sách" style="width: 100px; height: 150px;">
                <p><strong>${book.name}</strong></p>
                <p>${book.author}</p>
                <p>${book.id}</p>
            `;
            searchResults.appendChild(resultItem);
        });
    } else {
        searchResults.innerHTML = '<p>Không tìm thấy sách nào phù hợp.</p>';
    }

    // Hiển thị modal kết quả tìm kiếm
    document.getElementById('modalSearch').style.display = 'block';
}

// Đóng modal tìm kiếm
document.getElementById('closeSearchModal').onclick = function() {
    document.getElementById('modalSearch').style.display = 'none';
};

// Đóng modal khi nhấn ngoài khu vực modal
window.onclick = function(event) {
    if (event.target == document.getElementById('modalSearch')) {
        document.getElementById('modalSearch').style.display = 'none';
    }
};

// Thêm sự kiện cho ô tìm kiếm
document.getElementById('search').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchBooks(); // Tìm kiếm khi nhấn Enter
    }
});

// Thêm sự kiện cho biểu tượng tìm kiếm
document.querySelector('#search i').onclick = function() {
    searchBooks(); // Tìm kiếm khi nhấn vào biểu tượng
};
