
// 等待DOM和配置文件加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 检查配置是否加载
    if (typeof AppConfig === 'undefined') {
        console.error('配置文件未加载，请确保正确引入config.js');
        // 显示错误信息
        const errorEl = document.createElement('div');
        errorEl.className = 'fixed top-0 left-0 right-0 bg-red-500 text-white p-4 z-50 text-center';
        errorEl.textContent = '网站配置加载失败，请刷新页面重试';
        document.body.prepend(errorEl);
        return;
    }

    // 初始化赞助者列表（如果在赞助页面）
    if (document.getElementById('donors-list')) {
        initDonorsList();
    }


    // 赞助者列表功能
    function initDonorsList() {
        // 从配置获取赞助者数据
        const donorsData = AppConfig.donors || [];

        // 赞助者列表配置
        const donorsPerPage = 5;
        const donorsList = document.getElementById('donors-list');
        const loadMoreBtn = document.getElementById('load-more-donors');
        const totalAmountEl = document.getElementById('total-amount');
        const donorCountEl = document.getElementById('donor-count');
        const lastUpdateEl = document.getElementById('last-update');
        const sortAmountBtn = document.getElementById('sort-amount');
        const sortDateBtn = document.getElementById('sort-date');
        const donorSearchInput = document.getElementById('donor-search');

        let currentDonorsPage = 1;
        let totalDonorsPages = 1;
        let filteredDonors = [...donorsData]; // 用于搜索过滤
        let sortType = 'date'; // 默认按日期排序

        // 初始化赞助者列表
        function initDonorsList() {
            // 计算统计数据
            calculateDonorStats();

            // 计算总页数
            totalDonorsPages = Math.ceil(filteredDonors.length / donorsPerPage);

            // 显示当前页的赞助者
            displayDonorsPage(currentDonorsPage);

            // 更新加载更多按钮状态
            updateLoadMoreButton();
        }

        // 计算赞助统计数据
        function calculateDonorStats() {
            // 计算总金额
            const totalAmount = donorsData.reduce((sum, donor) => sum + donor.amount, 0);
            // 格式化金额显示
            totalAmountEl.textContent = `¥${totalAmount.toLocaleString()}`;

            // 显示赞助人数
            donorCountEl.textContent = donorsData.length;

            // 显示最后更新日期（取最新的赞助日期）
            if (donorsData.length > 0) {
                const sortedByDate = [...donorsData].sort((a, b) =>
                    new Date(b.date) - new Date(a.date)
                );
                lastUpdateEl.textContent = sortedByDate[0].date;
            }
        }

        // 显示指定页的赞助者
        function displayDonorsPage(page) {
            if (!donorsList) return;

            // 清空当前列表
            donorsList.innerHTML = '';

            // 计算当前页的起始和结束索引
            const startIndex = (page - 1) * donorsPerPage;
            const endIndex = Math.min(startIndex + donorsPerPage, filteredDonors.length);

            // 获取当前页的赞助者
            const currentDonors = filteredDonors.slice(startIndex, endIndex);

            // 显示赞助者
            currentDonors.forEach(donor => {
                // 确定赞助等级
                let donorClass, badgeClass, badgeText;
                if (donor.amount >= 100) {
                    donorClass = 'donor-diamond';
                    badgeClass = 'bg-yellow-100 text-yellow-800';
                    badgeText = '钻石赞助者';
                } else if (donor.amount >= 50) {
                    donorClass = 'donor-gold';
                    badgeClass = 'bg-gray-100 text-gray-800';
                    badgeText = '黄金赞助者';
                } else {
                    donorClass = 'donor-silver';
                    badgeClass = 'bg-amber-100 text-amber-800';
                    badgeText = '白银赞助者';
                }

                // 创建赞助者元素
                const donorEl = document.createElement('div');
                donorEl.className = `p-5 ${donorClass} hover:bg-gray-50 transition-colors`;
                donorEl.innerHTML = `
                <div class="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <div class="flex items-center">
                            <img src="${donor.avatar || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/48/48`}" 
                                 alt="${donor.name}的头像" 
                                 class="w-8 h-8 rounded-full mr-2 object-cover">
                            <h4 class="font-medium">${donor.name}</h4>
                            <span class="ml-2 px-2 py-0.5 ${badgeClass} text-xs rounded-full">${badgeText}</span>
                        </div>
                        <p class="text-dark text-sm mt-1">"${donor.message}"</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-primary">¥${donor.amount}</p>
                        <p class="text-gray-500 text-xs mt-1">${donor.date}</p>
                    </div>
                </div>
            `;

                donorsList.appendChild(donorEl);
            });

            // 如果没有赞助者
            if (filteredDonors.length === 0) {
                donorsList.innerHTML = `
                <div class="p-6 text-center">
                    <i class="fa fa-heart-o text-2xl text-gray-300 mb-3"></i>
                    <p class="text-dark">暂无赞助记录</p>
                    <p class="text-sm text-gray-500 mt-2">成为第一个支持服务器的玩家吧！</p>
                </div>
            `;
            }
        }

        // 更新加载更多按钮状态
        function updateLoadMoreButton() {
            if (!loadMoreBtn) return;

            if (currentDonorsPage >= totalDonorsPages) {
                loadMoreBtn.innerHTML = '没有更多了';
                loadMoreBtn.disabled = true;
                loadMoreBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                loadMoreBtn.innerHTML = '查看更多赞助者 <i class="fa fa-chevron-down ml-1"></i>';
                loadMoreBtn.disabled = false;
                loadMoreBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }

        // 加载更多赞助者
        function loadMoreDonors() {
            if (currentDonorsPage >= totalDonorsPages) return;

            currentDonorsPage++;
            displayDonorsPage(currentDonorsPage);
            updateLoadMoreButton();
        }

        // 排序赞助者
        function sortDonors(type) {
            if (sortType === type) return;

            sortType = type;

            // 更新按钮样式
            if (type === 'amount') {
                sortAmountBtn.classList.add('bg-primary', 'text-white');
                sortAmountBtn.classList.remove('bg-light', 'text-dark');
                sortDateBtn.classList.add('bg-light', 'text-dark');
                sortDateBtn.classList.remove('bg-primary', 'text-white');

                // 按金额降序排序
                filteredDonors.sort((a, b) => b.amount - a.amount);
            } else {
                sortDateBtn.classList.add('bg-primary', 'text-white');
                sortDateBtn.classList.remove('bg-light', 'text-dark');
                sortAmountBtn.classList.add('bg-light', 'text-dark');
                sortAmountBtn.classList.remove('bg-primary', 'text-white');

                // 按日期降序排序
                filteredDonors.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            // 重置到第一页
            currentDonorsPage = 1;
            displayDonorsPage(currentDonorsPage);
            updateLoadMoreButton();
        }

        // 搜索赞助者
        function handleDonorSearch() {
            const searchTerm = donorSearchInput.value.toLowerCase().trim();

            if (searchTerm === '') {
                // 搜索为空，显示所有
                filteredDonors = [...donorsData];
            } else {
                // 根据名称搜索
                filteredDonors = donorsData.filter(donor =>
                    donor.name.toLowerCase().includes(searchTerm)
                );
            }

            // 保持当前排序方式
            if (sortType === 'amount') {
                filteredDonors.sort((a, b) => b.amount - a.amount);
            } else {
                filteredDonors.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            // 重置到第一页
            currentDonorsPage = 1;
            totalDonorsPages = Math.ceil(filteredDonors.length / donorsPerPage);
            displayDonorsPage(currentDonorsPage);
            updateLoadMoreButton();
        }

        // 绑定事件
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreDonors);
        }

        if (sortAmountBtn && sortDateBtn) {
            sortAmountBtn.addEventListener('click', () => {
                sortDonors('amount');
            });
            sortDateBtn.addEventListener('click', () => {
                sortDonors('date');
            });
        }

        if (donorSearchInput) {
            donorSearchInput.addEventListener('input', handleDonorSearch);
        }

        // 初始化赞助者列表
        initDonorsList();
    }
});