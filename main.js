
const Telegraf = require('telegraf');

const Bot = new Telegraf('5627044029:AAEe2G7Tw3N6SkxbmMXYxt90hMGrLayjVrg');

const groupCommands = [
  '╭━────━━〔 Welcome 〕━━┈⊷',
  '│╭────────────────────┈⊷',
  '││ /kick - removeruser ',
  '││                                ',
  '││ /mute - stopuser!             ',
  '││                                ',
  '││ /unmute - unmuteuser!          ',
  '││                                ',
  '││ /del - deletemessage!         ',
  '││                                ',
  '││ /commands - allcommands        ',
  '││                                ',
  '││ /demote - remove admin!        ',
  '││                                ',
  '││ /promote - make useradmin     ',
  '││                               ',
  '││ /warn - issue warning          ',
  '││                                ',
  '││ /kickme - user to leave        ',
  '│╰───────────────────────⊷',
  '╰───────────────────────┈⊷',
 
 
];


let adminCheckMiddleware = async (ctx, next) => {
  const chatId = ctx.message.chat.id;
  const userId = ctx.message.from.id;

  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    try {
      const chatMember = await ctx.telegram.getChatMember(chatId, userId);
      const isAdmin = ['creator', 'administrator'].includes(chatMember.status);

      if (isAdmin || !groupCommands.includes(ctx.message.text.split(' ')[0])) {
        return next();
      } else {
        return ctx.reply('You need to be an admin to use this command in a group.');
      }
    } catch (error) {
      console.error(error);
      return ctx.reply('Failed to check admin status.');
    }
  } else {
    return ctx.reply('Am a chatbot designed to help only in group!');
  }
};

Bot.use(adminCheckMiddleware);

Bot.command('/kick', async (ctx) => {
  const mentionedUser = ctx.message.reply_to_message?.from;

  if (!mentionedUser) {
    return ctx.reply('Please reply to a user message to kick them.');
  }

  const kickedUserId = mentionedUser.id;
  const groupId = ctx.message.chat.id;

  try {

    if (isAdmin) {
      return ctx.reply('You cannot warn an admin user.');
    }
    await ctx.telegram.kickChatMember(groupId, kickedUserId);
    ctx.reply(`User ${mentionedUser.first_name} has been kicked from the group.`);
  } catch (error) {
    console.error('Error occurred while kicking user:', error);
    ctx.reply("I can't kick myself!☹️");
  }
OBOB});

OBOB
Bot.command('/mute', async (ctx) => {
OBOBOBOBOBOBOBOBOB  const mentionedUser = ctx.message.reply_to_message?.from;
OBOBOB
OBOBOBOBOBOB  if (!mentionedUser) {
    return ctx.reply('Please reply to a user message to mute them.');
  }

OBOB  const mutedUserId = mentionedUser.id;
  const groupId = ctx.message.chat.id;

  try {
OBOBOBOBOBOBOBOBOBOBOB    await ctx.telegram.restrictChatMember(groupId, mutedUserId, {
      can_send_messages: false,
OB      can_send_media_messages: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false
    });
OBOBOBOBOBOB    ctx.reply(`User ${mentionedUser.first_name} has been muted in the group.`);
  } catch (error) {
OB    console.error('Error occurred while muting user:', error);
    ctx.reply("I can't mute myself!☹️");
OBOBOBOBOB  }
});
OBOB
Bot.command('/unmute', async (ctx) => {
  const mentionedUser = ctx.message.reply_to_message?.from;

OBOB  if (!mentionedUser) {
    return ctx.reply('Please reply to a user message to unmute them.');
OB  }

OB  const unmutedUserId = mentionedUser.id;
  const groupId = ctx.message.chat.id;

  try {
    await ctx.telegram.restrictChatMember(groupId, unmutedUserId, {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true
    });
    ctx.reply(`User ${mentionedUser.first_name} can talk now!☹️.`);
  } catch (error) {
    console.error('Error occurred while unmuting user:', error);
    ctx.reply('An error occurred while trying to unmute the user. Please try again later.');
  }
});

Bot.command('del', async (ctx) => {
  if (ctx.message.reply_to_message) {
    try {
      await ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.reply_to_message.message_id);
    } catch (error) {
      console.error(error);
    }
  } else {
    ctx.reply('Reply to a message to delete it!.');
  }
});


Bot.command('/promote', async (ctx) => {
  const mentionedUser = ctx.message.reply_to_message?.from;

  if (!mentionedUser) {
    return ctx.reply('Please reply to a user message to promote them.');
  }

  const promotedUserId = mentionedUser.id;
  const groupId = ctx.message.chat.id;

  try {
    await ctx.telegram.promoteChatMember(groupId, promotedUserId, {
      can_change_info: true,
      can_post_messages: true,
      can_edit_messages: true,
      can_delete_messages: true,
      can_invite_users: true,
      can_restrict_members: true,
      can_pin_messages: true,
      can_promote_members: true
    });
    ctx.reply(`User ${mentionedUser.first_name} has been promoted in the group.`);
  } catch (error) {
    console.error('!:', error);
    ctx.reply('Am already admin🥺.');
  }
});

Bot.command('/demote', async (ctx) => {
  const repliedMessage = ctx.message.reply_to_message;

  if (!repliedMessage || !repliedMessage.from) {
    return ctx.reply('Please reply to a user message to demote them.');
  }

  const demotedUserId = repliedMessage.from.id;
  const groupId = ctx.message.chat.id;

  try {
    await ctx.telegram.promoteChatMember(groupId, demotedUserId, {
      can_change_info: false,
      can_post_messages: false,
      can_edit_messages: false,
      can_delete_messages: false,
      can_invite_users: false,
      can_restrict_members: false,
      can_pin_messages: false,
      can_promote_members: false
    });
    ctx.reply(`User ${repliedMessage.from.first_name} has been demoted in the group.`);
  } catch (error) {
    console.error('Error occurred while demoting user:', error);
    ctx.reply("I can't demote myself, you have to remove me manually!🥺");
  }
});



Bot.command('/warn', async (ctx) => {
  const repliedMessage = ctx.message.reply_to_message;

  if (!repliedMessage || !repliedMessage.from) {
    return ctx.reply('Please reply to a user message to warn them.');
  }
  

  const warnedUser = repliedMessage.from;
  const groupId = ctx.message.chat.id;

  try {

    if (isAdmin) {
      return ctx.reply('You cannot warn an admin user.');
    }
   
    await ctx.telegram.sendMessage(warnedUser.id, 'You have been warned in the group.');

    ctx.reply(`User ${warnedUser.first_name} has been warned in the group.`);
  } catch (error) {
    console.error('!', error);
    ctx.reply("I can't warn an Admin!");
  }
});


Bot.command('/kickme', async (ctx) => {
  const { message } = ctx;

  if (message.chat.type !== 'group' && message.chat.type !== 'supergroup') {
    return ctx.reply('This command can only be used in a group.');
  }

  const userId = message.from.id;
  const groupId = message.chat.id;

  try {
    const chatMember = await ctx.telegram.getChatMember(groupId, userId);
    const isAdmin = ['creator', 'administrator'].includes(chatMember.status);

    if (isAdmin) {
      return ctx.reply('You cannot use this command as an admin.');
    }

    await ctx.telegram.kickChatMember(groupId, userId);
    ctx.reply('Was nice to meet you!');
  } catch (error) {
    console.error('Error occurred while kicking user:', error);
    ctx.reply('Please try again later!.');
  }
});

Bot.command('/start', (ctx) => {
  const developerInfo = {
    Developer: 'Abdulrahman🤩',
    script: 'https://github.com/x-poison/tel-Bot',
    website: 'https://www.youtube.com/@poisonmods',
    pm: 'https://t.me/kesandy',
  };

  const message = `Welcome to the Halima Sweet bot🫣!\n\nThis bot is developed by\n\n ${developerInfo.Developer}.\n\nIf you want script of this bot👨‍💻\n\n ${developerInfo.script}\n\nVisit the developer's website for more information:\n\n ${developerInfo.website}\n\nPm me if you encounter issue:🤗\n\n ${developerInfo.pm}`;

  ctx.reply(message);
});



Bot.command('/commands', async (ctx) => {
  const commandsList = groupCommands.join('\n');
  ctx.reply(`Available commands:\n${commandsList}`);
});


Bot.launch();

