# Plano do Protótipo: Marca Férias

## Objetivo

Criar um protótipo visual e interativo, em português do Brasil, para ajudar trabalhadores em São Paulo a planejar férias, folgas mensais pagas e folgas livres pagas. O foco é substituir a experimentação manual em planilhas por uma experiência de calendário, permitindo montar, salvar e comparar cenários de afastamento contínuo do trabalho.

Este não é um sistema de produção. A primeira versão deve priorizar clareza visual, regras configuráveis, comparação de cenários e validação das contas principais.

O público-alvo não é formado por trabalhadores CLT. Portanto, o protótipo não deve orientar a experiência por regras trabalhistas da CLT. Quando necessário, regras específicas devem ser tratadas como políticas configuráveis de contrato, empresa ou pessoa.

## Decisões de Produto

### 1. Contagem de férias

No protótipo, férias serão contadas em dias úteis elegíveis.

Finais de semana e feriados não consomem dias de férias, mas entram no cálculo do período total contínuo de afastamento. Essa decisão reflete o modelo mental da planilha: o usuário quer "gastar" dias úteis para maximizar dias corridos fora do trabalho.

Observação para a interface: mostrar uma etiqueta fixa no painel de regras: "Férias consomem apenas dias úteis".

### 2. Início das férias

O início das férias só poderá ser escolhido em um dia útil elegível.

Se o usuário clicar em sábado, domingo ou feriado, o protótipo deve mostrar uma mensagem curta: "Escolha um dia útil para iniciar as férias." Como melhoria futura, pode sugerir automaticamente o próximo dia útil.

### 3. Uso de folgas mensais

Folgas mensais poderão ser usadas antes, durante ou depois das férias, desde que sejam aplicadas a dias úteis elegíveis.

Por padrão, será permitido usar folga mensal no mesmo mês em que há férias. O limite é mensal: se a configuração for 1 folga mensal por mês, o cenário poderá usar no máximo 1 dia daquele mês.

### 4. Uso de folgas livres

Folgas livres poderão ser posicionadas antes ou depois das férias para estender o período contínuo, ou em outros pontos do ano para testar cenários. Cada folga livre consome uma unidade do saldo anual.

### 5. Feriados e dias não úteis

Para o protótipo, os feriados devem ser armazenados como dados editáveis do calendário, carregados a partir de uma lista local por ano e localidade. A localidade padrão será "São Paulo, SP".

Além da lista base, o usuário poderá adicionar, remover ou editar feriados e dias não úteis. Isso cobre recessos da empresa, emendas, pontos facultativos observados na prática e regras particulares de contrato.

A versão de produção pode importar feriados de uma API ou serviço oficial, mas o protótipo deve manter os dados localmente para evitar dependência externa e facilitar testes visuais.

### 6. Finais de semana configuráveis

O protótipo deve assumir sábado e domingo como dias de descanso por padrão, mas o modelo deve permitir configurar quais dias da semana são considerados descanso. Isso permite evoluir para contratos com sábado útil, escala especial ou semanas alternativas.

### 7. Sugestões automáticas

A primeira versão deve incluir uma sugestão simples de melhores datas de início. O algoritmo pode testar todos os dias úteis elegíveis do ano, mantendo as folgas já posicionadas, e ordenar os resultados pelo maior afastamento contínuo.

Isso não substitui a edição manual. A sugestão serve como ponto de partida para o usuário refinar o cenário no calendário.

## Experiência Principal

### Tela principal

A tela principal deve ser um espaço de trabalho de calendário, não um formulário.

Estrutura sugerida:

- Barra superior com ano, localidade e ações do cenário.
- Coluna lateral esquerda com configurações e saldos.
- Área central com calendário anual dividido por meses.
- Painel lateral direito com resumo do cenário atual.
- Faixa inferior ou aba secundária com cenários salvos para comparação.

Textos principais em PT-BR:

- "Ano"
- "Localidade"
- "Dias de férias"
- "Folgas mensais"
- "Folgas livres"
- "Dias de descanso"
- "Início das férias"
- "Período oficial"
- "Afastamento total"
- "Salvar cenário"
- "Duplicar cenário"
- "Comparar cenários"
- "Sugestões de melhores inícios"
- "Editar feriados"

### Calendário anual

O calendário deve mostrar os 12 meses em grade responsiva. Em desktop, usar 3 ou 4 colunas de meses. Em telas menores, usar 1 ou 2 colunas.

Cada dia deve ter:

- Número do dia.
- Estado visual principal.
- Indicador pequeno quando houver sobreposição relevante, como feriado dentro de um período de afastamento.
- Tooltip ou painel de detalhe ao passar o mouse/clicar.

Estados visuais:

- Dia útil comum.
- Dia de descanso.
- Feriado ou dia não útil.
- Férias.
- Folga mensal.
- Folga livre.
- Dia de ponte ou afastamento contínuo por contexto.
- Dia inválido para seleção.

O calendário deve destacar o intervalo total contínuo de afastamento com uma borda ou fundo suave que una os dias, diferenciando-o dos tipos de dia consumidos.

Quando o usuário abrir "Sugestões de melhores inícios", o protótipo pode mostrar uma lista lateral com as melhores datas. Um mapa de calor no calendário é opcional e deve ficar para polimento se houver tempo.

### Modelo de interação

1. O usuário ajusta ano, localidade, dias de descanso e quantidades de dias.
2. O calendário carrega dias de descanso, feriados e dias não úteis.
3. O usuário clica em um dia útil para definir o início das férias.
4. O sistema preenche automaticamente os dias úteis de férias até consumir o saldo configurado.
5. O usuário ativa o modo "Folga mensal" ou "Folga livre".
6. Ao clicar em um dia útil, o sistema adiciona ou remove a folga daquele tipo.
7. O painel de cenário recalcula o período total contínuo.
8. O usuário pode abrir sugestões de melhores inícios e aplicar uma delas ao cenário atual.
9. O usuário salva o cenário.
10. O usuário duplica um cenário salvo para testar outra data ou outro posicionamento de folgas.
11. A comparação mostra qual cenário gera mais dias corridos fora, qual usa menos folgas e quais datas estão envolvidas.

Controles recomendados:

- Controle segmentado para modo de edição: "Férias", "Folga mensal", "Folga livre".
- Botões com ícones e rótulos curtos para salvar, duplicar e limpar.
- Tooltip por dia com tipo, data completa e impacto no cenário.
- Contadores persistentes para saldo usado/restante.
- Editor simples de feriados e dias não úteis.

## Painel do Cenário

O painel do cenário atual deve mostrar:

- Nome do cenário, editável.
- Data de início das férias.
- Data de fim das férias.
- Dias de férias consumidos.
- Folgas mensais usadas por mês.
- Folgas livres usadas e restantes.
- Feriados incluídos no afastamento.
- Dias de descanso incluídos.
- Início do afastamento total.
- Fim do afastamento total.
- Total de dias corridos fora do trabalho.
- Maior afastamento contínuo encontrado no ano.
- Avisos e validações.
- Observações livres do cenário.

Exemplo de resumo:

```text
Cenário A (valores calculados em tempo real)
Férias: <início> a <fim>
Dias de férias usados: <n> de <total configurado>
Afastamento total: <início do afastamento> a <fim do afastamento>
Total fora do trabalho: <dias corridos>
Folgas mensais usadas: <meses>
Folgas livres usadas: <usadas> de <total>
```

Nenhum total deve ser escrito à mão no protótipo. O sistema deve sempre calcular datas e totais a partir do calendário real do ano, da localidade, dos dias de descanso configurados e das edições feitas pelo usuário.

## Comparação de Cenários

A comparação deve permitir salvar múltiplas opções e avaliar lado a lado.

Campos da tabela:

- Nome.
- Início das férias.
- Fim das férias.
- Início do afastamento total.
- Fim do afastamento total.
- Total de dias fora.
- Dias de férias usados.
- Folgas mensais usadas.
- Folgas livres usadas.
- Folgas não usadas.
- Feriados incluídos.
- Dias de descanso incluídos.
- Observações.

A tabela deve ordenar por "Total de dias fora" por padrão, do maior para o menor. Em caso de empate, mostrar primeiro o cenário que usa menos folgas extras.

Ações por cenário:

- Duplicar.
- Tornar atual.
- Renomear.
- Excluir.

## Modelo de Dados

### Configuração

```ts
type PlanningConfig = {
  year: number;
  location: {
    country: "BR";
    state: "SP";
    city: "São Paulo";
  };
  vacationDays: number;
  monthlyPaidLeaves: number;
  freePaidLeaves: number;
  carryMonthlyLeaves: false;
  weekendDays: number[]; // 0 domingo, 6 sábado. Padrão: [0, 6].
};
```

### Dia do calendário

```ts
type CalendarDay = {
  date: string; // YYYY-MM-DD
  year: number;
  month: number;
  day: number;
  weekday: number; // 0 domingo, 6 sábado
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isEligibleWorkday: boolean;
};
```

### Feriado ou dia não útil

```ts
type Holiday = {
  date: string; // YYYY-MM-DD
  name: string;
  scope: "nacional" | "estadual" | "municipal" | "personalizado";
};

type HolidayOverrides = {
  added: Holiday[];
  removedDates: string[];
};
```

### Cenário

```ts
type Scenario = {
  id: string;
  name: string;
  config: PlanningConfig;
  vacationStartDate?: string;
  vacationDates: string[];
  monthlyLeaveDates: string[];
  freeLeaveDates: string[];
  holidayOverrides?: HolidayOverrides;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Resultado calculado

```ts
type ScenarioTotals = {
  officialVacationStart?: string;
  officialVacationEnd?: string;
  vacationDaysUsed: number;
  monthlyLeavesUsed: number;
  monthlyLeavesByMonth: Record<string, number>; // chave YYYY-MM
  freeLeavesUsed: number;
  freeLeavesRemaining: number;
  holidaysIncluded: string[];
  weekendsIncluded: string[];
  totalBreakStart?: string;
  totalBreakEnd?: string;
  totalContinuousDaysAway: number;
  longestBreakStart?: string;
  longestBreakEnd?: string;
  longestContinuousDaysAway: number;
  unusedMonthlyLeaves: Record<string, number>; // chave YYYY-MM
  warnings: string[];
};
```

## Lógica de Cálculo

### Preencher férias

Entrada:

- Data de início.
- Quantidade de dias de férias.
- Calendário do ano.

Algoritmo:

1. Validar se a data de início é dia útil elegível.
2. Percorrer os dias a partir da data de início.
3. Se o dia for útil elegível, adicionar a `vacationDates`.
4. Ignorar dias de descanso, feriados e dias não úteis para consumo de saldo.
5. Continuar até consumir todos os dias de férias configurados.
6. Permitir que o fim avance para o ano seguinte se necessário, mas mostrar aviso no protótipo se isso acontecer.

### Validar folga mensal

Uma folga mensal só pode ser aplicada se:

- A data for dia útil elegível.
- A data não estiver em férias.
- O mês ainda tiver saldo disponível.
- A data não tiver folga livre.

Quando o usuário tenta exceder o limite mensal, mostrar: "Limite de folgas mensais atingido para este mês."

### Validar folga livre

Uma folga livre só pode ser aplicada se:

- A data for dia útil elegível.
- A data não estiver em férias.
- A data não tiver folga mensal.
- Ainda existir saldo anual de folgas livres.

Quando o usuário tenta exceder o limite anual, mostrar: "Você já usou todas as folgas livres."

### Calcular afastamento contínuo

Um dia conta como "fora do trabalho" quando:

- É dia de descanso conforme `config.weekendDays`.
- É feriado ou dia não útil.
- Está em férias.
- Está marcado como folga mensal.
- Está marcado como folga livre.

Algoritmo:

1. Criar um conjunto com todas as datas fora do trabalho no ano.
2. Agrupar essas datas em sequências contínuas de dias corridos sem interrupção por dia trabalhado.
3. Calcular o afastamento principal:
   - Se houver férias selecionadas, usar a sequência contínua que contém as datas de férias.
   - Se não houver férias selecionadas, usar a maior sequência contínua formada por dias de descanso, feriados e folgas.
4. Calcular também a maior sequência contínua do ano, independentemente de conter férias.
5. Contar todos os dias corridos entre início e fim de cada sequência relevante.
6. Listar feriados e dias de descanso incluídos dentro do intervalo principal.

Se não houver férias selecionadas, o painel ainda deve sugerir "Escolha uma data de início das férias", mas pode mostrar o afastamento já construído com folgas e feriados.

### Sugerir melhores inícios

Algoritmo:

1. Para cada dia útil elegível do ano:
   - Simular férias começando nessa data com o saldo configurado.
   - Manter as folgas mensais e livres já posicionadas no cenário.
   - Calcular o afastamento contínuo resultante.
2. Ordenar por total de afastamento, do maior para o menor.
3. Em caso de empate, priorizar o cenário que usa menos folgas extras.
4. Exibir os melhores resultados como lista clicável.
5. Ao clicar em uma sugestão, aplicar aquela data de início ao cenário atual e recalcular o calendário.

## Validações e Casos de Borda

- Não permitir início de férias em dia de descanso, feriado ou dia não útil.
- Não permitir folga mensal ou livre em dia de descanso, feriado ou dia não útil.
- Não permitir folga mensal ou livre em dia já ocupado por férias.
- Não permitir dois tipos de folga no mesmo dia.
- Avisar se o período de férias atravessar o ano.
- Avisar se o cenário não usar todas as férias configuradas por falta de calendário carregado.
- Mostrar meses sem uso de folga mensal, mas não tratar como erro.
- Recalcular tudo quando o ano, localidade, dias de descanso ou feriados mudarem.
- Ao mudar o ano, limpar ou migrar cenários apenas após confirmação.
- Ao editar/remover um feriado que já fazia parte de um afastamento salvo, recalcular e destacar cenários cujo total mudou.
- Preservar cenários salvos localmente no navegador durante o protótipo.

## Design Visual

O visual deve ser sóbrio, claro e eficiente para leitura repetida.

Paleta sugerida:

- Dia útil comum: fundo branco, borda cinza clara.
- Dia de descanso: cinza frio claro.
- Feriado ou dia não útil: amarelo suave com texto marrom escuro.
- Férias: azul forte com texto branco.
- Folga mensal: verde médio com texto branco.
- Folga livre: roxo moderado com texto branco.
- Afastamento contínuo: contorno ou fundo azul muito claro.
- Erro ou inválido: vermelho suave.

Cuidados de acessibilidade:

- Não depender apenas de cor; usar abreviações pequenas como "F", "M", "L" ou ícones.
- Garantir contraste suficiente.
- Oferecer tooltip com descrição textual.
- Usar foco visível para navegação por teclado.

## Dados de Feriados de São Paulo

Lista base para a localidade padrão "São Paulo, SP" combinando feriados nacionais, estaduais e municipais. Feriados móveis, como Carnaval, Sexta-feira Santa e Corpus Christi, devem ser calculados a partir da Páscoa do ano.

Exemplo de dados esperados:

```ts
type HolidayProvider = {
  fixedHolidays: Holiday[];
  getMovableHolidays: (year: number) => Holiday[];
};
```

Os dados do protótipo devem ser verificados antes de qualquer uso de produção. Pontos facultativos ou recessos devem poder ser ativados, desativados ou adicionados pelo usuário.

## Arquitetura Recomendada do Protótipo

Para um protótipo rápido e fácil de evoluir:

- Vite + React + TypeScript.
- Estado local no navegador.
- Dados de feriados em JSON, com feriados móveis calculados por ano.
- Sem backend na primeira versão.
- Persistência em `localStorage`.
- Testes unitários com Vitest para regras de calendário e cálculo de totais.

Módulos sugeridos:

```text
src/
  data/
    holidays.br-sp-sao-paulo.json
  domain/
    calendar.ts
    holidays.ts
    scenarios.ts
    totals.ts
    optimizer.ts
    validation.ts
  components/
    YearCalendar.tsx
    MonthGrid.tsx
    DayCell.tsx
    ConfigPanel.tsx
    ScenarioPanel.tsx
    ScenarioComparison.tsx
    HolidayEditor.tsx
    SuggestionsPanel.tsx
  App.tsx
```

## Plano de Desenvolvimento

### Etapa 1: Fundação visual

- Criar app estático com Vite + React + TypeScript.
- Criar layout com calendário anual, painel de configuração e painel de cenário.
- Renderizar os 12 meses do ano selecionado.
- Marcar dias de descanso.
- Carregar feriados locais de São Paulo a partir de JSON e calcular feriados móveis.

Critério de pronto: o usuário vê um calendário anual navegável, em português, com dias de descanso e feriados diferenciados.

### Etapa 2: Férias

- Adicionar campos de configuração.
- Permitir selecionar início das férias.
- Implementar preenchimento automático de dias úteis.
- Mostrar início e fim das férias.
- Mostrar contador de dias usados.

Critério de pronto: clicar em um dia útil preenche férias corretamente e recalcula o painel.

### Etapa 3: Folgas

- Adicionar modo de edição para folga mensal e folga livre.
- Validar limites mensais e anuais.
- Mostrar saldos restantes.
- Permitir remover folgas clicando novamente no dia.

Critério de pronto: o usuário consegue posicionar folgas para aumentar ou testar o afastamento contínuo.

### Etapa 4: Cálculo de afastamento contínuo

- Implementar cálculo do intervalo total fora do trabalho.
- Implementar a maior sequência contínua do ano e o caso "sem férias".
- Incluir dias de descanso, feriados e dias não úteis.
- Mostrar lista de feriados e contagem de dias de descanso incluídos.
- Destacar visualmente o intervalo total no calendário.

Critério de pronto: o painel responde claramente à pergunta "quantos dias corridos eu fico fora?".

### Etapa 5: Cenários salvos

- Permitir salvar cenário atual.
- Permitir duplicar, renomear, excluir e reabrir cenário.
- Criar tabela de comparação.
- Ordenar por maior total de dias fora.

Critério de pronto: o usuário consegue comparar pelo menos três opções lado a lado.

### Etapa 6: Feriados editáveis

- Implementar editor de feriados e dias não úteis.
- Persistir `holidayOverrides` por cenário ou por ano/localidade.
- Recalcular cenários afetados quando feriados mudam.

Critério de pronto: o usuário consegue ajustar o calendário real da sua empresa/contrato e ver o impacto nos totais.

### Etapa 7: Sugestões de melhores inícios

- Implementar `optimizer.ts` com força bruta sobre dias úteis.
- Criar painel de sugestões com os melhores inícios, clicáveis.
- Aplicar uma sugestão ao cenário atual e recalcular.

Critério de pronto: com um clique, o usuário vê quais datas de início maximizam o afastamento.

### Etapa 8: Polimento do protótipo

- Ajustar responsividade.
- Adicionar tooltips e estados de erro.
- Revisar textos em português.
- Adicionar dados de exemplo inspirados no caso de outubro/novembro.
- Criar testes unitários para as regras principais.

Critério de pronto: o protótipo demonstra o fluxo completo sem depender de explicação externa.

## Exemplo de Cenário para Demonstração

Configuração:

- Ano: escolhido pelo usuário.
- Localidade: São Paulo, SP.
- Dias de férias: 20.
- Folgas mensais: 1 por mês.
- Folgas livres: 2 por ano.

Roteiro:

1. Aplicar uma folga mensal de outubro em um dia útil próximo ao início pretendido.
2. Selecionar o início das férias em um dia útil de outubro.
3. Aplicar folgas livres em dias úteis logo após o fim das férias, para emendar com dias de descanso ou feriados.
4. Aplicar uma folga mensal de novembro em um dia útil que estenda o período.
5. Observar o total contínuo calculado e ajustar conforme as datas reais do ano escolhido.

Nota: o exemplo do prompt deve ser tratado como referência de comportamento, não como fixture fixa. O protótipo deve recalcular conforme o calendário real do ano selecionado.

Para teste unitário, criar fixtures pequenas e explícitas com datas artificiais ou anos reais verificados. O objetivo é travar a lógica de sequência contínua, não forçar um resultado manual em um calendário incompatível.

## Funcionalidades Futuras

- Simulação automática de posicionamento ótimo de folgas junto com o início das férias.
- Múltiplos blocos de férias ou afastamento no mesmo ano.
- Regras customizadas por contrato ou empresa.
- Importação de feriados por API.
- Exportação para PDF.
- Exportação para calendário `.ics`.
- Compartilhamento de cenário por link.
- Mapa de calor no calendário para visualizar melhores janelas.

## Métrica de Sucesso do Protótipo

O protótipo será bem-sucedido se uma pessoa conseguir responder rapidamente:

- Quando começam e terminam minhas férias?
- Quantos dias corridos eu fico fora do trabalho?
- Quais feriados e dias de descanso aumentam esse período?
- Onde minhas folgas mensais e livres têm maior impacto?
- Qual dos cenários salvos é o melhor para mim?
- Existe uma data de início melhor do que a que escolhi?
