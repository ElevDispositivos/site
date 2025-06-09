# Configurações SSL e Certificados - Netlify

## 🚨 Problema Identificado
**Erro**: `Hostname/IP does not match certificate's altnames: Host: elevdispositivos.com.br. is not in the cert's altnames: DNS:*.netlify.app, DNS:netlify.app`

## 🔧 Soluções Implementadas

### 1. Arquivo `_redirects` ✅
```
https://elevdispositivos.com.br/* https://www.elevdispositivos.com.br/:splat 301!
```

### 2. Configurações DNS Necessárias

#### No Provedor de Domínio
```
Tipo  | Nome                     | Valor
------|--------------------------|------------------------
CNAME | www                      | silver-capybara-287363.netlify.app
A     | elevdispositivos.com.br  | [IP do Netlify]
```

### 3. Configurações no Netlify

#### Domain Settings
1. Acesse: `app.netlify.com/teams/[team]/dns/[domain]`
2. **Primary Domain**: `www.elevdispositivos.com.br`
3. **Custom Domain**: `elevdispositivos.com.br` (com redirect)

#### SSL Certificate
1. **HTTPS**: Force HTTPS habilitado
2. **Certificate**: Auto-gerado pelo Netlify
3. **Domain**: Certificado válido para ambos domínios

## 📋 Checklist de Verificação

### DNS Propagation
- [ ] `dig www.elevdispositivos.com.br` → Aponta para Netlify
- [ ] `dig elevdispositivos.com.br` → Aponta para Netlify
- [ ] TTL configurado (máximo 3600s)

### SSL Status
- [ ] Certificado válido para `www.elevdispositivos.com.br`
- [ ] Certificado válido para `elevdispositivos.com.br`
- [ ] Force HTTPS ativo
- [ ] Redirecionamento 301 funcionando

### Testes de URL
- [ ] `https://www.elevdispositivos.com.br` → ✅ Funciona
- [ ] `https://elevdispositivos.com.br` → ✅ Redireciona para www
- [ ] `http://www.elevdispositivos.com.br` → ✅ Redireciona para HTTPS
- [ ] `http://elevdispositivos.com.br` → ✅ Redireciona para HTTPS+www

## 🛠️ Comandos para Teste

### Verificar DNS
```bash
nslookup www.elevdispositivos.com.br
nslookup elevdispositivos.com.br
```

### Verificar SSL
```bash
curl -I https://www.elevdispositivos.com.br
curl -I https://elevdispositivos.com.br
```

### Verificar Redirecionamentos
```bash
curl -L -I http://elevdispositivos.com.br
curl -L -I https://elevdispositivos.com.br
```

## 📞 Suporte
Se os problemas persistirem, contactar:
- **Netlify Support**: support@netlify.com
- **Desenvolvimento**: desenvolvimento@hyzy.com.br

---
**Status**: Configurado ✅  
**Última verificação**: Janeiro 2025 