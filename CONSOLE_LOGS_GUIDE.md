# 📋 Console Logs - Guia de Configuração

## 🎯 Visão Geral

O sistema possui um gerenciador inteligente de logs que permite controlar quais avisos aparecem no console do navegador.

## 🚀 Acesso Rápido

### **Painel Visual (Recomendado)**

Em modo de desenvolvimento, há um botão flutuante **"Console Settings"** no canto inferior direito da tela.

**Clique nele para:**
- ✅ Ativar/desativar todos os logs
- 🎭 Ocultar avisos de "Demo Mode"
- ✅ Mostrar/ocultar logs de sucesso de API
- 🔍 Ativar logs detalhados de debug

**Modos Pré-configurados:**
- **🔕 Silent Mode** - Console limpo (recomendado para trabalhar com dados mock)
- **🔊 Verbose Mode** - Todos os logs habilitados (útil para debugging)

---

## ⚙️ Configuração Manual

### **Arquivo: `/src/config/app.ts`**

```typescript
export const APP_CONFIG = {
  logging: {
    // Habilita/desabilita TODOS os logs
    enabled: true,
    
    // Avisos de "Demo Mode" quando backend está offline
    showDemoWarnings: true,  // ⬅️ Mude para false para silenciar
    
    // Logs de sucesso de conexões API
    showApiSuccess: false,
    
    // Logs detalhados de desenvolvimento
    showDebugLogs: false,
  },
};
```

---

## 📊 Tipos de Logs

### **🎭 Demo Mode** (Laranja)
```
🎭 Demo Mode  /messages
```
**O que é:** Avisa quando o backend está offline e dados mockados estão sendo usados.

**Como desabilitar:**
- **Painel:** Desligue "Demo Mode Warnings"
- **Código:** `showDemoWarnings: false`

---

### **✅ API Success** (Verde)
```
✅ Backend Online
```
**O que é:** Confirma quando o backend volta a funcionar.

**Como desabilitar:**
- **Painel:** Desligue "API Success Logs"
- **Código:** `showApiSuccess: false`

---

### **❌ Erros** (Vermelho)
```
❌ Failed to load data
```
**O que é:** Erros críticos do sistema.

**IMPORTANTE:** Erros sempre aparecem, mesmo com logs desabilitados (por segurança).

---

### **🔍 Debug** (Cinza)
```
🔍 Detailed operation info
```
**O que é:** Informações detalhadas para desenvolvimento.

**Como habilitar:**
- **Painel:** Ative "Debug Logs"
- **Código:** `showDebugLogs: true`

---

## 🎯 Casos de Uso

### **Caso 1: Trabalhando com Backend Offline**

**Problema:** Console cheio de avisos "🎭 Demo Mode"

**Solução:**
1. Clique em **"Console Settings"** (canto inferior direito)
2. Clique em **"🔕 Silent Mode"**
3. Pronto! Console limpo ✨

---

### **Caso 2: Debugando Conexões API**

**Objetivo:** Ver todos os detalhes de requisições

**Solução:**
1. Clique em **"Console Settings"**
2. Clique em **"🔊 Verbose Mode"**
3. Todos os logs serão exibidos

---

### **Caso 3: Produção (Deploy)**

**Objetivo:** Desabilitar todos os logs em produção

**Solução:** Editar `/src/config/app.ts`:
```typescript
logging: {
  enabled: false,  // ⬅️ Desabilita tudo
  // ...
}
```

---

## 🔧 Desenvolvimento

### **Usar o Logger no Código**

```typescript
import { logger } from './utils/logger';

// Sucesso
logger.success('Operation completed!', 'API');

// Erro
logger.error('Something went wrong', 'API', error);

// Aviso
logger.warning('Check this out', 'DATA');

// Info
logger.info('Processing data...', 'STORAGE');

// Demo Mode
logger.demo('/endpoint', 'API');

// Debug
logger.debug('Detailed info', { data });
```

---

## 📌 Status Atual

### **Logs Silenciados por Padrão:**
- ✅ API Success (poluía console)
- 🔍 Debug logs (muito verboso)

### **Logs Ativos por Padrão:**
- 🎭 Demo Mode warnings (útil para saber quando backend está offline)
- ❌ Erros críticos (sempre ativos)

---

## 💡 Dicas

1. **Console limpo enquanto desenvolve?**
   → Use "🔕 Silent Mode"

2. **Precisar ver tudo para debug?**
   → Use "🔊 Verbose Mode"

3. **Deploy em produção?**
   → Mude `enabled: false` em `/src/config/app.ts`

4. **Avisos específicos incomodam?**
   → Use o painel para desabilitar individualmente

---

## 🎨 Formatação dos Logs

Todos os logs usam **cores e badges** para fácil identificação:

- 🟢 Verde = Sucesso
- 🔴 Vermelho = Erro
- 🟡 Amarelo = Aviso/Demo
- 🔵 Azul = Informação
- ⚪ Cinza = Debug

---

## 🐛 Troubleshooting

### **"Avisos ainda aparecem mesmo desabilitados"**

**Causa:** Página precisa ser recarregada

**Solução:** Pressione `Ctrl+R` (ou `Cmd+R` no Mac)

---

### **"Painel não aparece"**

**Causa:** Só está disponível em modo desenvolvimento

**Solução:** 
```bash
npm run dev
```

---

### **"Configurações não salvam"**

**Causa:** Configurações são temporárias (não salvam no banco)

**Solução:** Para mudanças permanentes, edite `/src/config/app.ts`

---

## 📞 Suporte

Se tiver dúvidas ou problemas com logs:

1. Verifique este guia
2. Teste o painel visual de configuração
3. Use "Silent Mode" para limpar o console rapidamente

---

**Última atualização:** Janeiro 2026
