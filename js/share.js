/**
 * UPI Bill Maker - Universal Website Share Module
 * Provides seamless 1-click native sharing on mobile & an elegant modal on desktop
 */

(function () {
  const SHARE_TITLE = 'UPI Bill Maker – Free GST & Non-GST Invoice Maker';
  const SHARE_TEXT = 'Create professional GST & Non-GST bills with auto-pay UPI QR code. 100% free, private & instant PDF download!';
  const SHARE_URL = 'https://upibillmaker.com/';

  window.shareWebsite = function () {
    // If mobile browser supports native Web Share API
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      navigator.share({
        title: SHARE_TITLE,
        text: SHARE_TEXT,
        url: SHARE_URL
      }).catch(function (err) {
        if (err.name !== 'AbortError') {
          openShareModal();
        }
      });
    } else {
      openShareModal();
    }
  };

  window.openShareModal = function () {
    let modal = document.getElementById('website-share-modal');
    if (!modal) {
      createShareModalDOM();
      modal = document.getElementById('website-share-modal');
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  window.closeShareModal = function () {
    const modal = document.getElementById('website-share-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.copyShareUrl = function () {
    const btn = document.getElementById('share-modal-copy-btn');
    const input = document.getElementById('share-modal-url-input');
    const url = input ? input.value : SHARE_URL;

    function showSuccess() {
      if (btn) {
        const originalHtml = btn.innerHTML;
        btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
        btn.classList.add('bg-emerald-800');
        btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i><span>Copied!</span>';
        if (window.lucide) window.lucide.createIcons();
        setTimeout(function () {
          btn.innerHTML = originalHtml;
          btn.classList.remove('bg-emerald-800');
          btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
          if (window.lucide) window.lucide.createIcons();
        }, 2200);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(showSuccess).catch(function () {
        fallbackCopy(url, showSuccess);
      });
    } else {
      fallbackCopy(url, showSuccess);
    }
  };

  function fallbackCopy(text, callback) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch (e) {
      console.error('Copy fallback failed', e);
    }
    document.body.removeChild(textarea);
  }

  function createShareModalDOM() {
    const modalHtml = `
      <div id="website-share-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity" onclick="if(event.target===this)closeShareModal()">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
          <!-- Modal Header -->
          <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <i data-lucide="share-2" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="font-heading font-bold text-slate-900 text-base leading-tight">Share UPI Bill Maker</h3>
                <p class="text-slate-500 text-xs">Help other businesses create free bills & QR codes</p>
              </div>
            </div>
            <button type="button" onclick="closeShareModal()" class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-5 space-y-4">
            <!-- Share Channels Grid -->
            <div class="grid grid-cols-2 gap-2.5">
              <!-- WhatsApp -->
              <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(SHARE_TEXT + '\n👉 ' + SHARE_URL)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-800 transition-all font-semibold text-xs group">
                <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <i data-lucide="message-circle" class="w-4 h-4"></i>
                </div>
                <span>WhatsApp</span>
              </a>

              <!-- Telegram -->
              <a href="https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 p-3 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/80 text-sky-800 transition-all font-semibold text-xs group">
                <div class="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <i data-lucide="send" class="w-4 h-4"></i>
                </div>
                <span>Telegram</span>
              </a>

              <!-- Twitter / X -->
              <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all font-semibold text-xs group">
                <div class="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <i data-lucide="twitter" class="w-4 h-4"></i>
                </div>
                <span>Twitter / X</span>
              </a>

              <!-- LinkedIn -->
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-blue-800 transition-all font-semibold text-xs group">
                <div class="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <i data-lucide="linkedin" class="w-4 h-4"></i>
                </div>
                <span>LinkedIn</span>
              </a>
            </div>

            <!-- Copy Link Box -->
            <div class="pt-2 border-t border-slate-100">
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">Or copy website link:</label>
              <div class="flex items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-xl">
                <input id="share-modal-url-input" type="text" readonly value="${SHARE_URL}" class="bg-transparent text-xs text-slate-700 font-mono px-2 py-1 grow outline-none select-all" />
                <button type="button" id="share-modal-copy-btn" onclick="copyShareUrl()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-all shrink-0 cursor-pointer shadow-xs">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = modalHtml.trim();
    document.body.appendChild(div.firstChild);
  }

  // Pre-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      createShareModalDOM();
    });
  } else {
    createShareModalDOM();
  }
})();
