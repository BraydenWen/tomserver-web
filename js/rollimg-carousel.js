// 获取元素
const rollimgCarouselList = document.querySelector('.rollimg-carousel-list');
const rollimgItems = document.querySelectorAll('.rollimg-carousel-item');
const rollimgDots = document.querySelectorAll('.rollimg-dot');
const rollimgLeftArrow = document.querySelector('.rollimg-arrow-left');
const rollimgRightArrow = document.querySelector('.rollimg-arrow-right');

let currentIndex = 0;
const itemCount = rollimgItems.length;

// 更新轮播位置和圆点状态
function updateCarousel() {
    rollimgCarouselList.style.transform = `translateX(-${currentIndex * 100}%)`;
    rollimgDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// 右箭头切换
rollimgRightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % itemCount;
    updateCarousel();
});

// 左箭头切换
rollimgLeftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + itemCount) % itemCount;
    updateCarousel();
});

// 点击圆点切换
rollimgDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
});