module.exports = {
  apps: [
    {
      name: "alpha-wallet-tracker",
      script: "server/server.js",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
      restart_delay: 3000,
      max_restarts: 10
    }
  ]
};
