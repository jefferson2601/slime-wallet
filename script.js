const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let userWallet;
const tokenContracts = {}; // Guardar os contratos adicionados
const tokenData = {}; // guarda as informações dos tokens adicionados

function loadTokens() {
    const storedTokens = localStorage.getItem('tokenData');
    if (storedTokens) {
        const parsedTokens = JSON.parse(storedTokens);
        for (const symbol in parsedTokens) {
            const tokenInfo = parsedTokens[symbol];
            //adicionado a verificação
            if (tokenInfo.address && tokenInfo.decimals) {
                tokenData[symbol] = {
                    address: tokenInfo.address,
                    decimals: tokenInfo.decimals,
                };
            }
        }
    }
}
function saveTokens() {
    const tokensToSave = {};
    for (const symbol in tokenData) {
        tokensToSave[symbol] = {
            address: tokenData[symbol].address,
            decimals: tokenData[symbol].decimals,
        };
    }
    localStorage.setItem('tokenData', JSON.stringify(tokensToSave));
  }
loadTokens()

document.getElementById("connectWallet").addEventListener("click", async function() {
    if (window.ethereum) {
        try {
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            userWallet = address;
            document.getElementById("accountInfo").innerText = `Conectado: ${address}`;
            document.getElementById("walletActions").classList.remove("hidden");
            //atualiza a lista quando conectar
            updateTokenList();

        } catch (error) {
            console.error("Erro ao conectar:", error);
        }
    } else {
        alert("MetaMask não detectado! Instale e tente novamente.");
    }
});

document.getElementById("createWallet").addEventListener("click", function() {
    const wallet = ethers.Wallet.createRandom();
    userWallet = wallet.address;
    document.getElementById("accountInfo").innerText = `Nova Carteira Criada: ${wallet.address}`;
    document.getElementById("privateKeyInfo").innerText = `Chave Privada (Guarde com segurança!): ${wallet.privateKey}`;
    document.getElementById("privateKeyInfo").classList.remove("hidden");
    document.getElementById("walletActions").classList.remove("hidden");
    updateTokenList();

});

document.getElementById("showOptions").addEventListener("click", function() {
    const allOptions = document.getElementById("allOptions");
    if(allOptions.classList.contains("hidden")){
        allOptions.classList.remove("hidden");
        document.getElementById("showOptions").textContent = "Esconder Opções";
    }else{
        allOptions.classList.add("hidden");
        document.getElementById("showOptions").textContent = "Mostrar Opções";
    }
});

document.getElementById("checkBalance").addEventListener("click", async function() {
    if (!userWallet) return alert("Conecte ou crie uma carteira primeiro!");

    const balance = await provider.getBalance(userWallet);
    const formattedBalance = ethers.utils.formatEther(balance);
    document.getElementById("balanceInfo").innerText = `Saldo: ${formattedBalance} BNB`;
});

document.getElementById("confirmSend").addEventListener("click", async function() {
    const recipient = document.getElementById("recipientAddress").value;
    const amount = document.getElementById("amountBNB").value;

    if (!userWallet || !recipient || !amount) {
        return alert("Preencha todos os campos corretamente!");
    }

    try {
        const signer = provider.getSigner();
        const tx = await signer.sendTransaction({
            to: recipient,
            value: ethers.utils.parseEther(amount)
        });
        
        alert(`Transação enviada! Hash: ${tx.hash}`);
        
        // Limpar os campos do formulário
        document.getElementById("recipientAddress").value = "";
        document.getElementById("amountBNB").value = "";

        // Atualizar o status da transação ou o saldo
        document.getElementById("balanceInfo").innerText = "Saldo atualizado!";
    } catch (error) {
        console.error("Erro ao enviar BNB:", error);
    }
});

async function switchNetwork(chainId, rpcUrl, chainName, currencySymbol, blockExplorerUrl) {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexValue(chainId) }],
        });
        console.log(`Mudou para a rede ${chainName}`);
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: ethers.utils.hexValue(chainId),
                        chainName: chainName,
                        nativeCurrency: {
                            name: currencySymbol,
                            symbol: currencySymbol,
                            decimals: 18
                        },
                        rpcUrls: [rpcUrl],
                        blockExplorerUrls: [blockExplorerUrl]
                    }]
                });
                console.log(`Rede ${chainName} adicionada e selecionada.`);
            } catch (addError) {
                console.error("Erro ao adicionar rede:", addError);
                alert("Erro ao adicionar a rede. Adicione manualmente nas configurações da MetaMask.");
            }
        } else {
            console.error("Erro ao mudar de rede:", switchError);
            alert("Erro ao mudar de rede. Verifique se a MetaMask permite trocas de rede.");
        }
    }
}

async function getBalance(tokenAddress, userAddress) {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();

        console.log(`Conectado à rede ${network.chainId}`);

        // ABI mínima do ERC-20 para consultar saldo
        const abi = ["function balanceOf(address owner) view returns (uint256)"];
        const contract = new ethers.Contract(tokenAddress, abi, signer);
        
        const balance = await contract.balanceOf(userAddress);
        console.log("Saldo do usuário:", balance.toString());

        return balance;
    } catch (error) {
        console.error("Erro ao obter saldo:", error.message);
        alert("Erro ao buscar saldo. Verifique se o token está correto e tente novamente.");
        return 0;
    }
}

async function detectTokenNetwork(tokenAddress) {
    // Simulação de banco de dados de redes conhecidas
    const networks = [
        {
            chainId: 97,
            chainName: "Binance Smart Chain Testnet",
            rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            currencySymbol: "BNB",
            blockExplorerUrl: "https://testnet.bscscan.com"
        },
        {
            chainId: 56,
            chainName: "Binance Smart Chain Mainnet",
            rpcUrl: "https://bsc-dataseed.binance.org/",
            currencySymbol: "BNB",
            blockExplorerUrl: "https://bscscan.com"
        }
    ];

    // Lógica para determinar a rede do token (simulação)
    for (const net of networks) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(net.rpcUrl);
            const abi = ["function totalSupply() view returns (uint256)"];
            const contract = new ethers.Contract(tokenAddress, abi, provider);
            await contract.totalSupply(); // Testa se o contrato responde nesta rede
            console.log(`Token encontrado na rede ${net.chainName}`);
            return net;
        } catch (error) {
            continue; // Se falhar, tenta a próxima rede
        }
    }

    throw new Error("Rede do token desconhecida. Adicione manualmente.");
}
async function addToken() {
    console.log('addToken foi chamado');
    const tokenAddress = document.getElementById('tokenAddress').value.trim();
    console.log('tokenAddress:', tokenAddress);
    const tokenActionsDiv = document.getElementById('tokenActions');

    if (!tokenAddress) {
        alert("Por favor, insira o endereço do token.");
        return;
    }
    if (!window.ethereum) {
        alert("Nenhuma carteira Web3 detectada. Instale MetaMask ou outra carteira.");
        return;
    }

    try {
        console.log("Verificando rede conectada...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        const network = await provider.getNetwork();
        console.log("Rede conectada:", network.name, network.chainId);

        // **Caso o token esteja em outra rede, trocar automaticamente**
        const tokenNetwork = await detectTokenNetwork(tokenAddress);
        if (network.chainId !== tokenNetwork.chainId) {
            console.log(`Token pertence à rede ${tokenNetwork.chainName}. Trocando...`);
            await switchNetwork(tokenNetwork.chainId, tokenNetwork.rpcUrl, tokenNetwork.chainName, tokenNetwork.currencySymbol, tokenNetwork.blockExplorerUrl);

            console.log("Reconectando à nova rede...");
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            signer = newProvider.getSigner();
            console.log("Nova rede conectada com sucesso.");
        }

        // **Criando o contrato do token**
        console.log("Criando contrato...");
        const abi = [
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)",
            "function totalSupply() view returns (uint256)",
            "function balanceOf(address) view returns (uint256)"
        ];
        const contract = new ethers.Contract(tokenAddress, abi, signer);
        console.log("Contrato criado.");

        // **Testando chamada ao contrato**
        console.log("Testando balanceOf()...");
        const balance = await contract.balanceOf(await signer.getAddress());
        console.log("Balance:", balance.toString());

        console.log("Testando decimals()...");
        const decimals = await contract.decimals();
        console.log("Decimals:", decimals);

        console.log("Tentando obter o símbolo");
        const symbol = await contract.symbol();
        console.log(`Símbolo do Token: ${symbol}`);

        // **Verificar se o token já foi adicionado**
        if (tokenContracts[symbol]) {
            alert("Este token já foi adicionado!");
            return;
        }
            tokenData[symbol] = {
            address: tokenAddress,
            decimals: decimals
        };
        saveTokens();

        document.getElementById("tokenAddress").value = "";
        tokenActionsDiv.classList.remove('hidden');
        updateTokenList();
        alert("Token adicionado com sucesso!");



    } catch (error) {
        console.error("Erro ao adicionar token:", error);
        alert("Erro ao adicionar token. Verifique o endereço e tente novamente.\nDetalhes: " + error.message);
    }
}
document.getElementById("addToken").addEventListener("click", addToken);

//funçao que vai atualizar a lista de tokens
async function updateTokenList() {
    const tokenList = document.getElementById("tokenList");
    tokenList.innerHTML = ""; // Limpa a lista existente
    const bnbListItem = document.createElement("li");
    bnbListItem.textContent = `BNB - Saldo: ${await getBnbBalance(userWallet)} BNB`;
    bnbListItem.addEventListener("click", () => selectToken("BNB"));
    tokenList.appendChild(bnbListItem);

    //adicionado
    console.log("TokenData:",tokenData);

    for (const symbol in tokenData) {
         //adicionado
        if (!tokenData[symbol].address) {
            console.error(`Token ${symbol} não tem um endereço válido.`);
            continue; // Pula para o próximo token
        }
        const contract = new ethers.Contract(tokenData[symbol].address, [ "function balanceOf(address) view returns (uint256)"], signer);
        const balance = await getTokenBalance(symbol);
        const listItem = document.createElement("li");
        listItem.textContent = `${symbol} - Saldo: ${balance}`;
        listItem.addEventListener("click", () => selectToken(symbol));
        tokenList.appendChild(listItem);
    }
}


//função para buscar o balance do bnb
async function getBnbBalance(userWallet) {
    if (!userWallet) return "0";

    const balance = await provider.getBalance(userWallet);
    const formattedBalance = ethers.utils.formatEther(balance);
    return formattedBalance;
}
//função para buscar o balance do token
async function getTokenBalance(symbol) {
    if (!userWallet) return "0";
    const contract = new ethers.Contract(tokenData[symbol].address, [ "function balanceOf(address) view returns (uint256)"], signer);
    const decimals = tokenData[symbol].decimals;
    const balance = await contract.balanceOf(userWallet);
    const formattedBalance = ethers.utils.formatUnits(balance, decimals);
    return formattedBalance;
}
//função para selecionar o token da lista
function selectToken(symbol) {
    // Mostra o formulário de envio do token
    document.getElementById("sendTokenSection").classList.remove("hidden");
    document.getElementById("tokenRecipient").value = ""; // Limpa o campo do destinatário
    document.getElementById("tokenAmount").value = "";// Limpa o campo de quantidade
    // Armazena o símbolo do token selecionado para uso posterior
    document.getElementById("selectedToken").value = symbol;
    //altera o nome do botão de enviar
    document.getElementById("sendToken").textContent = `Enviar ${symbol}`;

    //esconde o enviar bnb
    document.getElementById("sendForm").classList.add("hidden");
}


document.getElementById("sendToken").addEventListener("click", async function() {
    if (!signer) return alert("Conecte sua carteira primeiro!");

    const recipient = document.getElementById("tokenRecipient").value;
    const amount = document.getElementById("tokenAmount").value;
    const tokenSymbol = document.getElementById("selectedToken").value;

    if (!recipient || !amount || !tokenSymbol) {
        return alert("Preencha todos os campos corretamente!");
    }

    if (!tokenData[tokenSymbol] || !tokenData[tokenSymbol].address) {
        alert(`Erro ao enviar token: ${tokenSymbol}. Token sem endereço definido.`);
        return;
    }

    try {
        const contract = new ethers.Contract(tokenData[tokenSymbol].address, ["function transfer(address to, uint256 value) external returns (bool)"], signer);
        const decimals = tokenData[tokenSymbol].decimals; 
        const amountInWei = ethers.utils.parseUnits(amount, decimals);
        const tx = await contract.transfer(recipient, amountInWei);

        alert(`Token enviado! Hash: ${tx.hash}`);
    } catch (error) {
        console.error("Erro ao enviar token:", error);
        alert("Erro ao enviar token.");
    }
});
const BSC_API_KEY = "X86YG1WJW3SMEN9YQ79X1UBEMYUA2VCE5Y"; // Substitua pela sua chave REAL da API BscScan
const BSC_API_URL = `https://api.bscscan.com/api`;

document.getElementById("viewTransactions").addEventListener("click", async function() {
    if (!userWallet) {
        alert("Conecte ou crie uma carteira primeiro!");
        return;
    }

    const address = userWallet; // Agora é diretamente o endereço

    const historyList = document.getElementById("transactionHistory");
    historyList.innerHTML = "Carregando transações...";

    try {
        const url = `${BSC_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${BSC_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "0") {
            alert("Erro ao carregar transações: " + data.message);
            historyList.innerHTML = "Erro ao carregar transações"; // Correção: Alterado para innerHTML
            return;
        }

        const txs = data.result;

        if (txs.length === 0) {
            historyList.innerHTML = "Nenhuma transação encontrada"; // Correção: Alterado para innerHTML
            return;
        }

        historyList.innerHTML = ""; // Limpa o conteúdo existente

        txs.slice(0, 5).forEach(tx => {
            const listItem = document.createElement("li");
            listItem.innerText = `Tx Hash: ${tx.hash}, Para: ${tx.to}, Quantidade: ${ethers.utils.formatEther(tx.value)} BNB`;
            historyList.appendChild(listItem);
        });

    } catch (error) {
        console.error("Erro ao carregar o histórico de transações:", error);
        alert("Erro ao carregar o histórico de transações!");
        historyList.innerHTML = "Erro ao carregar o histórico de transações!";
    }
});
