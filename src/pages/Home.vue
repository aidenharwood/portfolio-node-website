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
          <div class="flex px-2 py-2 flex-col justify-between h-full overflow-auto">
            <div class="terminal-output flex flex-col overflow-y-auto h-full max-h-full" ref="outputRef">
              <p v-for="(line, idx) in lines" :key="idx" class="text-green-200 max-w-2xl mx-0" v-html="line"></p>
            </div>
            <div class="mt-4 flex items-center space-x-2">
              <span class="text-green-600 mr-2">aiden@localhost:~/$</span>
              <input v-model="input" @keyup.enter="handleCommand" type="text" placeholder=""
                class="bg-black border-none outline-none text-green-200 placeholder-green-500 font-mono w-full max-h-full h-full"
                autofocus />
            </div>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

const lines = ref([
  "This is a demo of a terminal-like interface.",
  "You can type commands below.",
  "Try typing 'echo Hello World!' or 'help' for a list of commands.",
  "Type 'clear' to clear the terminal.",
]);
const input = ref("");
const outputRef = ref<HTMLElement | null>(null);

function handleCommand() {
  if (input.value.trim() !== "") {
    lines.value.push(
      '<span class="text-green-600 mr-2">aiden@localhost:~/$</span>' +
      input.value +
      "</span>"
    );
    // Example: echo command
    if (input.value.startsWith("echo ")) {
      lines.value.push(input.value.slice(5));
    } else if (input.value === "help") {
      lines.value.push("Try: echo [text], help, clear");
    } else if (input.value === "clear") {
      lines.value = [];
    } else {
      lines.value.push("Command not found: " + input.value);
    }
    input.value = "";
    nextTick(() => {
      if (outputRef.value) {
        outputRef.value.scrollTop = outputRef.value.scrollHeight;
      }
    });
  }
}
</script>
