/* Modern Duang Theme */

function copyToClipboard(btn, text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
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
  } catch (err) {
    console.error('复制失败:', err);
  }

  document.body.removeChild(textarea);
}

document.addEventListener('DOMContentLoaded', function() {

  /* 深色模式 */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
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
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');
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
  const animateCards = document.querySelectorAll('.feature-card, .post-card, .cloud-card');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, index) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
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

  /* Mermaid 图表 */
  const mermaidBlocks = document.querySelectorAll('figure.highlight.plaintext');
  mermaidBlocks.forEach(function(block) {
    const codeElement = block.querySelector('.code pre');
    if (codeElement) {
      const lineSpans = codeElement.querySelectorAll('span.line');
      let mermaidCode = '';

      lineSpans.forEach(function(span) {
        let lineText = span.textContent;
        // 跳过行号列
        if (/^\d+$/.test(lineText.trim())) return;
        mermaidCode += lineText + '\n';
      });

      mermaidCode = mermaidCode.trim();

      if (mermaidCode.includes('graph') || mermaidCode.includes('flowchart') ||
          mermaidCode.includes('sequenceDiagram') || mermaidCode.includes('classDiagram') ||
          mermaidCode.includes('stateDiagram') || mermaidCode.includes('erDiagram')) {
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = 'mermaid';
        code.textContent = mermaidCode;
        pre.appendChild(code);
        block.parentNode.replaceChild(pre, block);
      }
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

    // 滚动高亮当前标题，并只展开当前 H1 下的子标题
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
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 15l-6-6-6 6"/></svg>';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', '回到顶部');
  backToTop.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 40px;
    width: 44px;
    height: 44px;
    background: var(--bg-card);
    color: var(--primary);
    border: 2px solid var(--primary);
    border-radius: var(--radius-md);
    font-size: 18px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 1000;
    box-shadow: var(--shadow-clay);
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 400) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backToTop.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-4px) scale(1.1)';
    this.style.background = 'var(--primary)';
    this.style.color = 'white';
    this.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)';
  });

  backToTop.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.background = 'var(--bg-card)';
    this.style.color = 'var(--primary)';
    this.style.boxShadow = 'var(--shadow-clay)';
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

});
