<template>
  <section class="h-full flex-col justify-stretch w-full">
    <section class="content flex flex-row content-center justify-stretch w-full">
      <section class="text-left w-full flex">
        <div class=" bg-black rounded-lg shadow-lg font-mono text-left flex flex-col justify-between w-full h-100">
          <!-- Terminal Top Bar -->
          <div class="flex items-center justify-between bg-slate-800 rounded-t-lg px-4 py-2">
            <span class="text-center w-full">aiden@localhost</span>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
              <span class="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
              <span class="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
            </div>
          </div>
          <!-- Terminal Content -->
          <div ref="terminalRef"></div>
        </div>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import "xterm/css/xterm.css";

const terminalRef = ref<HTMLElement | null>(null);
let term: Terminal | null = null;
let fit: FitAddon | null = null;
let attach: AttachAddon | null = null;
let ws: WebSocket | null = null;

onMounted(() => {
  if (!terminalRef.value) return;

  term = new Terminal({
    cursorStyle: "bar",
    cursorBlink: true,
    fontFamily: "monospace",
    theme: { background: "#000000", foreground: "#008000" },
  });
  term.open(terminalRef.value);

  const protocol = location.protocol === "https:" ? "wss" : "ws";
  const url = `${protocol}://aidenharwood.uk/k9s`;
  ws = new WebSocket(url);
  ws.binaryType = "arraybuffer";

  window.addEventListener("resize", onResize);

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
});

function onResize() {
  if (!fit || !term || !ws) return;
  fit.fit();
}

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  try { ws?.close(); } catch { }
  term?.dispose();
  term = null;
  fit = null;
});
</script>
