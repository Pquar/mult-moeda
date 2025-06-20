<script setup lang="ts">
import { inject, type Ref } from 'vue'
import NavMain from './NavMain.vue'
import NavDocuments from './NavDocuments.vue'

// Tipo para o estado do sidebar
interface SidebarState {
  isCollapsed: Ref<boolean>
  toggleSidebar: () => void
}

// Injetar o estado do sidebar compartilhado
const sidebarState = inject<SidebarState>('sidebarCollapsed')

if (!sidebarState) {
  throw new Error('Sidebar state not provided')
}

const { isCollapsed, toggleSidebar } = sidebarState

const data = {
  user: {
    name: "Financial Dashboard",
    email: "admin@multmoeda.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#dashboard",
      icon: "fas fa-tachometer-alt",
    },
    {
      title: "Análise Financeira",
      url: "#analytics",
      icon: "fas fa-chart-line",
    },
    {
      title: "Pagamentos",
      url: "#payments",
      icon: "fas fa-credit-card",
    },
    {
      title: "Receita",
      url: "#profits",
      icon: "fas fa-chart-bar",
    },
    {
      title: "Profissionais",
      url: "#team",
      icon: "fas fa-users",
    },
    {
      title: "Faturas",
      url: "#invoices",
      icon: "fas fa-file-invoice",
    },
    {
      title: "CM Por Projeto",
      url: "#salaries",
      icon: "fas fa-money-check-alt",
    },
    {
      title: "Relatórios",
      url: "#reports",
      icon: "fas fa-chart-bar",
    },
  ],
  documents: [
    {
      name: "Exportações",
      url: "#reports",
      icon: "fas fa-download",
    },
  ]
}

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
  <aside 
    class="fixed left-0 top-0 bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 overflow-hidden z-30"
    :class="{ 'w-16': isCollapsed, 'w-64': !isCollapsed }"
  >
    <!-- Header -->
    <div class="relative border-b border-gray-200">
      <div class="m-0 p-0">
        <div class="list-none">
          <button 
            @click="toggleSidebar"
            class="w-full text-inherit flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span v-if="!isCollapsed" class="text-base font-semibold text-gray-900">
              Multi-Moeda
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content with custom scrollbar using Tailwind -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
      <NavMain :items="data.navMain" v-if="!isCollapsed" />
      
      <!-- Collapsed navigation -->
      <div v-if="isCollapsed" class="space-y-2">
        <a 
          v-for="item in data.navMain" 
          :key="item.title"
          :href="item.url"
          @click="smoothScrollTo(item.url, $event)"
          class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          :title="item.title"
        >
          <i :class="item.icon" class="w-5 h-5 text-gray-600"></i>
        </a>
      </div>
      
      <NavDocuments :items="data.documents" v-if="!isCollapsed" />
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200" v-if="!isCollapsed">
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <i class="fas fa-user text-gray-600"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 truncate">{{ data.user.name }}</div>
          <div class="text-xs text-gray-500 truncate">{{ data.user.email }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<!-- AppSidebar uses only Tailwind CSS -->
