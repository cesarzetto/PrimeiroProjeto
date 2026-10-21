# MyTask (Lista de Tarefas)

Aplicativo web e Android (**APK**) responsivo de lista de tarefas desenvolvido com HTML5, CSS3, JavaScript e **Capacitor**.

## Funcionalidades

- **Adicionar tarefas**: Crie tarefas rapidamente com salvamento automático duplo (`localStorage` + memória nativa do Android `SharedPreferences`).
- **Concluir tarefas**:
  - Marque ou desmarque tarefas concluídas e filtre entre *Todas*, *Pendentes* e *Concluídas*.
  - Exibe data e hora de criação no lado esquerdo e data e hora de conclusão no lado direito do card.
  - Bloqueio de exclusão: tarefas concluídas são preservadas no histórico e não podem ser excluídas nem enviadas para a lixeira.
- **Lixeira inteligente**:
  - Envie tarefas pendentes para a lixeira sem perdê-las imediatamente.
  - Restaure tarefas da lixeira de volta como **tarefas ativas**.
  - Exclua tarefas definitivamente (individualmente ou esvaziando a lixeira).
- **Backup Simples (`.json`)**:
  - **Exportar**: Baixe ou compartilhe todas as suas tarefas em um arquivo `.json` leve.
  - **Importar**: Restaure ou mescle suas tarefas a partir de qualquer arquivo de backup `.json`.
- **Modo Escuro Inteligente (Dark Mode)**:
  - Botão no cabeçalho com 3 modos: **Automático** (segue a preferência do sistema operacional do celular/PC), **Escuro** forçado e **Claro** forçado.
- **Design Responsivo e APK Android**: Adaptado para PC, tablets e smartphones, com compilação automatizada de APK via GitHub Actions.
