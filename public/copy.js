document.addEventListener('click', function (e) {
  var el = e.target.closest('.copy-text');
  if (!el) return;

  var text = el.dataset.copy;
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand('copy');
  ta.remove();

  var rect = el.getBoundingClientRect();
  var toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = 'Copied!';
  toast.style.top = (rect.top - 28) + 'px';
  toast.style.left = (rect.left + rect.width / 2) + 'px';
  toast.style.transform = 'translateX(-50%)';
  document.body.appendChild(toast);

  setTimeout(function () { toast.style.opacity = '0'; }, 900);
  setTimeout(function () { toast.remove(); }, 1200);
});
