import { SUPPORTED_CHAINS } from './chains.js';

export function isValidAddress(address) {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

export function formatAddress(address) {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function fetchLiveBalance(network, address) {
  const chain = SUPPORTED_CHAINS[network.toLowerCase()];
  if (!chain || !isValidAddress(address)) {
    return { balanceNative: 0, balanceUsd: 0 };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(chain.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();

    if (data.result) {
      const wei = BigInt(data.result);
      const ethVal = Number(wei) / 1e18;
      const usdVal = ethVal * (chain.nativePriceUsd || 2500);
      return {
        balanceNative: parseFloat(ethVal.toFixed(4)),
        balanceUsd: parseFloat(usdVal.toFixed(2))
      };
    }
  } catch (err) {
    // Return fallback balance if RPC rate limits or is offline
  }

  return {
    balanceNative: 0,
    balanceUsd: 0
  };
}

export function generateRandomHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}
