/* ============================================================
   MENTR101 · View-only protection
   Disables copy, cut, paste, drag, context menu, saving and printing.
   © Dr. Hildegard Haas · Genedia AG Education
   ============================================================ */
(function () {
  'use strict';

  var MSG = 'This course material is for on-screen study only. Copying, downloading and printing are disabled.';

  function editable(el) {
    if (!el || !el.tagName) return false;
    var t = el.tagName.toUpperCase();
    return t === 'INPUT' || t === 'TEXTAREA' || el.isContentEditable;
  }

  function toast() {
    var n = document.getElementById('protectToast');
    if (!n) {
      n = document.createElement('div');
      n.id = 'protectToast';
      n.style.cssText = 'position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:10000;' +
        'background:#1B2A4A;color:#fff;font-family:Arial,Helvetica,sans-serif;font-size:13px;' +
        'padding:10px 16px;border-radius:8px;box-shadow:0 6px 22px rgba(0,0,0,.3);opacity:0;' +
        'transition:opacity .2s;pointer-events:none;max-width:90vw;text-align:center';
      document.body.appendChild(n);
    }
    n.textContent = MSG;
    n.style.opacity = '1';
    clearTimeout(n._t);
    n._t = setTimeout(function () { n.style.opacity = '0'; }, 2200);
  }

  function block(ev) {
    if (editable(ev.target)) return;
    ev.preventDefault();
    ev.stopPropagation();
    toast();
    return false;
  }

  /* clipboard, drag, selection and context menu */
  ['copy', 'cut', 'paste', 'contextmenu', 'dragstart', 'selectstart'].forEach(function (t) {
    document.addEventListener(t, block, true);
  });

  /* keyboard shortcuts: copy, cut, save, print, view source, select all, devtools */
  document.addEventListener('keydown', function (ev) {
    if (editable(ev.target)) return;
    var k = (ev.key || '').toLowerCase();
    var meta = ev.ctrlKey || ev.metaKey;
    if (meta && ['c', 'x', 's', 'p', 'u', 'a'].indexOf(k) > -1) return block(ev);
    if (meta && ev.shiftKey && ['i', 'j', 'c', 's'].indexOf(k) > -1) return block(ev);
    if (k === 'f12') return block(ev);
    if (k === 'printscreen') { toast(); }
  }, true);

  /* printing: blank the page, warn, restore */
  var shield = null;
  function makeShield() {
    if (shield) return shield;
    shield = document.createElement('div');
    shield.className = 'protect-shield';
    shield.innerHTML = '<div><strong style="display:block;font-size:1.15rem;margin-bottom:.6rem">' +
      'Printing is disabled</strong>' + MSG +
      '<br><br><span style="opacity:.7;font-size:.85rem">\u00A9 Dr. Hildegard Haas \u00B7 Genedia AG Education</span></div>';
    document.body.appendChild(shield);
    return shield;
  }
  window.addEventListener('beforeprint', function () { makeShield().classList.add('on'); });
  window.addEventListener('afterprint', function () { makeShield().classList.remove('on'); });
  if (window.matchMedia) {
    var mq = window.matchMedia('print');
    if (mq.addEventListener) {
      mq.addEventListener('change', function (m) { makeShield().classList.toggle('on', m.matches); });
    }
  }
  try {
    var nativePrint = window.print;
    window.print = function () { makeShield().classList.add('on'); toast();
      setTimeout(function () { makeShield().classList.remove('on'); }, 2500); };
    window.__nativePrint = nativePrint;
  } catch (e) {}

  /* saving: strip download attributes and block file:// style saves of embedded media */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[download]').forEach(function (a) {
      a.removeAttribute('download');
      a.addEventListener('click', block, true);
    });
    document.querySelectorAll('img, svg').forEach(function (el) {
      el.setAttribute('draggable', 'false');
      el.addEventListener('dragstart', block, true);
    });
  });
})();
