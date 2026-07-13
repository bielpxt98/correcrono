# Ingresso Corrida — Bilheteria digital

Sistema de inscrição estilo bilheteria (tipo Ingresso / Bilheteria Digital) para **um amigo organizador**.

- Site público escuro, capa + galeria + card de ingresso  
- Checkout com categorias e camisetas **editáveis no admin**  
- Painel fácil (sem código): dados da corrida, fotos, inscritos  
- Upload de fotos → aparecem no site na hora  
- Mercado Pago (opcional)  
- Stack grátis: **Vercel + Supabase Storage**

Pasta do projeto: `C:\Users\TRANSRAP05\inscricoes-corrida`

---

## O que VOCÊ precisa fazer (passo a passo)

### 1) Rodar o site no PC (já pode)

```powershell
cd C:\Users\TRANSRAP05\inscricoes-corrida
npm run dev
```

Abra: http://localhost:3000  

Sem Supabase ainda, a home mostra o aviso de configuração — isso é normal.

---

### 2) Criar conta Supabase (grátis) — ~5 min

1. Acesse https://supabase.com e crie conta  
2. **New project** → escolha nome, senha do banco, região (ex.: South America)  
3. Espere o projeto ficar **Ready**  
4. Menu **SQL Editor** → New query  
5. Cole o conteúdo do arquivo `supabase/schema.sql` → **Run**  
   (cria tabelas, evento exemplo e bucket de fotos `event-photos`)  
6. Menu **Project Settings → API**  
   - copie **Project URL**  
   - copie **anon public**  
   - copie **service_role** (secreto — só no servidor)

---

### 3) Arquivo de ambiente

Na pasta do projeto:

```powershell
copy .env.example .env.local
```

Edite `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=uma-senha-forte-para-seu-amigo
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Reinicie:

```powershell
npm run dev
```

**Não precisa editar o banco na mão.** Use o painel admin (passo 4).

---

### 4) Painel do organizador (fácil)

1. http://localhost:3000/admin — senha do `ADMIN_PASSWORD`  
2. Aba **1. Dados da corrida** — nome, data, vagas, preço, categorias, regulamento → **Salvar**  
3. Aba **2. Fotos** — enviar imagens (a 1ª vira capa; dá para trocar capa/remover)  
4. Aba **3. Inscritos** — buscar, marcar paga, Excel  

O site público (http://localhost:3000) atualiza sozinho.

Sem Mercado Pago, a inscrição fica **pendente** e o admin confirma manualmente (Pix por fora, se quiser).

---

### 5) Mercado Pago (quando quiser pagamento online)

1. Conta em https://www.mercadopago.com.br  
2. https://www.mercadopago.com.br/developers/panel/app → criar aplicação  
3. Copiar **Access Token** (comece com o de **teste**)  
4. No `.env.local`:

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-...
```

5. Depois do deploy na Vercel, use token de **produção** e:

```env
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

Webhook automático: `https://seu-app.vercel.app/api/webhook/mercadopago`

---

### 6) Publicar grátis na Vercel

1. Conta em https://vercel.com (login com GitHub)  
2. Suba o projeto no GitHub **ou** use Vercel CLI  
3. Em **Settings → Environment Variables**, cole as mesmas do `.env.local`  
4. Deploy → link público tipo `https://inscricoes-corrida.vercel.app`  
5. **Não precisa de domínio** no começo

---

## O que já está pronto no código

| Tela / API | Função |
|------------|--------|
| `/` | Página da corrida + vagas |
| `/inscrever` | Formulário |
| `/confirmacao` | Após inscrição/pagamento |
| `/admin` | Lista, busca, status, Excel |
| `POST /api/inscricoes` | Criar inscrição |
| `POST /api/pagamento` | Preferência Mercado Pago |
| `POST /api/webhook/mercadopago` | Confirma pagamento |

---

## Checklist rápido

- [ ] `npm run dev` ok  
- [ ] Projeto Supabase criado  
- [ ] `schema.sql` executado  
- [ ] `.env.local` preenchido  
- [ ] Evento editado na tabela `events`  
- [ ] Teste de inscrição + admin  
- [ ] (Opcional) Mercado Pago  
- [ ] (Opcional) Deploy Vercel  

---

## Suporte rápido

| Problema | Solução |
|----------|---------|
| “Supabase ainda não configurado” | Falta `.env.local` ou reiniciar o `npm run dev` |
| “Nenhum evento” | Rodar `schema.sql` ou inserir linha em `events` |
| Admin “Não autorizado” | `ADMIN_PASSWORD` igual ao digitado |
| Pagamento 503 | Normal sem `MERCADOPAGO_ACCESS_TOKEN` — use marcar paga no admin |

Quando tiver o Supabase pronto, avise — eu te ajudo a validar as chaves e o primeiro deploy.
