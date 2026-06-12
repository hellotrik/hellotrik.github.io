// 回风返火：让风倒卷回返、令火势回缩/暂停/加速；用于逆转与调控 Unicode 字序之势。sourceKind: spell
(function () {
    var THEME_STORAGE_KEY = 'unicode-sort-theme';
    var COPY_MODE_STORAGE_KEY = 'unicode-sort-copy-mode';
    var WHITESPACE_RE = /^\s$/;

    var dom = {
        themeRadios: document.querySelectorAll('input[name="theme"]'),
        textInput: document.getElementById('text-input'),
        inputStats: document.getElementById('input-stats'),
        optDedupe: document.getElementById('opt-dedupe'),
        optDesc: document.getElementById('opt-desc'),
        optSkipSpace: document.getElementById('opt-skip-space'),
        optShowCode: document.getElementById('opt-show-code'),
        btnSort: document.getElementById('btn-sort'),
        btnClear: document.getElementById('btn-clear'),
        btnSampleQzw: document.getElementById('btn-sample-qzw'),
        btnSampleEmoji: document.getElementById('btn-sample-emoji'),
        btnSampleShort: document.getElementById('btn-sample-short'),
        copyModeRadios: document.querySelectorAll('input[name="copy-mode"]'),
        resultSummary: document.getElementById('result-summary'),
        charGrid: document.getElementById('char-grid'),
        toast: document.getElementById('toast')
    };

    var state = {
        items: [],
        toastTimer: null
    };

    function splitCodePoints(text) {
        var points = [];
        var i = 0;
        while (i < text.length) {
            var cp = text.codePointAt(i);
            points.push({
                char: String.fromCodePoint(cp),
                code: cp
            });
            i += cp > 0xffff ? 2 : 1;
        }
        return points;
    }

    function formatUnicode(code) {
        return 'U+' + code.toString(16).toUpperCase().padStart(code <= 0xffff ? 4 : 5, '0');
    }

    function getOptions() {
        return {
            dedupe: dom.optDedupe.checked,
            desc: dom.optDesc.checked,
            skipSpace: dom.optSkipSpace.checked,
            showCode: dom.optShowCode.checked
        };
    }

    function getCopyMode() {
        var mode = 'char';
        dom.copyModeRadios.forEach(function (radio) {
            if (radio.checked) mode = radio.value;
        });
        return mode === 'code' ? 'code' : 'char';
    }

    function getCopyPayload(item) {
        if (getCopyMode() === 'code') {
            return {
                text: formatUnicode(item.code),
                toast: '已复制：' + formatUnicode(item.code)
            };
        }
        return {
            text: item.char,
            toast: '已复制：' + item.char
        };
    }

    function getChipTitle(item) {
        if (getCopyMode() === 'code') {
            return '点击复制 ' + formatUnicode(item.code) + '（' + item.char + '）';
        }
        return '点击复制「' + item.char + '」 · ' + formatUnicode(item.code);
    }

    function processText(text, options) {
        var raw = splitCodePoints(text);
        var filtered = options.skipSpace
            ? raw.filter(function (item) {
                return !WHITESPACE_RE.test(item.char);
            })
            : raw.slice();

        if (options.dedupe) {
            var seen = new Set();
            filtered = filtered.filter(function (item) {
                if (seen.has(item.code)) return false;
                seen.add(item.code);
                return true;
            });
        }

        filtered.sort(function (a, b) {
            return options.desc ? b.code - a.code : a.code - b.code;
        });

        return filtered;
    }

    function updateInputStats() {
        var text = dom.textInput.value;
        var points = splitCodePoints(text);
        dom.inputStats.textContent = text.length + ' 字 · ' + points.length + ' 码点';
    }

    function showToast(message) {
        dom.toast.textContent = message;
        dom.toast.hidden = false;
        dom.toast.classList.add('is-visible');
        if (state.toastTimer) clearTimeout(state.toastTimer);
        state.toastTimer = setTimeout(function () {
            dom.toast.classList.remove('is-visible');
            setTimeout(function () {
                dom.toast.hidden = true;
            }, 250);
        }, 1600);
    }

    function copyText(text, onDone) {
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(onDone);
            return;
        }
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            onDone();
        } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
    }

    function flashChip(chip) {
        chip.classList.add('is-copied');
        setTimeout(function () {
            chip.classList.remove('is-copied');
        }, 900);
    }

    function renderCharGrid(items, showCode) {
        var copyMode = getCopyMode();
        dom.charGrid.dataset.copyMode = copyMode;
        dom.charGrid.innerHTML = '';
        items.forEach(function (item, index) {
            var chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'char-chip';
            chip.setAttribute('role', 'listitem');
            chip.title = getChipTitle(item);

            var order = document.createElement('span');
            order.className = 'char-chip__index';
            order.textContent = String(index + 1);
            chip.appendChild(order);

            var glyph = document.createElement('span');
            glyph.className = 'char-chip__glyph';
            glyph.textContent = item.char;
            chip.appendChild(glyph);

            if (showCode) {
                var meta = document.createElement('span');
                meta.className = 'char-chip__meta';

                var code = document.createElement('span');
                code.className = 'char-chip__code';
                code.textContent = formatUnicode(item.code);
                meta.appendChild(code);

                var decimal = document.createElement('span');
                decimal.className = 'char-chip__decimal';
                decimal.textContent = String(item.code);
                meta.appendChild(decimal);

                chip.appendChild(meta);
            }

            chip.addEventListener('click', function () {
                var payload = getCopyPayload(item);
                copyText(payload.text, function () {
                    flashChip(chip);
                    showToast(payload.toast);
                });
            });

            dom.charGrid.appendChild(chip);
        });
    }

    function renderSummary(items, options) {
        if (items.length === 0) {
            dom.resultSummary.textContent = '无可用字符（可能全是空白或输入为空）';
            return;
        }
        var order = options.desc ? '降序' : '升序';
        var range = formatUnicode(items[0].code) + ' → ' + formatUnicode(items[items.length - 1].code);
        dom.resultSummary.textContent =
            items.length + ' 个单字 · ' + order + ' · ' + range;
    }

    var SAMPLE_TOAST = {
        qianziwen: '已载入千字文（1000 字）',
        emoji: '已载入 emoji（1816 个）',
        short: '已载入短句样例'
    };

    var SAMPLE_FILE = {
        emoji: './samples/emoji.txt'
    };

    function applySampleText(text, key) {
        dom.textInput.value = text;
        updateInputStats();
        sortAndRender();
        showToast(SAMPLE_TOAST[key] || '已载入样例');
    }

    function loadSample(key) {
        var file = SAMPLE_FILE[key];
        if (file) {
            fetch(file)
                .then(function (res) {
                    if (!res.ok) throw new Error('fetch failed');
                    return res.text();
                })
                .then(function (text) {
                    applySampleText(text, key);
                })
                .catch(function () {
                    showToast('样例加载失败');
                });
            return;
        }
        var samples = window.UNICODE_SORT_SAMPLES || {};
        var text = samples[key];
        if (!text) return;
        applySampleText(text, key);
    }

    function sortAndRender() {
        var text = dom.textInput.value;
        var options = getOptions();
        state.items = processText(text, options);

        renderSummary(state.items, options);
        renderCharGrid(state.items, options.showCode);
    }

    function applyTheme(mode) {
        if (mode !== 'light' && mode !== 'dark' && mode !== 'auto') return;
        document.documentElement.setAttribute('data-theme', mode);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (e) { /* ignore */ }
        dom.themeRadios.forEach(function (radio) {
            radio.checked = radio.value === mode;
        });
    }

    function initTheme() {
        var saved = 'dark';
        try {
            saved = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
        } catch (e) { /* ignore */ }
        applyTheme(saved);
    }

    function applyCopyMode(mode) {
        if (mode !== 'char' && mode !== 'code') return;
        dom.copyModeRadios.forEach(function (radio) {
            radio.checked = radio.value === mode;
        });
        try {
            localStorage.setItem(COPY_MODE_STORAGE_KEY, mode);
        } catch (e) { /* ignore */ }
        if (state.items.length > 0) {
            renderCharGrid(state.items, getOptions().showCode);
        }
    }

    function initCopyMode() {
        var saved = 'char';
        try {
            saved = localStorage.getItem(COPY_MODE_STORAGE_KEY) || 'char';
        } catch (e) { /* ignore */ }
        applyCopyMode(saved);
    }

    function bindEvents() {
        dom.themeRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                if (!radio.checked) return;
                applyTheme(radio.value);
            });
        });

        dom.textInput.addEventListener('input', function () {
            updateInputStats();
            sortAndRender();
        });

        [dom.optDedupe, dom.optDesc, dom.optSkipSpace, dom.optShowCode].forEach(function (el) {
            el.addEventListener('change', sortAndRender);
        });

        dom.btnSort.addEventListener('click', sortAndRender);

        dom.btnSampleQzw.addEventListener('click', function () {
            loadSample('qianziwen');
        });

        dom.btnSampleEmoji.addEventListener('click', function () {
            loadSample('emoji');
        });

        dom.btnSampleShort.addEventListener('click', function () {
            loadSample('short');
        });

        dom.btnClear.addEventListener('click', function () {
            dom.textInput.value = '';
            updateInputStats();
            sortAndRender();
            dom.textInput.focus();
        });

        dom.copyModeRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                if (!radio.checked) return;
                applyCopyMode(radio.value);
            });
        });
    }

    function init() {
        initTheme();
        initCopyMode();
        bindEvents();
        updateInputStats();
        sortAndRender();
    }

    init();
})();
