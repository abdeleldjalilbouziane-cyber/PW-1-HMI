const expressionDisplay = document.getElementById("expression-display");
const resultDisplay = document.getElementById("result-display");

let memory = 0;

function appendToDisplay(value) {
    expressionDisplay.value += value;
}

function clearDisplay() {
    expressionDisplay.value = "";
    resultDisplay.value = "";
}

function deleteDisplay() {
    expressionDisplay.value = expressionDisplay.value.slice(0, -1);
}

// تفعيل الكتابة من الكيبورد والضغط على Enter لحساب النتيجة
expressionDisplay.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        calculate();
    }
});

// دالة تحويل الأعداد الكبيرة والصغيرة إلى صيغة علمية مناسبة
function formatNeb(num) {
    if (typeof num !== 'number' || isNaN(num)) return num;
    if (num === 0) return 0;

    if (Math.abs(num) >= 1e5 || (Math.abs(num) < 1e-5 && Math.abs(num) > 0)) {
        let expStr = num.toExponential(4);
        let parts = expStr.split('e');
        let n = parseFloat(parts[0]);
        let b = parseInt(parts[1], 10);
        return `${n}e${b}`;
    }
    
    return parseFloat(num.toFixed(6));
}

function calculate() {
    try {
        let expr = expressionDisplay.value;
        if (!expr) return;

        let formattedExpr = expr
            .replace(/ln\(/g, "log(")
            .replace(/log\(/g, "log10(");

        let res = math.evaluate(formattedExpr);
        
        resultDisplay.value = formatNeb(res);
        return res;
    } catch (err) {
        resultDisplay.value = "خطأ";
        return null;
    }
}

// الحصول على القيمة الحالية المتاحة للحسابات (من النتيجة أو من الإدخال مباشرة)
function getCurrentValue() {
    if (resultDisplay.value && resultDisplay.value !== "خطأ") {
        return parseFloat(resultDisplay.value);
    }
    
    let calculated = calculate();
    if (calculated !== null && !isNaN(calculated)) {
        return calculated;
    }
    
    return 0;
}

// دوال الذاكرة المحدثة
function memorySave() {
    let val = getCurrentValue();
    memory = val;
}

function memoryRecall() {
    expressionDisplay.value += memory;
}

function memoryClear() {
    memory = 0;
}

function memoryAdd() {
    let val = getCurrentValue();
    memory += val;
}

function memorySub() {
    let val = getCurrentValue();
    memory -= val;
}

// التبديل بين النمط الليلي والعادي (Dark Mode)
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    document.getElementById("theme-toggle").innerText = newTheme === "dark" ? "☀️" : "🌙";
    
    localStorage.setItem("theme", newTheme);
}

// استرجاع المظهر المفضل للمستخدم عند التحميل
(function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.innerText = savedTheme === "dark" ? "☀️" : "🌙";
    }
})();

// التحكم في نافذة المساعدة Help Modal
function openHelp() {
    document.getElementById("help-modal").style.display = "flex";
}

function closeHelp() {
    document.getElementById("help-modal").style.display = "none";
}

// إغلاق النافذة المساعدة عند الضغط خارجها
window.onclick = function(event) {
    const modal = document.getElementById("help-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};