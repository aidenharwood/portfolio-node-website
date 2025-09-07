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
    cursorBlink: true,
    fontFamily: "monospace",
    theme: { background: "#000000", foreground: "#008000" },
  });
  fit = new FitAddon();
  term.loadAddon(fit);
  term.open(terminalRef.value);
  onResize(); // Calls fit() and sends resize event

  const protocol = location.protocol === "https:" ? "wss" : "ws";
  const url = `${protocol}://aidenharwood.uk/k9s`;
  ws = new WebSocket(url);
  ws.binaryType = "arraybuffer";

  ws.addEventListener("open", () => {
    if (!term) return;

    // send explicit init so server will exec k9s for this session
    try {
      ws?.send(JSON.stringify({ type: "init", cols: term.cols, rows: term.rows }));
    } catch {}

    // log first server frame (hex) for debugging, then attach xterm
    const onFirst = async (ev: MessageEvent) => {
      try {
        // normalize to Uint8Array
        let bytes: Uint8Array;
        if (ev.data instanceof ArrayBuffer) bytes = new Uint8Array(ev.data);
        else if (ev.data instanceof Blob) {
          const buf = await ev.data.arrayBuffer();
          bytes = new Uint8Array(buf);
        } else if (typeof ev.data === "string") {
          bytes = new TextEncoder().encode(ev.data);
        } else {
          bytes = new Uint8Array(0);
        }

        // debug: print first ~64 bytes as hex to console
        const hex = Array.from(bytes.slice(0, 64)).map(b => b.toString(16).padStart(2, "0")).join("");
        console.log("k9s first frame hex:", hex);

        // now attach xterm so it receives subsequent binary frames
        attach = new AttachAddon(ws!);
        term?.loadAddon(attach!);

        // ensure sizing is correct immediately after attach
        fit?.fit();
        try { ws!.send(JSON.stringify({ type: "resize", cols: term!.cols, rows: term!.rows })); } catch {}

        term?.focus();
      } catch (e) {
        console.error("attach/onFirst failed", e);
      } finally {
        ws?.removeEventListener("message", onFirst);
      }
    };

    ws?.addEventListener("message", onFirst);
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
