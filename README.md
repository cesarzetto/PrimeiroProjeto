# Minhas Tarefas (To-Do List)

Aplicativo web responsivo de lista de tarefas desenvolvido com HTML5, CSS3 e JavaScript puro.

## Funcionalidades

- **Adicionar tarefas**: Crie tarefas rapidamente com salvamento automático no navegador (`localStorage`).
- **Concluir tarefas**: Marque ou desmarque tarefas concluídas e filtre entre *Todas*, *Pendentes* e *Concluídas*.
- **Lixeira inteligente**:
  - Envie tarefas para a lixeira sem perdê-las imediatamente.
  - Restaure tarefas da lixeira de volta como **tarefas ativas**.
  - Exclua tarefas definitivamente (individualmente ou esvaziando a lixeira).
- **Modo Escuro Inteligente (Dark Mode)**:
  - Botão no cabeçalho com 3 modos: **Automático** (segue a preferência do sistema operacional do celular/PC), **Escuro** forçado e **Claro** forçado.
  - Lembra a preferência do usuário e atualiza a cor da barra de status do navegador no celular.
- **Design Responsivo**: Adaptado para PC, tablets e smartphones.

## Estrutura do Projeto

- `index.html`: Estrutura da aplicação.
- `style.css`: Estilização moderna e responsiva.
- `script.js`: Lógica de estado, filtros, lixeira e persistência local.
