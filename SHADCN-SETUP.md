# Multi-Moeda - Problema e Solução Shadcn/UI com Vue.js

## ❌ Problema Original

Você estava enfrentando o problema de que quando baixava componentes do **shadcn/ui**, eles vinham como componentes **React** (`.tsx`) ao invés de componentes **Vue.js** (`.vue`).

Isso acontece porque:
1. O shadcn/ui CLI original foi feito principalmente para React
2. Mesmo configurando para Vue.js, muitos componentes ainda baixam em formato React
3. O projeto estava misturando dependências React e Vue

## ✅ Solução Implementada

### 1. Limpeza das dependências React
Removidas:
- `@radix-ui/react-slot`
- `lucide-react`

Adicionadas:
- `lucide-vue-next` (ícones para Vue.js)

### 2. Conversão do componente Button
- Convertido de React (`.tsx`) para Vue.js (`.vue`)
- Mantida toda a funcionalidade e variantes
- Adaptado para usar a sintaxe do Vue 3 Composition API

### 3. Configuração correta
- `components.json` configurado com `"tsx": false`
- `iconLibrary` definido como `"lucide-vue-next"`

## 🚀 Como usar agora

### Componente Button já convertido
```vue
<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
</script>

<template>
  <div>
    <Button variant="default">Botão Padrão</Button>
    <Button variant="outline">Botão Outline</Button>
    <Button variant="destructive">Botão Destrutivo</Button>
    <Button variant="secondary">Botão Secundário</Button>
    <Button variant="ghost">Botão Ghost</Button>
    <Button variant="link">Botão Link</Button>
  </div>
</template>
```

### Para novos componentes
⚠️ **ATENÇÃO**: O CLI do shadcn/ui ainda pode baixar componentes React em alguns casos.

**Opções:**
1. **Manualmente converter** componentes React para Vue (recomendado)
2. **Usar bibliotecas Vue nativas** como:
   - [Headless UI Vue](https://headlessui.com/vue/menu)
   - [Radix Vue](https://www.radix-vue.com/)
   - [Element Plus](https://element-plus.org/)
   - [Naive UI](https://www.naiveui.com/)

### Conversão manual de componentes
Se você baixar um componente React, siga este padrão de conversão:

**React (.tsx):**
```tsx
import { Button } from "./ui/button"

export function MyButton({ children, ...props }) {
  return <Button {...props}>{children}</Button>
}
```

**Vue (.vue):**
```vue
<script setup lang="ts">
import Button from './ui/Button.vue'

interface Props {
  // definir props aqui
}

const props = defineProps<Props>()
</script>

<template>
  <Button v-bind="props">
    <slot />
  </Button>
</template>
```

## 📁 Estrutura atual
```
src/
├── components/
│   ├── ui/
│   │   └── Button.vue ✅ (convertido para Vue)
│   └── HelloWorld.vue
├── lib/
│   └── utils.ts ✅ (compatível)
└── style.css ✅ (Tailwind configurado)
```

## 🔄 Próximos passos
1. Quando precisar de novos componentes, considere usar bibliotecas Vue nativas
2. Se baixar do shadcn/ui e vier como React, converta manualmente
3. O componente Button já está funcionando perfeitamente como exemplo

**O projeto agora está 100% Vue.js compatível!** 🎉
