const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6983897462:AAF6LEhxhES6qg2aUReRFGlXL41W4HLU_OE';
const bot = new TelegramBot(token, {polling: true});
const solanaApiUrl = 'https://api.mainnet-beta.solana.com'; // URL de la Solana Explorer API

// Comando para obtener el precio de un token
bot.onText(/\/precio (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tokenContract = match[1];
  

  // Obtén el contrato del token desde el mensaje del usuario
  const userMessage = '/precio drakduQWnTS89CdTUdgHmZzEkN6reBLYqrk8rzVhU53'; // Ejemplo: reemplázalo con el mensaje real del usuario
  const tokenContract = userMessage.split(' ')[1];
  
  // Configura las opciones de la solicitud
  const options = {
    method: 'GET',
    headers: {'X-API-KEY': '05671c2d808b426097a1b59f0705762c'},
  };
  
  // Realiza la solicitud a la API con el contrato del token proporcionado por el usuario
  axios.get(`https://public-api.birdeye.so/public/price?address=${tokenContract}`, options)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  

 
});

// Otros comandos y mensajes
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/data (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  bot.sendMessage(chatId, message);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Received your message');
});

console.log("Estoy vivo!");
