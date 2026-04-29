// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 初始化配置
    initializeConfig();

    // 复制服务器地址功能
    const copyButton = document.querySelector('.btn-copy');
    if (copyButton) {
        copyButton.addEventListener('click', function () {
            // 等待配置加载完成
            const checkConfig = setInterval(() => {
                if (typeof serverConfig !== 'undefined') {
                    clearInterval(checkConfig);
                    const serverAddress = serverConfig.serverPort && serverConfig.serverPort !== "25565"
                        ? `${serverConfig.serverIP}:${serverConfig.serverPort}`
                        : serverConfig.serverIP;
                    navigator.clipboard.writeText(serverAddress).then(function () {
                        // 显示成功消息
                        showNotification("服务器地址已复制到剪贴板！", "success");
                    }, function () {
                        // 显示错误消息
                        showNotification("复制失败，请手动复制地址", "error");
                    });
                }
            }, 100);
        });
    }

    // 平滑滚动功能
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 移动端菜单切换
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 服务器状态更新
    updateServerStatus();
    setInterval(updateServerStatus, 30000); // 每30秒更新一次

    // 为页面元素添加进入视口时的动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animateElements = document.querySelectorAll('.feature-card, .gallery-item, .server-info-card, .rollimg-server-card');
    animateElements.forEach(el => {
        el.classList.add('opacity-0');
        observer.observe(el);
    });

    // FAQ手风琴效果
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // 切换当前FAQ项目的答案显示状态
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');

            answer.classList.toggle('show');
            // 移除或添加hidden类以确保答案正确显示或隐藏
            if (answer.classList.contains('show')) {
                answer.classList.remove('hidden');
            } else {
                answer.classList.add('hidden');
            }
            icon.classList.toggle('rotate-180');
        });
    });
});

// 显示通知函数
function showNotification(message, type) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transform transition duration-300 ease-in-out`;
    notification.textContent = message;

    // 根据类型设置样式
    if (type === 'success') {
        notification.classList.add('bg-green-500', 'text-white');
    } else if (type === 'error') {
        notification.classList.add('bg-red-500', 'text-white');
    } else {
        notification.classList.add('bg-blue-500', 'text-white');
    }

    // 添加到页面
    document.body.appendChild(notification);

    // 3秒后移除通知
    setTimeout(() => {
        notification.classList.add('opacity-0');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 更新服务器状态函数
async function updateServerStatus() {
    // 等待配置加载完成
    if (typeof serverConfig === 'undefined') {
        setTimeout(updateServerStatus, 100);
        return;
    }

    try {
        // 从API获取服务器状态
        // 构建API请求URL，只在端口不是默认值时包含端口参数
        const apiUrl = serverConfig.serverPort && serverConfig.serverPort !== "25565"
            ? `${serverConfig.statusAPI}?ip=${serverConfig.serverIP}&port=${serverConfig.serverPort}`
            : `${serverConfig.statusAPI}?ip=${serverConfig.serverIP}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        // 更新在线玩家显示
        const playerCountElement = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 > div')[0]?.querySelector('div.text-3xl');
        if (playerCountElement && data.players) {
            playerCountElement.textContent = `${data.players.online.toLocaleString()}/${data.players.max.toLocaleString()}`;
        }

        // 更新在线状态
        const uptimeElement = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 > div')[2]?.querySelector('div.text-3xl');
        if (uptimeElement) {
            uptimeElement.textContent = data.status === 'online' ? '在线' : '离线';
        }

        // 更新进度条
        const progressBar = document.querySelector('.players-progress');
        if (progressBar && data.players) {
            const percentage = Math.min((data.players.online / data.players.max) * 100, 100);
            progressBar.style.width = `${percentage}%`;
        }

        // 更新服务器名称显示
        const serverNameElement = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 > div')[1]?.querySelector('div.text-3xl');
        if (serverNameElement) {
            serverNameElement.textContent = serverConfig.serverName;
        }

        // 更新服务器版本显示
        const serverVersionElement = document.getElementById('server-version');
        if (serverVersionElement) {
            serverVersionElement.textContent = serverConfig.serverVersion;
        }
    } catch (error) {
        console.error('获取服务器状态失败:', error);
        // 如果API调用失败，使用模拟数据
        const maxPlayers = 100;
        const minPlayers = 20;
        const currentPlayers = Math.floor(Math.random() * (maxPlayers - minPlayers + 1)) + minPlayers;

        // 更新在线玩家显示
        const playerCountElement = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 > div')[0]?.querySelector('div.text-3xl');
        if (playerCountElement) {
            playerCountElement.textContent = `${currentPlayers.toLocaleString()}/${maxPlayers.toLocaleString()}`;
        }

        // 更新进度条
        const progressBar = document.querySelector('.players-progress');
        if (progressBar) {
            const percentage = (currentPlayers / maxPlayers) * 100;
            progressBar.style.width = `${percentage}%`;
        }

        // 更新服务器名称显示
        const serverNameElement = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 > div')[1]?.querySelector('div.text-3xl');
        if (serverNameElement) {
            serverNameElement.textContent = serverConfig.serverName;
        }
    }
}

// 添加淡入动画的CSS类
(function () {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translate3d(0, 20%, 0);
            }
            to {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }
        }
        
        .animate-fade-in-up {
            animation-duration: 0.6s;
            animation-fill-mode: both;
            animation-name: fadeInUp;
        }
    `;
    document.head.appendChild(style);
})();

// 添加淡入动画的CSS类
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate3d(0, 20%, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    .animate-fade-in-up {
        animation-duration: 0.6s;
        animation-fill-mode: both;
        animation-name: fadeInUp;
    }
`;
document.head.appendChild(style);


// 初始化配置函数
function initializeConfig() {
    // 等待配置加载完成
    const checkConfig = setInterval(() => {
        if (typeof serverConfig !== 'undefined') {
            clearInterval(checkConfig);

            // 更新网站版本
            const webVersion = document.getElementById('web-ver');
            if (webVersion) {
                webVersion.textContent = serverConfig.webVersion;
            }

            // 更新页面标题
            const serverTitle = document.getElementById('server-title');
            if (serverTitle) {
                serverTitle.textContent = serverConfig.pageTitle;
            }

            // 更新导航栏服务器名称
            const serverNameNav = document.getElementById('server-name-nav');
            if (serverNameNav) {
                serverNameNav.textContent = serverConfig.serverName;
            }

            // 更新页脚服务器名称
            const serverNameFooter = document.getElementById('server-name-footer');
            if (serverNameFooter) {
                serverNameFooter.textContent = serverConfig.serverName;
            }

            // 更新服务器IP地址
            const serverIPElement = document.getElementById('server-ip');
            if (serverIPElement) {
                serverIPElement.textContent = serverConfig.serverIP;
            }
            // 更新服务器IP地址和端口
            const serverIPElement2 = document.getElementById('server-ip2');
            if (serverIPElement2) {
                serverIPElement2.textContent = serverConfig.serverIP2;
            }
            // 更新服务器端口
            const serverIPElementport = document.getElementById('server-port');
            if (serverIPElementport) {
                serverIPElementport.textContent = serverConfig.serverPort;
            }

            // 更新FAQ中的服务器IP地址
            const serverIPFaqElement = document.getElementById('server-ip-faq');
            if (serverIPFaqElement) {
                serverIPFaqElement.textContent = serverConfig.serverIP;
            }

            // 更新服务器版本
            const serverVersionElement = document.getElementById('server-version');
            if (serverVersionElement) {
                serverVersionElement.textContent = serverConfig.serverVersion;
            }

            // 更新QQ群链接和号码
            const qqGroupLink = document.getElementById('qq-group-link');
            const qqGroupNumber = document.getElementById('qq-group-number');
            if (qqGroupLink && qqGroupNumber) {
                qqGroupLink.href = serverConfig.socialLinks.qqGroup.url;
                qqGroupNumber.textContent = serverConfig.socialLinks.qqGroup.number;
            }

            // 更新哔哩哔哩链接和名称
            const bilibiliLink = document.getElementById('bilibili-link');
            const bilibiliName = document.getElementById('bilibili-name');
            if (bilibiliLink && bilibiliName) {
                bilibiliLink.href = serverConfig.socialLinks.bilibili.url;
                bilibiliName.textContent = serverConfig.socialLinks.bilibili.name;
            }

            // 更新邮箱链接和地址
            const emailLink = document.getElementById('email-link');
            const emailAddress = document.getElementById('email-address');
            if (emailLink && emailAddress) {
                emailLink.href = `mailto:${serverConfig.socialLinks.email}`;
                emailAddress.textContent = serverConfig.socialLinks.email;
            }

            // 更新页脚社交媒体链接
            const footerQQLink = document.getElementById('footer-qq-link');
            const footerBilibiliLink = document.getElementById('footer-bilibili-link');
            const footerEmailLink = document.getElementById('footer-email-link');

            if (footerQQLink) {
                footerQQLink.href = serverConfig.socialLinks.qqGroup.url;
            }

            if (footerBilibiliLink) {
                footerBilibiliLink.href = serverConfig.socialLinks.bilibili.url;
            }

            if (footerEmailLink) {
                footerEmailLink.href = `mailto:${serverConfig.socialLinks.email}`;
            }
        }
    }, 100);
}