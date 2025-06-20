<script setup lang="ts">
interface NavItem {
  title: string
  url: string
  icon: string
}

interface Props {
  items: NavItem[]
}

defineProps<Props>()
</script>

<template>
  <div class="sidebar-group">
    <div class="sidebar-group-content">
      <ul class="sidebar-menu">
        <li v-for="item in items" :key="item.title" class="sidebar-menu-item">
          <a 
            :href="item.url" 
            class="sidebar-menu-button flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <i :class="item.icon" class="w-4 h-4"></i>
            <span>{{ item.title }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<!-- NavSecondary uses only Tailwind CSS -->
