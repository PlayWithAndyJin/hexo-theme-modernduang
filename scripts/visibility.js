// 文章可见性控制
// visibility: "local"  — 列表页隐藏，直接访问可见
// visibility: "global" — 完全隐藏，直接访问返回 404

hexo.extend.filter.register('after_post_render', function(data) {
  if (data.visibility === 'global') {
    data.content = '';
    data.layout = '404';
  }
  return data;
});

hexo.extend.helper.register('is_visible', function(post) {
  var v = post.visibility;
  return !v || (v !== 'local' && v !== 'global');
});
