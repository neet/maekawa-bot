"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
// import express from 'express';
// import bodyParser from 'body-parser';
const path_1 = require("path");
dotenv_1.default.config({ path: path_1.resolve(__dirname, '..', '.env') });
exports.token = process.env.AUTHORIZATION_TOKEN;
// export const host        = process.env.APP_HOST as string;
// export const port        = process.env.APP_PORT || 80;
// export const certificate = process.env.SSL_CERT;
// Telegram Bot
const api = new node_telegram_bot_api_1.default(exports.token, { polling: true });
// api.setWebHook(`https://${host}/bot${token}`, { certificate });
// Express
// const app = express();
// app.use(bodyParser.json());
// app.post(`/bot${token}`, (req, res): void => {
//   api.processUpdate(req.body);
//   res.sendStatus(200);
// });
// app.listen(port);
api.on('sticker', (message) => {
    const { from, chat } = message;
    if (chat.type === 'supergroup') {
        api.exportChatInviteLink(chat.id).then((inviteLink) => {
            if (inviteLink instanceof Error) {
                api.sendMessage(chat.id, 'Error: 招待URLの取得に失敗');
                return;
            }
            const notificationMessage = `Join link of ${chat.title}:\n${inviteLink}`;
            api.kickChatMember(chat.id, from.id).then(() => {
                api.sendMessage(from.id, notificationMessage);
            });
        });
    }
});
//# sourceMappingURL=index.js.map