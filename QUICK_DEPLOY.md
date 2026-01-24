# ⚡ Deploy Rápido - 3 Passos

## Para fazer deploy DAS ATUALIZAÇÕES MAIS RECENTES:

### **Método 1: Script Automático (MAIS FÁCIL)** 🌟

#### **No Windows:**
```bash
# Clique duplo no arquivo:
deploy.bat
```

#### **No Mac/Linux:**
```bash
# No terminal:
chmod +x deploy.sh
./deploy.sh
```

O script vai:
1. ✅ Fazer build e testar
2. ✅ Adicionar arquivos ao Git
3. ✅ Fazer commit
4. ✅ Fazer push para GitHub
5. ✅ Deploy automático em 2-5 minutos

---

### **Método 2: Manual (3 comandos)** 💻

```bash
# 1. Adicione as mudanças
git add .

# 2. Faça commit
git commit -m "feat: adiciona CRM ao admin panel"

# 3. Envie para GitHub
git push origin main
```

**Pronto!** Aguarde 2-5 minutos e as atualizações estarão online.

---

## 🔍 Acompanhar Deploy

1. Acesse: `https://github.com/SEU-USUARIO/SEU-REPOSITORIO/actions`
2. Veja o workflow em execução
3. Aguarde ✅ verde
4. Site atualizado!

---

## 🌐 Ver Site Atualizado

**URL do seu site:**
- `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`

**Ou seu domínio personalizado:**
- `https://seudominio.com`

---

## 💡 Dica Importante

**Sempre force refresh após deploy:**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

Isso garante que você veja a versão mais recente!

---

## 📋 Checklist Rápido

- [ ] Fiz as mudanças no código
- [ ] Executei o script ou os 3 comandos
- [ ] Aguardei 2-5 minutos
- [ ] Fiz force refresh no navegador
- [ ] ✅ Site atualizado!

---

**É só isso! Deploy feito! 🚀**
