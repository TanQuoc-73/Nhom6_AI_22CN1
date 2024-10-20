// Lấy phần tử modal và danh mục
const modalTheLoai = document.getElementById("modalTheLoai");
const danhMuc = document.getElementById("danhMuc");

// Khi di chuột vào danh mục, hiển thị modal
danhMuc.addEventListener('mouseenter', function() {
    modalTheLoai.classList.add('show');
});

// Khi di chuột ra ngoài danh mục và modal, ẩn modal
document.addEventListener('mousemove', function(event) {
    // Kiểm tra xem chuột có đang ở ngoài danh mục hoặc modal không
    const isInsideDanhMuc = danhMuc.contains(event.target);
    const isInsideModal = modalTheLoai.contains(event.target);

    if (!isInsideDanhMuc && !isInsideModal) {
        modalTheLoai.classList.remove('show');
    }
});
