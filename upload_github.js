import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = "Akumazin";
const REPO_NAME = "crypto-wallet-tracker";

// Ignores
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', '.system_generated', 'logs']);
const IGNORE_FILES = new Set(['.DS_Store', 'Thumbs.db']);

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const relPath = path.relative(__dirname, fullPath).replace(/\\/g, '/');

    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.has(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (!IGNORE_FILES.has(file) && !file.endsWith('.log')) {
        arrayOfFiles.push({ fullPath, relPath });
      }
    }
  });

  return arrayOfFiles;
}

export async function uploadToGitHub(token) {
  if (!token) {
    throw new Error("Token do GitHub (Personal Access Token) é obrigatório.");
  }

  const headers = {
    'Authorization': `token ${token.trim()}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'AlphaTracker-Uploader'
  };

  console.log(`[1/4] Verificando / criando repositório "${REPO_NAME}" no GitHub...`);

  // 1. Check or Create Repo
  let repoRes = await fetch(`https://api.github.com/user/repos`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: REPO_NAME,
      description: "Crypto, NFT & Token Multi-Chain Live Tracker Dashboard (9 Chains)",
      private: false,
      auto_init: true
    })
  });

  let repoData = await repoRes.json();
  if (repoRes.status === 422) {
    console.log("Repositório já existe no GitHub, continuando...");
  } else if (!repoRes.ok && repoRes.status !== 201) {
    throw new Error(`Erro ao criar repositório: ${repoData.message || JSON.stringify(repoData)}`);
  }

  // 2. Read all project files
  console.log("[2/4] Lendo arquivos do projeto...");
  const files = getAllFiles(__dirname);
  console.log(`Total de ${files.length} arquivos para upload.`);

  // 3. Upload files via GitHub contents API
  console.log("[3/4] Enviando arquivos para o repositório...");
  for (const item of files) {
    try {
      const content = fs.readFileSync(item.fullPath);
      const base64Content = content.toString('base64');

      // Check if file exists to get SHA for update
      let sha = undefined;
      const getFileRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${item.relPath}`, {
        headers
      });
      if (getFileRes.ok) {
        const fileJson = await getFileRes.json();
        sha = fileJson.sha;
      }

      const putRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${item.relPath}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `Add ${item.relPath}`,
          content: base64Content,
          sha: sha
        })
      });

      if (!putRes.ok) {
        console.warn(`Aviso ao enviar ${item.relPath}: ${putRes.statusText}`);
      } else {
        console.log(`✓ Enviado: ${item.relPath}`);
      }
    } catch (e) {
      console.warn(`Erro no arquivo ${item.relPath}:`, e.message);
    }
  }

  console.log("\n=================================================");
  console.log(`🎉 Projeto enviado com sucesso para o GitHub!`);
  console.log(`🔗 https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`);
  console.log("=================================================\n");
  return `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`;
}

// If run from CLI with token as argument
if (process.argv[2]) {
  uploadToGitHub(process.argv[2]).catch(console.error);
}
