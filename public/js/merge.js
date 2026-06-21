/* Merge page logic.
 * Loaded only by /merge (via merge.twig). Self-contained; does not touch main.js. */
(function () {
    'use strict';

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    function debounce(fn, wait) {
        var t;
        return function () {
            var ctx = this, args = arguments;
            clearTimeout(t);
            t = setTimeout(function () { fn.apply(ctx, args); }, wait);
        };
    }

    function cssAttrEscape(v) {
        return String(v).replace(/["\\]/g, '\\$&');
    }

    async function searchItems(type, query) {
        var url = '/api/merge/' + encodeURIComponent(type) + '/search?q=' + encodeURIComponent(query);
        var res = await fetch(url);
        var data = await res.json();
        if (!data.success) throw new Error(data.error || 'Search failed');
        return data.data || [];
    }

    function renderResults(listEl, items) {
        listEl.innerHTML = '';
        if (!items.length) {
            var empty = document.createElement('li');
            empty.className = 'list-group-item text-muted';
            empty.textContent = 'No matches.';
            listEl.appendChild(empty);
            return;
        }
        items.forEach(function (item) {
            var id = String(item.id);
            var name = (item.name == null) ? '' : String(item.name);

            var li = document.createElement('li');
            li.className = 'list-group-item d-flex align-items-center gap-2';

            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'form-check-input mt-0 merge-item';
            cb.value = id;
            cb.dataset.id = id;
            cb.dataset.name = name;
            cb.addEventListener('change', function () { syncCheckbox(cb); });

            var label = document.createElement('label');
            label.className = 'flex-grow-1 mb-0';
            label.style.cursor = 'pointer';

            var idSpan = document.createElement('span');
            idSpan.className = 'text-muted me-2';
            idSpan.textContent = id;

            var nameSpan = document.createElement('span');
            nameSpan.textContent = name;

            label.appendChild(idSpan);
            label.appendChild(nameSpan);
            label.addEventListener('click', function () { cb.checked = !cb.checked; syncCheckbox(cb); });

            li.appendChild(cb);
            li.appendChild(label);
            listEl.appendChild(li);
        });
    }

    // Same item can appear in both search lists -> keep their checkboxes in sync within a pane.
    function syncCheckbox(changed) {
        var pane = changed.closest('[data-type]');
        if (!pane) return;
        var id = changed.dataset.id;
        var twins = pane.querySelectorAll('.merge-item[data-id="' + cssAttrEscape(id) + '"]');
        twins.forEach(function (cb) { if (cb !== changed) cb.checked = changed.checked; });
        updateMergeButton(pane);
    }

    function getSelected(pane) {
        var seen = {};
        var out = [];
        pane.querySelectorAll('.merge-item:checked').forEach(function (cb) {
            if (!seen[cb.dataset.id]) {
                seen[cb.dataset.id] = true;
                out.push({ id: cb.dataset.id, name: cb.dataset.name });
            }
        });
        return out;
    }

    function updateMergeButton(pane) {
        var btn = pane.querySelector('.merge-selected-btn');
        var counter = pane.querySelector('.merge-counter');
        var sel = getSelected(pane);
        if (btn) btn.disabled = sel.length < 2;
        if (counter) counter.textContent = sel.length ? (sel.length + ' selected') : '';
    }

    function refreshPaneSearches(pane) {
        pane.querySelectorAll('.merge-search-input').forEach(function (inp) {
            if (inp.value.trim()) {
                inp.dispatchEvent(new Event('input'));
            } else {
                var list = inp.closest('.merge-search-col').querySelector('.merge-results');
                if (list) list.innerHTML = '';
            }
        });
    }

    async function doMerge(pane) {
        var type = pane.dataset.type;
        var sel = getSelected(pane);
        if (sel.length < 2) return;

        var keep = sel[0];
        var merge = sel.slice(1);

        var msg = 'KEEP "' + keep.name + '" (id ' + keep.id + ').\n\n' +
            'These will be merged into it and DELETED:\n' +
            merge.map(function (m) { return '  \u2022 ' + m.name + ' (id ' + m.id + ')'; }).join('\n') +
            '\n\nAll of their books will be reassigned to "' + keep.name + '". Continue?';
        if (!confirm(msg)) return;

        var btn = pane.querySelector('.merge-selected-btn');
        var status = pane.querySelector('.merge-status');
        var original = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Merging...';
        if (status) { status.className = 'merge-status text-muted'; status.textContent = ''; }

        try {
            var res = await fetch('/api/merge/' + encodeURIComponent(type), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: sel.map(function (s) { return s.id; }) })
            });
            var data = await res.json();
            if (data.success) {
                if (status) {
                    status.className = 'merge-status text-success';
                    status.textContent = 'Merged ' + merge.length + ' item(s) into "' + keep.name + '".';
                }
                refreshPaneSearches(pane);
            } else if (status) {
                status.className = 'merge-status text-danger';
                status.textContent = 'Error: ' + (data.error || 'Merge failed');
            }
        } catch (e) {
            if (status) {
                status.className = 'merge-status text-danger';
                status.textContent = 'Request failed: ' + e.message;
            }
        } finally {
            btn.textContent = original;
            updateMergeButton(pane);
        }
    }

    ready(function () {
        var page = document.getElementById('mergePage');
        if (!page) return;

        page.querySelectorAll('.merge-search-input').forEach(function (input) {
            var col = input.closest('.merge-search-col');
            var list = col.querySelector('.merge-results');
            var pane = input.closest('[data-type]');
            var type = pane.dataset.type;

            var run = debounce(async function () {
                var q = input.value.trim();
                if (!q) { list.innerHTML = ''; return; }
                list.innerHTML = '<li class="list-group-item text-muted">Searching...</li>';
                try {
                    var items = await searchItems(type, q);
                    renderResults(list, items);
                    updateMergeButton(pane);
                } catch (e) {
                    list.innerHTML = '';
                    var li = document.createElement('li');
                    li.className = 'list-group-item text-danger';
                    li.textContent = 'Error: ' + e.message;
                    list.appendChild(li);
                }
            }, 300);

            input.addEventListener('input', run);
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') { e.preventDefault(); run(); }
            });
        });

        page.querySelectorAll('.merge-selected-btn').forEach(function (btn) {
            var pane = btn.closest('[data-type]');
            btn.addEventListener('click', function () { doMerge(pane); });
            updateMergeButton(pane);
        });
    });
})();
