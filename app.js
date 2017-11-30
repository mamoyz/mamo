var telegram = require('telegram-bot-api');

var readline = require('readline');
var path = require('path');
var fs = require('fs');
var ytdl = require('ytdl-core');

var api = new telegram({
    token: '505485589:AAFPi4ADXC69WlG2s5HH465aCP96vLyiDRA',
    updates: {
        enabled: true
    }
});

api.on('message', function(message) {
    // Received text message
    var url = message.text;
    if (ytdl.validateURL(url)) {
        api.sendMessage({
            chat_id: message.chat.id,
            parse_mode: 'Markdown',
            text: 'Downloading. Please Wait...'

        });
        ytdl.getInfo(url, { filter: (format) => format.itag === '18' }, function(err, info) {
            var filename = info.title + Math.floor(100000 + Math.random() * 900000) + '.mp4';

            if (filename) {
                var output = path.resolve(__dirname, filename);
                var video = ytdl(url);
                video.pipe(fs.createWriteStream(output));
                video.on('end', () => {
                    console.log('DONE!');
                    api.sendMessage({
                        chat_id: message.chat.id,
                        parse_mode: 'Markdown',
                        text: 'Video has been saved successfully. Uploading to Telegram. Please wait...'

                    });
                    api.sendVideo({
                        chat_id: message.chat.id,
                        video: filename,
                        duration: info.length_seconds,
                        caption: info.title,
                        reply_to_message_id: message.message_id
                    });
                });
            }
        });
    } else {
        api.sendMessage({
            chat_id: message.chat.id,
            parse_mode: 'Markdown',
            text: 'Bad Format. Please send a Youtube link'

        });

    }

});