var TelegramBot = require('node-telegram-bot-api');
var Firebase = require("firebase");
var ref = new Firebase('https://moli-checkin.firebaseio.com/');

// Setup polling way
var request = require('request');

var options = {
	polling: true
};

var token = process.env.TELEGRAM_BOT_TOKEN || '';

var bot = new TelegramBot(token, options);
bot.getMe().then(function (me) {
	console.log('Hi my name is %s!', me.username);
});

bot.onText(/\/echo (.+)/, function (msg, match) {
	var chatId = msg.chat.id;
	var resp = match[1];
	bot.sendMessage(chatId, resp);
	console.log(msg);
});

bot.onText(/\/help/, function (msg) {
	var chatId = msg.chat.id;
	bot.sendMessage(chatId, 'This is MaoLinBot!!');
	console.log(msg);
});

bot.onText(/\/signin/, function (msg, match) {
//  var resp = match[1];
	var date = new Date();
	var signInRef = ref.child('list');

	signInRef.push({
		first_name: msg.chat.first_name,
		last_name: msg.chat.last_name,
		username: msg.chat.username,
		id: msg.chat.id, 
		signInDate: Date.now(),
		status: true
	});
	console.log('@' + msg.chat.username + ' is sign in ' + date);
	console.log(msg);
	bot.sendMessage(msg.chat.id, '@' + msg.chat.username + ' is sign in ' + date);
});

bot.onText(/\/signout/, function (msg, match) {
//  var resp = match[1];
	 
	var signInRef = ref.child('list');
	var date = new Date();

	signInRef.on("value", function(list) {
		var listObj = list.val();
		console.log(listObj);
		for(var key in listObj) {
			if(listObj[key].status) {
				console.log(key + ' ' + listObj[key].status);
				signInRef.child(key).update({ status: false, signOutDate: Date.now()});
				bot.sendMessage(listObj[key].id, '@' + listObj[key].username + ' is sign out ' + date);
				break;
			}
		}
	});

});

var checkSign = function (list, checkStatus) {
    for(var key in list) {
      if(listObj[key].status == checkStatus) {
        return true;
      }
    }
    return false;
};
