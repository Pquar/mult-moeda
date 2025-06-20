<script setup lang="ts">
interface NavItem {
  title: string
  url: string
  icon?: string
}

interface Props {
  items: NavItem[]
}

defineProps<Props>()

// Função para scroll suave
const smoothScrollTo = (elementId: string, event: Event) => {
  event.preventDefault()
  
  const targetId = elementId.replace('#', '')
  const targetElement = document.getElementById(targetId)
  
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<template>
  <div class="mb-2">
    <div class="flex flex-col gap-2">
      <!-- Main Navigation -->
      <ul class="flex flex-col gap-1 m-0 p-0">
        <li v-for="item in items" :key="item.title" class="list-none">
          <a 
            :href="item.url" 
            @click="smoothScrollTo(item.url, $event)"
            class="w-full text-left text-gray-700 transition-all duration-200 ease-in-out border-0 bg-transparent cursor-pointer hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2 px-3 py-2 text-sm rounded-md"
            :title="item.title"
          >
            <i v-if="item.icon" :class="item.icon" class="w-4 h-4"></i>
            <span>{{ item.title }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<!-- NavMain uses only Tailwind CSS -->
