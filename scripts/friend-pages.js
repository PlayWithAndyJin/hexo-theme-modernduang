// 为每个友链生成独立页面
hexo.extend.generator.register('friend-pages', function() {
  var friends = hexo.theme.config.friends || [];
  var pages = [];

  friends.forEach(function(friend) {
    if (!friend.name) return;
    // 用名称生成安全的路径
    var slug = friend.name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    pages.push({
      path: 'links/' + slug + '/index.html',
      layout: 'friend',
      data: {
        title: friend.name,
        friend: friend
      }
    });
  });

  return pages;
});
