// 云篆太虚，浩劫之初；用于开经演道、阐明网络地址之奥义。
(function () {
    var THEME_STORAGE_KEY = 'cidr-theme';
    var IPV4_RE = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var CIDR_RE = /^(.+?)\/(\d{1,2})$/;

    var dom = {
        themeRadios: document.querySelectorAll('input[name="theme"]'),
        ipInput: document.getElementById('ip-input'),
        prefixRange: document.getElementById('prefix-range'),
        prefixLabel: document.getElementById('prefix-label'),
        prefixBtns: document.querySelectorAll('.prefix-btn'),
        btnCalc: document.getElementById('btn-calc'),
        btnCopyCidr: document.getElementById('btn-copy-cidr'),
        statusError: document.getElementById('status-error'),
        outMask: document.getElementById('out-mask'),
        outWildcard: document.getElementById('out-wildcard'),
        outNetwork: document.getElementById('out-network'),
        outBroadcast: document.getElementById('out-broadcast'),
        outTotal: document.getElementById('out-total'),
        outUsable: document.getElementById('out-usable'),
        outFirst: document.getElementById('out-first'),
        outLast: document.getElementById('out-last'),
        outClass: document.getElementById('out-class'),
        outFlags: document.getElementById('out-flags'),
        outBinary: document.getElementById('out-binary'),
        outCidr: document.getElementById('out-cidr')
    };

    function parseIpv4(text) {
        var m = IPV4_RE.exec(text.trim());
        if (!m) return null;
        var octets = m.slice(1, 5).map(function (s) {
            return parseInt(s, 10);
        });
        if (octets.some(function (n) {
            return n < 0 || n > 255;
        })) {
            return null;
        }
        return octets;
    }

    function octetsToInt(octets) {
        return (
            ((octets[0] << 24) >>> 0) |
            ((octets[1] << 16) >>> 0) |
            ((octets[2] << 8) >>> 0) |
            (octets[3] >>> 0)
        ) >>> 0;
    }

    function intToOctets(n) {
        return [
            (n >>> 24) & 255,
            (n >>> 16) & 255,
            (n >>> 8) & 255,
            n & 255
        ];
    }

    function formatIp(octets) {
        return octets.join('.');
    }

    function formatIpFromInt(n) {
        return formatIp(intToOctets(n));
    }

    function prefixToMask(prefix) {
        if (prefix === 0) return 0;
        return (~0 << (32 - prefix)) >>> 0;
    }

    function formatBinary(octets) {
        return octets
            .map(function (o) {
                return ('00000000' + o.toString(2)).slice(-8);
            })
            .join('.');
    }

    function formatBigNumber(n) {
        if (n >= 1e9) return n.toLocaleString('zh-CN');
        return String(n);
    }

    function getIpClass(octets) {
        var first = octets[0];
        if (first >= 1 && first <= 126) return 'A';
        if (first >= 128 && first <= 191) return 'B';
        if (first >= 192 && first <= 223) return 'C';
        if (first >= 224 && first <= 239) return 'D（组播）';
        if (first >= 240 && first <= 255) return 'E（保留）';
        return '—';
    }

    function getAddressFlags(octets) {
        var flags = [];
        var first = octets[0];
        var second = octets[1];
        if (first === 10) flags.push('私有 (RFC 1918)');
        if (first === 172 && second >= 16 && second <= 31) flags.push('私有 (RFC 1918)');
        if (first === 192 && second === 168) flags.push('私有 (RFC 1918)');
        if (first === 127) flags.push('环回');
        if (first === 169 && second === 254) flags.push('链路本地');
        if (first >= 224 && first <= 239) flags.push('组播');
        if (flags.length === 0) flags.push('公网/其他');
        return flags.join(' · ');
    }

    function calcHostCounts(prefix) {
        var total = Math.pow(2, 32 - prefix);
        var usable;
        if (prefix <= 30) {
            usable = total - 2;
        } else if (prefix === 31) {
            usable = 2;
        } else {
            usable = 1;
        }
        return { total: total, usable: usable };
    }

    function calcUsableRange(network, broadcast, prefix) {
        if (prefix >= 31) {
            return {
                first: formatIpFromInt(network),
                last: formatIpFromInt(broadcast)
            };
        }
        if (network === broadcast) {
            return { first: '—', last: '—' };
        }
        return {
            first: formatIpFromInt((network + 1) >>> 0),
            last: formatIpFromInt((broadcast - 1) >>> 0)
        };
    }

    function parseInput() {
        var raw = dom.ipInput.value.trim();
        var ipText = raw;
        var prefix = parseInt(dom.prefixRange.value, 10);

        var cidrMatch = CIDR_RE.exec(raw);
        if (cidrMatch) {
            ipText = cidrMatch[1].trim();
            prefix = parseInt(cidrMatch[2], 10);
        }

        var octets = parseIpv4(ipText);
        if (!octets) {
            return { error: '请输入有效的 IPv4 地址，例如 192.168.1.1 或 192.168.1.0/24' };
        }
        if (isNaN(prefix) || prefix < 0 || prefix > 32) {
            return { error: 'CIDR 前缀须在 0–32 之间' };
        }

        return { octets: octets, prefix: prefix, ipText: ipText };
    }

    function setPrefixUi(prefix) {
        dom.prefixRange.value = String(prefix);
        dom.prefixLabel.textContent = '/' + prefix;
        dom.prefixRange.setAttribute('aria-valuenow', String(prefix));
        dom.prefixBtns.forEach(function (btn) {
            var p = parseInt(btn.getAttribute('data-prefix'), 10);
            btn.classList.toggle('is-active', p === prefix);
        });
    }

    function clearResults() {
        [
            dom.outMask,
            dom.outWildcard,
            dom.outNetwork,
            dom.outBroadcast,
            dom.outTotal,
            dom.outUsable,
            dom.outFirst,
            dom.outLast,
            dom.outClass,
            dom.outFlags,
            dom.outBinary,
            dom.outCidr
        ].forEach(function (el) {
            el.textContent = '—';
        });
    }

    function showError(message) {
        dom.statusError.hidden = !message;
        dom.statusError.textContent = message || '';
    }

    function renderResult(data) {
        var ipInt = octetsToInt(data.octets);
        var mask = prefixToMask(data.prefix);
        var wildcard = (~mask) >>> 0;
        var network = (ipInt & mask) >>> 0;
        var broadcast = (network | wildcard) >>> 0;
        var counts = calcHostCounts(data.prefix);
        var range = calcUsableRange(network, broadcast, data.prefix);
        var cidrText = formatIpFromInt(network) + '/' + data.prefix;

        dom.outMask.textContent = formatIpFromInt(mask);
        dom.outWildcard.textContent = formatIpFromInt(wildcard);
        dom.outNetwork.textContent = formatIpFromInt(network);
        dom.outBroadcast.textContent = formatIpFromInt(broadcast);
        dom.outTotal.textContent = formatBigNumber(counts.total);
        dom.outUsable.textContent = formatBigNumber(Math.max(0, counts.usable));
        dom.outFirst.textContent = counts.usable > 0 ? range.first : '—';
        dom.outLast.textContent = counts.usable > 0 ? range.last : '—';
        dom.outClass.textContent = getIpClass(data.octets);
        dom.outFlags.textContent = getAddressFlags(data.octets);
        dom.outBinary.textContent = formatBinary(data.octets);
        dom.outCidr.textContent = cidrText;

        setPrefixUi(data.prefix);
        showError('');
    }

    function calculate() {
        var parsed = parseInput();
        if (parsed.error) {
            showError(parsed.error);
            clearResults();
            return;
        }
        if (parsed.prefix !== parseInt(dom.prefixRange.value, 10)) {
            setPrefixUi(parsed.prefix);
        }
        renderResult(parsed);
    }

    function copyText(text, onDone) {
        if (!text || text === '—') return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(onDone);
        }
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

        dom.prefixRange.addEventListener('input', function () {
            setPrefixUi(parseInt(dom.prefixRange.value, 10));
            calculate();
        });

        dom.prefixBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var p = parseInt(btn.getAttribute('data-prefix'), 10);
                setPrefixUi(p);
                calculate();
            });
        });

        dom.ipInput.addEventListener('input', function () {
            var raw = dom.ipInput.value.trim();
            var m = CIDR_RE.exec(raw);
            if (m) {
                var p = parseInt(m[2], 10);
                if (!isNaN(p) && p >= 0 && p <= 32) {
                    setPrefixUi(p);
                }
            }
            calculate();
        });

        dom.btnCalc.addEventListener('click', calculate);

        dom.btnCopyCidr.addEventListener('click', function () {
            var text = dom.outCidr.textContent;
            copyText(text, function () {
                dom.btnCopyCidr.textContent = '已复制';
                setTimeout(function () {
                    dom.btnCopyCidr.textContent = '复制 CIDR';
                }, 1200);
            });
        });

        document.querySelectorAll('.copy-chip').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-copy');
                var el = document.getElementById(id);
                if (!el) return;
                var label = btn.textContent;
                copyText(el.textContent, function () {
                    btn.textContent = '已复制';
                    setTimeout(function () {
                        btn.textContent = label;
                    }, 1000);
                });
            });
        });
    }

    function init() {
        initTheme();
        bindEvents();
        setPrefixUi(24);
        calculate();
    }

    init();
})();
