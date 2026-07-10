var fs = require('fs');
var path = require('path');

hexo.extend.helper.register('link_apply_content', function() {
  var siteInfo = (hexo.theme.config && hexo.theme.config.siteInfo) || {};
  var hexoConfig = hexo.config || {};

  // 读取 md 文件
  var mdPath = path.join(hexo.theme_dir, 'layout', '_link-apply.md');
  var raw = '';
  try {
    raw = fs.readFileSync(mdPath, 'utf8');
  } catch(e) {
    return { title: '', content: '' };
  }

  // 解析 YAML front matter
  var title = '';
  var content = raw;
  var fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (fmMatch) {
    var fm = fmMatch[1];
    var titleMatch = fm.match(/title:\s*(.+)/);
    if (titleMatch) title = titleMatch[1].trim();
    content = fmMatch[2];
  }

  // 构建站点信息 HTML - 从 Hexo 主配置读取站点名称和描述
  var siteInfoHtml = '<div class="link-format">';
  var formatItems = [
    { label: '博客名', value: hexoConfig.title || siteInfo.name },
    { label: '简介', value: hexoConfig.description || siteInfo.desc },
    { label: '网站地址', value: siteInfo.url, isLink: true },
    { label: '头像图片', value: siteInfo.avatar },
    { label: 'Atom订阅', value: siteInfo.atom, isLink: true }
  ];
  formatItems.forEach(function(item) {
    if (item.value === undefined || item.value === null) return;
    siteInfoHtml += '<div class="link-format-item">';
    siteInfoHtml += '<span class="link-format-text"><strong>' + item.label + '：</strong>';
    if (item.isLink) {
      siteInfoHtml += '<a href="' + esc(item.value) + '" target="_blank">' + esc(item.value) + '</a>';
    } else {
      siteInfoHtml += esc(item.value);
    }
    siteInfoHtml += '</span>';
    if (item.value) {
      siteInfoHtml += '<button class="link-copy-btn" data-copy="' + esc(item.value) + '">';
      siteInfoHtml += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
      siteInfoHtml += ' 复制</button>';
    }
    siteInfoHtml += '</div>';
  });
  siteInfoHtml += '</div>';

  function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  content = content.replace(/<!--\s*siteinfo\s*-->/g, siteInfoHtml);
  content = content.replace(/\{%card%\}([\s\S]*?)\{%card%\}/g, '<div class="link-apply-note">$1</div>');
  content = content.replace(/^### (.+)$/gm, function(_, t) { return '<h4>' + esc(t) + '</h4>'; });
  content = content.replace(/^## (.+)$/gm, function(_, t) { return '<h3>' + esc(t) + '</h3>'; });
  content = content.replace(/^# (.+)$/gm, function(_, t) { return '<h2>' + esc(t) + '</h2>'; });
  content = content.replace(/\*\*(.+?)\*\*/g, function(_, t) { return '<strong>' + esc(t) + '</strong>'; });
  content = content.replace(/\*(.+?)\*/g, function(_, t) { return '<em>' + esc(t) + '</em>'; });
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, t, u) { return '<a href="' + esc(u) + '" target="_blank">' + esc(t) + '</a>'; });
  content = content.replace(/^- (.+)$/gm, function(_, t) { return '<li>' + esc(t) + '</li>'; });
  content = content.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, '<ul>$&</ul>');
  content = content.replace(/^---$/gm, '<hr class="link-apply-divider">');
  content = content.replace(/\n\n/g, '</p><p>');
  content = '<p>' + content + '</p>';
  content = content.replace(/<p>\s*<(h[2-4]|ul|div|hr)/g, '<$1');
  content = content.replace(/<\/(h[2-4]|ul|div)>\s*<\/p>/g, '</$1>');
  content = content.replace(/<hr([^>]*)>\s*<\/p>/g, '<hr$1>');
  content = content.replace(/<p>\s*<\/p>/g, '');

  return { title: title, content: content };
});
