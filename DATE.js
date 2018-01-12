registerPlugin({
    name: 'DATE',
    version: '1.3.0',
    backends: ['ts3', 'discord'],
    engine: '>= 0.9.16',
    description: 'USUWAJ STARSZE NIZ x DNI',
    author: 'Alkowskey',
    vars:  {
        Day_count: {
            title: 'Ile dni',
            type: 'string'
        },
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
	
	var dbc = db.connect({ driver: 'mysql', host: '127.0.0.1', username: '---', password: '---', database: '---' }, function(err) {
		if (err) { engine.log(err); }
	});

    event.on('clientMove', function (ev) {
        if (!ev.client.isSelf()) {
			var res;
			var date = new Date().toISOString().slice(0,10);
			
			backend.getChannels().forEach(function(channel) {
				var CH = backend.getChannelByID(channel.id());
				var CHparent = CH.parent();
					if (CHparent) {
						if (CHparent.id() == backend.getChannelByID(config.Kanal2).id()) {
							if (dbc) dbc.query('SELECT DATE, Chann_ID FROM Date WHERE Chann_ID = (?)', channel.id(), function select(err, res) {

								if (!err) res.forEach(function(row) {
									var L_DATE = helpers.toString(row.DATE);
									L_DATE = L_DATE.replace("-", "");
									L_DATE = L_DATE.replace("-", "");
									
									L_DATE = L_DATE +"-";
									
									var TDay = date.replace("-", "");
									TDay = TDay.replace("-", "");
									TDay = TDay + "-";
									
									var Ldni = parseFloat(L_DATE);
									var TDay_num = parseFloat(TDay);
									
									if(TDay_num - Ldni>=config.Day_count&&TDay_num - Ldni<=70)
									{
										channelDelete(CH.id(), true);
									}
									else if(TDay_num - Ldni>=70+config.Day_count)
									{
										channelDelete(CH.id(), true);
									}
									
								});

							 });
						}
					}
				});
			
			if (dbc) dbc.query('SELECT Chann_ID FROM Date WHERE Chann_ID = (?)', ev.toChannel.id(), function select(err, res) {

			if (!err) res.forEach(function(row) { });

				 if (!res.length) {
		 			if(ev.toChannel.parent().id()==backend.getChannelByID(config.Kanal2).id())
					{
						ev.client.chat("Zmieniłeś date na kanale!][");
						ev.toChannel.setDescription(date);
						dbc.exec('INSERT INTO Date (Chann_ID, DATE, Last_IP) VALUES (?, ?, ?)', ev.toChannel.id(), date, ev.client.getIPAddress());
					}
				 } 
				 else {
						ev.client.chat("Zaktualizowales date na kanale!");
						ev.toChannel.setDescription(date);
						dbc.exec('UPDATE Date SET DATE=?,Last_IP=? WHERE Chann_ID=?', date, ev.client.getIPAddress(), ev.toChannel.id());
				 }  
			});
						
        }

    });
});
