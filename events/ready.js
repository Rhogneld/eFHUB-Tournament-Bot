module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        console.log(`started successfully`)
		client.guilds.cache.forEach(g => {      
			g.roles.fetch();
	  	});
	},
};