# 🚀 AlphaTracker: Multi-Chain Crypto, NFT & Token Wallet Tracker

Sistema completo e profissional para **rastreamento e monitoramento de carteiras on-chain em tempo real**, com foco especializado em **NFTs (Mints, Vendas e Compras)** e **Tokens (Swaps em DEXs, Memecoins e Transferências)** nas principais redes do ecossistema cripto.

---

## 🌐 9 Redes Blockchain Integradas

| Rede | Símbolo | Foco Principal | Explorador Padrão |
|---|---|---|---|
| **Ethereum** | ETH | NFTs Bluechip, OpenSea, Blur, Uniswap | Etherscan |
| **Base** | ETH | Memecoins em alta, Aerodrome, NFTs Base | Basescan |
| **HyperEVM** | HYPE | Hyperliquid L1/EVM, Perps & Novos Tokens | Hyperliquid Explorer |
| **Monad** | MON | Ecossistema paralelo de alta velocidade, Early Mints | Monad Explorer |
| **Ink** | ETH | Superchain da Kraken, DeFi & NFTs | Ink Explorer |
| **ApeChain** | APE | NFTs Yuga Labs, Gaming, Ape Ecosystem | ApeScan |
| **BNB Chain** | BNB | Altcoins, PancakeSwap, Baixas taxas | BscScan |
| **Arbitrum** | ETH / ARB | DeFi Alpha, GMX, Camelot | Arbiscan |
| **Robinhood** | ETH / USD | Ecossistema Robinhood Chain / EVM | Robinhood Explorer |

---

## 💎 Principais Funcionalidades

1. **Dashboard em Tempo Real (Live Feed)**:
   - Streaming instantâneo de transações via **Server-Sent Events (SSE)**.
   - Detecção de **NFT Mints** com visualização de thumbnail da arte, coleção e Token ID.
   - Detecção de **Swaps em DEX** mostrando pares de troca (ex: `2.5 ETH ➔ 50,000 $BRETT`).
   - Cálculo automático de valor em USD e taxa de Gas.
   - Links diretos para os Block Explorers oficiais e botão de cópia de Hash.
2. **Galeria Visual de NFTs (NFT Hub)**:
   - Grade com imagens em alta qualidade das artes digitais adquiridas e mintadas pelas carteiras monitoradas.
   - Filtros por coleção e rede.
3. **Radar de Tokens & Smart Money**:
   - Classificação dos tokens e memecoins mais negociados e acumulados pelas carteiras que você segue.
4. **Gerenciador Completo de Carteiras**:
   - Cadastro fácil de novos endereços com validação EVM (`0x...`).
   - Apelidos customizados, tags e paleta de cores.
   - Botões para pausar/ativar monitoramento e excluir carteiras.
   - **Visão Deep-Dive**: Extrato e métricas individuais de cada carteira.
5. **Alertas Visuais e Sonoros**:
   - Efeitos sonoros customizados sintetizados via Web Audio API para novas transações e Mints.
   - Toasts flutuantes com animação em tempo real.
6. **Gráficos & Analytics**:
   - Volume movimentado por rede e distribuição por tipo de operação (NFTs vs Swaps vs Transferências).

---

## 🛠️ Como Executar o Projeto

O projeto já está configurado e pronto para rodar na sua máquina:

### 1. Iniciar o Servidor (Backend + Frontend integrado)
No diretório `crypto-wallet-tracker`:

```powershell
npm start
```

O sistema estará acessível em: **[http://localhost:3001](http://localhost:3001)**

### 2. Modo Desenvolvimento com Hot-Reload (Opcional)
Se desejar editar os componentes React em tempo real:

**Terminal 1 (Backend):**
```powershell
npm run dev:server
```

**Terminal 2 (Frontend Vite):**
```powershell
npm run dev:client
```
Acesse o Vite Dev Server em: **[http://localhost:5173](http://localhost:5173)**

---

## 📁 Estrutura do Código

```
crypto-wallet-tracker/
├── package.json
├── README.md
├── server/
│   ├── server.js              # API Express + SSE Streaming + Servidor estático
│   ├── chains.js              # Configuração detalhada das 9 redes (RPCs, Cores, Logos)
│   ├── db.js                  # Banco de dados persistente em arquivo local
│   ├── blockchain.js          # Utilitários de validação e consulta RPC
│   ├── watcher.js             # Motor de monitoramento e emissão de eventos em tempo real
│   └── mockData.js            # Sementes iniciais ricas com coleções de NFT e Tokens
└── client/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx            # Orquestrador da aplicação
        ├── main.jsx
        ├── index.css
        ├── services/
        │   ├── api.js         # Cliente REST e SSE
        │   └── audio.js       # Sintetizador de alertas sonoros
        └── components/
            ├── Navbar.jsx           # Barra superior com seletor de 9 redes e conexões
            ├── StatsOverview.jsx    # Cards de métricas principais e simulação rápida
            ├── TransactionFeed.jsx  # Feed ao vivo especializado em NFTs e Tokens
            ├── NFTGallery.jsx       # Grid visual com artes de NFTs
            ├── TokenTracker.jsx     # Radar de tokens e memecoins
            ├── WalletManager.jsx    # Gerenciamento de carteiras
            ├── AddWalletModal.jsx   # Modal de inclusão com presets populares
            ├── WalletDetailModal.jsx# Visão detalhada de extrato por carteira
            ├── AnalyticsCharts.jsx  # Gráficos Recharts
            └── LiveToast.jsx        # Notificações popup em tempo real
```
