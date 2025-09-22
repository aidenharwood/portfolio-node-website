<template>
  <div class="
        space-y-4
        /* Inline/block code */
        [&_code]:text-sm 
        [&_code]:font-mono
        [&_code]:bg-secondary
        [&_code]:text-secondary-foreground
        [&_code]:px-1 
        [&_code]:py-1 
        [&_code]:rounded 
        /* Code blocks */
        [&_pre]:text-foreground
        [&_pre]:my-4 
        [&_pre]:overflow-x-auto 
        [&_pre]:leading-6
        [&_pre_div.code-header]:text-xs 
        [&_pre_div.code-header]:px-2
        [&_pre_div.code-header]:py-1 
        [&_pre_div.code-header]:border-b
        [&_pre_div.code-header]:border-border
        [&_pre]:bg-muted
        [&_pre]:border
        [&_pre]:border-border
        [&_pre]:p-4 
        [&_pre]:rounded-2xl
        [&_pre_code]:block 
        [&_pre_code]:w-full
        [&_pre_code]:bg-transparent 
        [&_pre_code]:overflow-x-auto 
        /* List items */
        [&_ul]:list-disc 
        [&_ol]:list-decimal 
        [&_li]:text-foreground
        [&_li]:px-2 
        [&_li]:ml-6
        /* Tables */
        [&_table]:w-full 
        [&_table]:text-left 
        [&_th]:bg-secondary
        [&_th]:text-secondary-foreground
        [&_th]:px-2 
        [&_th]:py-2
        [&_td]:px-2 
        [&_td]:py-2
        [&_tr]:border-b 
        [&_tr]:border-border
        /* Images */
        [&_img]:mx-auto
        [&_img]:object-cover 
        [&_img]:object-center
        [&_a]:text-accent
        [&_a]:hover:text-accent/80
        [&_h1]:text-2xl 
        [&_h2]:text-xl 
        [&_h3]:text-lg
        [&_h4]:text-base 
        [&_h5]:text-sm 
        [&_h6]:text-xs
        [&_blockquote]:border-l-4 
        [&_blockquote]:border-border
        [&_blockquote]:pl-4 
        [&_blockquote]:text-muted-foreground
        /* Mermaid diagrams */
        [&_pre.mermaid]:bg-muted
        [&_pre.mermaid]:text-foreground
        [&_pre.mermaid]:p-4 
        [&_pre.mermaid]:rounded-lg
        [&_pre.mermaid]:justify-center 
        [&_pre.mermaid]:items-center 
        [&_pre.mermaid]:flex" 
        v-html="processedContent" ref="contentRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, createApp, onUnmounted } from 'vue';
import { marked } from 'marked';
import { markdownComponents, replaceComponentsWithPlaceholders } from '@/lib/markdown-components';
import hljs from 'highlight.js';
import highlightBicep from '@/lib/highlight.bicep';
import slugify from 'slugify';

// Register custom language
hljs.registerLanguage('bicep', highlightBicep);

// Configure marked with custom renderers
marked.use({
  renderer: {
    heading({ text, depth }) {
      // Use slugify for clean, predictable IDs
      const id = slugify(text, { lower: true, strict: true });
      return `<div class="flex items-center group">
        <h${depth} id="${id}" class="flex-1">${text}</h${depth}>
        <a href="#${id}" class="ml-2 opacity-0 group-hover:opacity-50 hover:opacity-75 transition-opacity" title="Link to this section">
          <i class="pi pi-link"></i>
        </a>
      </div>`;
    },
    code(this, code) {
      const info = code.lang || "";
      const text = code.text || "";
      const parts = info.split(/\s+/).filter(Boolean);
      const lang = parts[0] || "";
      let filename = "";

      if (lang === "mermaid") return `<pre class="mermaid">${text}</pre>`;

      parts.slice(1).forEach((p) => {
        const m = p.match(/(?:filename|title)=(.+)/);
        if (m) filename = decodeURIComponent(m[1]);
      });

      const header = filename ? `<div class="code-header">${filename}</div>` : "";

      return `<pre>${header}<code class="language-${lang}">${text}</code></pre>`;
    },
  },
});

interface Props {
  content: string;
}

const props = defineProps<Props>();
const contentRef = ref<HTMLElement>();
const processedContent = ref('');

// Component instances to track for cleanup
const componentInstances: Array<{ app: any; element: HTMLElement }> = [];

// Dynamically import mermaid only on client
let mermaid: any = null;
const loadMermaid = async () => {
  if (!mermaid && typeof window !== 'undefined') {
    mermaid = (await import('mermaid')).default;
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
  }
};

const renderMermaid = async () => {
  await loadMermaid();
  if (mermaid) {
    // Find all mermaid divs and render them
    const mermaidDivs = contentRef.value?.querySelectorAll('.mermaid');
    mermaidDivs?.forEach((el) => {
      try {
        mermaid.run({ nodes: [el as HTMLElement] });
      } catch (e) {
        // fallback: show error in the div
        el.innerHTML = `<pre style="color:red;">Mermaid render error: ${e}</pre>`;
      }
    });
  }
};

const processMarkdown = async () => {
  // Parse and replace custom components with placeholders
  const { content: contentWithPlaceholders, components } = replaceComponentsWithPlaceholders(props.content);
  
  // Convert markdown to HTML
  processedContent.value = await marked(contentWithPlaceholders);
  
  // Wait for DOM update
  await nextTick();
  
  // Apply syntax highlighting
  hljs.highlightAll();
  
  // Render mermaid diagrams
  await renderMermaid();
  
  // Mount Vue components in placeholders
  if (contentRef.value) {
    components.forEach(({ id, component, props: componentProps }) => {
      const placeholder = contentRef.value?.querySelector(`[data-component-id="${id}"]`);
      if (placeholder && component in markdownComponents) {
        // Create a new Vue app instance for this component
        const app = createApp(markdownComponents[component as keyof typeof markdownComponents], componentProps);
        
        // Mount the component
        app.mount(placeholder);
        
        // Track for cleanup
        componentInstances.push({ app, element: placeholder as HTMLElement });
      }
    });
  }
};

const cleanup = () => {
  // Unmount all component instances
  componentInstances.forEach(({ app }) => {
    if (app && typeof app.unmount === 'function') {
      app.unmount();
    }
  });
  componentInstances.length = 0;
};

// Watch for content changes
watch(() => props.content, () => {
  cleanup();
  processMarkdown();
}, { immediate: true });

onMounted(() => {
  processMarkdown();
});

// Cleanup on unmount
onUnmounted(() => {
  cleanup();
});
</script>

<style>
/* Styles inherited from parent markdown content */
</style>