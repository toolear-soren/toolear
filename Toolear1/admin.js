/* admin.js - FULL FIXED VERSION */

const AdminApp = (() => {
    
    // ПАРОЛЬ: @Aram434479092582
    const PASSWORD_HASH = "YWRtaW4xMjM="; 

    // === БАЗА ДАННЫХ ИНСТРУМЕНТОВ ===
    const toolsConfig = [
        // 1. JSON
        {
            id: "json-formatter",
            name: "JSON Formatter",
            url: "json.html",
            inputSel: "#jsonInput",
            btnSel: ".action-btn",
            outputSel: "#jsonOutput",
            waitMs: 300,
            testValue: '{"test":1}',
            expected: (val) => val.includes('"test": 1')
        },
        // 2. PDF (с реальным файлом)
        {
            id: "pdf-to-text",
            name: "PDF to Text",
            url: "pdf.html",
            inputSel: "#pdfInput",
            btnSel: ".action-btn",
            outputSel: "#pdfOutput",
            waitMs: 2500,
            testFileBase64: "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCiAgICA+PgogID4+CiAgL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iagoKNCAwIG9iago8PAogIC9UeXBlIC9Gb250CiAgL1N1YnR5cGUgL1R5cGUxCiAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgo+PgplbmRvYmoKCjUgMCBvYmoKPDwgL0xlbmd0aCA0NCA+PgpzdHJlYW0KQlQKNzAgNTAgVEQKL0YxIDEyIFRmCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmCgowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDE1NyAwMDAwMCBuIAowMDAwMDAwMjU1IDAwMDAwIG4gCjAwMDAwMDAzNDQgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDQyCiUlRU9GCg==",
            customInputHandler: (doc, config) => {
                injectFile(doc, config.inputSel, config.testFileBase64, "application/pdf", "test.pdf");
            },
            expected: (val) => val.includes("Hello World")
        },
        // 3. IMAGE COMPRESSOR (с проверкой)
        {
            id: "image-compressor",
            name: "Image Compressor",
            url: "image.html",
            inputSel: "#imgInput",
            btnSel: ".action-btn",
            outputSel: null,
            // Маленький красный пиксель (PNG)
            testFileBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
            customInputHandler: (doc, config) => {
                injectFile(doc, config.inputSel, config.testFileBase64, "image/png", "test.png");
            },
            waitMs: 1500,
            // Проверяем, появилась ли активная рамка
            customCheck: (doc) => doc.getElementById('previewArea').classList.contains('active')
        },
        // 4. IMAGE RESIZER (Теперь работает!)
        {
            id: "image-resizer",
            name: "Image Resizer",
            url: "image-resizer.html",
            inputSel: "#imgInput",
            btnSel: null, // Кнопку нажимать не надо, он реагирует на загрузку
            outputSel: "#width",
            // Тот же красный пиксель 1x1
            testFileBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
            customInputHandler: (doc, config) => {
                injectFile(doc, config.inputSel, config.testFileBase64, "image/png", "test.png");
            },
            waitMs: 1000,
            // Если ширина заполнилась (стала > 0), значит картинка считалась
            expected: (val) => parseInt(val) > 0
        },
        // 5. CODE MINIFIER (Исправлен тест)
        {
            id: "code-minifier",
            name: "Code Minifier",
            url: "code-minifier.html",
            inputSel: "#input",
            btnSel: ".action-btn",
            outputSel: "#output",
            waitMs: 100,
            testValue: "body { color: red; }",
            expected: (val) => val === "body{color:red;}"
        },
        // ... ОСТАЛЬНЫЕ ИНСТРУМЕНТЫ (СТАНДАРТНЫЕ) ...
        { id: "base64-encoder", name: "Base64 Encoder", url: "base64.html", inputSel: "#b64Input", btnSel: "button[onclick*='encode']", outputSel: "#b64Output", waitMs: 100, testValue: "Toolear", expected: (val) => val.includes("VG9vbGVhcg==") },
        { id: "word-counter", name: "Word Counter", url: "word-counter.html", inputSel: "#inputText", btnSel: "#inputText", outputSel: "#wCount", waitMs: 100, testValue: "one two three", expected: (val) => val.trim() === "3" },
        { id: "text-case", name: "Text Case", url: "text-case.html", inputSel: "#inputText", btnSel: "button[onclick*='upper']", outputSel: "#inputText", waitMs: 100, testValue: "hello", expected: (val) => val === "HELLO" },
        { id: "url-encoder", name: "URL Encoder", url: "url-encoder.html", inputSel: "#input", btnSel: "button[onclick*='encode']", outputSel: "#input", waitMs: 100, testValue: "hello world", expected: (val) => val === "hello%20world" },
        { id: "csv-to-json", name: "CSV to JSON", url: "csv-to-json.html", inputSel: "#csvInput", btnSel: ".action-btn", outputSel: "#jsonOutput", waitMs: 200, testValue: "name,age\nJohn,25", expected: (val) => val.includes('"name": "John"') },
        { id: "json-to-csv", name: "JSON to CSV", url: "json-to-csv.html", inputSel: "#jsonInput", btnSel: ".action-btn", outputSel: "#csvOutput", waitMs: 200, testValue: '[{"a":1}]', expected: (val) => val.includes("1") },
        { id: "text-diff", name: "Text Diff", url: "text-diff.html", inputSel: "#txt1", extraInput: { sel: "#txt2", val: "Hello" }, btnSel: ".action-btn", outputSel: "#result", waitMs: 100, testValue: "Hello", expected: (val) => val.includes("Identical") },
        { id: "slug-generator", name: "Slug Generator", url: "slug-generator.html", inputSel: "#input", btnSel: "#input", outputSel: "#output", waitMs: 100, testValue: "Hello World", expected: (val) => val === "hello-world" },
        { id: "color-converter", name: "Color Converter", url: "color-converter.html", inputSel: "#colorPicker", btnSel: "#colorPicker", outputSel: "#rgb", waitMs: 100, testValue: "#000000", expected: (val) => val.includes("rgb(0, 0, 0)") },
        { id: "gradient-generator", name: "Gradient Gen", url: "gradient-generator.html", inputSel: "#deg", btnSel: "#deg", outputSel: "#cssOutput", waitMs: 100, testValue: "90", expected: (val) => val.includes("linear-gradient") },
        { id: "shadow-generator", name: "Shadow Gen", url: "shadow-generator.html", inputSel: "#blur", btnSel: "#blur", outputSel: "#cssOutput", waitMs: 100, testValue: "50", expected: (val) => val.includes("box-shadow") },
        { id: "image-to-base64", name: "Image to Base64", url: "image-to-base64.html", inputSel: "#imgInput", btnSel: null, outputSel: "#output", testFileBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", customInputHandler: (doc, config) => injectFile(doc, config.inputSel, config.testFileBase64, "image/png", "test.png"), waitMs: 500, expected: (val) => val.startsWith("data:image/png;base64") },
        { id: "base64-to-image", name: "Base64 to Image", url: "base64-to-image.html", inputSel: "#input", btnSel: ".action-btn", outputSel: null, waitMs: 200, testValue: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", customCheck: (doc) => doc.getElementById('preview').style.display === 'block' },
        { id: "password-generator", name: "Password Gen", url: "password-generator.html", inputSel: "#len", btnSel: ".action-btn", outputSel: "#passResult", waitMs: 100, testValue: "20", expected: (val) => val.length === 20 },
        { id: "hash-generator", name: "Hash Gen", url: "hash-generator.html", inputSel: "#input", btnSel: ".action-btn", outputSel: "#output", waitMs: 200, testValue: "hello", expected: (val) => val === "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824" },
        { id: "uuid-generator", name: "UUID Gen", url: "uuid-generator.html", inputSel: null, btnSel: ".action-btn", outputSel: "#uuidOut", waitMs: 100, testValue: null, expected: (val) => val.length > 30 },
        { id: "timestamp-converter", name: "Unix Timestamp", url: "timestamp-converter.html", inputSel: "#tsInput", btnSel: ".action-btn", outputSel: "#output", waitMs: 100, testValue: "1600000000", expected: (val) => val.includes("2020") },
        { id: "number-formatter", name: "Num Formatter", url: "number-formatter.html", inputSel: "#input", btnSel: "#input", outputSel: "#output", waitMs: 100, testValue: "1000000", expected: (val) => val === "1,000,000" },
        { id: "json-validator", name: "JSON Validator", url: "json-validator.html", inputSel: "#input", btnSel: ".action-btn", outputSel: "#status", waitMs: 100, testValue: '{"a":1}', expected: (val) => val.includes("Valid") }
    ];

    // --- УНИВЕРСАЛЬНЫЙ ЗАГРУЗЧИК ФАЙЛОВ ДЛЯ ТЕСТА ---
    function injectFile(doc, selector, base64Data, mimeType, fileName) {
        const input = doc.querySelector(selector);
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: mimeType});
        const file = new File([blob], fileName, { type: mimeType });
        
        const container = new DataTransfer();
        container.items.add(file);
        input.files = container.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // --- UI И ЛОГИКА ---
    const UI = {
        loginScreen: document.getElementById('login-screen'),
        dashboard: document.getElementById('dashboard-screen'),
        passInput: document.getElementById('adminPass'),
        errorMsg: document.getElementById('loginError'),
        tableBody: document.getElementById('toolsTableBody'),
        iframe: document.getElementById('test-runner-frame'),
        stats: { total: document.getElementById('stat-total'), passed: document.getElementById('stat-passed'), failed: document.getElementById('stat-failed') }
    };

    function init() {
        document.body.classList.add('loaded'); // ВКЛЮЧАЕМ СВЕТ
        if (localStorage.getItem('isAdminLoggedIn') === 'true') showDashboard();
        else UI.loginScreen.style.display = 'flex';
    }

    function login() {
        if (btoa(UI.passInput.value) === PASSWORD_HASH) {
            localStorage.setItem('isAdminLoggedIn', 'true');
            showDashboard();
        } else UI.errorMsg.style.display = 'block';
    }

    function logout() { localStorage.removeItem('isAdminLoggedIn'); location.reload(); }

    function showDashboard() {
        UI.loginScreen.style.display = 'none';
        UI.dashboard.style.display = 'block';
        renderTable();
    }

    let testResults = {}; 

    function renderTable() {
        UI.tableBody.innerHTML = '';
        toolsConfig.forEach(tool => {
            const row = document.createElement('tr');
            const status = testResults[tool.id]?.status || 'pending';
            let badge = `<span class="status-badge status-pending">Wait</span>`;
            if(status === 'pass') badge = `<span class="status-badge status-pass">PASS</span>`;
            if(status === 'fail') badge = `<span class="status-badge status-fail">FAIL</span>`;
            if(status === 'running') badge = `<span class="status-badge status-running">Run...</span>`;

            row.innerHTML = `
                <td><b>${tool.name}</b><br><span style="font-size:0.75rem;color:#666;">${tool.url}</span>
                ${status === 'fail' ? `<div style="font-size:0.7rem;color:#ef4444;">${testResults[tool.id].error}</div>` : ''}</td>
                <td>${badge}</td>
                <td style="color:#aaa;">${testResults[tool.id]?.time || '-'}</td>
                <td><button class="action-btn" style="padding:0.4rem 0.8rem;font-size:0.8rem;" onclick="AdminApp.runSingleTest('${tool.id}')">Test</button></td>
            `;
            UI.tableBody.appendChild(row);
        });
        updateStats();
    }

    function updateStats() {
        const res = Object.values(testResults);
        UI.stats.total.innerText = toolsConfig.length;
        UI.stats.passed.innerText = res.filter(t => t.status === 'pass').length;
        UI.stats.failed.innerText = res.filter(t => t.status === 'fail').length;
    }

    async function runSingleTest(id) {
        testResults[id] = { status: 'running', time: new Date().toLocaleTimeString() };
        renderTable();
        const tool = toolsConfig.find(t => t.id === id);
        
        try {
            const res = await performTest(tool);
            testResults[id].status = res.success ? 'pass' : 'fail';
            if (!res.success) testResults[id].error = res.message;
        } catch(e) {
            testResults[id].status = 'fail';
            testResults[id].error = "SysErr: " + e.message;
        }
        renderTable();
    }

    async function runAllTests() {
        for(const tool of toolsConfig) { await runSingleTest(tool.id); await new Promise(r => setTimeout(r, 300)); }
    }

    function performTest(tool) {
        return new Promise((resolve) => {
            const iframe = UI.iframe;
            iframe.src = 'about:blank';
            const timeout = setTimeout(() => resolve({ success: false, message: "Timeout" }), 8000);

            iframe.onload = async () => {
                if (iframe.src === 'about:blank') return;
                try {
                    const doc = iframe.contentDocument;
                    
                    if (tool.inputSel) {
                        const input = doc.querySelector(tool.inputSel);
                        if (!input) throw new Error("Input not found");

                        if (tool.customInputHandler) {
                            tool.customInputHandler(doc, tool);
                        } else {
                            input.value = tool.testValue;
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }

                    if (tool.extraInput) {
                        const extra = doc.querySelector(tool.extraInput.sel);
                        if(extra) { extra.value = tool.extraInput.val; extra.dispatchEvent(new Event('input')); }
                    }

                    if (tool.btnSel) {
                        const btn = doc.querySelector(tool.btnSel);
                        if (btn) btn.click();
                    }

                    await new Promise(r => setTimeout(r, tool.waitMs));

                    let isPassed = false;
                    if (tool.customCheck) {
                        isPassed = tool.customCheck(doc);
                    } else if (tool.outputSel) {
                        const output = doc.querySelector(tool.outputSel);
                        if (!output) throw new Error("Output not found");
                        const val = output.value || output.innerText;
                        isPassed = tool.expected(val);
                    }

                    clearTimeout(timeout);
                    resolve({ success: isPassed, message: isPassed ? "OK" : "Result mismatch" });

                } catch(e) { clearTimeout(timeout); resolve({ success: false, message: e.message }); }
            };
            iframe.src = tool.url;
        });
    }

    return { init, login, logout, runSingleTest, runAllTests };
})();

document.addEventListener('DOMContentLoaded', AdminApp.init);