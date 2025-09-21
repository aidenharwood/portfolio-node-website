import { defineAsyncComponent } from 'vue';

// Dynamically import all components from the components directory
// This uses Vite's import.meta.glob to automatically discover components
const componentModules = import.meta.glob('@/components/**/*.vue');

// Create a registry of available components for markdown
export const markdownComponents: Record<string, any> = {};

// Auto-register components based on their file names
Object.entries(componentModules).forEach(([path, importFn]) => {
  // Extract component name from path
  // e.g., '/src/components/ArgoCDCard.vue' -> 'ArgoCDCard'
  // e.g., '/src/components/ui/button/Button.vue' -> 'Button'
  const componentName = path.split('/').pop()?.replace('.vue', '') || '';
  
  // Skip certain components that shouldn't be used in markdown
  const skipComponents = ['MarkdownRenderer', 'Navigation', 'ThemeToggle'];
  
  if (componentName && !skipComponents.includes(componentName)) {
    markdownComponents[componentName] = defineAsyncComponent(importFn as any);
  }
});

// Manual additions for components in subdirectories with custom names
markdownComponents['CustomComponent'] = defineAsyncComponent(() => import('@/components/markdown/CustomComponent.vue'));
markdownComponents['Callout'] = defineAsyncComponent(() => import('@/components/markdown/Callout.vue'));

// Type for component names
export type MarkdownComponentName = keyof typeof markdownComponents;

// Utility function to get list of available components (for debugging)
export function getAvailableComponents(): string[] {
  return Object.keys(markdownComponents).sort();
}

// Log available components in development
if (import.meta.env.DEV) {
  console.log('Available markdown components:', getAvailableComponents());
}

// Parse component tags from markdown content
export function parseCustomComponents(content: string): Array<{
  tag: string;
  component: string;
  props: Record<string, any>;
  startIndex: number;
  endIndex: number;
}> {
  const components: Array<{
    tag: string;
    component: string;
    props: Record<string, any>;
    startIndex: number;
    endIndex: number;
  }> = [];

  // Regex to match custom component tags like <CustomComponent prop="value" />
  const componentRegex = /<(\w+)([^>]*?)\/>/g;
  let match;

  while ((match = componentRegex.exec(content)) !== null) {
    const [fullMatch, componentName, propsString] = match;
    
    // Check if component exists in registry
    if (componentName in markdownComponents) {
      // Parse props from the props string
      const props: Record<string, any> = {};
      const propRegex = /(\w+)=["']([^"']*?)["']/g;
      let propMatch;
      
      while ((propMatch = propRegex.exec(propsString)) !== null) {
        const [, propName, propValue] = propMatch;
        props[propName] = propValue;
      }

      components.push({
        tag: fullMatch,
        component: componentName,
        props,
        startIndex: match.index,
        endIndex: match.index + fullMatch.length
      });
    }
  }

  return components;
}

// Replace component tags with placeholders for rendering
export function replaceComponentsWithPlaceholders(content: string): {
  content: string;
  components: Array<{
    id: string;
    component: string;
    props: Record<string, any>;
  }>;
} {
  const parsedComponents = parseCustomComponents(content);
  const components: Array<{
    id: string;
    component: string;
    props: Record<string, any>;
  }> = [];
  
  let modifiedContent = content;
  let offset = 0;

  parsedComponents.forEach((comp, index) => {
    const id = `component-${index}-${Date.now()}`;
    const placeholder = `<div data-component-id="${id}"></div>`;
    
    const startPos = comp.startIndex - offset;
    const endPos = comp.endIndex - offset;
    
    modifiedContent = modifiedContent.slice(0, startPos) + placeholder + modifiedContent.slice(endPos);
    offset += comp.tag.length - placeholder.length;
    
    components.push({
      id,
      component: comp.component,
      props: comp.props
    });
  });

  return { content: modifiedContent, components };
}