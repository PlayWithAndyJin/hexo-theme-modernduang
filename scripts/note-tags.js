// 不同类型的引用块标签插件
var blockTypes = {
  note: { label: '提示', color: '#22c55e', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' },
  warning: { label: '警告', color: '#d97706', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
  declare: { label: '声明', color: '#8b5cf6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' },
  danger: { label: '危险', color: '#dc2626', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' }
};

Object.keys(blockTypes).forEach(function(type) {
  var config = blockTypes[type];

  hexo.extend.tag.register(type, function(args, content) {
    var title = args.join(' ') || config.label;
    // 将 markdown 内容按行处理为 HTML
    var html = content
      .replace(/^### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^## (.+)$/gm, '<h3>$1</h3>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p>\s*<(h[2-4]|ul)/g, '<$1');
    html = html.replace(/<\/(h[2-4]|ul)>\s*<\/p>/g, '</$1>');
    html = html.replace(/<p>\s*<\/p>/g, '');

    return '<blockquote class="post-blockquote blockquote-' + type + '">' +
      '<div class="blockquote-header">' +
        '<span class="blockquote-icon">' + config.icon + '</span>' +
        '<span class="blockquote-title">' + title + '</span>' +
      '</div>' +
      '<div class="blockquote-content">' + html + '</div>' +
    '</blockquote>';
  }, {ends: true});
});
