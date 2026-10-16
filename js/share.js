/**
 * UPI Bill Maker - Universal Website Share Module
 * Provides seamless 1-click native sharing on mobile & an elegant modal on desktop
 */

(function () {
  function getCleanUrl() {
    try {
      var loc = window.location;
      if (!loc || !loc.origin || loc.origin === 'null' || loc.protocol === 'file:') {
        return 'https://upibillmaker.com/';
      }
      var cleanPath = (loc.pathname || '/').replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
      return loc.origin + (cleanPath === '' ? '/' : cleanPath);
    } catch (e) {
      return 'https://upibillmaker.com/';
    }
  }

  function getDefaultShareText() {
    return 'Create professional GST and Non-GST bills with auto-pay UPI QR code - Free, private and instant PDF download!';
  }

  function getDefaultShareTitle() {
    return document.title || 'UPI Bill Maker – Free GST & Non-GST Invoice Maker';
  }

  window.shareWebsite = function (customTitle, customText, customUrl) {
    var url = customUrl || getCleanUrl();
    var title = customTitle || getDefaultShareTitle();
    var text = customText || getDefaultShareText();

    // If mobile browser supports native Web Share API
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url
      }).catch(function (err) {
        if (err.name !== 'AbortError') {
          openShareModal(url, title, text);
        }
      });
    } else {
      openShareModal(url, title, text);
    }
  };

  window.openShareModal = function (customUrl, customTitle, customText) {
    var url = customUrl || getCleanUrl();
    var text = customText || getDefaultShareText();

    var modal = document.getElementById('website-share-modal');
    if (!modal) {
      createShareModalDOM(url, text);
      modal = document.getElementById('website-share-modal');
    } else {
      updateShareModalDOM(url, text);
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  window.closeShareModal = function () {
    var modal = document.getElementById('website-share-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  function updateShareModalDOM(url, text) {
    var waBtn = document.getElementById('share-btn-wa');
    var tgBtn = document.getElementById('share-btn-tg');
    var xBtn = document.getElementById('share-btn-x');
    var liBtn = document.getElementById('share-btn-li');
    var input = document.getElementById('share-modal-url-input');

    if (waBtn) waBtn.href = 'https://wa.me/?text=' + encodeURIComponent(text + '\n' + url);
    if (tgBtn) tgBtn.href = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
    if (xBtn) xBtn.href = 'https://x.com/intent/post?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
    if (liBtn) liBtn.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
    if (input) input.value = url;
  }

  window.copyShareUrl = function () {
    var btn = document.getElementById('share-modal-copy-btn');
    var input = document.getElementById('share-modal-url-input');
    var url = input ? input.value : getCleanUrl();

    function showSuccess() {
      if (btn) {
        var originalHtml = btn.innerHTML;
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
    var textarea = document.createElement('textarea');
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

  function createShareModalDOM(initialUrl, initialText) {
    var url = initialUrl || getCleanUrl();
    var text = initialText || getDefaultShareText();

    var waHref = 'https://wa.me/?text=' + encodeURIComponent(text + '\n' + url);
    var tgHref = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
    var xHref = 'https://x.com/intent/post?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
    var liHref = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);

    var modalHtml = `
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
              <a id="share-btn-wa" href="${waHref}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-800 transition-all font-semibold text-xs group">
                <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <i data-lucide="message-circle" class="w-4 h-4"></i>
                </div>
                <span>WhatsApp</span>
              </a>

              <!-- Telegram -->
              <a id="share-btn-tg" href="${tgHref}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 p-3 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/80 text-sky-800 transition-all font-semibold text-xs group">
                <div class="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <i data-lucide="send" class="w-4 h-4"></i>
                </div>
                <span>Telegram</span>
              </a>

              <!-- X (Twitter) -->
              <a id="share-btn-x" href="${xHref}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all font-semibold text-xs group">
                <div class="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </div>
                <span>X (Twitter)</span>
              </a>

              <!-- LinkedIn -->
              <a id="share-btn-li" href="${liHref}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2.5 p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-blue-800 transition-all font-semibold text-xs group">
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
                <input id="share-modal-url-input" type="text" readonly value="${url}" class="bg-transparent text-xs text-slate-700 font-mono px-2 py-1 grow outline-none select-all" />
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
    var div = document.createElement('div');
    div.innerHTML = modalHtml.trim();
    document.body.appendChild(div.firstChild);
  }

  // ==========================================
  // UNIVERSAL BILL SHARE MODAL (Text, PNG, PDF)
  // ==========================================
  var currentBillShareConfig = null;

  window.openBillShareModal = function (config) {
    currentBillShareConfig = config || {};
    var modal = document.getElementById('bill-share-modal');
    if (!modal) {
      createBillShareModalDOM();
      modal = document.getElementById('bill-share-modal');
    }
    updateBillShareModalDOM();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  window.closeBillShareModal = function () {
    var modal = document.getElementById('bill-share-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  function updateBillShareModalDOM() {
    if (!currentBillShareConfig) return;
    var titleEl = document.getElementById('bill-share-modal-title');
    if (titleEl && currentBillShareConfig.title) {
      titleEl.textContent = 'Share ' + currentBillShareConfig.title;
    }
    var previewEl = document.getElementById('bill-share-text-preview');
    if (previewEl) {
      previewEl.textContent = currentBillShareConfig.text || '';
    }
    var phoneBtn = document.getElementById('btn-share-text-phone');
    var phoneLabel = document.getElementById('btn-share-text-phone-label');
    var rawPhone = (currentBillShareConfig.customerPhone || '').replace(/[^0-9]/g, '');
    var isRealPhone = rawPhone && rawPhone.length >= 10 && !currentBillShareConfig.customerPhone.includes('*');
    if (isRealPhone) {
      if (phoneBtn) {
        phoneBtn.classList.remove('hidden');
        phoneBtn.classList.add('inline-flex');
      }
      if (phoneLabel) {
        phoneLabel.textContent = 'Direct to ' + (rawPhone.length > 10 ? '+' + rawPhone : '+91 ' + rawPhone);
      }
    } else {
      if (phoneBtn) {
        phoneBtn.classList.add('hidden');
        phoneBtn.classList.remove('inline-flex');
      }
    }
  }

  window.shareBillTextToAny = function () {
    if (!currentBillShareConfig) return;
    var text = currentBillShareConfig.text || '';
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      navigator.share({
        title: currentBillShareConfig.title || 'Bill / Invoice',
        text: text
      }).catch(function (err) {
        if (err && err.name !== 'AbortError') {
          window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
        }
      });
    } else {
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
    }
  };

  window.shareBillTextToPhone = function () {
    if (!currentBillShareConfig) return;
    var text = currentBillShareConfig.text || '';
    var phone = (currentBillShareConfig.customerPhone || '').replace(/[^0-9]/g, '');
    if (phone) {
      window.open('https://api.whatsapp.com/send?phone=' + phone + '&text=' + encodeURIComponent(text), '_blank');
    }
  };

  window.copyBillText = function () {
    if (!currentBillShareConfig) return;
    var text = currentBillShareConfig.text || '';
    var btn = document.getElementById('btn-copy-bill-text');
    function onDone() {
      if (btn) {
        var orig = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i><span>Copied!</span>';
        if (window.lucide) window.lucide.createIcons();
        setTimeout(function () {
          btn.innerHTML = orig;
          if (window.lucide) window.lucide.createIcons();
        }, 2000);
      }
      showBillShareToast('Bill summary copied to clipboard!');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(function () {
        fallbackCopy(text, onDone);
      });
    } else {
      fallbackCopy(text, onDone);
    }
  };

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2500);
  }

  window.shareBillPNG = async function () {
    if (!currentBillShareConfig || !currentBillShareConfig.onGetPNGBlob) return;
    var btn = document.getElementById('btn-share-bill-png');
    var originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<svg class="animate-spin h-3.5 w-3.5 text-current inline mr-1" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Generating Image...';
    }
    try {
      var blob = await currentBillShareConfig.onGetPNGBlob();
      var filename = (currentBillShareConfig.filename || 'Bill') + '.png';
      var file = new File([blob], filename, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: currentBillShareConfig.title || 'Bill Image',
          text: currentBillShareConfig.text || ''
        });
      } else {
        downloadBlob(blob, filename);
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            showBillShareToast('PNG image copied & downloaded! Opening WhatsApp to send...');
          } else {
            showBillShareToast('PNG image downloaded! Opening WhatsApp to send...');
          }
        } catch(e) {
          showBillShareToast('PNG image downloaded! Opening WhatsApp to send...');
        }
        setTimeout(function() {
          window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(currentBillShareConfig.text || ''), '_blank');
        }, 700);
      }
    } catch(err) {
      if (err && err.name !== 'AbortError') {
        console.error('PNG Share error:', err);
        showBillShareToast('Notice: Could not share directly. Downloading PNG...');
        if (currentBillShareConfig.onDownloadPNG) currentBillShareConfig.onDownloadPNG();
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  };

  window.shareBillPDF = async function () {
    if (!currentBillShareConfig || !currentBillShareConfig.onGetPDFBlob) return;
    var btn = document.getElementById('btn-share-bill-pdf');
    var originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<svg class="animate-spin h-3.5 w-3.5 text-current inline mr-1" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Generating PDF...';
    }
    try {
      var blob = await currentBillShareConfig.onGetPDFBlob();
      var filename = (currentBillShareConfig.filename || 'Bill') + '.pdf';
      var file = new File([blob], filename, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: currentBillShareConfig.title || 'Bill PDF',
          text: currentBillShareConfig.text || ''
        });
      } else {
        downloadBlob(blob, filename);
        showBillShareToast('PDF downloaded! Opening WhatsApp to send to any contact...');
        setTimeout(function() {
          window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(currentBillShareConfig.text || ''), '_blank');
        }, 700);
      }
    } catch(err) {
      if (err && err.name !== 'AbortError') {
        console.error('PDF Share error:', err);
        showBillShareToast('Notice: Could not share PDF directly. Downloading file...');
        if (currentBillShareConfig.onDownloadPDF) currentBillShareConfig.onDownloadPDF();
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  };

  window.triggerDirectDownloadPNG = function () {
    if (currentBillShareConfig && currentBillShareConfig.onDownloadPNG) {
      currentBillShareConfig.onDownloadPNG();
    } else if (currentBillShareConfig && currentBillShareConfig.onGetPNGBlob) {
      currentBillShareConfig.onGetPNGBlob().then(function(blob) {
        downloadBlob(blob, (currentBillShareConfig.filename || 'Bill') + '.png');
      });
    }
  };

  window.triggerDirectDownloadPDF = function () {
    if (currentBillShareConfig && currentBillShareConfig.onDownloadPDF) {
      currentBillShareConfig.onDownloadPDF();
    } else if (currentBillShareConfig && currentBillShareConfig.onGetPDFBlob) {
      currentBillShareConfig.onGetPDFBlob().then(function(blob) {
        downloadBlob(blob, (currentBillShareConfig.filename || 'Bill') + '.pdf');
      });
    }
  };

  function showBillShareToast(msg) {
    var toast = document.getElementById('bill-share-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bill-share-toast';
      toast.className = 'fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-none';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i><span>' + msg + '</span>';
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
    toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
    setTimeout(function() {
      toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
    }, 3500);
  }

  function createBillShareModalDOM() {
    var modalHtml = `
      <div id="bill-share-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity no-print" onclick="if(event.target===this)closeBillShareModal()">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
          <!-- Modal Header -->
          <div class="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <i data-lucide="share-2" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 id="bill-share-modal-title" class="font-heading font-bold text-slate-900 text-sm sm:text-base leading-tight">Share Bill / Invoice (बिल शेयर करें)</h3>
                <p id="bill-share-modal-subtitle" class="text-slate-500 text-[11px] sm:text-xs">Choose how you want to share with customer or anyone:</p>
              </div>
            </div>
            <button type="button" onclick="closeBillShareModal()" class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Modal Body (3 Distinct Options: Text, PNG, PDF) -->
          <div class="p-4 sm:p-5 space-y-3.5 overflow-y-auto text-xs">
            
            <!-- Option 1: Text Summary -->
            <div class="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3 sm:p-3.5 space-y-2.5 transition-all">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 text-xs sm:text-sm block">1. Share as Text (व्हाट्सएप टेक्स्ट संदेश)</span>
                    <span class="text-[11px] text-slate-500">Summary with invoice details & instant UPI auto-pay link</span>
                  </div>
                </div>
                <span class="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">Quick Text</span>
              </div>

              <!-- Preview Box of Message -->
              <div class="bg-white/95 border border-emerald-200/80 rounded-lg p-2.5 text-[11px] text-slate-700 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto leading-relaxed select-all" id="bill-share-text-preview"></div>

              <!-- Action Buttons for Text -->
              <div class="flex flex-wrap items-center gap-2 pt-0.5">
                <button type="button" id="btn-share-text-any" onclick="shareBillTextToAny()" class="flex-1 min-w-[150px] py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer">
                  <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                  <span>Share to Any Contact</span>
                </button>
                
                <button type="button" id="btn-share-text-phone" onclick="shareBillTextToPhone()" class="hidden py-2 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg items-center gap-1.5 transition-all cursor-pointer">
                  <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                  <span id="btn-share-text-phone-label">Send to Bill Phone</span>
                </button>

                <button type="button" id="btn-copy-bill-text" onclick="copyBillText()" class="py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <!-- Option 2: PNG Image -->
            <div class="border border-purple-200 bg-purple-50/40 rounded-xl p-3 sm:p-3.5 space-y-2.5 transition-all">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <i data-lucide="image" class="w-3.5 h-3.5"></i>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 text-xs sm:text-sm block">2. Share as PNG Image (बिल की फोटो / इमेज)</span>
                    <span class="text-[11px] text-slate-500">HD photo of the bill with UPI QR code for 1-click sharing</span>
                  </div>
                </div>
                <span class="text-[9px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full shrink-0">Photo</span>
              </div>

              <div class="flex flex-wrap items-center gap-2 pt-0.5">
                <button type="button" id="btn-share-bill-png" onclick="shareBillPNG()" class="flex-1 min-w-[150px] py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer">
                  <i data-lucide="share" class="w-3.5 h-3.5"></i>
                  <span>Share Image to Any Contact</span>
                </button>
                <button type="button" onclick="triggerDirectDownloadPNG()" class="py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i>
                  <span>Download PNG</span>
                </button>
              </div>
            </div>

            <!-- Option 3: PDF Document -->
            <div class="border border-rose-200 bg-rose-50/40 rounded-xl p-3 sm:p-3.5 space-y-2.5 transition-all">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 text-xs sm:text-sm block">3. Share as PDF Document (ओरिजिनल A4 PDF)</span>
                    <span class="text-[11px] text-slate-500">Official printable A4 PDF file for accounting & tax records</span>
                  </div>
                </div>
                <span class="text-[9px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">Document</span>
              </div>

              <div class="flex flex-wrap items-center gap-2 pt-0.5">
                <button type="button" id="btn-share-bill-pdf" onclick="shareBillPDF()" class="flex-1 min-w-[150px] py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer">
                  <i data-lucide="share" class="w-3.5 h-3.5"></i>
                  <span>Share PDF to Any Contact</span>
                </button>
                <button type="button" onclick="triggerDirectDownloadPDF()" class="py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer">
                  <i data-lucide="download" class="w-3.5 h-3.5"></i>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
    var div = document.createElement('div');
    div.innerHTML = modalHtml.trim();
    document.body.appendChild(div.firstChild);
  }

  // Pre-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      createShareModalDOM();
      createBillShareModalDOM();
    });
  } else {
    createShareModalDOM();
    createBillShareModalDOM();
  }
})();
