@echo off
title AlphaTracker - Crypto, NFT & Token Wallet Tracker
cd /d "C:\Users\Ventrue\.gemini\antigravity\scratch\crypto-wallet-tracker"

echo ======================================================
echo   Iniciando AlphaTracker (9 Redes Blockchain)...
echo   Ethereum, Base, HyperEVM, Monad, Ink, Ape, BNB, Arbitrum, Robinhood
echo ======================================================

:: Abre o navegador automaticamente no dashboard
timeout /t 2 /nobreak >nul
start "" http://localhost:3001

:: Inicia o servidor Node.js
node server/server.js
pause
