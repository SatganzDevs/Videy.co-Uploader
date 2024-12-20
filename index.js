import { Telegraf, Markup } from 'telegraf';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import express from 'express'

const app = new express()
const bot = new Telegraf('7449733663:AAHS25Q7VRkWyvEZWlW5DTCb4y_K_YMPYwI');



app.get('/', (req,res) => res.send('Hello Prabowo!'))
app.listen(3000, () => console.log('Server is running on port 3000'))





bot.start(async (ctx) => {
try {
ctx.reply(
`Hi ${ctx.message.from.first_name},\n\nI can upload video to videy.co\n\nMade with ❤️ by @SatganzDevs\n\nSend any video to upload.`,
Markup.inlineKeyboard([
Markup.button.url(" Channel", "https://t.me/satzzzcode"),
Markup.button.url("Report bug", "https://t.me/SatganzDevs"),
]),
);
} catch (e) {
console.error(e);
}
});


bot.on('video', async (ctx) => {
try {
const fileId = ctx.message.video.file_id;
console.log('Received file_id:', fileId);
let fileUrl;
try {
fileUrl = await ctx.telegram.getFileLink(fileId);
console.log('File URL:', fileUrl.href);
if (!fileUrl || !fileUrl.href) {
throw new Error('No file URL returned');
}
} catch (error) {
console.error('Error getting file URL:', error);
await ctx.reply('Failed to retrieve file URL. Please try again later.');
return;
}
if (!fileUrl || !fileUrl.href) {
console.error('Failed to retrieve file URL from Telegram');
await ctx.reply('Failed to retrieve file URL.');
return;
}
const videoBuffer = (await axios.get(fileUrl.href, { responseType: 'arraybuffer' })).data;
const videoForm = new FormData();
videoForm.append('file', videoBuffer, { filename: 'video.mp4' });
const response = await axios.post('https://videy.co/api/upload', videoForm, {
headers: {
...videoForm.getHeaders(),
'Content-Type': 'multipart/form-data',
},
});
await ctx.reply(`Your video is uploaded: https://videy.co/v?id=${response.data.id}`);
} catch (error) {
console.error('Error uploading video:', error.response?.data || error.message);
await ctx.reply('An error occurred while uploading the video.');
}
});

bot.launch().then(console.log('Bot is running...'));
