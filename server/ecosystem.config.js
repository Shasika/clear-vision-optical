module.exports = {
  apps: [{
    name: 'clear-vision-optical-backend',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3007
    },
    error_file: '/var/log/pm2/clear-vision-optical-error.log',
    out_file: '/var/log/pm2/clear-vision-optical-out.log',
    log_file: '/var/log/pm2/clear-vision-optical-combined.log',
    time: true
  }]
};