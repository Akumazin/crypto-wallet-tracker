// Intelligent Anti-Spam & Anti-Scam Filter for Tokens and NFTs

const SPAM_PATTERNS = [
  /https?:\/\//i,
  /\.(io|com|xyz|org|net|me|cc|top|site|app|link|click|vip|win)\b/i,
  /\b(claim|voucher|airdrop|gift|reward|free|visit|t\.me|bonus|whitelist|winner|promocode)\b/i,
  /\b(t\.me\/|telegram|discord\.gg)\b/i,
  /\b(fake|honeypot|phishing)\b/i
];

export function isScamOrSpam(tx) {
  if (!tx) return false;

  // 1. Check Token Name & Symbol for Scam Links / Phishing words
  const textsToCheck = [
    tx.tokenSymbol || '',
    tx.tokenName || '',
    tx.nftCollection || '',
    tx.notes || ''
  ];

  for (const text of textsToCheck) {
    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(text)) {
        return {
          isSpam: true,
          reason: `Padrão de phishing/URL suspeita detectado: "${text.slice(0, 30)}"`
        };
      }
    }
  }

  // 2. Filter out Unsolicited NFT Airdrops
  // Legitimate NFTs MUST be either explicitly MINTED (from 0x0) or BOUGHT/TRADED on a verified DEX/Marketplace
  if (tx.type === 'NFT_TRANSFER' || (tx.type.startsWith('NFT') && !['NFT_MINT', 'NFT_BUY', 'NFT_SELL'].includes(tx.type))) {
    // If it's a random unsolicited transfer without value/mint, flag as spam airdrop
    if (!tx.valueToken || tx.valueToken === 0) {
      return {
        isSpam: true,
        reason: 'Airdrop não solicitado de NFT (Possível phishing/dust)'
      };
    }
  }

  // 3. Filter out Dust Scam Tokens (tokens with 0 volume / 0 value sent automatically)
  if (tx.type === 'TOKEN_TRANSFER' && tx.valueUsd === 0 && tx.valueToken > 1000000) {
    return {
      isSpam: true,
      reason: 'Token Dust com valor nulo (Comum em golpes de airdrop falso)'
    };
  }

  return {
    isSpam: false,
    reason: null
  };
}

export function getOpenSeaUrl(network, contractAddress, tokenId) {
  const net = network?.toLowerCase();
  const cleanId = tokenId ? tokenId.replace('#', '') : '1';
  const cleanAddr = contractAddress || '0x0000000000000000000000000000000000000000';

  switch (net) {
    case 'ethereum':
      return `https://opensea.io/assets/ethereum/${cleanAddr}/${cleanId}`;
    case 'base':
      return `https://opensea.io/assets/base/${cleanAddr}/${cleanId}`;
    case 'arbitrum':
      return `https://opensea.io/assets/arbitrum/${cleanAddr}/${cleanId}`;
    case 'bnb':
      return `https://opensea.io/assets/bsc/${cleanAddr}/${cleanId}`;
    case 'ape':
      return `https://magiceden.io/item-details/apechain/${cleanAddr}/${cleanId}`;
    case 'hyperevm':
      return `https://hyperliquid.cloud.blockscout.com/token/${cleanAddr}/instance/${cleanId}`;
    case 'monad':
      return `https://monadexplorer.com/token/${cleanAddr}`;
    case 'ink':
      return `https://explorer.inkonchain.com/token/${cleanAddr}`;
    case 'robinhood':
      return `https://robinhood.com`;
    default:
      return `https://opensea.io`;
  }
}

export function getCollectionUrl(network, collectionSlug, contractAddress) {
  const net = network?.toLowerCase();
  const slug = collectionSlug ? collectionSlug.toLowerCase().replace(/\s+/g, '-') : '';

  if (['ethereum', 'base', 'arbitrum', 'bnb'].includes(net)) {
    return `https://opensea.io/collection/${slug}`;
  } else if (net === 'ape') {
    return `https://magiceden.io/collections/apechain/${slug}`;
  } else {
    return `https://opensea.io/category/art`;
  }
}
