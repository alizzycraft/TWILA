<template>
  <div>
    <!-- Use default layout for all pages -->
    <DefaultTheme.Layout>
      <!-- Override hero section for home page -->
      <template #home-hero-info-before>
        <div class="custom-hero-title">
          <h1 class="name">
            <span class="clip">TWILA</span>
          </h1>
          <p class="text">That's What I'm Looking At</p>
        </div>
      </template>
      
      <template #home-hero-info>
        <p class="custom-tagline">A client-side block and entity identification overlay mod for the Tapestry platform.</p>
      </template>

      <!-- MAIN CONTENT ANCHOR -->
      <template #doc-before>

      </template>

      <!-- Can inject stuff before footer here -->
    </DefaultTheme.Layout>
  </div>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
</script>

<style scoped>
.custom-hero-title {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.custom-hero-title .name {
  display: inline;
  margin: 0;
}

.custom-hero-title .text {
  display: inline;
  margin: 0;
  font-family: 'Inconsolata', monospace;
  font-size: 1.3rem;
  color: #f5f5f5;
  font-style: normal;
  font-weight: 500;
}

.custom-tagline {
  font-family: 'Inconsolata', monospace;
  font-size: 1.2rem;
  line-height: 1.4;
  max-width: 700px;
  color: var(--text-secondary);
  margin: 0 0 20px 0;
}
</style>
