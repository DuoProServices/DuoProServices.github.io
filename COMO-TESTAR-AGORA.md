# 🚀 COMO TESTAR O SISTEMA AGORA

**Tudo funciona LOCALMENTE sem precisar de deploy!**

---

## ✅ TESTE 1: LOGIN

### Passos:
1. Abra o navegador
2. Vá para: `http://localhost:5173/login`
3. Digite email e senha válidos
4. Clique "Sign In"
5. ✅ Deve redirecionar para dashboard

### Se der erro:
- Verifique se tem usuário criado
- Vá para `/signup` para criar conta
- Ou use `/setup` para criar conta admin

---

## ✅ TESTE 2: RESET DE SENHA

### Passos:
1. Vá para: `http://localhost:5173/login`
2. Clique em "Forgot password?"
3. Digite um email válido
4. Clique "Send Reset Link"
5. ✅ Deve mostrar mensagem de sucesso
6. Cheque email (se Supabase Email estiver configurado)
7. Clique no link do email
8. Defina nova senha
9. ✅ Deve redirecionar para login

### ⚠️ Importante:
- Email só funciona se configurado no Supabase
- Sem configuração de email, link não será enviado
- Mas o código está funcionando corretamente!

---

## ✅ TESTE 3: TAREFAS DO ADMIN (Project Management)

### Passos:

#### 1. Fazer Login como Admin:
```
1. Vá para /login
2. Use email de admin (configurado em /src/app/config/admins.ts)
3. Sistema redireciona para /admin
```

#### 2. Ir para Control Panel:
```
1. No menu admin, clique "Control Panel"
2. Ou vá direto para /admin/control-panel
```

#### 3. Abrir Project Management:
```
1. Veja 4 módulos (ícones):
   📊 Client Management
   💰 Financial Control
   💼 Project Management ← ESTE!
   📱 Social Media Calendar

2. Clique no ícone de maleta (💼 Project Management)
```

#### 4. Criar Nova Tarefa:
```
1. Clique no botão azul "New Task" (canto superior direito)
2. Preencha o formulário:
   
   ✏️ Task Title: "Revisar código do módulo X"
   📝 Description: "Fazer code review completo"
   📊 Status: "In Progress"
   🚩 Priority: "High"
   📅 Due Date: Escolha uma data
   👤 Assign To: Marque "Verónica Prass"

3. Clique "Create Task"
```

#### 5. Verificar o que acontece:
```
✅ Verá toast: "⚠️ Saved locally (server offline)"
✅ Tarefa aparece na lista do mês correspondente
✅ Contadores atualizam (Total Tasks, In Progress, etc.)
```

#### 6. Editar Tarefa:
```
1. Passe mouse sobre a tarefa
2. Clique no ícone de lápis (✏️)
3. Modifique o que quiser
4. Clique "Update Task"
5. ✅ Mudanças são salvas!
```

#### 7. Deletar Tarefa:
```
1. Clique no ícone de lixeira (🗑️)
2. Confirme
3. ✅ Tarefa é removida!
```

#### 8. Filtrar Tarefas:
```
1. Use dropdown "All Status" para filtrar por status
2. Use dropdown "All Team Members" para filtrar por pessoa
3. ✅ Lista atualiza automaticamente!
```

---

## 🔍 TESTE 4: VER DADOS SALVOS NO NAVEGADOR

### Opção 1: DevTools (Chrome/Firefox):
```
1. Pressione F12 (ou Ctrl+Shift+I)
2. Vá para aba "Application" (Chrome) ou "Storage" (Firefox)
3. Clique "Local Storage" no menu esquerdo
4. Clique no seu domínio (localhost:5173)
5. Veja todas as chaves que começam com "duopro_kv_"

Exemplo do que verá:
  duopro_kv_task:task-1705171234567
  duopro_kv_task:task-1705171234568
  duopro_kv_task:task-1705171234569
```

### Opção 2: Console:
```
1. Pressione F12
2. Vá para aba "Console"
3. Digite e execute:

// Ver todas as chaves:
Object.keys(localStorage).filter(k => k.startsWith('duopro_kv_'))

// Ver conteúdo de uma tarefa:
JSON.parse(localStorage.getItem('duopro_kv_task:task-1705171234567'))
```

---

## 🧹 COMO LIMPAR DADOS LOCAIS

### Se quiser começar do zero:

#### Opção 1: Console (RÁPIDO):
```
1. F12 → Console
2. Digite e execute:
   localStorage.clear()
3. Recarregue a página (F5)
✅ Todos os dados locais foram apagados!
```

#### Opção 2: DevTools (MANUAL):
```
1. F12 → Application/Storage → Local Storage
2. Clique com botão direito no domínio
3. Selecione "Clear"
4. Recarregue a página
✅ Dados apagados!
```

#### Opção 3: Deletar chave por chave:
```
1. F12 → Application/Storage → Local Storage
2. Clique em cada chave "duopro_kv_*"
3. Pressione Delete
4. Repita para todas
```

---

## 📊 COMO VERIFICAR SE ESTÁ FUNCIONANDO

### Checklist Visual:

#### ✅ Login funcionando:
- [ ] Consigo digitar email/senha
- [ ] Botão "Sign In" está clicável
- [ ] Após clicar, sou redirecionado
- [ ] Vejo meu nome/email no header
- [ ] Posso fazer logout

#### ✅ Reset senha funcionando:
- [ ] Link "Forgot password?" está visível
- [ ] Formulário de reset aparece
- [ ] Toast de sucesso aparece após enviar
- [ ] Volto para login após clicar "Back to Login"

#### ✅ Tarefas funcionando:
- [ ] Vejo os 4 módulos do Control Panel
- [ ] Consigo clicar em "Project Management"
- [ ] Vejo os 5 contadores no topo
- [ ] Botão "New Task" está visível
- [ ] Modal abre ao clicar "New Task"
- [ ] Consigo preencher formulário
- [ ] Toast aparece após salvar
- [ ] Tarefa aparece na lista
- [ ] Consigo editar tarefa
- [ ] Consigo deletar tarefa
- [ ] Filtros funcionam

---

## 🎯 FLUXO COMPLETO DE TESTE

### Teste tudo em sequência:

```
1. ✅ Limpar dados locais (localStorage.clear())

2. ✅ Criar conta:
   - Vá para /signup
   - Crie conta com email de admin (admin@duoproservices.ca)
   - Sistema cria conta

3. ✅ Logout
   - Clique no botão de logout

4. ✅ Test Reset Senha:
   - Vá para /login
   - Clique "Forgot password?"
   - Digite email
   - Veja mensagem de sucesso

5. ✅ Login novamente:
   - Use credenciais originais
   - Sistema redireciona

6. ✅ Criar tarefas:
   - Vá para /admin/control-panel
   - Project Management
   - Crie 3 tarefas diferentes:
     * Tarefa 1: Status "To Do", Hoje
     * Tarefa 2: Status "In Progress", Amanhã
     * Tarefa 3: Status "Completed", Sem data

7. ✅ Testar filtros:
   - Filtre por "In Progress" → deve mostrar 1 tarefa
   - Filtre por "All Status" → deve mostrar 3 tarefas
   - Filtre por pessoa específica
   - Volte para "All"

8. ✅ Editar tarefa:
   - Clique em editar na Tarefa 1
   - Mude para "In Progress"
   - Salve
   - Veja que agora tem 2 "In Progress"

9. ✅ Deletar tarefa:
   - Delete a Tarefa 3
   - Veja que contador atualiza

10. ✅ Verificar persistência:
    - Feche o navegador completamente
    - Reabra
    - Vá para /login
    - Login
    - Vá para Project Management
    - ✅ Tarefas ainda estão lá!

11. ✅ Ver dados no localStorage:
    - F12 → Application → Local Storage
    - Veja chaves "duopro_kv_task:*"
    - Clique para ver JSON

12. ✅ Limpar e testar novamente:
    - localStorage.clear()
    - F5 (recarregar)
    - Vá para Project Management
    - ✅ Não tem mais tarefas (começou do zero)
```

---

## 🐛 TROUBLESHOOTING

### Problema: Tarefas não aparecem
**Solução:**
```
1. Abra DevTools (F12)
2. Vá para Console
3. Veja se tem erros em vermelho
4. Se tiver erro de "localStorage", limpe:
   localStorage.clear()
   location.reload()
```

### Problema: Toast não aparece
**Solução:**
```
1. Verifique se Sonner está funcionando
2. Teste criar tarefa novamente
3. Olhe canto superior direito da tela
```

### Problema: "Not authenticated"
**Solução:**
```
1. Logout
2. Login novamente
3. Tente a ação novamente
```

### Problema: Modal não abre
**Solução:**
```
1. Recarregue a página (F5)
2. Tente clicar "New Task" novamente
3. Veja console (F12) por erros
```

---

## ✅ SINAIS DE QUE ESTÁ TUDO OK

Você saberá que está tudo funcionando quando:

- ✅ Login funciona sem erros
- ✅ Toast "Working offline" ou "Saved locally" aparece
- ✅ Tarefas aparecem na lista após salvar
- ✅ Contadores (Total, To Do, etc.) atualizam
- ✅ Filtros funcionam
- ✅ Edição funciona
- ✅ Deleção funciona
- ✅ Dados persistem após fechar navegador
- ✅ localStorage tem chaves "duopro_kv_*"

---

## 🎉 TUDO PRONTO!

Agora você pode:
1. ✅ Testar login
2. ✅ Testar reset de senha
3. ✅ Criar e gerenciar tarefas
4. ✅ Trabalhar completamente offline
5. ✅ Tudo sem precisar de deploy!

**Quando tiver crédito para deploy:**
- Sistema passa a usar servidor automaticamente
- Dados sincronizam entre usuários
- Tudo funciona em produção

---

**Dúvidas? Veja os logs no Console (F12) - tudo é logado com emojis para facilitar debug! 🐛**
