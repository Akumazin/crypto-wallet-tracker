import { v4 as uuidv4 } from 'uuid';

export const INITIAL_WALLETS = [
  {
    id: "w-vitalik",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    label: "Vitalik Buterin",
    network: "ethereum",
    tags: ["Legend", "OG Whale", "EVM Creator"],
    color: "#627EEA",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    balanceUsd: 1450200.50,
    notes: "Carteira principal de Vitalik. Foco em doações, mints de NFTs experimentais e testes L2."
  },
  {
    id: "w-base-sniper",
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    label: "Base Memecoin Sniper",
    network: "base",
    tags: ["Smart Money", "Base Memes", "Aerodrome Whale"],
    color: "#0052FF",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    balanceUsd: 584320.00,
    notes: "Sniper de memecoins e tokens recém-lançados na Base L2."
  },
  {
    id: "w-hyper-whale",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    label: "HyperEVM Alpha Trader",
    network: "hyperevm",
    tags: ["Hyperliquid", "HYPE Whale", "Perps"],
    color: "#2EE59D",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    balanceUsd: 890450.75,
    notes: "Grande negociador no ecossistema HyperEVM / Hyperliquid."
  },
  {
    id: "w-monad-hunter",
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    label: "Monad Early Minter",
    network: "monad",
    tags: ["Monad", "Early Alpha", "NFT Minter"],
    color: "#836EF9",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    balanceUsd: 210500.00,
    notes: "Caçador de airdrops e mintador em série de NFTs na Monad."
  },
  {
    id: "w-ape-collector",
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    label: "ApeChain Heavy Collector",
    network: "ape",
    tags: ["ApeChain", "BAYC Whale", "Gaming"],
    color: "#0054F7",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    balanceUsd: 430120.30,
    notes: "Colecionador focado em ApeChain, Yuga Labs e ecossistema Ape."
  },
  {
    id: "w-ink-alpha",
    address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    label: "Ink Kraken Pioneer",
    network: "ink",
    tags: ["Ink L2", "Kraken Superchain", "DeFi"],
    color: "#7B3FE4",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    balanceUsd: 312800.00,
    notes: "Primeiros movimentos no ecossistema Ink da Kraken."
  }
];

export const NFT_COLLECTIONS_DATA = [
  {
    name: "Pudgy Penguins",
    network: "ethereum",
    contractAddress: "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8",
    openSeaSlug: "pudgypenguins",
    floorPriceEth: 11.8,
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80",
    verified: true
  },
  {
    name: "Bored Ape Yacht Club",
    network: "ethereum",
    contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    openSeaSlug: "boredapeyachtclub",
    floorPriceEth: 13.4,
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80",
    verified: true
  },
  {
    name: "Base Punks Gen-2",
    network: "base",
    contractAddress: "0x39a1D574542B8C654497e88C0c6F721b0C863dF9",
    openSeaSlug: "base-punks",
    floorPriceEth: 0.85,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    verified: true
  },
  {
    name: "Monad Chads Club",
    network: "monad",
    contractAddress: "0x10143a5c128479a9d3864197e42ba79b5c3080ff",
    openSeaSlug: "monad-chads",
    floorPriceEth: 45.0,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80",
    verified: true
  },
  {
    name: "Hyper Purrs Genesis",
    network: "hyperevm",
    contractAddress: "0x998a7beb91bf9983692484a0d9b4b09f0c61141",
    openSeaSlug: "hyper-purrs",
    floorPriceEth: 120.0,
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&auto=format&fit=crop&q=80",
    verified: true
  },
  {
    name: "Ape Legends 3D",
    network: "ape",
    contractAddress: "0x33139aadade8e6dff049820680d1f14bd3903a5d",
    openSeaSlug: "ape-legends",
    floorPriceEth: 850.0,
    image: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&auto=format&fit=crop&q=80",
    verified: true
  },
  {
    name: "Ink Kraken Beasts",
    network: "ink",
    contractAddress: "0x57073d1a55bcc2695c58ba16fb37d819b0a4dc",
    openSeaSlug: "ink-kraken",
    floorPriceEth: 0.42,
    image: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=400&auto=format&fit=crop&q=80",
    verified: true
  },
  {
    name: "Pancake Bunnies Squad",
    network: "bnb",
    contractAddress: "0x0a8901b0E25DEb55A87524f0cC164E9644020EBA",
    openSeaSlug: "pancake-bunnies",
    floorPriceEth: 1.2,
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&auto=format&fit=crop&q=80",
    verified: true
  },
  {
    name: "Arbitrum Knights",
    network: "arbitrum",
    contractAddress: "0x42161f539739df2c5dacb4c659f2488d00000001",
    openSeaSlug: "arbitrum-knights",
    floorPriceEth: 0.65,
    image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400&auto=format&fit=crop&q=80",
    verified: true
  }
];

export const TOKENS_CATALOG = {
  ethereum: [
    { symbol: "ETH", name: "Ethereum", priceUsd: 2850.0, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=035" },
    { symbol: "PEPE", name: "Pepe", priceUsd: 0.0000094, logo: "https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=035" },
    { symbol: "USDC", name: "USD Coin", priceUsd: 1.0, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=035" },
    { symbol: "SHIB", name: "Shiba Inu", priceUsd: 0.0000185, logo: "https://cryptologos.cc/logos/shiba-inu-shib-logo.svg?v=035" }
  ],
  base: [
    { symbol: "BRETT", name: "Brett on Base", priceUsd: 0.142, logo: "https://pbs.twimg.com/profile_images/1761614749320245248/m30T9_5q_400x400.jpg" },
    { symbol: "DEGEN", name: "Degen", priceUsd: 0.0084, logo: "https://pbs.twimg.com/profile_images/1749842603845771264/jDqW898o_400x400.jpg" },
    { symbol: "TOSHI", name: "Toshi Base Cat", priceUsd: 0.00028, logo: "https://pbs.twimg.com/profile_images/1691230182600642560/JkK4-U6H_400x400.jpg" },
    { symbol: "AERO", name: "Aerodrome Finance", priceUsd: 1.25, logo: "https://pbs.twimg.com/profile_images/1696229983943790592/qL9b4zH8_400x400.jpg" }
  ],
  hyperevm: [
    { symbol: "HYPE", name: "Hyperliquid", priceUsd: 38.5, logo: "https://pbs.twimg.com/profile_images/1691166318882041856/rYQkO2b5_400x400.jpg" },
    { symbol: "PURR", name: "Purr Memecoin", priceUsd: 0.24, logo: "https://pbs.twimg.com/profile_images/1780277747807039488/jXfL4l4W_400x400.jpg" },
    { symbol: "HFUN", name: "HyperFun Token", priceUsd: 1.85, logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80" }
  ],
  monad: [
    { symbol: "MON", name: "Monad Token", priceUsd: 14.2, logo: "https://pbs.twimg.com/profile_images/1769850125218320384/Q3J9x4xP_400x400.jpg" },
    { symbol: "CHAD", name: "Monad Chad", priceUsd: 0.045, logo: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&q=80" },
    { symbol: "GIGA", name: "Giga Monad", priceUsd: 0.12, logo: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=100&q=80" }
  ],
  ink: [
    { symbol: "INKY", name: "Inky Kraken Token", priceUsd: 0.85, logo: "https://pbs.twimg.com/profile_images/1849479427672580096/QjD3Gv-E_400x400.jpg" },
    { symbol: "KRAK", name: "Krak DeFi Token", priceUsd: 2.10, logo: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=100&q=80" }
  ],
  ape: [
    { symbol: "APE", name: "ApeCoin", priceUsd: 1.65, logo: "https://cryptologos.cc/logos/apecoin-ape-ape-logo.svg?v=035" },
    { symbol: "BANANA", name: "Ape Banana Token", priceUsd: 0.055, logo: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=100&q=80" }
  ],
  bnb: [
    { symbol: "BNB", name: "BNB", priceUsd: 640.0, logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=035" },
    { symbol: "CAKE", name: "PancakeSwap", priceUsd: 2.85, logo: "https://cryptologos.cc/logos/pancakeswap-cake-logo.svg?v=035" },
    { symbol: "FLOKI", name: "Floki Inu", priceUsd: 0.00019, logo: "https://cryptologos.cc/logos/floki-inu-floki-logo.svg?v=035" }
  ],
  arbitrum: [
    { symbol: "ARB", name: "Arbitrum Token", priceUsd: 0.95, logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=035" },
    { symbol: "GMX", name: "GMX", priceUsd: 32.5, logo: "https://cryptologos.cc/logos/gmx-gmx-logo.svg?v=035" },
    { symbol: "GRAIL", name: "Camelot Token", priceUsd: 1850.0, logo: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=100&q=80" }
  ],
  robinhood: [
    { symbol: "HOOD", name: "Robinhood Tokenized", priceUsd: 24.50, logo: "https://cryptologos.cc/logos/robinhood-markets-hood-logo.svg?v=035" },
    { symbol: "RH-ETH", name: "Robinhood Wrapped ETH", priceUsd: 2850.0, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=035" }
  ]
};

export const INITIAL_TRANSACTIONS = [
  {
    id: uuidv4(),
    walletId: "w-vitalik",
    walletAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    walletLabel: "Vitalik Buterin",
    network: "ethereum",
    type: "NFT_MINT",
    txHash: "0x8fa9c7b1e42d3864197e42ba79b5c3080ff9821ef9a12c4180d21a2c3b889312",
    from: "0x0000000000000000000000000000000000000000",
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    valueToken: 0.05,
    tokenSymbol: "ETH",
    tokenName: "Ethereum",
    valueUsd: 142.50,
    nftCollection: "Pudgy Penguins",
    nftTokenId: "#6821",
    nftImage: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80",
    gasFee: "0.0042 ETH ($11.97)",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    status: "CONFIRMED",
    notes: "Mint direto de NFT raro com metadados especiais."
  },
  {
    id: uuidv4(),
    walletId: "w-base-sniper",
    walletAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    walletLabel: "Base Memecoin Sniper",
    network: "base",
    type: "TOKEN_SWAP",
    txHash: "0x12bb998f4ca0839e4a3177bb3fae19001bfaee49320e8a71946ec33c3a14ffaa",
    from: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    to: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1E0", // Aerodrome Router
    valueToken: 2.5,
    tokenSymbol: "ETH",
    tokenName: "Ethereum",
    valueUsd: 7125.00,
    swapFromToken: "2.5 ETH",
    swapToToken: "50,175 $BRETT",
    gasFee: "0.00012 ETH ($0.34)",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: "CONFIRMED",
    notes: "Swap de alto volume em DEX (Aerodrome Base)."
  },
  {
    id: uuidv4(),
    walletId: "w-hyper-whale",
    walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    walletLabel: "HyperEVM Alpha Trader",
    network: "hyperevm",
    type: "TOKEN_SWAP",
    txHash: "0x77ee92a1884dc09bb104f32aa78411b98a0021cbbd4981fae6205739811fa120",
    from: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    to: "0x981A7bEbB91bF9983692484a0d9b4b09F0c61141",
    valueToken: 1200,
    tokenSymbol: "HYPE",
    tokenName: "Hyperliquid",
    valueUsd: 46200.00,
    swapFromToken: "1,200 HYPE",
    swapToToken: "192,500 $PURR",
    gasFee: "0.001 HYPE ($0.04)",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: "CONFIRMED",
    notes: "Compra massiva de $PURR no ecossistema HyperEVM."
  },
  {
    id: uuidv4(),
    walletId: "w-monad-hunter",
    walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    walletLabel: "Monad Early Minter",
    network: "monad",
    type: "NFT_MINT",
    txHash: "0x99ff2461abdc47629471bbad0049281a80c98fbaeed4781423bc55667788192a",
    from: "0x0000000000000000000000000000000000000000",
    to: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    valueToken: 10,
    tokenSymbol: "MON",
    tokenName: "Monad Token",
    valueUsd: 142.00,
    nftCollection: "Monad Chads Club",
    nftTokenId: "#1042",
    nftImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80",
    gasFee: "0.0005 MON ($0.007)",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: "CONFIRMED",
    notes: "Mint de NFT antecipado na Monad EVM."
  },
  {
    id: uuidv4(),
    walletId: "w-ape-collector",
    walletAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    walletLabel: "ApeChain Heavy Collector",
    network: "ape",
    type: "NFT_BUY",
    txHash: "0x44aa10029b9f48201a08461048bace09281e4b857726fca0998319a2e6189912",
    from: "0x828479A9D3864197e42ba79b5c3080ff9821ef9a",
    to: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    valueToken: 1250,
    tokenSymbol: "APE",
    tokenName: "ApeCoin",
    valueUsd: 2062.50,
    nftCollection: "Ape Legends 3D",
    nftTokenId: "#88",
    nftImage: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&auto=format&fit=crop&q=80",
    gasFee: "0.02 APE ($0.033)",
    timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    status: "CONFIRMED",
    notes: "Compra em marketplace descentralizado na ApeChain."
  },
  {
    id: uuidv4(),
    walletId: "w-ink-alpha",
    walletAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    walletLabel: "Ink Kraken Pioneer",
    network: "ink",
    type: "TOKEN_TRANSFER",
    txHash: "0x3312f10928e1aa561820468e2bbfa8491028716bca091827461827bfae83011a",
    from: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    valueToken: 15.0,
    tokenSymbol: "ETH",
    tokenName: "Ethereum (Ink L2)",
    valueUsd: 42750.00,
    gasFee: "0.00015 ETH ($0.42)",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: "CONFIRMED",
    notes: "Transferência de capital para farming na Ink L2."
  }
];
