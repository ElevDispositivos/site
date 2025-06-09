# Configurações SSL e Certificados - Netlify

## 🚨 Problema Identificado e Resolvido
**Erro Original**: `Hostname/IP does not match certificate's altnames`  
**Causa Adicional**: Conflito entre redirecionamentos duplicados

## 🔧 Soluções Implementadas

### 1. Arquivo `_redirects` ✅ (Método Recomendado)
```
# Redirecionamentos para www (melhores práticas Netlify)
https://elevdispositivos.com.br/* https://www.elevdispositivos.com.br/:splat 301!
http://elevdispositivos.com.br/* https://www.elevdispositivos.com.br/:splat 301!
http://www.elevdispositivos.com.br/* https://www.elevdispositivos.com.br/:splat 301!
```

### 2. `netlify.toml` Limpo ✅
```toml
[build]
  publish = "."
```
**Importante**: Removidos redirecionamentos duplicados que causavam conflitos

### 3. Configurações DNS Necessárias

#### No Provedor de Domínio
```
Tipo  | Nome                     | Valor
------|--------------------------|------------------------
CNAME | www                      | silver-capybara-287363.netlify.app
A     | elevdispositivos.com.br  | [IP do Netlify]
```

### 4. Configurações no Netlify

#### Domain Settings
1. **Primary Domain**: `www.elevdispositivos.com.br` ✅
2. **Custom Domain**: `elevdispositivos.com.br` (com redirect automático)
3. **Force HTTPS**: Habilitado ✅

## ⚠️ Problemas Evitados

### Redirecionamentos Duplicados
- ❌ **Antes**: `_redirects` + `netlify.toml` (conflito)
- ✅ **Depois**: Apenas `_redirects` (método recomendado)

### Loops de Redirecionamento
- ❌ **Risco**: Domínio primário incorreto
- ✅ **Solução**: `www.elevdispositivos.com.br` como primário

## 📋 Checklist de Verificação

### DNS Propagation
- [ ] `dig www.elevdispositivos.com.br` → Aponta para Netlify
- [ ] `dig elevdispositivos.com.br` → Aponta para Netlify
- [ ] TTL configurado (máximo 3600s)

### SSL Status
- [ ] Certificado válido para `www.elevdispositivos.com.br`
- [ ] Certificado válido para `elevdispositivos.com.br`
- [ ] Force HTTPS ativo
- [ ] Sem redirecionamentos duplicados

### Testes de URL (Todos devem funcionar)
- [ ] `https://www.elevdispositivos.com.br` → ✅ Carrega normalmente
- [ ] `https://elevdispositivos.com.br` → ✅ Redireciona para www
- [ ] `http://www.elevdispositivos.com.br` → ✅ Redireciona para HTTPS+www
- [ ] `http://elevdispositivos.com.br` → ✅ Redireciona para HTTPS+www

## 🛠️ Comandos para Teste

### Verificar Redirecionamentos
```bash
# Deve retornar 301 e redirecionar para www
curl -I https://elevdispositivos.com.br

# Deve retornar 200 (página final)
curl -I https://www.elevdispositivos.com.br

# Teste completo com seguimento de redirecionamentos
curl -L -I http://elevdispositivos.com.br
```

### Verificar SSL
```bash
# Verificar certificado
openssl s_client -connect www.elevdispositivos.com.br:443 -servername www.elevdispositivos.com.br

# Verificar certificado do domínio sem www
openssl s_client -connect elevdispositivos.com.br:443 -servername elevdispositivos.com.br
```

## 🚀 Deploy e Teste

### Após Alterações
1. **Commit**: `git commit -m "fix: resolve redirect conflicts"`
2. **Push**: `git push origin main`
3. **Aguardar**: 2-3 minutos para propagação
4. **Força Deploy**: Netlify → Deploys → "Trigger deploy"
5. **Testar**: Todos os URLs listados acima

## 📞 Suporte
Se os problemas persistirem:
- **Netlify Support**: support@netlify.com
- **Desenvolvimento**: desenvolvimento@hyzy.com.br

---
**Status**: Corrigido ✅  
**Última verificação**: Janeiro 2025  
**Método**: Apenas `_redirects` (melhor prática) 