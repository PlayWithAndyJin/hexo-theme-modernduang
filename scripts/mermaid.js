/* global hexo */

'use strict';

// 注册 mermaid 标签
function mermaid(args, content) {
  return `<pre><code class="mermaid">${content}</code></pre>`;
}

hexo.extend.tag.register('mermaid', mermaid, { ends: true });

// 处理 ```mermaid 代码块，将 Hexo highlight 格式转换为 mermaid 可识别格式
hexo.extend.filter.register('after_post_render', (page) => {
  if (page.mermaid) {
    // 匹配 mermaid 代码块（Hexo highlight 生成的 figure 格式）
    // 使用更宽松的正则来匹配实际的 HTML 结构
    page.content = page.content.replace(
      /<figure class="highlight plaintext">[\s\S]*?<\/figure>/g,
      (match) => {
        // 提取代码内容
        const codeMatch = match.match(/<td class="code"><pre>([\s\S]*?)<\/pre><\/td>/);
        if (!codeMatch) return match;
        
        let mermaidCode = codeMatch[1]
          .replace(/<span class="line">/g, '')
          .replace(/<\/span><br>/g, '\n')
          .replace(/<\/span>/g, '')
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&#x2F;/g, '/')
          .trim();
        
        return `<pre><code class="mermaid">${mermaidCode}</code></pre>`;
      }
    );
  }
  return page;
});
