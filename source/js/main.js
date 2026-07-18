/* Modern Duang Theme */

function copyToClipboard(btn, text) {
  function onSuccess() {
    var originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>复制成功';
    btn.style.background = 'rgba(34, 197, 94, 0.2)';
    btn.style.color = '#22c55e';
    btn.style.borderColor = '#22c55e';
    setTimeout(function() {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(function() {
      fallbackCopy(text, onSuccess);
    });
  } else {
    fallbackCopy(text, onSuccess);
  }

  function fallbackCopy(value, callback) {
    var textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      callback();
    } catch (err) {
      console.error('复制失败:', err);
    }
    document.body.removeChild(textarea);
  }
}

/* QR 弹窗 */
function showQrModal(src, name) {
  var modal = document.getElementById('qrModal');
  var title = document.getElementById('qrTitle');
  var img = document.getElementById('qrImg');
  if (modal && title && img) {
    title.textContent = name;
    img.src = src;
    img.alt = name;
    modal.classList.add('is-open');
  }
}
function closeQrModal() {
  var modal = document.getElementById('qrModal');
  if (modal) modal.classList.remove('is-open');
}

document.addEventListener('DOMContentLoaded', function() {

  /* 深色模式 */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(function(btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  // 同步 head 内联脚本已设置的初始主题状态
  var currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme) {
    document.querySelectorAll('.theme-toggle').forEach(function(btn) {
      btn.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
    });
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  var mobileThemeToggle = document.getElementById('mobileThemeToggle');
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }

  /* 移动端菜单 */
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');
      this.setAttribute('aria-expanded', mobileMenu.classList.contains('is-open'));
    });

    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (this.classList.contains('mobile-dropdown-trigger')) return;
        if (this.closest('.mobile-dropdown-menu')) return;
        mobileMenuBtn.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
      });
    });
  }

  /* 卡片入场动画 */
  var animateCards = document.querySelectorAll('.feature-card, .post-card, .cloud-card');

  var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  var cardIndex = 0;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = cardIndex * 100;
        cardIndex++;
        setTimeout(function() {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateCards.forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });

  /* Mermaid */
  var mermaidBlocks = document.querySelectorAll('figure.highlight.plaintext');
  mermaidBlocks.forEach(function(block) {
    var codeElement = block.querySelector('.code pre');
    if (!codeElement) return;
    var lineSpans = codeElement.querySelectorAll('span.line');
    var mermaidCode = '';
    lineSpans.forEach(function(span) {
      var lineText = span.textContent;
      // 跳过行号列
      if (/^\d+$/.test(lineText.trim())) return;
      mermaidCode += lineText + '\n';
    });
    mermaidCode = mermaidCode.trim();
    if (mermaidCode.includes('graph') || mermaidCode.includes('flowchart') ||
        mermaidCode.includes('sequenceDiagram') || mermaidCode.includes('classDiagram') ||
        mermaidCode.includes('stateDiagram') || mermaidCode.includes('erDiagram')) {
      var pre = document.createElement('pre');
      var code = document.createElement('code');
      code.className = 'mermaid';
      code.textContent = mermaidCode;
      pre.appendChild(code);
      block.parentNode.replaceChild(pre, block);
    }
  });

  if (typeof mermaid !== 'undefined') {
    mermaid.run();
  }

  /* 文章目录 */
  var tocContent = document.getElementById('tocContent');
  var postContent = document.querySelector('.post-content');

  if (tocContent && postContent) {
    var headings = postContent.querySelectorAll('h1, h2, h3, h4');
    var tocHTML = '';
    var currentH1Index = -1;
    var headingInfo = [];
    var headingOffsets = [];

    headings.forEach(function(heading, index) {
      var id = 'heading-' + index;
      heading.id = id;
      var level = heading.tagName.toLowerCase();
      var levelNum = parseInt(level.replace('h', ''));
      var text = heading.textContent.trim();
      var h1Index = currentH1Index;
      if (levelNum === 1) {
        currentH1Index = index;
        h1Index = index;
      }
      headingInfo.push({ id: id, level: level, levelNum: levelNum, text: text, h1Index: h1Index });
      tocHTML += '<a href="#' + id + '" class="toc-' + level + '" data-h1="' + h1Index + '">' + text + '</a>';
    });

    tocContent.innerHTML = tocHTML;
    var tocLinks = tocContent.querySelectorAll('a');

    function updateOffsets() {
      headingOffsets = [];
      headings.forEach(function(heading) {
        headingOffsets.push(heading.getBoundingClientRect().top + window.scrollY);
      });
    }

    tocLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var targetId = this.getAttribute('href').substring(1);
        var targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    var ticking = false;

    // 滚动高亮当前标题，只展开当前 H1 下的子标题
    function updateToc() {
      var scrollPos = window.scrollY + 150;
      var currentH1 = -1;
      var currentIndex = -1;
      for (var i = 0; i < headings.length; i++) {
        if (scrollPos >= headingOffsets[i]) {
          currentIndex = i;
          if (headingInfo[i].levelNum === 1) currentH1 = i;
        }
      }
      tocLinks.forEach(function(link, index) {
        var linkH1 = parseInt(link.getAttribute('data-h1'));
        if (headingInfo[index].levelNum === 1 || linkH1 === currentH1) {
          link.style.display = 'block';
        } else {
          link.style.display = 'none';
        }
        if (index === currentIndex) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateToc);
        ticking = true;
      }
    }

    updateOffsets();
    updateToc();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function() {
      updateOffsets();
      updateToc();
    });
  }

  /* 回到顶部 */
  var backToTop = document.createElement('button');
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 15l-6-6-6 6"/></svg>';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', '回到顶部');
  document.body.appendChild(backToTop);

  var scrollTicking = false;
  window.addEventListener('scroll', function() {
    if (!scrollTicking) {
      requestAnimationFrame(function() {
        var footer = document.querySelector('.site-footer');
        if (!footer) {
          backToTop.classList.toggle('visible', window.pageYOffset > 400);
          scrollTicking = false;
          return;
        }
        var footerRect = footer.getBoundingClientRect();
        var viewportHeight = window.innerHeight;
        var btnHeight = 48;
        var gap = 20;
        if (footerRect.top < viewportHeight - gap) {
          var stopTop = footerRect.top - btnHeight - gap;
          if (stopTop < 0) stopTop = gap;
          backToTop.style.top = stopTop + 'px';
          backToTop.classList.add('visible');
        } else {
          backToTop.style.top = '';
          backToTop.classList.toggle('visible', window.pageYOffset > 400);
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* 引用块鼠标光效 */
  document.querySelectorAll('blockquote').forEach(function(blockquote) {
    blockquote.addEventListener('mousemove', function(e) {
      var rect = this.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      this.style.setProperty('--mouse-x', x + '%');
      this.style.setProperty('--mouse-y', y + '%');
    });
  });

  /* 友链复制 + RSS 防冒泡 + QR 弹窗 */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.link-copy-btn');
    if (btn) {
      e.preventDefault();
      copyToClipboard(btn, btn.getAttribute('data-copy') || '');
    }
    if (e.target.closest('.link-rss')) {
      e.stopPropagation();
    }
    var qr = e.target.closest('.qr-trigger');
    if (qr) {
      e.preventDefault();
      showQrModal(qr.getAttribute('data-qrcode'), qr.getAttribute('data-name'));
    }
  });

});
