#!/usr/bin/env node

/**
 * Script para copiar arquivos da pasta server/ para make-server-c2a25be0/
 * Isso prepara os arquivos para deploy via Supabase CLI
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'supabase', 'functions', 'server');
const TARGET_DIR = path.join(__dirname, 'supabase', 'functions', 'make-server-c2a25be0');

console.log('🚀 Copiando arquivos para deploy...\n');

// Verificar se os diretórios existem
if (!fs.existsSync(SOURCE_DIR)) {
  console.error('❌ Erro: Diretório source não encontrado:', SOURCE_DIR);
  process.exit(1);
}

if (!fs.existsSync(TARGET_DIR)) {
  console.log('📁 Criando diretório target:', TARGET_DIR);
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Função para copiar recursivamente
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
    console.log('✅ Copiado:', path.basename(dest));
  }
}

// Copiar todos os arquivos
console.log('📦 Copiando arquivos de server/ para make-server-c2a25be0/...\n');
copyRecursive(SOURCE_DIR, TARGET_DIR);

// Renomear index.tsx para index.ts se existir
const indexTsx = path.join(TARGET_DIR, 'index.tsx');
const indexTs = path.join(TARGET_DIR, 'index.ts');

if (fs.existsSync(indexTsx)) {
  fs.renameSync(indexTsx, indexTs);
  console.log('\n📝 Renomeado: index.tsx → index.ts');
}

console.log('\n✅ Todos os arquivos copiados com sucesso!');
console.log('\n📋 Arquivos na pasta make-server-c2a25be0:');
const files = fs.readdirSync(TARGET_DIR);
files.forEach(file => {
  console.log('   -', file);
});

console.log('\n🚀 Pronto para deploy!');
console.log('\nExecute agora:');
console.log('   supabase functions deploy make-server-c2a25be0');
