import { Router } from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { JsonDb } from '../db.js';
import type { MenuItem, SiteSettings } from '../types.js';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const router = Router();
const menuDb = new JsonDb<MenuItem>('menu');
const settingsDb = new JsonDb<SiteSettings>('settings');

function getS3Client() {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });
}

function hasR2Config() {
  return !!(
    process.env.R2_ACCESS_KEY_ID &&
    !process.env.R2_ACCESS_KEY_ID.includes('your_') &&
    process.env.R2_SECRET_ACCESS_KEY &&
    !process.env.R2_SECRET_ACCESS_KEY.includes('your_') &&
    process.env.R2_ENDPOINT &&
    process.env.R2_BUCKET_NAME
  );
}

function getSettings(): SiteSettings {
  const existing = settingsDb.findById('site');
  if (existing) return existing;
  const defaults: SiteSettings = {
    id: 'site',
    heroImage: '/images/hero.jpg',
    logoImage: '/images/logo.jpg',
    eventBanner: '/images/event-banner.jpg',
    galleryImage1: '/images/hero.jpg',
    galleryImage2: '/images/logo.jpg',
    galleryImage3: '/images/event-banner.jpg',
    phone: '233554984950',
    whatsappMessage: "Hi Joviva Foods! I'd like to place an order.",
    instagramUrl: 'https://instagram.com/jovivafoods',
    tiktokUrl: 'https://tiktok.com/@jovivafoods',
    restaurantLat: 5.6891,
    restaurantLng: -0.1869,
    restaurantAddress: 'Kwabenya, Accra, Ghana',
  };
  settingsDb.create(defaults);
  return defaults;
}

async function uploadImageBuffer(buffer: Buffer): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME || '';
  const publicUrl = process.env.R2_PUBLIC_URL || '';
  const useR2 = hasR2Config();
  const ext = '.jpg';
  const key = `${randomUUID()}${ext}`;

  if (useR2) {
    await getS3Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
      })
    );
    return publicUrl
      ? `${publicUrl}/${key}`
      : `${process.env.R2_ENDPOINT}/${bucket}/${key}`;
  }

  // Fallback: save locally for dev/testing
  const uploadsDir = path.join(process.cwd(), 'uploads', 'menu');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const localPath = path.join(uploadsDir, key);
  fs.writeFileSync(localPath, buffer);
  return `${process.env.APP_URL || 'http://localhost:3001'}/uploads/menu/${key}`;
}

// Only initialize bot if token is present
let bot: TelegramBot | null = null;

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

if (TOKEN) {
  try {
    bot = new TelegramBot(TOKEN, { polling: true });
    console.log('Telegram bot initialized successfully');
  } catch (err: any) {
    console.error('Telegram bot init error:', err.message);
    bot = null;
  }
}

const mainKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '📋 View Menu', callback_data: 'menu' },
        { text: '➕ Add Item', callback_data: 'add_help' },
      ],
      [
        { text: '🖼 Update Hero', callback_data: 'hero_help' },
        { text: '🖼 Update Logo', callback_data: 'logo_help' },
        { text: '🖼 Update Banner', callback_data: 'banner_help' },
      ],
      [
        { text: '🗑 Delete Item', callback_data: 'delete_list' },
        { text: 'ℹ️ Help', callback_data: 'help' },
      ],
    ],
  },
};

function sendMenu(chatId: number) {
  const items = menuDb.findAll().filter((i) => i.available !== false);
  if (items.length === 0) {
    bot?.sendMessage(chatId, 'No menu items found.', mainKeyboard);
    return;
  }
  const lines = items.map(
    (i) => `• ${i.name} — GH₵${i.price} (${i.category})`
  );
  bot?.sendMessage(chatId, `*Current Menu:*\n\n${lines.join('\n')}`, {
    parse_mode: 'Markdown',
    ...mainKeyboard,
  });
}

if (bot) {
  bot.onText(/\/start/, (msg: any) => {
    bot?.sendMessage(
      msg.chat.id,
      '*Welcome to Joviva Foods Bot!* 🍲\n\n' +
      'Manage your restaurant menu and site images right here.\n\n' +
      'Choose an action below:',
      mainKeyboard,
    );
  });

  bot.on('callback_query', async (query: any) => {
    const chatId = query.message?.chat?.id;
    const data = query.data;
    if (!chatId || !data) return;

    await bot?.answerCallbackQuery(query.id);

    switch (data) {
      case 'menu':
        sendMenu(chatId);
        break;
      case 'add_help':
        bot?.sendMessage(
          chatId,
          '*How to add a menu item:*\n\n' +
          '1. Take or upload a photo\n' +
          '2. Add this caption:\n' +
          '`Name | Price | Category | Description`\n\n' +
          'Example:\n' +
          '`Jollof Rice | 40 | Rice Dishes | Spicy Ghanaian jollof with chicken`',
          { parse_mode: 'Markdown', ...mainKeyboard },
        );
        break;
      case 'hero_help':
        bot?.sendMessage(
          chatId,
          '*Update Hero Image:*\n\n' +
          'Send a photo with caption: `#hero`',
          { parse_mode: 'Markdown', ...mainKeyboard },
        );
        break;
      case 'logo_help':
        bot?.sendMessage(
          chatId,
          '*Update Logo:*\n\n' +
          'Send a photo with caption: `#logo`',
          { parse_mode: 'Markdown', ...mainKeyboard },
        );
        break;
      case 'banner_help':
        bot?.sendMessage(
          chatId,
          '*Update Banner:*\n\n' +
          'Send a photo with caption: `#banner`',
          { parse_mode: 'Markdown', ...mainKeyboard },
        );
        break;
      case 'delete_list': {
        const items = menuDb.findAll();
        if (items.length === 0) {
          bot?.sendMessage(chatId, 'No menu items to delete.', mainKeyboard);
          return;
        }
        const keyboard = items.map((i) => [
          { text: `🗑 ${i.name} — GH₵${i.price}`, callback_data: `delete:${i.id}` },
        ]);
        bot?.sendMessage(chatId, '*Tap an item to delete it:*', {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: keyboard },
        });
        break;
      }
      case 'help':
        bot?.sendMessage(
          chatId,
          '*Joviva Foods Bot Commands:*\n\n' +
          '📋 *View Menu* — See all current menu items\n' +
          '➕ *Add Item* — Send photo + `Name | Price | Category | Description`\n' +
          '🖼 *Update Images* — Send photo + `#hero`, `#logo`, or `#banner`\n' +
          '🗑 *Delete Item* — Remove items from the menu\n\n' +
          'All changes sync instantly to the website!',
          { parse_mode: 'Markdown', ...mainKeyboard },
        );
        break;
      default: {
        if (data.startsWith('delete:')) {
          const itemId = data.replace('delete:', '');
          const item = menuDb.findById(itemId);
          if (item) {
            menuDb.delete(itemId);
            bot?.sendMessage(chatId, `Deleted *${item.name}* ✅`, {
              parse_mode: 'Markdown',
              ...mainKeyboard,
            });
          } else {
            bot?.sendMessage(chatId, 'Item not found.', mainKeyboard);
          }
        }
        break;
      }
    }
  });

  bot.onText(/\/menu/, async (msg: any) => {
    sendMenu(msg.chat.id);
  });

  bot.onText(/\/settings/, async (msg: any) => {
    const settings = getSettings();
    bot?.sendMessage(
      msg.chat.id,
      `*Site Settings:*\n\n` +
      `Hero Image: ${settings.heroImage}\n` +
      `Logo Image: ${settings.logoImage}\n` +
      `Event Banner: ${settings.eventBanner}\n` +
      `Phone: ${settings.phone}\n\n` +
      `To update an image, send a photo with caption #hero, #logo, or #banner.`,
      mainKeyboard,
    );
  });

  bot.onText(/\/delete/, async (msg: any) => {
    const items = menuDb.findAll();
    if (items.length === 0) {
      bot?.sendMessage(msg.chat.id, 'No menu items to delete.', mainKeyboard);
      return;
    }
    const keyboard = items.map((i) => [
      { text: `🗑 ${i.name} — GH₵${i.price}`, callback_data: `delete:${i.id}` },
    ]);
    bot?.sendMessage(msg.chat.id, '*Tap an item to delete it:*', {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard },
    });
  });

  bot.on('text', async (msg: any) => {
    const text = (msg.text || '').trim();
    if (!text || text.startsWith('/')) return;

    // Handle deletion by name (reply to /delete message)
    if (msg.reply_to_message?.text?.includes('Delete an item:')) {
      const items = menuDb.findAll();
      const match = items.find((i) =>
        i.name.toLowerCase() === text.toLowerCase()
      );
      if (match) {
        menuDb.delete(match.id);
        bot?.sendMessage(msg.chat.id, `Deleted *${match.name}* ✅`, { parse_mode: 'Markdown' });
      } else {
        bot?.sendMessage(msg.chat.id, `Item "${text}" not found. Check the list and reply with the exact name.`);
      }
      return;
    }
  });

  bot.on('photo', async (msg: any) => {
    try {
      const chatId = msg.chat.id;
      const caption = (msg.caption || '').trim();

      // Handle site settings images (#hero, #logo, #banner)
      if (caption.startsWith('#')) {
        const settingKey = caption.toLowerCase();
        let field: keyof SiteSettings | null = null;
        let label = '';

        if (settingKey === '#hero') {
          field = 'heroImage';
          label = 'Hero image';
        } else if (settingKey === '#logo') {
          field = 'logoImage';
          label = 'Logo image';
        } else if (settingKey === '#banner') {
          field = 'eventBanner';
          label = 'Event banner';
        }

        if (field) {
          const photo = msg.photo?.[msg.photo.length - 1];
          if (!photo) {
            bot?.sendMessage(chatId, 'Could not process the photo.');
            return;
          }

          const fileLink = await bot!.getFileLink(photo.file_id);
          const imageRes = await fetch(fileLink);
          if (!imageRes.ok) {
            bot?.sendMessage(chatId, 'Failed to download photo from Telegram.');
            return;
          }
          const buffer = Buffer.from(await imageRes.arrayBuffer());
          const imageUrl = await uploadImageBuffer(buffer);

          const settings = getSettings();
          settingsDb.update('site', { ...settings, [field]: imageUrl });

          bot?.sendMessage(
            chatId,
            `Updated ${label} ✅\n\nNew URL: ${imageUrl}`,
            { parse_mode: 'Markdown' }
          );
          return;
        }
      }

      // Handle menu items
      if (!caption) {
        bot?.sendMessage(
          chatId,
          'Please send a photo with a caption.\n\n' +
          '*For menu items:* Name | Price | Category | Description\n' +
          '*For settings:* #hero, #logo, or #banner'
        );
        return;
      }

      const parts = caption.split('|').map((s: string) => s.trim());
      if (parts.length < 3) {
        bot?.sendMessage(
          chatId,
          'Caption format: Name | Price | Category | Description\n(Price must be a number)\n\n' +
          'Or use #hero, #logo, #banner to update site images.'
        );
        return;
      }

      const [name, priceStr, category, description = ''] = parts;
      const price = Number(priceStr);
      if (!name || isNaN(price) || !category) {
        bot?.sendMessage(
          chatId,
          'Invalid caption. Format: Name | Price | Category | Description'
        );
        return;
      }

      const photo = msg.photo?.[msg.photo.length - 1];
      if (!photo) {
        bot?.sendMessage(chatId, 'Could not process the photo.');
        return;
      }

      const fileLink = await bot!.getFileLink(photo.file_id);
      const imageRes = await fetch(fileLink);
      if (!imageRes.ok) {
        bot?.sendMessage(chatId, 'Failed to download photo from Telegram.');
        return;
      }
      const buffer = Buffer.from(await imageRes.arrayBuffer());
      const imageUrl = await uploadImageBuffer(buffer);

      // Check if this is a reply to an existing menu item message
      let updated = false;
      if (msg.reply_to_message?.text) {
        const replyText = msg.reply_to_message.text;
        const existing = menuDb.findAll().find((i) =>
          replyText.includes(i.name)
        );
        if (existing) {
          menuDb.update(existing.id, { image: imageUrl });
          bot?.sendMessage(
            chatId,
            `Updated image for *${existing.name}* ✅`,
            { parse_mode: 'Markdown' }
          );
          updated = true;
        }
      }

      if (!updated) {
        const newItem = menuDb.create({
          name,
          description,
          price,
          category,
          image: imageUrl,
          available: true,
          popular: false,
          featured: false,
        });
        bot?.sendMessage(
          chatId,
          `Added *${newItem.name}* to the menu ✅\nPrice: GH₵${newItem.price}\nCategory: ${newItem.category}`,
          { parse_mode: 'Markdown' }
        );
      }
    } catch (err: any) {
      console.error('Telegram photo handler error:', err);
      bot?.sendMessage(
        msg.chat.id,
        'Something went wrong processing your photo. Please try again.'
      );
    }
  });
}

// Health/status endpoint
router.get('/status', (_req, res) => {
  res.json({
    enabled: !!bot,
    tokenConfigured: !!process.env.TELEGRAM_BOT_TOKEN,
    bucket: process.env.R2_BUCKET_NAME || null,
  });
});

export default router;
