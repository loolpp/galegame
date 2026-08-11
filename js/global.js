// 全局数据持久化工具
const STORAGE_KEY = "loveGameData";
// 默认初始数据
function getDefaultData() {
    return {
        money: 500,          // 初始货币
        stamina: 300,        // 当前体力
        maxStamina: 500,     // 体力上限
        timePeriod: "morning",// morning早晨 noon中午 night夜晚
        nightRefreshFlag: false // 夜晚体力恢复标记，防止重复恢复
    }
}

// 读取存档
export function loadData() {
    let save = localStorage.getItem(STORAGE_KEY);
    if (!save) return getDefaultData();
    return JSON.parse(save);
}

// 保存存档
export function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 获取当前时段文字
export function getTimeText() {
    const data = loadData();
    const map = {
        morning: "早晨",
        noon: "中午",
        night: "夜晚"
    }
    return map[data.timePeriod];
}

// 切换全局时段
export function changeTime(type) {
    let data = loadData();
    data.timePeriod = type;

    // 切到夜晚，自动恢复200体力（仅一次）
    if (type === "night" && !data.nightRefreshFlag) {
        data.stamina = Math.min(data.stamina + 200, data.maxStamina);
        data.nightRefreshFlag = true;
    }
    // 切回早晨，重置夜晚恢复标记，下一晚可再次恢复
    if (type === "morning") {
        data.nightRefreshFlag = false;
    }

    saveData(data);
    refreshAllUI();
}

// 扣除体力，返回true=成功 false=不足
export function costStamina(num) {
    let data = loadData();
    if (data.stamina < num) {
        alert("体力不足，无法打工！");
        return false;
    }
    data.stamina -= num;
    saveData(data);
    refreshAllUI();
    return true;
}

// 增加货币
export function addMoney(num) {
    let data = loadData();
    data.money += num;
    saveData(data);
    refreshAllUI();
}

// 预留御花园随机剧情空接口（后续填充剧情）
export function randomStoryInterface() {
    console.log("触发御花园随机剧情接口，此处后续编写剧情弹窗逻辑");
    // 示例拓展：弹窗、角色对话、额外奖励等
}

// 全局刷新顶部UI（大厅/打工页共用）
let refreshCallback = null;
export function setRefreshCallback(fn) {
    refreshCallback = fn;
}
function refreshAllUI() {
    if (refreshCallback) refreshCallback();
}