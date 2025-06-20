<script setup lang="ts">
import { ref, provide } from 'vue'
import AppSidebar from '@/components/ui/AppSidebar.vue'
import PaymentDashboard from '@/components/PaymentDashboard.vue'

const isCollapsed = ref(false)

provide('sidebarCollapsed', { isCollapsed, toggleSidebar: () => { isCollapsed.value = !isCollapsed.value } })
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <AppSidebar />

    <main
class="flex-1 min-w-0 overflow-hidden transition-all duration-300"
      :class="{ 'ml-16': isCollapsed, 'ml-64': !isCollapsed }">
      <div class="relative h-screen overflow-y-auto scroll-smooth">
        <header class="bg-white border-b border-gray-200 px-6 py-4  top-0 z-20">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl md:text-2xl font-bold text-gray-900">Dashboard Multi-Moeda</h1>
              <p class="text-sm text-gray-600 mt-1">
                Sistema de gestão financeira global com múltiplas moedas
              </p>
            </div>
          </div>
        </header>

        <div class="p-0">
          <PaymentDashboard />
        </div>
      </div>
    </main>
  </div>
</template>