// 服务器配置文件
// 通过修改此文件中的值，可以一键更改网站中的所有相关信息

const serverConfig = {
    // 服务器基本信息
    webVersion: "0.6",
    serverName: "汤姆服务器",           // 服务器名称
    pageTitle: "汤姆服务器 - 官方网站",   // 页面标题
    serverIP: "game.mctom.top", 
    serverIP2: "game.mctom.top:42157",         // 服务器IP地址
    serverPort: "42157",                    // 服务器端口（如果需要）
    serverVersion: "1.26.2X",                // 服务器版本
    
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
        github: {
            url: "https://github.com/BraydenWen/",           // 哔哩哔哩链接
            name: "汤姆的GitHub仓库"                              // 哔哩哔哩账号名称
        },
        email: "tomserver-official@qq.com"                           // 联系邮箱
    },
    // 优秀玩家配置
    featuredPlayers: [

        {
            id: 1,
            name: "汤姆",
            avatar: "http://q.qlogo.cn/headimg_dl?dst_uin=2475736084&spec=640&img_type=jpg",
            contact: "tomserver-official@qq.com",
            description: "汤姆服务器创始人，拥有六年开服经验，负责服务器整体运营与技术维护，致力于给所有玩家一个温暖的家。",
            tags: [
                { name: "腐竹", color: "bg-green-500" },
                { name: "ㅤ" },
                { name: "为人和善", color: "bg-purple-500" }
            ]
        },
        {
            id: 2,
            name: "沙幻",
            avatar: "http://q.qlogo.cn/headimg_dl?dst_uin=3047799246&spec=640&img_type=jpg",
            contact: "3047799246@qq.com",
            description: "红石电路专家、开服元老级玩家，最爱各种红石机器，热衷于打造蒸汽时代，同时也是服务器赞助者。",
            tags: [
                { name: "红石大佬", color: "bg-yellow-500" },
                { name: "ㅤ" },
                { name: "老玩家", color: "bg-blue-500" }
            ]
        }
    ],
    
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