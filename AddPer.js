registerPlugin({
    name: 'AddPer',
    version: '1.0.0',
    backends: ['ts3', 'discord'],
    engine: '>= 0.9.16',
    description: 'Desc',
    author: 'Alkowskey',
    vars:  {
        MaxRang: {
            title: 'Ile rang maksimum dla clienta',
            type: 'select',
			options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '100'] 
        }
    }
}, function (sinusbot, config) {
    var engine = require('engine');
    var backend = require('backend');
    var event = require('event');

    event.on('chat', function (ev) {
        if (!ev.client.isSelf()) {
			var text = ev.text;
			if(text.charAt(0)=='('){
				text = text.substr(1)
				text = text.substr(0, text.length-1)
			}
			ev.client.chat(text);
			var serverGroups = ev.client.getServerGroups();
			for (var serverGroup in serverGroups){
					if (text == serverGroups[serverGroup].id()){
						ev.client.removeFromServerGroup(serverGroups[serverGroup].id());
						ev.client.chat('Sciagnalem range: '+text);
						return;
					}
				}
			
			if(serverGroups.length>=parseInt(config.MaxRang)){
				ev.client.chat('Masz maksimum rang (max '+config.MaxRang+')!');
				return;
			}
			
			ev.client.addToServerGroup(text);
			ev.client.chat('Otrzymales range o ID: '+ev.text);
        }
    });
});
