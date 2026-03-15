# Life RPG — Manual de Uso

## Como Abrir

```bash
cd life-rpg
npm run dev
```

Acesse `http://localhost:5173/` no navegador.

---

## Estrutura do Dashboard

### 1. Player Core (topo)
Mostra seu **Level**, **XP total**, **Skill Points** disponíveis e a barra de progresso até o próximo level.

### 2. Quest Board — Daily Missions (coluna esquerda)
Quests diárias que resetam todo dia automaticamente. Cada quest tem:
- **Categoria**: Health, Money, Networking, Learning, Discipline
- **Dificuldade**: Easy (+10 XP), Medium (+25 XP), Hard (+45 XP)
- **Cooldown**: Easy = 1d, Medium = 2d, Hard = 3d (após completar, precisa esperar)

### 3. Weekly Missions (coluna esquerda)
Missões semanais que resetam toda segunda-feira. Sistema chave para engajamento semanal:
- Adicione missões concretas e mensuráveis para a semana
- Cada missão dá XP baseado na dificuldade
- Completar TODAS as missões da semana = **+50 XP bonus**
- **Weekly Check-in**: clique 1x por semana para ganhar **+30 XP** (incentivo para abrir o dashboard)

### 4. Epic Quests (coluna direita)
Metas de longo prazo divididas em **milestones** (etapas):
- Cada milestone completado = **+60 XP**
- Barra de progresso visual mostrando % de conclusão
- Deadline opcional para controle de prazo
- Ideal para metas trimestrais/semestrais

### 5. Character Panel (coluna direita)
Seu avatar, classe, streak de dias ativos e badges.

### 6. Skill Tree (coluna direita)
Gaste Skill Points (ganhos ao subir de level) para desbloquear habilidades.
- **2 Skill Points** por level up
- 5 categorias com 5 nodes cada

### 7. Wealth Engine (coluna esquerda)
Acompanhe sua renda mensal e veja seu Wealth Level progredir.

### 8. System Pulse (coluna direita)
Resumo do estado atual: quests ativas e XP total.

---

## Como Jogar — Estrategia Recomendada

### Rotina Semanal (toda segunda-feira)
1. Abra o dashboard e clique em **Weekly Check-in** (+30 XP)
2. Revise suas **Epic Quests** — algum milestone foi atingido? Marque como completo
3. Adicione **Weekly Missions** para a semana com base nas suas epic quests
4. Ao longo da semana, complete as daily quests e weekly missions

### Montando suas Epic Quests
Quebre cada meta grande em 3-6 milestones mensuráveis:

**Exemplo: "Aumentar renda 50% no Q2"**
- Milestone 1: Fazer 3 propostas para novos clientes
- Milestone 2: Fechar 1 novo contrato
- Milestone 3: Atingir +25% de renda
- Milestone 4: Atingir +50% de renda

**Exemplo: "Queimar 5kg"**
- Milestone 1: Perder 1kg
- Milestone 2: Perder 2.5kg
- Milestone 3: Atingir meta de 5kg

**Exemplo: "Reach CLB 5 French"**
- Milestone 1: Completar modulo A1
- Milestone 2: Conseguir manter conversa basica
- Milestone 3: Passar no teste CLB 5

**Exemplo: "Faixa Amarela"**
- Milestone 1: Completar 1 mes de treinos consistentes
- Milestone 2: Dominar as tecnicas basicas do exame
- Milestone 3: Passar no exame de faixa

### Weekly Missions — Ideias por Categoria

**Health:**
- 4 sessoes de academia esta semana
- Treinar artes marciais 3x
- Comer dentro do deficit calorico 5/7 dias
- Dormir 7h+ por 5 noites

**Money:**
- Enviar 3 propostas para clientes
- Estudar investimentos por 2h
- Revisar budget mensal
- Fazer 1 reuniao de networking

**Learning:**
- Estudar frances 30min/dia por 5 dias
- Completar 1 capitulo do curso
- Ler 50 paginas de um livro tecnico
- Praticar conversacao 2x

**Discipline:**
- Acordar antes das 7h todos os dias
- Zero redes sociais antes do meio-dia
- Meditar 10min/dia
- Planejar o dia seguinte toda noite

### Dicas de XP

| Acao | XP |
|------|-----|
| Quest Easy | +10 |
| Quest Medium | +25 |
| Quest Hard | +45 |
| Milestone (Epic Quest) | +60 |
| Weekly Check-in | +30 |
| Todas Weekly Missions completas | +50 bonus |

### Progressao de Level
- Level 1 -> 2: 400 XP
- Level 2 -> 3: 500 XP
- Level 3 -> 4: 700 XP
- Cada level up = +2 Skill Points

### Mantendo o Engajamento
1. **Nao coloque mais de 5-7 weekly missions** — manter realista
2. **Varie as categorias** — nao foque so em uma area da vida
3. **Atualize milestones das epic quests** toda semana ou quinzena
4. **Use a dificuldade certa** — Hard para coisas que realmente exigem esforco
5. **Mantenha o streak** — complete pelo menos 1 quest por dia

---

## Dados

Tudo fica salvo no **localStorage** do navegador (chave `lifeRpg.*`).
- Dados sao especificos do navegador
- Limpar cache/dados do site apaga o progresso
- Modo anonimo nao salva entre sessoes

### Reverter para versao anterior
Se precisar voltar para a versao original (sem Epic Quests e Weekly Missions):
```bash
git checkout v1.0-base -- life-rpg/src
```

---

## Deploy (GitHub Pages)
```bash
cd life-rpg
npm run build
cd ..
git add -A
git commit -m "deploy"
git push
```
