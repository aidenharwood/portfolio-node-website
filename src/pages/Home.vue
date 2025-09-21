<template>
  <section class="h-full flex-col justify-stretch w-full">
    <section class="content flex flex-row content-center justify-stretch w-full">
      <section class="text-left w-full flex">
        <Terminal 
          title="aiden@localhost"
          websocket-url="wss://aidenharwood.uk/k9s"
          height="100%"
          class="w-full h-100"
        />
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import Terminal from '@/components/Terminal.vue';
</script>
