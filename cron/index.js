// 千古地仙随风逝，昔日三王归青冢。
(function () {
    var FIELD_META = {
        second: { label: '秒', name: 'second', range: [0, 59] },
        minute: { label: '分', name: 'minute', range: [0, 59] },
        hour: { label: '时', name: 'hour', range: [0, 23] },
        day: { label: '日', name: 'day-of-month', range: [1, 31], allowQuestion: true },
        month: { label: '月', name: 'month', range: [1, 12] },
        weekday: { label: '周', name: 'day-of-week', range: [0, 7], weekNames: true, allowQuestion: true },
        year: { label: '年', name: 'year', range: [1970, 2099] }
    };

    var MODE_OPTIONS = [
        { value: 'any', label: '每（*）' },
        { value: 'unset', label: '不指定（?）' },
        { value: 'step', label: '每隔（*/n）' },
        { value: 'value', label: '指定值' },
        { value: 'range', label: '范围（n-m）' },
        { value: 'list', label: '列表（a,b,c）' }
    ];

    var WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六', '日'];

    var FORMATS = {
        linux: {
            id: 'linux',
            label: 'Linux / Crontab',
            hint: '5 位：分 · 时 · 日 · 月 · 周（无秒字段）',
            fieldIds: ['minute', 'hour', 'day', 'month', 'weekday'],
            defaultExpr: '0 0 * * *',
            placeholder: '0 0 * * *',
            presets: {
                'every-minute': '* * * * *',
                hourly: '0 * * * *',
                'daily-midnight': '0 0 * * *',
                'weekday-9': '0 9 * * 1-5',
                'monthly-1': '0 0 1 * *',
                sunday: '0 0 * * 0'
            }
        },
        java: {
            id: 'java',
            label: 'Java / Spring @Scheduled',
            hint: '6 位：秒 · 分 · 时 · 日 · 月 · 周（日/周可用 ?，二者其一为 ?）',
            fieldIds: ['second', 'minute', 'hour', 'day', 'month', 'weekday'],
            defaultExpr: '0 0 0 * * ?',
            placeholder: '0 0 0 * * ?',
            presets: {
                'every-minute': '0 * * * * ?',
                hourly: '0 0 * * * ?',
                'daily-midnight': '0 0 0 * * ?',
                'weekday-9': '0 0 9 ? * MON-FRI',
                'monthly-1': '0 0 0 1 * ?',
                sunday: '0 0 0 ? * SUN'
            }
        },
        quartz: {
            id: 'quartz',
            label: 'Quartz Scheduler',
            hint: '7 位：秒 · 分 · 时 · 日 · 月 · 周 · 年（日/周常用 ?，年可为 *）',
            fieldIds: ['second', 'minute', 'hour', 'day', 'month', 'weekday', 'year'],
            defaultExpr: '0 0 0 ? * * *',
            placeholder: '0 0 0 ? * * *',
            presets: {
                'every-minute': '0 * * ? * * *',
                hourly: '0 0 * ? * * *',
                'daily-midnight': '0 0 0 ? * * *',
                'weekday-9': '0 0 9 ? * MON-FRI *',
                'monthly-1': '0 0 0 1 * ? *',
                sunday: '0 0 0 ? * SUN *'
            }
        }
    };

    var THEME_STORAGE_KEY = 'cron-theme';

    var dom = {
        themeRadios: document.querySelectorAll('input[name="theme"]'),
        formatRadios: document.querySelectorAll('input[name="cron-format"]'),
        formatHint: document.getElementById('format-hint'),
        fieldGrid: document.getElementById('field-grid'),
        cronInput: document.getElementById('cron-input'),
        btnParse: document.getElementById('btn-parse'),
        btnCopy: document.getElementById('btn-copy'),
        fieldTableBody: document.getElementById('field-table-body'),
        humanDesc: document.getElementById('human-desc'),
        nextRuns: document.getElementById('next-runs'),
        statusWarn: document.getElementById('status-warn'),
        statusError: document.getElementById('status-error'),
        tzLabel: document.getElementById('tz-label')
    };

    var fieldState = {};
    var currentFormat = 'linux';

    function getFormatConfig() {
        return FORMATS[currentFormat];
    }

    function getActiveFields() {
        return getFormatConfig().fieldIds.map(function (id) {
            var meta = FIELD_META[id];
            return Object.assign({ id: id }, meta);
        });
    }

    function detectFormatFromParts(parts) {
        if (parts.length === 7) return 'quartz';
        if (parts.length === 6) return 'java';
        if (parts.length === 5) return 'linux';
        return null;
    }

    function setFormat(formatId, keepExpr) {
        if (!FORMATS[formatId]) return;
        currentFormat = formatId;
        dom.formatRadios.forEach(function (radio) {
            radio.checked = radio.value === formatId;
        });
        dom.formatHint.textContent = getFormatConfig().hint;
        dom.cronInput.placeholder = getFormatConfig().placeholder;
        if (!keepExpr) {
            applyExpressionToBuilder(getFormatConfig().defaultExpr);
        } else {
            renderBuilder();
            updateBuilderControls();
        }
        updatePresetTitles();
        parseAndRender();
    }

    function getCronFromPreset(presetId) {
        var presets = getFormatConfig().presets;
        return presets[presetId] || '';
    }

    function updatePresetTitles() {
        document.querySelectorAll('.preset[data-preset]').forEach(function (btn) {
            var cron = getCronFromPreset(btn.getAttribute('data-preset'));
            if (cron) btn.title = cron;
        });
    }

    function createElement(tag, className, text) {
        var el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined) el.textContent = text;
        return el;
    }

    function getDefaultFieldState() {
        return { mode: 'any', value: '0', step: '1', from: '0', to: '0', list: '0' };
    }

    function fieldAllowsQuestion(def) {
        return !!def.allowQuestion && (currentFormat === 'java' || currentFormat === 'quartz');
    }

    function getModeOptionsForField(def) {
        return MODE_OPTIONS.filter(function (opt) {
            if (opt.value === 'unset') return fieldAllowsQuestion(def);
            return true;
        });
    }

    function buildFieldToken(state, def) {
        if (state.mode === 'unset') return '?';
        if (state.mode === 'any') return '*';
        if (state.mode === 'step') return '*/' + (state.step || '1');
        if (state.mode === 'value') return String(state.value);
        if (state.mode === 'range') return state.from + '-' + state.to;
        if (state.mode === 'list') return state.list.replace(/\s+/g, '');
        return '*';
    }

    function parseFieldToken(token, def) {
        var state = getDefaultFieldState();
        if (!token || token === '*') return state;
        if (token === '?') {
            state.mode = 'unset';
            return state;
        }
        if (/^\*\/\d+$/.test(token)) {
            state.mode = 'step';
            state.step = token.slice(2);
            return state;
        }
        if (/^\d+-\d+$/.test(token)) {
            var parts = token.split('-');
            state.mode = 'range';
            state.from = parts[0];
            state.to = parts[1];
            return state;
        }
        if (/,/.test(token) || /[A-Za-z]/.test(token)) {
            state.mode = 'list';
            state.list = token;
            return state;
        }
        if (/^\d+$/.test(token)) {
            state.mode = 'value';
            state.value = token;
            return state;
        }
        state.mode = 'list';
        state.list = token;
        return state;
    }

    function buildExpressionFromState() {
        return getActiveFields()
            .map(function (def) {
                return buildFieldToken(fieldState[def.id] || getDefaultFieldState(), def);
            })
            .join(' ');
    }

    function syncExpressionToInput() {
        dom.cronInput.value = buildExpressionFromState();
    }

    function describeFieldToken(token, def) {
        var match;
        if (token === '?') return def.label + '：不指定（?）';
        if (token === '*') return '每' + def.label;
        match = token.match(/^\*\/(\d+)$/);
        if (match) return '每 ' + match[1] + def.label;
        match = token.match(/^(\d+)-(\d+)$/);
        if (match) {
            if (def.weekNames && /^\d+$/.test(match[1])) {
                return '周' + WEEK_LABELS[+match[1]] + ' 至 周' + WEEK_LABELS[+match[2]];
            }
            return def.label + ' ' + match[1] + ' 至 ' + match[2];
        }
        if (/,/.test(token) || /[A-Za-z]/.test(token)) {
            return def.label + '：' + token;
        }
        if (def.weekNames && /^\d+$/.test(token)) return '周' + WEEK_LABELS[+token];
        return def.label + ' = ' + token;
    }

    function describeExpression(expr) {
        var parts = expr.trim().split(/\s+/);
        var fields = getActiveFields();
        if (parts.length !== fields.length) {
            return '字段数量与「' + getFormatConfig().label + '」不匹配（' + parts.length + ' / ' + fields.length + '）';
        }
        return parts
            .map(function (token, i) {
                return describeFieldToken(token, fields[i]);
            })
            .join('；');
    }

    function showError(message) {
        dom.statusError.hidden = !message;
        dom.statusError.textContent = message || '';
    }

    function showWarn(message) {
        dom.statusWarn.hidden = !message;
        dom.statusWarn.textContent = message || '';
    }

    function renderFieldTable(parts) {
        dom.fieldTableBody.innerHTML = '';
        var fields = getActiveFields();
        fields.forEach(function (def, i) {
            var token = parts[i] || '—';
            var tr = document.createElement('tr');
            tr.appendChild(createElement('td', null, def.label + ' (' + def.name + ')'));
            tr.appendChild(createElement('td', null, token));
            tr.appendChild(createElement('td', null, describeFieldToken(token, def)));
            dom.fieldTableBody.appendChild(tr);
        });
    }

    function normalizeForCroner(expr) {
        var parts = expr.trim().split(/\s+/);
        var warn = '';

        if (currentFormat === 'linux' && parts.length === 5) {
            parts = ['0'].concat(parts);
        }
        if (currentFormat === 'quartz' && parts.length === 7) {
            parts = parts.slice(0, 6);
            warn = 'Quartz 已忽略「年」字段用于试算；';
        }

        var hasExt = /[?A-Za-z#LW]/.test(expr);
        parts = parts.map(function (token, index) {
            if (token === '?') {
                if (index === 3) return '*';
                if (index === 5) return '*';
                return '*';
            }
            if (token === 'MON-FRI') return '1-5';
            if (token === 'MON') return '1';
            if (token === 'TUE') return '2';
            if (token === 'WED') return '3';
            if (token === 'THU') return '4';
            if (token === 'FRI') return '5';
            if (token === 'SAT') return '6';
            if (token === 'SUN') return '0';
            return token;
        });

        if (hasExt) {
            warn += '含 ? / 英文星期等扩展语法，已近似换算后预览下次执行时间。';
        }
        return { cron: parts.join(' '), warn: warn };
    }

    function renderNextRuns(expr) {
        dom.nextRuns.innerHTML = '';
        if (typeof Cron === 'undefined') {
            showError('Croner 未加载，请检查 vendor/croner.umd.js');
            showWarn('');
            return;
        }
        var normalized = normalizeForCroner(expr);
        showWarn(normalized.warn);
        try {
            var job = new Cron(normalized.cron, { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
            var runs = job.nextRuns(8);
            if (!runs || !runs.length) {
                dom.nextRuns.appendChild(createElement('li', null, '无法计算下一次执行时间'));
                return;
            }
            runs.forEach(function (date) {
                dom.nextRuns.appendChild(createElement('li', null, formatDateTime(date)));
            });
            showError('');
        } catch (err) {
            showError(err.message || String(err));
        }
    }

    function formatDateTime(date) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date);
    }

    function parseAndRender() {
        var expr = dom.cronInput.value.trim().replace(/\s+/g, ' ');
        if (!expr) {
            showError('请输入 Cron 表达式');
            showWarn('');
            return;
        }
        var parts = expr.split(' ');
        var expected = getActiveFields().length;
        if (parts.length !== expected) {
            var detected = detectFormatFromParts(parts);
            if (detected && detected !== currentFormat) {
                showError('当前为「' + getFormatConfig().label + '」需要 ' + expected + ' 个字段；检测到 ' + parts.length + ' 个字段，更像「' + FORMATS[detected].label + '」');
            } else {
                showError('需要 ' + expected + ' 个字段，当前为 ' + parts.length + ' 个');
            }
            dom.humanDesc.textContent = '—';
            dom.fieldTableBody.innerHTML = '';
            dom.nextRuns.innerHTML = '';
            showWarn('');
            return;
        }
        dom.humanDesc.textContent = describeExpression(expr);
        renderFieldTable(parts);
        renderNextRuns(expr);
    }

    function applyExpressionToBuilder(expr) {
        var parts = expr.trim().split(/\s+/);
        var detected = detectFormatFromParts(parts);
        if (detected && detected !== currentFormat) {
            currentFormat = detected;
            dom.formatRadios.forEach(function (radio) {
                radio.checked = radio.value === detected;
            });
            dom.formatHint.textContent = getFormatConfig().hint;
            dom.cronInput.placeholder = getFormatConfig().placeholder;
        }
        renderBuilder();
        var fields = getActiveFields();
        if (parts.length !== fields.length) {
            dom.cronInput.value = expr;
            return;
        }
        fields.forEach(function (def, i) {
            fieldState[def.id] = parseFieldToken(parts[i], def);
        });
        updateBuilderControls();
        syncExpressionToInput();
    }

    function updateBuilderControls() {
        getActiveFields().forEach(function (def) {
            var row = dom.fieldGrid.querySelector('[data-field="' + def.id + '"]');
            if (!row) return;
            var state = fieldState[def.id] || getDefaultFieldState();
            row.querySelector('.mode-select').value = state.mode;
            row.querySelector('.input-value').value = state.value;
            row.querySelector('.input-step').value = state.step;
            row.querySelector('.input-from').value = state.from;
            row.querySelector('.input-to').value = state.to;
            row.querySelector('.input-list').value = state.list;
            toggleExtraInputs(row, state.mode);
        });
    }

    function toggleExtraInputs(row, mode) {
        row.querySelector('.extra-value').hidden = mode !== 'value';
        row.querySelector('.extra-step').hidden = mode !== 'step';
        row.querySelector('.extra-range').hidden = mode !== 'range';
        row.querySelector('.extra-list').hidden = mode !== 'list';
        row.querySelector('.extra-unset').hidden = mode !== 'unset';
    }

    function onFieldChange(def, row) {
        var state = fieldState[def.id] || getDefaultFieldState();
        state.mode = row.querySelector('.mode-select').value;
        state.value = row.querySelector('.input-value').value;
        state.step = row.querySelector('.input-step').value;
        state.from = row.querySelector('.input-from').value;
        state.to = row.querySelector('.input-to').value;
        state.list = row.querySelector('.input-list').value;
        fieldState[def.id] = state;
        toggleExtraInputs(row, state.mode);
        syncExpressionToInput();
        parseAndRender();
    }

    function renderBuilder() {
        dom.fieldGrid.innerHTML = '';
        getActiveFields().forEach(function (def) {
            if (!fieldState[def.id]) fieldState[def.id] = getDefaultFieldState();

            var row = createElement('div', 'field-row');
            row.dataset.field = def.id;
            row.appendChild(createElement('div', 'field-row__label', def.label));

            var controls = createElement('div', 'field-row__controls');
            var modeSelect = createElement('select', 'mode-select');
            getModeOptionsForField(def).forEach(function (opt) {
                var o = createElement('option', null, opt.label);
                o.value = opt.value;
                modeSelect.appendChild(o);
            });
            controls.appendChild(modeSelect);

            var extraUnset = createElement('div', 'field-row__extra extra-unset');
            extraUnset.appendChild(createElement('span', null, '不指定（?）'));
            extraUnset.hidden = true;
            controls.appendChild(extraUnset);

            var extraValue = createElement('div', 'field-row__extra extra-value');
            var valueInput = createElement('input', 'input-value');
            valueInput.type = 'number';
            valueInput.min = def.range[0];
            valueInput.max = def.range[1];
            extraValue.appendChild(valueInput);
            extraValue.hidden = true;
            controls.appendChild(extraValue);

            var extraStep = createElement('div', 'field-row__extra extra-step');
            var stepInput = createElement('input', 'input-step');
            stepInput.type = 'number';
            stepInput.min = '1';
            stepInput.value = '1';
            extraStep.appendChild(createElement('span', null, '间隔'));
            extraStep.appendChild(stepInput);
            extraStep.hidden = true;
            controls.appendChild(extraStep);

            var extraRange = createElement('div', 'field-row__extra extra-range');
            var fromInput = createElement('input', 'input-from');
            fromInput.type = 'number';
            fromInput.min = def.range[0];
            fromInput.max = def.range[1];
            var toInput = createElement('input', 'input-to');
            toInput.type = 'number';
            toInput.min = def.range[0];
            toInput.max = def.range[1];
            extraRange.appendChild(fromInput);
            extraRange.appendChild(createElement('span', null, '—'));
            extraRange.appendChild(toInput);
            extraRange.hidden = true;
            controls.appendChild(extraRange);

            var extraList = createElement('div', 'field-row__extra extra-list');
            var listInput = createElement('input', 'input-list');
            listInput.type = 'text';
            listInput.placeholder = def.weekNames ? '如 MON-FRI 或 1,3,5' : '如 1,3,5';
            extraList.appendChild(listInput);
            extraList.hidden = true;
            controls.appendChild(extraList);

            row.appendChild(controls);
            dom.fieldGrid.appendChild(row);

            row.addEventListener('change', function () {
                onFieldChange(def, row);
            });
            row.addEventListener('input', function () {
                onFieldChange(def, row);
            });
        });
        updateBuilderControls();
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

    function bindEvents() {
        dom.themeRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                if (!radio.checked) return;
                applyTheme(radio.value);
            });
        });

        dom.formatRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                if (!radio.checked) return;
                setFormat(radio.value, false);
            });
        });

        dom.cronInput.addEventListener('blur', function () {
            applyExpressionToBuilder(dom.cronInput.value);
            parseAndRender();
        });

        dom.btnParse.addEventListener('click', parseAndRender);

        dom.btnCopy.addEventListener('click', function () {
            var text = dom.cronInput.value.trim();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    dom.btnCopy.textContent = '已复制';
                    setTimeout(function () {
                        dom.btnCopy.textContent = '复制';
                    }, 1200);
                });
            }
        });

        document.querySelectorAll('.preset[data-preset]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var cron = getCronFromPreset(btn.getAttribute('data-preset'));
                if (!cron) return;
                dom.cronInput.value = cron;
                applyExpressionToBuilder(cron);
                parseAndRender();
            });
        });
    }

    function init() {
        dom.tzLabel.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
        Object.keys(FIELD_META).forEach(function (id) {
            fieldState[id] = getDefaultFieldState();
        });
        initTheme();
        bindEvents();
        setFormat('java', false);
    }

    init();
})();
