const API_BASE = '/api';

export async function fetchChains() {
  const res = await fetch(`${API_BASE}/chains`);
  return res.json();
}

export async function fetchWallets() {
  const res = await fetch(`${API_BASE}/wallets`);
  return res.json();
}

export async function addWallet(data) {
  const res = await fetch(`${API_BASE}/wallets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateWallet(id, data) {
  const res = await fetch(`${API_BASE}/wallets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteWallet(id) {
  const res = await fetch(`${API_BASE}/wallets/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function fetchTransactions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/transactions?${query}`);
  return res.json();
}

export async function simulateTransaction(data = {}) {
  const res = await fetch(`${API_BASE}/transactions/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchNFTs() {
  const res = await fetch(`${API_BASE}/nfts`);
  return res.json();
}

export async function fetchTokens() {
  const res = await fetch(`${API_BASE}/tokens`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  return res.json();
}

export async function updateSettings(data) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export function subscribeToEvents(onEvent, onError) {
  const eventSource = new EventSource(`${API_BASE}/events`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onEvent(data);
    } catch (e) {
      console.error("Erro ao decodificar evento SSE:", e);
    }
  };

  eventSource.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}
