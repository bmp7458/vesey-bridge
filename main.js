const { Client, GatewayIntentBits } = require('discord.js');
const irc = require('irc');

var setchannel = "#trivia"; // `${setchannel}`
// could have just used ircConfig.channels instead of setchannel..
const ircConfig = {
    channels: ['#trivia'],
    server: 'irc.freenode.net',
    botName: 'vesey-bridge',
};

const discordConfig = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
};

const ircClient = new irc.Client(ircConfig.server, ircConfig.botName, {
    channels: ircConfig.channels,
});

const discordClient = new Client(discordConfig);

var removeUselessWords = function (txt) {
    var uselessWordsArray =
        [
            "10 ", "00,10", "08,10", "", "", "10"
        ];

    var expStr = uselessWordsArray.join("|");
    return txt.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
        .replace(/\s{2,}/g, ' ');
}

ircClient.addListener(`message${setchannel}`, function (from, message) {
    const msg = removeUselessWords(`${setchannel} => ` + from + ': ' + message);

    discordClient.channels.cache.get('DISCORD CHAT CHANNEL ID').send("`" + msg + "`");
});

discordClient.on('messageCreate', function (msg) {
    const message = msg.content;

    ircClient.say(`${setchannel}`, "13" + msg.author.displayName + ': ')
    ircClient.say(`${setchannel}`, message);

    ircClient.say(`${setchannel}`, "10" + msg.author.displayName + ': ')
    ircClient.say(`${setchannel}`, message);

});

ircClient.addListener('error', function (message) {
    console.log('error: ', message);
});

discordClient.login('DISCORD BOT TOKEN');

const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('vesey-server');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
