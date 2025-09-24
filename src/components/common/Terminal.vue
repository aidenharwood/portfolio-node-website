<template>
  <div class="terminal-container w-full h-full max-w-full overflow-hidden bg-card border border-border rounded-lg shadow-lg font-mono">
    <!-- Terminal Top Bar -->
    <div class="flex items-center justify-between bg-secondary rounded-t-lg px-4 py-2 flex-shrink-0">
      <span class="text-center w-full text-secondary-foreground">{{ title }}</span>
      <div class="flex items-center space-x-2">
        <span class="w-3 h-3 bg-green-500 rounded-full"></span>
        <span class="w-3 h-3 bg-yellow-400 rounded-full"></span>
        <span class="w-3 h-3 bg-red-500 rounded-full"></span>
      </div>
    </div>
    <!-- Terminal Content -->
    <div ref="terminalRef" class="terminal-content flex-1 min-h-0"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { useTheme } from '@/composables/useTheme';
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
  websocketUrl: `wss://aidenharwood.uk/k9s`,
  height: '100%',
  fontFamily: 'monospace',
  cursorStyle: 'bar',
  cursorBlink: true
});

const terminalRef = ref<HTMLElement | null>(null);
let term: Terminal | null = null;
let fit: FitAddon | null = null;
let ws: WebSocket | null = null;

const { theme } = useTheme();

// Theme-aware terminal colors
const getTerminalTheme = (currentTheme: 'light' | 'dark') => {
  if (currentTheme === 'light') {
    return {
      background: '#f4f3f2',
      foreground: '#2d2a27',
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
    };
  } else {
    return {
      background: '#1a1917',
      foreground: '#e8e6e3',
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
    };
  }
};

const initializeTerminal = () => {
  if (!terminalRef.value) return;

  term = new Terminal({
    cursorStyle: props.cursorStyle,
    cursorBlink: props.cursorBlink,
    fontFamily: props.fontFamily,
    fontSize: 14,
    theme: getTerminalTheme(theme.value),
    // Terminal capabilities for TUI applications like k9s
    cols: 80,
    rows: 24,
    scrollback: 1000,
    allowTransparency: false,
    altClickMovesCursor: false,
    convertEol: false,
    disableStdin: false,
    macOptionIsMeta: true,
    rightClickSelectsWord: false,
    screenReaderMode: false,
    windowsMode: false,
    wordSeparator: ' ()[]{}\'"',
    // Enable proper escape sequence handling
    allowProposedApi: true,
  });
  
  term.open(terminalRef.value);

  // Set up fit addon
  fit = new FitAddon();
  term.loadAddon(fit);
  
  // Connect to WebSocket if URL is provided
  if (props.websocketUrl) {
    connectWebSocket();
  } else {
    // If no WebSocket, show a demo terminal
    term.writeln('Welcome to the terminal!');
    term.writeln('WebSocket URL not provided - this is a demo terminal.');
    term.write('$ ');
    
    // Simple demo input handling
    term.onKey(({ key, domEvent }) => {
      if (!term) return;
      
      if (domEvent.keyCode === 13) { // Enter key
        term.writeln('');
        term.write('$ ');
      } else if (domEvent.keyCode === 8) { // Backspace
        term.write('\b \b');
      } else {
        term.write(key);
      }
    });
  }
  
  // Simple delayed fit
  setTimeout(() => {
    if (fit && term) {
      fit.fit();
      term.focus();
    }
  }, 100);
};

const connectWebSocket = () => {
  if (!props.websocketUrl || !term) return;

  console.log('Attempting to connect to:', props.websocketUrl);
  
  try {
    ws = new WebSocket(props.websocketUrl);
    ws.binaryType = "arraybuffer";
    
    console.log('WebSocket created, readyState:', ws.readyState);

    ws.addEventListener("open", () => {
      console.log('WebSocket OPEN event fired');
      console.log('WebSocket readyState:', ws?.readyState);
      if (!term || !fit) {
        console.log('Terminal or fit not ready:', { term: !!term, fit: !!fit });
        return;
      }
      
      // Handle WebSocket messages manually (don't use AttachAddon)
      ws!.addEventListener("message", (event) => {
        if (!term) return;
        
        console.log('Received WebSocket message:', event.data);
        
        // Handle both string and ArrayBuffer data
        if (typeof event.data === 'string') {
          console.log('Writing string to terminal:', event.data);
          term.write(event.data);
        } else if (event.data instanceof ArrayBuffer) {
          console.log('Writing ArrayBuffer to terminal, length:', event.data.byteLength);
          term.write(new Uint8Array(event.data));
        } else {
          console.log('Unknown data type:', typeof event.data);
        }
      });
      
      // Handle terminal input - send to WebSocket
      term.onData((data) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });
      
      // Fit terminal and send size information
      setTimeout(() => {
        if (fit && term && ws && ws.readyState === WebSocket.OPEN) {
          fit.fit();
          
          // Send terminal size to server for proper TUI rendering
          const cols = term.cols;
          const rows = term.rows;
          
          // Send multiple initialization messages
          const messages = [
            // Terminal size
            JSON.stringify({
              type: 'resize',
              cols: cols,
              rows: rows
            }),
            // Terminal initialization
            JSON.stringify({
              type: 'init',
              term: 'xterm-256color',
              cols: cols,
              rows: rows
            })
          ];
          
          messages.forEach(msg => {
            try {
              ws.send(msg);
              console.log(`Sent message: ${msg}`);
            } catch (error) {
              console.log('Could not send message:', error);
            }
          });
          
          term.focus();
        }
      }, 100);
    });

    ws.addEventListener("error", (error) => {
      console.error('WebSocket ERROR event:', error);
      console.error('WebSocket readyState on error:', ws?.readyState);
      if (term) {
        term.writeln('\r\n\x1b[31mWebSocket connection failed\x1b[0m');
        term.writeln('Unable to connect to the remote terminal.');
        term.writeln('Check console for details.');
        term.write('$ ');
      }
    });

    ws.addEventListener("close", () => {
      console.log('WebSocket disconnected');
      if (term) {
        term.writeln('\r\n\x1b[33mConnection closed\x1b[0m');
        term.writeln('Terminal session ended.');
      }
    });
  } catch (error) {
    console.error('Failed to create WebSocket:', error);
    if (term) {
      term.writeln('\x1b[31mFailed to establish WebSocket connection\x1b[0m');
    }
  }
};

const onResize = () => {
  if (!fit || !term) return;
  
  setTimeout(() => {
    if (fit && term) {
      fit.fit();
      
      // Send new terminal size to WebSocket server after resize
      if (ws && ws.readyState === WebSocket.OPEN) {
        const cols = term.cols;
        const rows = term.rows;
        
        const resizeMsg = JSON.stringify({
          type: 'resize',
          cols: cols,
          rows: rows
        });
        
        try {
          ws.send(resizeMsg);
          console.log(`Terminal resized: ${cols}x${rows}`);
        } catch (error) {
          console.log('Could not send resize message:', error);
        }
      }
    }
  }, 100);
};

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
  
  // Clean up WebSocket
  if (ws) {
    try { 
      ws.close(); 
    } catch { 
      // Ignore close errors
    }
  }
  
  // Clean up terminal
  if (term) {
    term.dispose();
  }
  
  // Reset references
  term = null;
  fit = null;
  ws = null;
});

// Expose methods for external control
defineExpose({
  write: (data: string) => term?.write(data),
  writeln: (data: string) => term?.writeln(data),
  clear: () => term?.clear(),
  focus: () => term?.focus(),
  fit: () => {
    fit?.fit();
    // Also send resize message after manual fit
    if (ws && ws.readyState === WebSocket.OPEN && term) {
      const resizeMsg = JSON.stringify({
        type: 'resize',
        cols: term.cols,
        rows: term.rows
      });
      try {
        ws.send(resizeMsg);
      } catch (error) {
        console.log('Could not send resize message:', error);
      }
    }
  },
  reconnect: () => {
    if (ws) {
      ws.close();
    }
    connectWebSocket();
  },
  sendResize: () => {
    if (ws && ws.readyState === WebSocket.OPEN && term) {
      const resizeMsg = JSON.stringify({
        type: 'resize',
        cols: term.cols,
        rows: term.rows
      });
      try {
        ws.send(resizeMsg);
        console.log(`Manual resize sent: ${term.cols}x${term.rows}`);
      } catch (error) {
        console.log('Could not send resize message:', error);
      }
    }
  },
  terminal: () => term
});
</script>

<style scoped>
.terminal-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.terminal-content {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
