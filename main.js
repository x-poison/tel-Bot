
const Telegraf = require('telegraf');

const Bot = new Telegraf('5627044029:AAGfMphlu9xFJ2v2sikyCPPhkXG02Xqf2ag');
const axios = require('axios');
const cheerio = require('cheerio');


//***********************************************************************************************************************8 */
// Middleware to check if the user is an admin
const groupCommands = ['kick', 'demote', 'mute', 'unmute', 'warn', 'delall', 'del', 'dban'];

Bot.use((ctx, next) => {
  const command = ctx.message.text.split(' ')[0].substring(1);

  // Check if the command is used in a PM
  if (ctx.chat.type === 'private' && groupCommands.includes(groupCommands)) {
    ctx.reply('This command is not available in private messages.');
    return;
  }

  return next();
});


let adminCheckMiddleware = async (ctx, next) => {
  const chatId = ctx.message.chat.id;
  const userId = ctx.message.from.id;

  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    try {
      const chatMember = await ctx.telegram.getChatMember(chatId, userId);
      const isAdmin = ['creator', 'administrator'].includes(chatMember.status);
      if (isAdmin || !groupCommands.includes(ctx.message.text.substr(1))) {
        return next();
      } else {
        ctx.reply('You need to be admin.');
      }
    } catch (error) {
      console.error(error);
      ctx.reply('Failed to check admin status.');
    }
  }
};

Bot.use(adminCheckMiddleware);




//***************************************************************************************************************************************8 */
/*Bot.command('help', async (ctx) => {
  // Command logic for help
});


//*********************************************************************************************************************************** */

Bot.command('promote', async (ctx) => {
  if (!ctx.message.reply_to_message && ctx.message.text.split(' ').length < 2) {
    ctx.reply('Please reply to a user message or provide a username to promote.');
    return;
  }

  let userId;

  if (ctx.message.reply_to_message) {
    userId = ctx.message.reply_to_message.from.id;
  } else {
    const username = ctx.message.text.split(' ')[1];
    const chatId = ctx.chat.id;

    try {
      const user = await ctx.telegram.getChatMember(chatId, username);
      userId = user.user.id;
    } catch (error) {
      console.error(error);
      ctx.reply('User not found.');
      return;
    }
  }

  try {
    await ctx.promoteChatMember(userId, { can_change_info: true, can_delete_messages: true });
    ctx.reply('User has been promoted successfully.');
  } catch (error) {
    console.error(error);
    ctx.reply('Failed to promote the user.');
  }
});


Bot.on('hello', (ctx) => {
  const { chat } = ctx.message;

  if (chat.type === 'group' || chat.type === 'supergroup') {
      ctx.reply('Hello group members!');
  } else {
      ctx.reply('This command is only available in group chats.');
  }
});


//******************************************************************************************************************************************* */

Bot.command('demote', async (ctx) => {
  if (!ctx.message.reply_to_message) {
    ctx.reply('Please reply to a user message to demote them.');
    return;
  }

  const userId = ctx.message.reply_to_message.from.id;

  try {
    await ctx.restrictChatMember(userId, {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_polls: false,
      can_send_other_messages: false,
      can_add_web_page_previews: true,
      can_change_info: false,
      can_invite_users: true,
      can_pin_messages: false,
    });
    ctx.reply('User has been demoted successfully.');
  } catch (error) {
    console.error(error);
    ctx.reply('Failed to demote the user.');
  }
});


//********************************************************************************************************************************************** */

Bot.command('mute', async (ctx) => {
  if (!ctx.message.reply_to_message) {
    ctx.reply('Please reply to a user message to mute them.');
    return;
  }

  const userId = ctx.message.reply_to_message.from.id;

  try {
    await ctx.restrictChatMember(userId, {
      can_send_messages: false,
      can_send_media_messages: false,
      can_send_polls: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
    });
    ctx.reply('User has been muted successfully.');
  } catch (error) {
    console.error(error);
    ctx.reply('Failed to mute the user.');
  }
});

//**************************************************************************************************************************************************** */
Bot.command('unmute', async (ctx) => {
  if (!ctx.message.reply_to_message) {
    ctx.reply('Please reply to a user message to unmute them.');
    return;
  }

  const userId = ctx.message.reply_to_message.from.id;

  try {
    await ctx.restrictChatMember(userId, {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_polls: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
    });
    ctx.reply('User has been unmuted successfully.');
  } catch (error) {
    console.error(error);
    ctx.reply('Failed to unmute the user.');
  }
});


/*******************************************************************************************************************************8 */

Bot.command(['help', 'menu'], async (ctx) => {
  const botUsername = ctx.botInfo.username;

  const helpMessage = `\n
  ╭━━━〔 Welcome 〕━━━┈⊷
  │╭──────────────┈⊷
  ││◦➛ /kick
  ││◦➛ /dwarn
  ││◦➛ /warn
  ││◦➛ /groupinfo
  ││◦➛ /dbarn
  ││◦➛ /del
  ││◦➛ /gpt
  ││◦➛ /delall
  ││ ◦➛ /mute
  ││◦➛ /unmute
  ││◦➛ /promote
  ││◦➛ /demote
  │╰────────────────┈⊷
  ╰─────────────────┈⊷
    

    If you have any further questions or need assistance, please contact me by sending a message to @${botUsername}.
  `;

  // Send the help message in a private chat
  ctx.telegram.sendMessage(ctx.from.id, helpMessage, { parse_mode: 'Markdown' });
});


//*********************************************************************************************************************************************** */
Bot.command('warn', async (ctx) => {
  // Check if the command was a reply to a message
  if (!ctx.message.reply_to_message) {
    ctx.reply('Please reply to a user message to warn them.');
    return;
  }

  // Get the user ID and name of the replied message
  const userId = ctx.message.reply_to_message.from.id;
  const userName = ctx.message.reply_to_message.from.username || ctx.message.reply_to_message.from.first_name;

  try {
    ctx.reply(`@${userName} has been warned`);
  } catch (error) {
    console.error(error);
    ctx.reply('Failed to warn the user.');
  }
});

Bot.command('start', (ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name;

  const welcomeMessage = `Hello There ${firstName}! Am made by @kesandy with Node.js how can i assist you?\n
  contact me in pm for commands! or tap /help command.
  
  
  `;

  ctx.reply(welcomeMessage);
});

//********************************************************************************************************************************************************//
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

//******************************************************************************************************************************************************************* */
Bot.command('delall', async (ctx) => {
  if (ctx.message.reply_to_message) {
    const userId = ctx.message.reply_to_message.from.id;

    try {
      await ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      const chatHistory = await ctx.telegram.getChatHistory(ctx.message.chat.id);
      for (const message of chatHistory.messages) {
        if (message.from.id === userId) {
          await ctx.telegram.deleteMessage(ctx.message.chat.id, message.message_id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      await ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      await ctx.telegram.deleteChatHistory(ctx.message.chat.id);
    } catch (error) {
      console.error(error);
    }
  }
});

//********************************************************************************************************************************************************************************** */
Bot.command('dban', async (ctx) => {
  // Check if the command is a reply to a message
  const replyMessage = ctx.message.reply_to_message;
  if (!replyMessage) {
    ctx.reply('Please reply to a message to delete and ban the user.');
    return;
  }

  try {
    const chatId = ctx.message.chat.id;
    const userId = replyMessage.from.id;

    // Delete the message
    await ctx.telegram.deleteMessage(chatId, replyMessage.message_id);

    // Ban the user
    await ctx.telegram.kickChatMember(chatId, userId);

    ctx.reply('Message deleted and user banned successfully.');
  } catch (error) {
    console.error(error);
    ctx.reply('Failed to delete the message and ban the user.');
  }
});



//************************************************************************************************************************************************************************************* */

Bot.command('gpt', async (ctx) => {
  try {
    const inputWords = ctx.message.text.split(' ').slice(1).join(' ');
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(inputWords)}`);
    const $ = cheerio.load(response.data);
    const explanation = $('div').text();
    const chunks = splitTextIntoChunks(explanation, 4000); 
    for (const chunk of chunks) {
      ctx.reply(chunk);
    }
  } catch (error) {
    console.error(error);
    ctx.reply('Failed to search for information.');
  }
});

function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  let index = 0;

  while (index < text.length) {
    chunks.push(text.substr(index, chunkSize));
    index += chunkSize;
  }

  return chunks;
}

//*****************************************************************************************************pm */
Bot.command('tagall', async (ctx) => {
  try {
    const chatId = ctx.message.chat.id;

    // Get the total number of chat members
    const membersCount = await ctx.telegram.getChatMembersCount(chatId);

    // Array to store the tag strings
    const tagStrings = [];

    // Retrieve the user information for each member
    for (let i = 0; i < membersCount; i++) {
      try {
        const memberId = (await ctx.telegram.getChatMember(chatId, i)).user.id;
        const member = await ctx.telegram.getUser(memberId);
        const username = member.username || member.first_name;
        
        // Check if the member has a username
        if (username) {
          tagStrings.push(`@${username}`);
        }
      } catch (error) {
        console.error(`Failed to retrieve information for member ${i + 1}`);
        console.error(error);
      }
    }

    // Send the tag messages
    for (const tagString of tagStrings) {
      await ctx.reply(tagString);
    }
  } catch (error) {
    console.error(error);
    ctx.reply('Failed to tag all group members.');
  }
});

Bot.on('text', async (ctx) => {
  // Check if the message is in a private chat (DM)
  if (ctx.chat.type === 'private') {
    // Check if the text is 'add me to group'
    if (ctx.message.text.toLowerCase() === 'add me to group') {
      ctx.reply('To add me to a group, simply invite me to the desired group and grant me the necessary permissions.');
    } else {
      // Respond with a default message for other texts in DM
      ctx.reply('I only respond to the command "add me to group" in direct messages.');
    }
  }
});

let gameModeEnabled = false;

// Enable game mode command
Bot.command('enablegamemode', (ctx) => {
  gameModeEnabled = true;
  ctx.reply('Game mode enabled. Use /lottery to play the game.');
});

// Disable game mode command
Bot.command('disablegamemode', (ctx) => {
  gameModeEnabled = false;
  ctx.reply('Game mode disabled.');
});

// Lottery game command
Bot.command('lottery', (ctx) => {
  if (gameModeEnabled) {
    // Generate a random number between 1 and 10
    const winningNumber = Math.floor(Math.random() * 10) + 1;

    // Generate a random number for the user
    const userNumber = Math.floor(Math.random() * 10) + 1;

    // Check if the user won or lost
    const result = winningNumber === userNumber ? 'Congratulations! You won!' : 'Sorry, you lost. Try again!';

    ctx.reply(`Winning number: ${winningNumber}\nYour number: ${userNumber}\n${result}`);
  } else {
    ctx.reply('Game mode is not enabled. Use /enablegamemode to start the game mode.');
  }
});

Bot.command('commands', (ctx) => {
  const commands = [
    '/start - Start the bot',
    '/help - Show help information',
    '/enablegamemode - Enable game mode',
    '/disablegamemode - Disable game mode',
    '/lottery - Play the lottery game'
  ];

  const buttons = commands.map((command) =>
    Markup.button.callback(command, `command:${command}`)
  );

  const keyboard = Markup.inlineKeyboard(buttons, { columns: 1 });

  ctx.reply('List of Commands:', keyboard);
});

// Handle command button callback
Bot.action(/^command:(.*)/, (ctx) => {
  const command = ctx.match[1];
  ctx.reply(`You clicked on the command: ${command}`);
});

//**************************************************************************************************************d */
Bot.command('kick', async (ctx) => {
  // Check if the command is a reply to a message
  const replyMessage = ctx.message.reply_to_message;
  if (!replyMessage || !replyMessage.from) {
    ctx.reply('Please reply to a user\'s message to kick them.');
    return;
  }

  const userId = replyMessage.from.id;
  const chatId = ctx.message.chat.id;

  try {
    // Kick the user
    await ctx.telegram.kickChatMember(chatId, userId);

    ctx.reply('User has been kicked successfully.');
  } catch (error) {
    console.error(error);
    ctx.reply('Failed to kick the user.');
  }
});



Bot.launch();

