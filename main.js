const tmi = require('tmi.js');

const setting = require('./setting.json');

const Level = require('./schemas/level');

const connect = require('./schemas');
connect();

const client = new tmi.client({
    identity: setting.BOT_ACCOUNT,
    channels: setting.channels,
    connection: {
        reconnect: true,
        secure: true
    }
});

client.on('logon', () => {
    console.log('트위치 봇 계정 로그인');
});

client.on('chat', async (chn, data, msg, self) => {
    if(self) return;

    if(msg.startsWith('!신청')) {
        await Level.create({
            url: msg.replace('!신청 ', ''),
            channel: chn
        });

        return client.say(chn, '맵이 대기열에 등록되었습니다.');
    }

    if(msg == '!맵') {
        const level = await Level.findOne({ channel : chn });
        if(!level) return client.say(chn, '현재 맵이 없습니다.');
        return client.say(chn, `현재 맵 : ${level.url}`);
    }

    if(msg == '!다음맵') {
        if(chn.slice(1) != data.username) return client.say(chn, '권한이 없습니다.');

        const levels = await Level.find({ channel : chn }).limit(2);
        if(levels.length == 0) return client.say(chn, '넘길 맵이 없습니다!');

        await Level.deleteOne({ channel : chn });
        if(levels.length == 1) return client.say(chn, '모든 맵을 마쳤습니다!');
        return client.say(chn, `맵을 넘겼습니다. 이번 맵은 ${levels[1].url} 입니다.`);
    }
});

client.connect();