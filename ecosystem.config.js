module.exports = {
    apps: [{
        name: 'PM2-Node',
        script: 'server.js',
        instances: 1,
        exec_mode: 'fork',
        watch: true,
        NODE_ENV: 'production'
    }]
};