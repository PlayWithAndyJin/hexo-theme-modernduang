/* Modern Duang Theme */

// 复制到剪贴板函数
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

document.addEventListener('DOMContentLoaded', function() {

  // ========== 深色模式切换 ==========
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

  // 初始化：优先读取 localStorage，否则尊重系统偏好
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  // 监听系统偏好变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // 桌面端切换按钮
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // 移动端切换按钮
  var mobileThemeToggle = document.getElementById('mobileThemeToggle');
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }

  // ========== 移动端菜单 ==========
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
        // 如果是下拉触发器，不关闭菜单
        if (this.classList.contains('mobile-dropdown-trigger')) {
          return;
        }
        // 如果点击的是下拉菜单内的链接，不关闭菜单
        if (this.closest('.mobile-dropdown-menu')) {
          return;
        }
        mobileMenuBtn.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
      });
    });
  }
  
  // ========== 卡片入场动画 ==========
  var animateCards = document.querySelectorAll('.feature-card, .post-card, .cloud-card');
  
  var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };
  
  var observer = new IntersectionObserver(function(entries) {
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
  
  // ========== 先处理 Mermaid ==========
  // 将 Hexo highlight 格式的 mermaid 代码块转换为 mermaid 可识别格式
  var mermaidBlocks = document.querySelectorAll('figure.highlight.plaintext');
  mermaidBlocks.forEach(function(block) {
    var codeElement = block.querySelector('.code pre');
    if (codeElement) {
      // 获取所有 line span 的内容
      var lineSpans = codeElement.querySelectorAll('span.line');
      var mermaidCode = '';
      
      lineSpans.forEach(function(span) {
        var lineText = span.textContent;
        // 跳过纯数字行（行号列）
        if (/^\d+$/.test(lineText.trim())) {
          return;
        }
        mermaidCode += lineText + '\n';
      });
      
      mermaidCode = mermaidCode.trim();
      
      // 检查是否是 mermaid 代码
      if (mermaidCode.includes('graph') || mermaidCode.includes('flowchart') || 
          mermaidCode.includes('sequenceDiagram') || mermaidCode.includes('classDiagram') ||
          mermaidCode.includes('stateDiagram') || mermaidCode.includes('erDiagram')) {
        
        // 创建新的 mermaid 代码块
        var pre = document.createElement('pre');
        var code = document.createElement('code');
        code.className = 'mermaid';
        code.textContent = mermaidCode;
        pre.appendChild(code);
        
        // 替换原来的代码块
        block.parentNode.replaceChild(pre, block);
      }
    }
  });
  
  // 渲染 mermaid 图表
  if (typeof mermaid !== 'undefined') {
    mermaid.run();
  }
  
  // ========== 文章目录（支持自动折叠） ==========
  var tocContent = document.getElementById('tocContent');
  var postContent = document.querySelector('.post-content');
  
  if (tocContent && postContent) {
    // 提取标题生成目录
    var headings = postContent.querySelectorAll('h1, h2, h3, h4');
    var tocHTML = '';
    
    // 记录每个标题的层级关系
    var currentH1Index = -1;
    var headingInfo = [];
    var headingOffsets = []; // 预计算标题位置
    
    headings.forEach(function(heading, index) {
      // 为标题添加 id
      var id = 'heading-' + index;
      heading.id = id;
      
      // 获取标题级别
      var level = heading.tagName.toLowerCase();
      var levelNum = parseInt(level.replace('h', ''));
      
      // 获取标题文本
      var text = heading.textContent.trim();
      
      // 记录标题信息
      var h1Index = currentH1Index;
      if (levelNum === 1) {
        currentH1Index = index;
        h1Index = index;
      }
      
      headingInfo.push({
        id: id,
        level: level,
        levelNum: levelNum,
        text: text,
        h1Index: h1Index
      });
      
      // 生成目录项
      tocHTML += '<a href="#' + id + '" class="toc-' + level + '" data-h1="' + h1Index + '">' + text + '</a>';
    });
    
    tocContent.innerHTML = tocHTML;
    var tocLinks = tocContent.querySelectorAll('a');
    
    // 预计算标题偏移量
    function updateOffsets() {
      headingOffsets = [];
      headings.forEach(function(heading) {
        headingOffsets.push(heading.getBoundingClientRect().top + window.scrollY);
      });
    }
    
    // 目录点击事件
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
    
    // 节流函数
    var ticking = false;
    
    // 滚动时高亮当前标题并展开对应区域
    function updateToc() {
      var scrollPos = window.scrollY + 150;
      var currentH1 = -1;
      var currentIndex = -1;
      
      // 找到当前所在的标题（使用预计算的偏移量）
      for (var i = 0; i < headings.length; i++) {
        if (scrollPos >= headingOffsets[i]) {
          currentIndex = i;
          if (headingInfo[i].levelNum === 1) {
            currentH1 = i;
          }
        }
      }
      
      // 更新目录项显示状态
      tocLinks.forEach(function(link, index) {
        var linkH1 = parseInt(link.getAttribute('data-h1'));
        
        // 显示 H1 标题
        if (headingInfo[index].levelNum === 1) {
          link.style.display = 'block';
        } 
        // 显示当前 H1 下的子标题
        else if (linkH1 === currentH1) {
          link.style.display = 'block';
        } 
        // 隐藏其他
        else {
          link.style.display = 'none';
        }
        
        // 高亮当前标题
        if (index === currentIndex) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      
      ticking = false;
    }
    
    // 滚动事件处理
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateToc);
        ticking = true;
      }
    }
    
    // 初始化
    updateOffsets();
    updateToc();
    
    // 监听滚动事件
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // 监听窗口大小变化，重新计算偏移量
    window.addEventListener('resize', function() {
      updateOffsets();
      updateToc();
    });
  }
  
  // ========== 回到顶部按钮 ==========
  var backToTop = document.createElement('button');
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 15l-6-6-6 6"/></svg>';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', '回到顶部');
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function() {
    backToTop.classList.toggle('visible', window.pageYOffset > 400);
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* 引用块鼠标追踪动效 */
  document.querySelectorAll('blockquote').forEach(function(blockquote) {
    blockquote.addEventListener('mousemove', function(e) {
      var rect = this.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      this.style.setProperty('--mouse-x', x + '%');
      this.style.setProperty('--mouse-y', y + '%');
    });
  });

  /* 友链页复制按钮 */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.link-copy-btn');
    if (btn) {
      e.preventDefault();
      copyToClipboard(btn, btn.getAttribute('data-copy') || '');
    }
    /* RSS 按钮不触发父级链接 */
    if (e.target.closest('.link-rss')) {
      e.stopPropagation();
    }
  });

});
