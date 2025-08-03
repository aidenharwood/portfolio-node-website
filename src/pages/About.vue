<template>
  <section class="py-16 text-center">
    <section
      class="content flex mx-12 py-2 my-auto content-center justify-center"
    >
      <img
        src="https://avatars.githubusercontent.com/u/1979974"
        alt="Aiden Harwood avatar"
        class="w-120 h-120 rounded-full mb-4"
      />
      <section class="flex flex-col text-left mx-12">
        <div
          class="bg-black rounded-lg shadow-lg font-mono text-left flex flex-col justify-between h-full w-full p-0"
        >
          <!-- Terminal Top Bar -->
          <div
            class="flex items-center justify-between bg-gray-900 rounded-t-lg px-4 py-2"
          >
            <span></span>
            
            >
            <div class="flex items-center space-x-2">
              <span
                class="w-3 h-3 bg-green-500 rounded-full inline-block"
              ></span>
              <span
                class="w-3 h-3 bg-yellow-400 rounded-full inline-block"
              ></span>
              <span class="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
            </div>
          </div>
          <!-- Terminal Content -->
          <div class="flex-1 p-8 flex flex-col justify-between">
            <div
              class="terminal-output flex-1 overflow-y-auto max-h-64 mb-4"
              ref="outputRef"
            >
              <p
                v-for="(line, idx) in lines"
                :key="idx"
                class="text-green-200 max-w-2xl mx-0"
                v-html="line"
              ></p>
            </div>
            <div class="mt-4 flex items-center">
              <span class="text-green-600 mr-2">aiden@localhost:~/$</span>
              <input
                v-model="input"
                @keyup.enter="handleCommand"
                type="text"
                placeholder="Type a command... (hint: help)"
                class="bg-black border-none outline-none text-green-200 placeholder-green-500 font-mono w-full"
                autofocus
              />
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
  "Hey!",
  "I'm Aiden Harwood",
  "I am a DevOps engineer with a passion for building scalable and efficient systems. I love working with cloud technologies and automating processes to improve productivity.",
]);
const input = ref("");
const outputRef = ref<HTMLElement | null>(null);

function handleCommand() {
  if (input.value.trim() !== "") {
    lines.value.push('<span class="text-green-600 mr-2">aiden@localhost:~/$</span>' + input.value + '</span>');
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
