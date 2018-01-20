registerPlugin({
    name: 'Poke',
    version: '1.0.0',
    backends: ['ts3', 'discord'],
    engine: '>= 0.9.16',
    description: 'Skrypt który da poke wchodzacemu',
    author: 'Alkowskey',
    vars:  {
        Msg_for_client: {
            title: 'Wiadomosc dla uzytkownika',
            type: 'string'
        },
		Msg_for_admin: {
            title: 'Wiadomosc dla administratora',
            type: 'string'
        },
		Adm_id: {
            title: 'Id rangi admina',
            type: 'string'
        },
		Ignored: {
            title: 'Id ignorowanych grup',
            type: 'string'
        },
		Kanal: {
            title: 'Kanal po wejsciu którego ma dostac poke',
            type: 'channel'
        }
    }
}, function (sinusbot, config) {
	
    var engine = require('engine');
    var backend = require('backend');
    var event = require('event');
	
	
	var Msg_for_admin = config.Msg_for_admin;
	var Msg_for_client = config.Msg_for_client;
	var Adm_id = config.Adm_id ? config.Adm_id.split(',') : []
	var Kanal = config.Kanal;
	var ignored = config.Ignored ? config.Ignored.split(',') : []
	
    event.on('clientMove', function (ev) {
		
        if (!ev.client.isSelf()&&ev.toChannel.id()==Kanal) {
			
			var groups = ev.client.getServerGroups();
			var clients = backend.getClients();
			var DoOrDie = false;

			ignored.forEach(function(ignored_c) {
				for (var serverGroup in groups){
					if(groups[serverGroup].id()==ignored_c)
					{
						DoOrDie = true;
						return;
					}
				}
			});
			if(DoOrDie)return;
			ev.client.poke(Msg_for_client);
			
			clients.forEach(function(client) {
				var c_groups = client.getServerGroups();
				for (var serverGroup in c_groups){
					for(var admGroup in Adm_id)
					{
						if(c_groups[serverGroup].id()==Adm_id[admGroup])client.poke(Msg_for_admin);
					}
				}
			});
        }

    });
});
