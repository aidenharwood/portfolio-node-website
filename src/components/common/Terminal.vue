<template>
  <div class="terminal-container w-full h-full max-w-full overflow-hidden bg-card border border-border rounded-lg shadow-lg font-mono">
    <!-- Terminal Top Bar -->
    <div class="flex items-center justify-between bg-secondary rounded-t-lg px-4 py-2 flex-shrink-0">
      <span class="text-center w-full text-secondary-foreground">{{ title }}</span>
      <div class="flex items-center space-x-2">
        <button 
          @click="refreshSession"
          class="text-secondary-foreground hover:text-primary text-sm"
          title="Refresh terminal session"
        >
          🔄
        </button>
        <span class="w-3 h-3 rounded-full" :class="connectionStatusClass"></span>
        <span class="w-3 h-3 bg-yellow-400 rounded-full"></span>
        <span class="w-3 h-3 bg-red-500 rounded-full"></span>
      </div>
    </div>
    <!-- Terminal Content -->
    <div class="terminal-content flex-1 min-h-0 relative">
      <!-- Loading State -->
      <div 
        v-if="isLoading" 
        class="absolute inset-0 flex items-center justify-center bg-background/90 z-10"
      >
        <div class="text-center">
          <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p class="text-muted-foreground">{{ loadingMessage }}</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div 
        v-else-if="error" 
        class="absolute inset-0 flex items-center justify-center bg-background/90 z-10"
      >
        <div class="text-center p-4">
          <div class="text-red-500 text-4xl mb-2">⚠️</div>
          <p class="text-red-600 font-semibold mb-2">Terminal Error</p>
          <p class="text-muted-foreground mb-4">{{ error }}</p>
          <button 
            @click="createSession"
            class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
      
      <!-- ttyd Web Terminal -->
      <iframe
        v-else-if="terminalUrl"
        ref="terminalIframe"
        :src="terminalUrl"
        class="w-full h-full border-none"
        @load="onIframeLoad"
        @error="onIframeError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

interface Props {
  title?: string;
  apiUrl?: string;
  sessionId?: string;
  height?: string;
  autoCreate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'aiden@localhost',
  apiUrl: 'https://aidenharwood.uk/api/ttyd',
  height: '100%',
  autoCreate: true
});

// Reactive state
const terminalUrl = ref<string>('');
const sessionId = ref<string>('');
const isLoading = ref<boolean>(true);
const error = ref<string>('');
const loadingMessage = ref<string>('Initializing terminal...');
const terminalIframe = ref<HTMLIFrameElement | null>(null);

// Keepalive state
let keepaliveInterval: number | null = null;

// Computed properties
const connectionStatusClass = computed(() => {
  if (error.value) return 'bg-red-500';
  if (isLoading.value) return 'bg-yellow-500 animate-pulse';
  if (terminalUrl.value) return 'bg-green-500';
  return 'bg-gray-500';
});

// API functions
const createSession = async (): Promise<void> => {
  try {
    isLoading.value = true;
    loadingMessage.value = 'Creating terminal session...';
    error.value = '';
    
    const response = await fetch(`${props.apiUrl}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create session');
    }
    
    sessionId.value = data.session.sessionId;
    terminalUrl.value = data.session.webUrl;
    
    console.log('Terminal session created:', {
      sessionId: sessionId.value,
      webUrl: terminalUrl.value
    });
    
    // Start keepalive for new sessions
    startKeepalive();
    
  } catch (err) {
    console.error('Failed to create terminal session:', err);
    error.value = err instanceof Error ? err.message : 'Failed to create terminal session';
  } finally {
    isLoading.value = false;
  }
};

const getOrCreateSession = async (id?: string): Promise<void> => {
  try {
    isLoading.value = true;
    loadingMessage.value = id ? 'Retrieving terminal session...' : 'Creating terminal session...';
    error.value = '';
    
    const url = id ? `${props.apiUrl}/sessions/${id}` : `${props.apiUrl}/sessions`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get session');
    }
    
    sessionId.value = data.session.sessionId;
    terminalUrl.value = data.session.webUrl;
    
    console.log('Terminal session retrieved:', {
      sessionId: sessionId.value,
      webUrl: terminalUrl.value
    });
    
    // Start keepalive for existing sessions
    startKeepalive();
    
  } catch (err) {
    console.error('Failed to get terminal session:', err);
    error.value = err instanceof Error ? err.message : 'Failed to get terminal session';
  } finally {
    isLoading.value = false;
  }
};

const destroySession = async (): Promise<void> => {
  if (!sessionId.value) return;
  
  // Stop keepalive first
  stopKeepalive();
  
  try {
    const response = await fetch(`${props.apiUrl}/sessions/${sessionId.value}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      console.log('Terminal session destroyed:', sessionId.value);
    }
  } catch (err) {
    console.error('Failed to destroy session:', err);
  } finally {
    sessionId.value = '';
    terminalUrl.value = '';
  }
};

// Event handlers
const onIframeLoad = (): void => {
  console.log('Terminal iframe loaded successfully');
  isLoading.value = false;
  error.value = '';
};

const onIframeError = (): void => {
  console.error('Terminal iframe failed to load');
  error.value = 'Failed to load terminal interface';
  isLoading.value = false;
};

const refreshSession = async (): Promise<void> => {
  stopKeepalive();
  await destroySession();
  await createSession();
  startKeepalive();
};

// Keepalive functionality
const startKeepalive = (): void => {
  if (keepaliveInterval) {
    clearInterval(keepaliveInterval);
  }
  
  // Ping session every 2 minutes to keep it alive
  keepaliveInterval = setInterval(async () => {
    if (sessionId.value) {
      try {
        const response = await fetch(`${props.apiUrl}/sessions/${sessionId.value}`);
        if (!response.ok) {
          console.warn('Session keepalive failed, session may have expired');
          stopKeepalive();
        }
      } catch (error) {
        console.warn('Session keepalive error:', error);
      }
    }
  }, 2 * 60 * 1000); // 2 minutes
};

const stopKeepalive = (): void => {
  if (keepaliveInterval) {
    clearInterval(keepaliveInterval);
    keepaliveInterval = null;
  }
};

// Handle page unload/refresh to cleanup sessions
const handleBeforeUnload = (): void => {
  if (sessionId.value) {
    // Use sendBeacon for reliable cleanup during page unload
    const data = JSON.stringify({ sessionId: sessionId.value });
    
    try {
      // Try sendBeacon first (most reliable)
      if (navigator.sendBeacon) {
        navigator.sendBeacon(`${props.apiUrl}/sessions/${sessionId.value}`, data);
      } else {
        // Fallback to synchronous fetch
        fetch(`${props.apiUrl}/sessions/${sessionId.value}`, {
          method: 'DELETE',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }).catch(() => {
          // Ignore errors during unload
        });
      }
    } catch (error) {
      // Ignore cleanup errors during unload
      console.warn('Failed to cleanup session during page unload:', error);
    }
  }
};

// Handle visibility change to detect when user switches tabs/minimizes
const handleVisibilityChange = (): void => {
  if (document.hidden) {
    // User switched away - session may become inactive
    console.log('Page hidden, session may become inactive');
  } else {
    // User returned - reactivate session
    if (sessionId.value && terminalUrl.value) {
      console.log('Page visible again, session should be active');
      // Optionally ping the session to keep it alive
    }
  }
};

// Lifecycle
onMounted(async () => {
  // Set up page unload handlers
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('pagehide', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  if (props.autoCreate) {
    if (props.sessionId) {
      await getOrCreateSession(props.sessionId);
    } else {
      await createSession();
    }
  }
});

onBeforeUnmount(async () => {
  // Stop keepalive
  stopKeepalive();
  
  // Remove event listeners
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.removeEventListener('pagehide', handleBeforeUnload);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  
  if (sessionId.value) {
    // Try to cleanup gracefully, but don't block unmount
    destroySession().catch(console.error);
  }
});

// Expose methods for external control
defineExpose({
  createSession,
  destroySession,
  refreshSession,
  getSessionId: () => sessionId.value,
  getTerminalUrl: () => terminalUrl.value,
  isReady: () => !!terminalUrl.value && !isLoading.value && !error.value
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
