module.exports = {
	apps: [
		{
			name: 'API',
			script: 'server.js',
			env: {
				COMMON_VARIABLE: 'true'
			},
			env_staging: {
				NODE_ENV: 'staging'
			}
		}
	],
	deploy: {
		staging: {
			key: '~/.ssh/staging',
			user: 'ubadmin',
			host: '192.168.63.32',
			ref: 'origin/master',
			repo: 'git@192.168.63.30:web/api.dpauls.com.git',
			path: '/var/www/api',
			'post-deploy': 'npm install && pm2 startOrRestart staging-ecosystem.config.js --env staging'
		}
	}
};
