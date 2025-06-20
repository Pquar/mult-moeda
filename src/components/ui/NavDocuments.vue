<script setup lang="ts">
import { ref } from 'vue'

interface DocumentItem {
  name: string
  url: string
  icon: string
}

interface Props {
  items: DocumentItem[]
}

defineProps<Props>()
const activeDropdown = ref<string | null>(null)

const toggleDropdown = (itemName: string) => {
  activeDropdown.value = activeDropdown.value === itemName ? null : itemName
}

const closeDropdown = () => {
  activeDropdown.value = null
}

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
  <div class="mb-4">
    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      Documents
    </div>
    <div class="flex flex-col gap-1">
      <ul class="flex flex-col gap-1 m-0 p-0">
        <li v-for="item in items" :key="item.name" class="list-none relative">
          <a 
            :href="item.url" 
            class="w-full text-left text-gray-700 transition-all duration-200 ease-in-out border-0 bg-transparent cursor-pointer relative hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2 px-3 py-2 text-sm rounded-md group"
            @click="smoothScrollTo(item.url, $event)"
          >
            <i :class="item.icon" class="w-4 h-4"></i>
            <span>{{ item.name }}</span>
          </a>
          
          <div class="relative inline-block">
            <button 
              class="bg-transparent border-0 cursor-pointer text-gray-600 opacity-0 group-hover:opacity-100 absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-sm hover:bg-gray-200 transition-all"
              :class="{ 'bg-gray-200': activeDropdown === item.name }"
              @click="toggleDropdown(item.name)"
            >
              <i class="fas fa-ellipsis-h w-4 h-4"></i>
              <span class="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">More</span>
            </button>
            
            <div 
              v-if="activeDropdown === item.name"
              class="min-w-[120px] absolute right-0 top-8 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              @click.stop
            >
              <button class="bg-transparent border-0 cursor-pointer text-left flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
                <i class="fas fa-folder w-4 h-4"></i>
                <span>Open</span>
              </button>
              <button class="bg-transparent border-0 cursor-pointer text-left flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
                <i class="fas fa-share w-4 h-4"></i>
                <span>Share</span>
              </button>
              <hr class="my-1 border-gray-200">
              <button class="bg-transparent border-0 cursor-pointer text-left flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <i class="fas fa-trash w-4 h-4"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </li>
      
      </ul>
    </div>
  </div>
  
  <div 
    v-if="activeDropdown" 
    class="fixed inset-0 z-40"
    @click="closeDropdown"
  ></div>
</template>
