<template>
  <div class="bg-card border border-border rounded-lg shadow-lg font-mono text-left flex flex-col justify-between w-full">
    <!-- Terminal Top Bar -->
    <div class="flex items-center justify-between bg-secondary rounded-t-lg px-4 py-2">
      <span class="text-center w-full text-secondary-foreground">{{ title }}</span>
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
        <span class="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
        <span class="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
      </div>
    </div>
    <!-- Terminal Content -->
    <div ref="terminalRef" :style="{ height: height }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import { useTheme } from '@/composables/useTheme'
import "xterm/css/xterm.css";

interface Props {
  title?: string;
  websocketUrl?: string;
  height?: string;
  fontFamily?: string;
  cursorStyle?: 'block' | 'underline' | 'bar';
  cursorBlink?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'aiden@localhost',
  websocketUrl: 'wss://aidenharwood.uk/k9s',
  height: '100%',
  fontFamily: 'monospace',
  cursorStyle: 'bar',
  cursorBlink: true
});

const terminalRef = ref<HTMLElement | null>(null);
let term: Terminal | null = null;
let fit: FitAddon | null = null;
let attach: AttachAddon | null = null;
let ws: WebSocket | null = null;

const { theme } = useTheme()

// Theme-aware terminal colors
const getTerminalTheme = (currentTheme: 'light' | 'dark') => {
  if (currentTheme === 'light') {
    return {
      background: '#f4f3f2', // Light background
      foreground: '#2d2a27', // Dark text
      cursor: '#2d2a27',
      cursorAccent: '#f4f3f2',
      selection: '#8a847a',
      black: '#2d2a27',
      red: '#d73527',
      green: '#22863a',
      yellow: '#b08800',
      blue: '#0366d6',
      magenta: '#6f42c1',
      cyan: '#1b7c83',
      white: '#6a737d',
      brightBlack: '#959da5',
      brightRed: '#cb2431',
      brightGreen: '#28a745',
      brightYellow: '#f9c513',
      brightBlue: '#2188ff',
      brightMagenta: '#8b5cf6',
      brightCyan: '#17a2b8',
      brightWhite: '#24292e'
    }
  } else {
    return {
      background: '#1a1917', // Dark background
      foreground: '#e8e6e3', // Light text
      cursor: '#e8e6e3',
      cursorAccent: '#1a1917',
      selection: '#4a4845',
      black: '#1a1917',
      red: '#f14c4c',
      green: '#23d18b',
      yellow: '#f5e094',
      blue: '#3b82f6',
      magenta: '#a855f7',
      cyan: '#06b6d4',
      white: '#d1d5db',
      brightBlack: '#6b7280',
      brightRed: '#ef4444',
      brightGreen: '#10b981',
      brightYellow: '#f59e0b',
      brightBlue: '#60a5fa',
      brightMagenta: '#c084fc',
      brightCyan: '#22d3ee',
      brightWhite: '#f9fafb'
    }
  }
}

const initializeTerminal = () => {
  if (!terminalRef.value) return;

  term = new Terminal({
    cursorStyle: props.cursorStyle,
    cursorBlink: props.cursorBlink,
    fontFamily: props.fontFamily,
    theme: getTerminalTheme(theme.value),
  });
  
  term.open(terminalRef.value);

  // Connect to WebSocket if URL is provided
  if (props.websocketUrl) {
    ws = new WebSocket(props.websocketUrl);
    ws.binaryType = "arraybuffer";

    ws.addEventListener("open", () => {
      if (!term) return;
      // attach
      attach = new AttachAddon(ws as any);
      term.loadAddon(attach);
      // fit
      fit = new FitAddon();
      term.loadAddon(fit);
      fit?.fit();
      // focus
      term?.focus();
    });
  } else {
    // If no WebSocket, just set up fit addon
    fit = new FitAddon();
    term.loadAddon(fit);
    fit?.fit();
    term?.focus();
  }
}

const onResize = () => {
  if (!fit || !term) return;
  fit.fit();
}

onMounted(() => {
  initializeTerminal();
  window.addEventListener("resize", onResize);
});

// Watch for theme changes and update terminal
watch(theme, (newTheme) => {
  if (term) {
    term.options.theme = getTerminalTheme(newTheme);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  try { 
    ws?.close(); 
  } catch { 
    // Ignore close errors
  }
  term?.dispose();
  term = null;
  fit = null;
  attach = null;
  ws = null;
});

// Expose methods for external control
defineExpose({
  write: (data: string) => term?.write(data),
  clear: () => term?.clear(),
  focus: () => term?.focus(),
  fit: () => fit?.fit(),
  terminal: term
});
</script>

<style scoped>
/* Any terminal-specific styles */
</style>