#  API MVP - Gerenciamento de Pedidos

Uma API RESTful desenvolvida em Node.js e Express como um Produto Mínimo Viável (MVP) para o cadastro, listagem, atualização e remoção de pedidos de clientes, seguindo rigorosamente as Regras de Negócio e Histórias de Usuário (US01 a US05).

##  Tecnologias Utilizadas
* **Node.js**
* **Express.js** (Framework web)

##  Regras do projeto:

US01 – Inclusão de um novo pedido
Como um colaborador:
Eu quero incluir um novo pedido para que o sistema mantenha os pedidos registrados no sistema

Regras de Negócio:
[R01] O CPF do cliente é obrigatório.
[R02] O CPF deve ser numérico e possuir 9 algarismos.
[R03] O nome do cliente é obrigatório.
[R04] O nome do cliente deve ter pelo menos 5 caracteres.
[R05] O nome do produto é obrigatório.
[R06] O nome do produto deve ter pelo menos 5 caracteres.
[R07] O preço do produto é obrigatório.
[R08] O preço do produto deve ser um número positivo.
[R09] O pedido deve ter preenchido automaticamente o código, a dataHora (atual) e a situação como “aberto”.

US02 – Listagem de pedidos
Como um colaborador
Eu quero visualizar a lista de pedidos realizados para apoiar consultas operacionais

Regras de Negócio:
[R01] A listagem deve retornar os pedidos cadastrados de acordo com o seguinte critério de filtragem (opcional): - situação
[R02] Caso especificada a situação, deve permitir somente os valores “aberto”,  “pago” e “finalizado”
[R03] A listagem deve exibir todos os pedidos, onde cada pedido deve mostrar:
- codigo
- dataHora
- clienteNome
- produtoNome
- situacao
- valor total (produtoPreco)

US03 – Consulta de um pedido
Como um colaborador eu quero consultar os dados completos de um pedido para validar informações em consultas operacionais

Regras de Negócio:
[R01] O código do pedido é obrigatório
[R02] O código do pedido deve ser um número
[R03] A consulta deve exibir as seguintes informações:
- codigo
- dataHora
- clienteCPF
- clienteNome
- produtoNome
- situacao
- valor total (produtoPreco)

US04 –Atualizar a situação de um pedido
Como um colaborador eu quero atualizar um pedido para manter a situação correta de cada pedido

Regras de Negócio:
[R01] O código do pedido  é obrigatório
[R02] O código do pedido deve ser um número
[R03] A situação do pedido é obrigatória
[R04] A situação só permite os valores “aberto”,  “pago” e “finalizado”

US05 –Deletar um pedido
Como um colaborador eu quero remover um pedido para permitir a remoção de pedidos inconsistentes

Regras de Negócio:
[R01] O código do pedido é obrigatório
[R02] O código do pedido deve ser um número

