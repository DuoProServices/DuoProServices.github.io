# 🚀 Deploy Automático para GitHub Pages

## ✅ Configuração Completa!

Seu projeto está 100% configurado para deploy automático no GitHub Pages:

- ✅ Workflow do GitHub Actions (`.github/workflows/deploy.yml`)
- ✅ Arquivo `.nojekyll` para GitHub Pages
- ✅ Configuração do Vite com `base: '/'`
- ✅ Scripts de build prontos

---

## 📋 Passo a Passo para Fazer Deploy

### **1️⃣ Primeiro Deploy (Configuração Inicial)**

Se é a primeira vez fazendo deploy no GitHub Pages:

#### a) Verifique o Repositório no GitHub

1. Acesse seu repositório no GitHub
2. URL deve ser algo como: `https://github.com/SEU-USUARIO/SEU-REPOSITORIO`

#### b) Ative o GitHub Pages

1. No repositório, clique em **Settings** (Configurações)
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione:
   - **Source**: `GitHub Actions`
4. Salve as alterações

**Pronto!** Agora qualquer push na branch `main` fará deploy automático.

---

### **2️⃣ Deploy das Atualizações (Rotina Normal)**

Para subir as atualizações mais recentes:

```bash
# 1. Adicione todas as mudanças
git add .

# 2. Faça um commit descritivo
git commit -m "feat: adiciona CRM completo ao Admin Control Panel"

# 3. Envie para o GitHub
git push origin main
```

**É só isso!** O GitHub Actions vai:
1. ✅ Detectar o push
2. ✅ Instalar dependências
3. ✅ Fazer o build
4. ✅ Fazer deploy automático
5. ✅ Site atualizado em 2-5 minutos

---

### **3️⃣ Acompanhar o Deploy**

1. Acesse seu repositório no GitHub
2. Clique na aba **Actions**
3. Você verá o workflow "Deploy to GitHub Pages" em execução
4. Aguarde até aparecer ✅ em verde
5. Clique no workflow para ver detalhes e logs

---

## 🌐 Acessar o Site

Após o deploy, seu site estará disponível em:

### Se você tem domínio personalizado:
- **URL**: `https://seudominio.com`

### Se usa GitHub Pages padrão:
- **URL**: `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`

**Exemplo**: `https://duoproservices.github.io/duopro-services/`

---

## 🔧 Comandos Úteis

### Build Local (Testar antes de fazer deploy)
```bash
npm run build
npm run preview
```

Isso abre um preview local do build de produção em `http://localhost:4173`

### Forçar Deploy Manual
Se quiser fazer deploy sem fazer commit:

1. Vá no GitHub → **Actions**
2. Selecione o workflow "Deploy to GitHub Pages"
3. Clique em **Run workflow**
4. Confirme

---

## 📊 Verificar Status do Deploy

### Última Atualização
Verifique quando foi o último deploy:
1. GitHub → **Actions**
2. Veja o histórico de workflows

### Site ao Vivo
Teste o site para confirmar as mudanças:
1. Acesse a URL do GitHub Pages
2. Force refresh: `Ctrl + Shift + R` (Windows) ou `Cmd + Shift + R` (Mac)
3. Verifique se as atualizações estão visíveis

---

## 🆘 Troubleshooting

### Deploy Falhou (❌ Red X)

**1. Ver o erro:**
- GitHub → Actions → Clique no workflow com erro
- Leia os logs para identificar o problema

**2. Erros comuns:**

#### `Module not found`
```bash
# Solução: Reinstale as dependências localmente
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: atualiza package-lock.json"
git push
```

#### `Build failed`
```bash
# Solução: Teste o build localmente
npm run build

# Se funcionar local, faça commit e push
git add .
git commit -m "fix: corrige erros de build"
git push
```

#### `Deployment failed`
- Verifique se GitHub Pages está ativo em Settings → Pages
- Confirme que Source está em "GitHub Actions"

---

## 🎯 Workflow Completo (Rotina Diária)

Quando você fizer mudanças no código:

```bash
# 1. Faça as alterações no código
# (edite os arquivos que precisar)

# 2. Salve tudo

# 3. Adicione ao Git
git add .

# 4. Commit com mensagem clara
git commit -m "feat: nova funcionalidade X"

# 5. Push para GitHub
git push origin main

# 6. Aguarde 2-5 minutos

# 7. ✅ Site atualizado!
```

---

## 🌟 Dicas de Boas Práticas

### Mensagens de Commit Claras
```bash
# ✅ Bom
git commit -m "feat: adiciona CRM ao admin panel"
git commit -m "fix: corrige erro no upload de documentos"
git commit -m "style: melhora design da página de login"

# ❌ Evite
git commit -m "mudanças"
git commit -m "update"
git commit -m "fix"
```

### Testar Antes de Deploy
```bash
# Sempre rode localmente antes de fazer push:
npm run dev        # Teste em desenvolvimento
npm run build      # Teste o build
npm run preview    # Teste o build em preview
```

### Branches para Features Grandes
Se estiver fazendo mudanças grandes:
```bash
# Crie uma branch
git checkout -b feature/nova-funcionalidade

# Trabalhe na branch
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade

# Quando pronto, faça merge via Pull Request no GitHub
# Isso evita quebrar o site em produção
```

---

## 📞 Suporte Rápido

### Site não atualiza após deploy?
1. **Force refresh**: `Ctrl + Shift + R`
2. **Limpe o cache**: Abra DevTools (F12) → Application → Clear storage
3. **Teste em aba anônima**

### Deploy está demorando muito?
- Normal: 2-5 minutos
- Se passar de 10 minutos, verifique Actions por erros

### Precisa reverter para versão anterior?
```bash
# Ver histórico
git log --oneline

# Reverter para commit específico
git revert COMMIT_HASH

# Push
git push
```

---

## ✅ Checklist Rápido

Antes de cada deploy:

- [ ] Testei localmente com `npm run dev`
- [ ] Build funciona com `npm run build`
- [ ] Código não tem erros no console
- [ ] Mensagem de commit é clara
- [ ] Fiz `git push origin main`
- [ ] Aguardei 2-5 minutos
- [ ] Verifiquei Actions (✅ verde)
- [ ] Testei o site ao vivo

---

## 🎉 Próximos Passos

Agora que o deploy está automático:

1. **Custom Domain** (Opcional):
   - Settings → Pages → Custom domain
   - Digite seu domínio (ex: `duoproservices.ca`)
   - Configure DNS conforme instruções

2. **Monitoramento**:
   - Configure Google Analytics
   - Adicione Google Search Console

3. **Backups**:
   - GitHub já faz backup automático
   - Todo commit é um ponto de restauração

---

**Seu site está pronto para updates automáticos! 🚀**

Qualquer mudança que você fizer e der push, em 5 minutos estará online!
