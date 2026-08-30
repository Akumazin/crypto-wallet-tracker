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

export function padAddress(address) {
  if (!address) return '';
  const clean = address.toLowerCase().replace('0x', '');
  return '0x' + clean.padStart(64, '0');
}

export function unpadAddress(topic) {
  if (!topic) return '';
  const clean = topic.replace('0x', '');
  return '0x' + clean.slice(-40);
}

// Resilient multi-RPC query with automatic failover
export async function queryRpcWithFallback(chain, method, params = []) {
  const rpcList = [chain.rpcUrl, ...(chain.backupRpcs || [])];

  for (const rpc of rpcList) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: 1
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data && data.result !== undefined) {
        return data.result;
      }
    } catch (err) {
      // Failed on this RPC, will attempt next backup RPC in list
    }
  }

  return null;
}

export async function fetchLiveBalance(network, address) {
  const chain = SUPPORTED_CHAINS[network.toLowerCase()];
  if (!chain || !isValidAddress(address)) {
    return { balanceNative: 0, balanceUsd: 0 };
  }

  try {
    const rawBalance = await queryRpcWithFallback(chain, 'eth_getBalance', [address, 'latest']);
    if (rawBalance) {
      const wei = BigInt(rawBalance);
      const ethVal = Number(wei) / 1e18;
      const usdVal = ethVal * (chain.nativePriceUsd || 2500);
      return {
        balanceNative: parseFloat(ethVal.toFixed(4)),
        balanceUsd: parseFloat(usdVal.toFixed(2))
      };
    }
  } catch (err) {
    // fallback
  }

  return {
    balanceNative: 0,
    balanceUsd: 0
  };
}

export async function getLatestBlockNumber(chain) {
  try {
    const raw = await queryRpcWithFallback(chain, 'eth_blockNumber', []);
    if (raw) return parseInt(raw, 16);
  } catch (e) {}
  return null;
}

// Fetch real on-chain transfer events (ERC-20, ERC-721 NFTs) for a specific wallet address
export async function fetchOnChainTransfers(chain, address, fromBlock, toBlock) {
  if (!isValidAddress(address)) return [];

  const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  const padded = padAddress(address);

  const hexFrom = '0x' + fromBlock.toString(16);
  const hexTo = '0x' + toBlock.toString(16);

  try {
    // 1. Check incoming transfers/mints
    const inLogsPromise = queryRpcWithFallback(chain, 'eth_getLogs', [{
      fromBlock: hexFrom,
      toBlock: hexTo,
      topics: [TRANSFER_TOPIC, null, padded]
    }]);

    // 2. Check outgoing transfers
    const outLogsPromise = queryRpcWithFallback(chain, 'eth_getLogs', [{
      fromBlock: hexFrom,
      toBlock: hexTo,
      topics: [TRANSFER_TOPIC, padded]
    }]);

    const [inLogs, outLogs] = await Promise.all([inLogsPromise, outLogsPromise]);
    const allLogs = [...(Array.isArray(inLogs) ? inLogs : []), ...(Array.isArray(outLogs) ? outLogs : [])];

    return allLogs;
  } catch (err) {
    return [];
  }
}

export function generateRandomHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}
