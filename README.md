# Slime Wallet - Carteira Web3 (ETH/BSC)

[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/seu-usuario/slime-wallet/blob/main/LICENSE)

**Slime Wallet** é uma carteira Web3 simplificada, projetada para interagir com a rede Ethereum e a Binance Smart Chain (BSC). Ela permite que você conecte sua carteira MetaMask, crie uma nova carteira, visualize seu saldo em BNB, adicione tokens BEP-20, envie BNB e tokens e veja o histórico de transações.

## Recursos

*   **Conexão com MetaMask:** Conecte sua carteira MetaMask existente.
*   **Criação de Nova Carteira:** Gere uma nova carteira Ethereum/BSC.
*   **Visualização de Saldo BNB:** Veja o saldo da sua carteira em BNB.
*   **Adicionar Tokens BEP-20:** Adicione tokens da rede BSC (BEP-20) pelo endereço do contrato.
*   **Lista de Tokens Persistente:** Os tokens adicionados são armazenados localmente e permanecem mesmo após a atualização da página.
*   **Enviar BNB:** Envie BNB para outros endereços.
*   **Enviar Tokens BEP-20:** Envie tokens BEP-20 adicionados para outros endereços.
*   **Histórico de Transações:** Visualize um histórico das últimas transações da sua carteira na BSC.
*   **Detecção Automática de Rede:** Ao adicionar um novo token, o aplicativo tenta detectar automaticamente a rede a qual o token pertence (BSC Mainnet ou BSC Testnet) e solicita a mudança de rede, se necessário.
* **Interface Ocultavel**: Ao iniciar a aplicação os botões que não são necessarios estão ocultos.

## Tecnologias Utilizadas

*   **HTML5:** Estrutura da página.
*   **CSS3:** Estilização da interface.
*   **JavaScript:** Lógica e interações da aplicação.
*   **Ethers.js (v5):** Biblioteca para interagir com a blockchain Ethereum/BSC.
*   **BscScan API:** Para obter o histórico de transações na rede BSC.
* **Localstorage:** para manter os tokens adicionados mesmo após atualizar a pagina.

## Configuração e Instalação

1.  **Requisitos:**
    *   Navegador com suporte a Web3 (como Chrome ou Firefox com a extensão MetaMask instalada).
    *   Extensão MetaMask instalada e configurada.

2.  **Clonando o Repositório (opcional):**
    *  Este projeto não possui um repositorio por ser um projeto pequeno.

3.  **Abrindo os Arquivos:**
    *   Abra o arquivo `index.html` no seu navegador.

## Como Usar

1.  **Conectar Carteira:**
    *   Clique no botão "Conectar Carteira" para conectar sua carteira MetaMask. Você precisará aprovar a conexão na sua MetaMask.
2.  **Criar Nova Carteira (opcional):**
    *   Clique no botão "Criar Nova Carteira" para gerar uma nova carteira. Anote e guarde a chave privada com segurança.
3. **Mostrar Opções:**
    * clique no botão `Mostrar opções` para exibir os demais botões e formularios.
4.  **Ver Saldo BNB:**
    *   Clique no botão "Ver Saldo BNB" para ver o saldo de BNB da carteira conectada.
5.  **Adicionar Token:**
    *   Insira o endereço do contrato do token BEP-20 no campo "Endereço do Token BEP-20".
    *   Clique no botão "Adicionar Token". O aplicativo vai tentar detectar a rede do token e, se necessário, solicitará que você mude de rede na MetaMask.
6.  **Enviar BNB:**
    *   Preencha o campo "Endereço do destinatário" com o endereço para onde você quer enviar BNB.
    *   Preencha o campo "Quantidade de BNB" com o valor que deseja enviar.
    *   Clique no botão "Confirmar Envio". Você precisará confirmar a transação na sua MetaMask.
7.  **Enviar Token BEP-20:**
    * Selecione o token que você quer enviar na lista de tokens.
    * Preencha o campo `Endereço do destinatário` com o endereço do destinatario.
    * Preencha o campo `Quantidade` com a quantidade de tokens que deseja enviar.
    * Clique no botão `Enviar Token` e confirme a transação na metamask.
8.  **Histórico de Transações:**
    *   Clique no botão "Histórico" para ver as últimas transações da sua carteira na rede BSC.


## Chave da API BscScan

O código utiliza a API da BscScan para buscar o histórico de transações. Você precisa substituir `"SUA CHAVE DE API AQUI"` pela sua própria chave de API REAL no arquivo `script.js`:

```javascript
const BSC_API_KEY = "SUA CHAVE DE API AQUI"; // Substitua pela sua chave REAL da API BscScan


Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

Licença
Este projeto está sob a licença MIT.

Considerações
Este projeto é um exemplo simplificado de carteira Web3.
É importante lembrar que segurança é fundamental ao lidar com criptomoedas. Use sua própria chave privada com muita cautela.
Este projeto foi feito apenas para fins de aprendizado
