import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import bodyParser from 'body-parser';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '..', '.env') });

export const token       = process.env.AUTHORIZATION_TOKEN as string;
export const host        = process.env.APP_HOST as string;
export const port        = process.env.APP_PORT || 80;
export const certificate = process.env.SSL_CERT;

// Telegram Bot
const api = new TelegramBot(token, { polling: true });
api.setWebHook(`https://${host}/bot${token}`, { certificate });

// Express
const app = express();
app.use(bodyParser.json());
app.post(`/bot${token}`, (req, res): void => {
  api.processUpdate(req.body);
  res.sendStatus(200);
});
app.listen(port);

api.on('sticker', (message): void => {
  const { from, chat } = message;

  if ( chat.type === 'supergroup' ) {

    api.exportChatInviteLink(chat.id).then((inviteLink) => {
      if ( inviteLink instanceof Error ) {
        api.sendMessage(chat.id, 'Error: Failed to get the invite link of this group');
        return;
      }

      const notificationMessage = `Join link of ${chat.title}:\n${inviteLink}`;

      api.kickChatMember(chat.id, from.id).then(() => {
        api.sendMessage(from.id, notificationMessage);
      });
    });
  }
});
