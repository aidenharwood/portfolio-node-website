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
          <div ref="terminalRef" class="h-96 w-full"></div>
        </div>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const terminalRef = ref<HTMLElement | null>(null);
let term: Terminal | null = null;
let fit: FitAddon | null = null;
let ws: WebSocket | null = null;

onMounted(() => {
  if (!terminalRef.value) return;

  term = new Terminal({
    cursorBlink: true,
    fontFamily: "monospace",
    theme: { background: "#000000", foreground: "#008000" },
  });
  fit = new FitAddon();
  term.loadAddon(fit);
  term.open(terminalRef.value);
  fit.fit();

  const protocol = location.protocol === "https:" ? "wss" : "ws";
  const url = `${protocol}://aidenharwood.uk/k9s`;
  ws = new WebSocket(url);
  ws.binaryType = "arraybuffer";

  ws.addEventListener("open", () => {
    // initial message instructs server which pod/container/cmd to exec
    ws!.send(JSON.stringify({ container: "k9s", cmd: ["k9s", "--readonly", "--splashless"] }));
    // send size (server may ignore, but it's harmless)
    ws!.send(JSON.stringify({ type: "resize", cols: term!.cols, rows: term!.rows }));
  });

  ws.addEventListener("message", (ev) => {
    if (!term) return;
    if (ev.data instanceof ArrayBuffer) {
      term.write(new TextDecoder().decode(ev.data));
    } else if (typeof ev.data === "string") {
      term.write(ev.data);
    }
  });

  ws.addEventListener("close", () => {
    term?.writeln("\r\n-- disconnected --");
  });

  term.onData((data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(data);
  });

  // handle window/terminal resize
  window.addEventListener("resize", onResize);
});

function onResize() {
  if (!fit || !term || !ws) return;
  fit.fit();
  try {
    ws.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
  } catch {}
}

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  try { ws?.close(); } catch {}
  term?.dispose();
  term = null;
  fit = null;
});
</script>
