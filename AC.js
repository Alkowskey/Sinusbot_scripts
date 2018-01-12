registerPlugin({
    name: 'AC',
    version: '1.2.0',
    backends: ['ts3', 'discord'],
    engine: '>= 0.9.16',
    description: 'Desc',
    author: 'Alkowskey',
    vars:  {
        Prefix: {
            title: 'Prefix przed nazwa generowanego kanału',
            type: 'string'
        },
		adminGroup: {
			title: 'Channel admin ID',
			type: 'string'
		},
		Il_Podkanalow: {
            title: 'Ilość podkanałów',
            type: 'select',
			options: ['1', '2', '3', '4']
        },
		Kanal: {
            title: 'Po wejsciu na jaki kanal ma generowac',
            type: 'channel'
        }
		Kanal2: {
            title: 'Kanal pod ktorym sa kanaly prywatne',
            type: 'channel'
        }
    }
}, function (sinusbot, config) {
    var engine = require('engine');
    var backend = require('backend');
    var event = require('event');
	var chann = require("channel");
	var db = require('db');
	var helpers = require('helpers');
	
	var dbc = db.connect({ driver: 'mysql', host: '127.0.0.1', username: '---', password: '---', database: '---a' }, function(err) {
		if (err) { engine.log(err); }
	});

    event.on('clientMove', function (ev) {
        if (!ev.client.isSelf()) {
			
			var res;
			
			if (dbc) dbc.query('SELECT UID FROM VerUser WHERE UID = (?)', ev.client.uid(), function select(err, res) {

			if (!err) res.forEach(function(row) { });

				 if (!res.length) {
					if(ev.toChannel.id()==config.Kanal)
					{
						var licznik = 0;
						var chann = backend.getChannels();
						var mainChann = backend.getChannelByID(config.Kanal2);
						engine.log(mainChann.id());
						backend.getChannels().forEach(function(channel) {
							var CH = backend.getChannelByID(channel.id());
							var CHparent = CH.parent();
							if (CHparent) {
								if (CHparent.id() == mainChann.id()) {
									licznik++;
								}
							}
						});
						var nazwa = licznik+1+". "+ev.client.name();
						
						var create = backend.createChannel({ name: nazwa, parent: 18, permanent: true, codec: 4, codecQuality: 8, maxClients: -1, description: "Wlasciciel kanalu: " + ev.client.name(), neededTalkPower: 0});
						ev.client.chat('Stworzyłem dla ciebie kanał!');
						sleep(500);
						var obj = backend.getChannelByName(nazwa);
						ev.client.moveTo(obj.id());
						dbc.exec('INSERT INTO VerUser (Uid, Nick, IPAddress) VALUES (?, ?, ?)', ev.client.uid(), ev.client.nick(), ev.client.getIPAddress());
						
						for(var i=1;i<=config.Il_Podkanalow;i++)
						{
							backend.createChannel({ name: i+"", parent: obj.id(), permanent: true, codec: 4, codecQuality: 8, maxClients: -1, description: "Wlasciciel kanalu: " + ev.client.name(), neededTalkPower: 0});
						}
						var channelAdminGroup = backend.getChannelGroupByID(config.adminGroup);
						obj.setChannelGroup(ev.client, channelAdminGroup);
					}
				 } else {
					return;
				 }  
			});
						
        }

    });
	
	function sleep(milliseconds) {
	  var start = new Date().getTime();
	  for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
		  break;
		}
	  }
	}
});
