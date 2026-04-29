// 服务器配置文件
// 通过修改此文件中的值，可以一键更改网站中的所有相关信息

const serverConfig = {
    // 服务器基本信息
    webVersion: "0.2",
    serverName: "汤姆服务器",           // 服务器名称
    pageTitle: "汤姆服务器 - 官方网站",   // 页面标题
    serverIP: "ao.rainplay.cn", 
    serverIP2: "ao.rainplay.cn:42157",         // 服务器IP地址
    serverPort: "42157",                    // 服务器端口（如果需要）
    serverVersion: "1.26.1X",                // 服务器版本
    
    // 社交媒体链接
    socialLinks: {
        qqGroup: {
            url: "https://qun.qq.com/join.html?key=205244843",  // QQ群链接
            number: "205244843"                                  // QQ群号
        },
        bilibili: {
            url: "https://space.bilibili.com/431110194",           // 哔哩哔哩链接
            name: "汤姆服务器官方账号"                              // 哔哩哔哩账号名称
        },
        email: "tomserver-official@qq.com"                           // 联系邮箱
    },
    
    // 服务器状态API（用于获取在线玩家数等信息）
    statusAPI: "https://motd.minebbs.com/api/status",
    
    // 下载链接（如果需要）
    downloadLinks: {
        client: "#",                           // 客户端下载链接
        resourcePack: "#"                      // 资源包下载链接
    }
};

// 导出配置
window.serverConfig = serverConfig;