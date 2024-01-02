const solanaWeb3 = require("@solana/web3.js");
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('6983897462:AAF6LEhxhES6qg2aUReRFGlXL41W4HLU_OE', { polling: true });

// Maneja el comando /home
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Crea un teclado en línea con un botón para "Precio"
  const keyboard = {
    inline_keyboard: [
      [
        { text: 'Precio', callback_data: 'precio' },
      ],
      // Agrega más botones según sea necesario
    ],
  };

  // Envia un mensaje con el teclado en línea
  bot.sendMessage(chatId, 'Selecciona una opción:', { reply_markup: keyboard });
});

// Variable de estado para rastrear el estado actual del usuario
const userState = {};

// Maneja la respuesta del usuario al seleccionar un botón en línea
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  // Verifica qué botón se seleccionó
  if (query.data === 'precio') {
    // Establece el estado del usuario para indicar que se está esperando el contrato
    userState[chatId] = 'waiting_for_contract';

    // Envia un mensaje solicitando al usuario que envíe el contrato
    bot.sendMessage(chatId, 'Por favor, envía el contrato del token:');
  } else {
    // Si no se selecciona un botón válido
    bot.sendMessage(chatId, 'Por favor, selecciona una opción válida.');
  }
});

// Maneja la respuesta del usuario con el contrato
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text.trim();

  // Verifica si el usuario está en el estado "waiting_for_contract"
  if (userState[chatId] === 'waiting_for_contract') {
    if (userMessage.length > 0) {
      // Configura las opciones de la solicitud
      const options = {
        method: 'GET',
        headers: { 'X-API-KEY': '05671c2d808b426097a1b59f0705762c' },
      };

      // Realiza la solicitud a la API con el contrato del token proporcionado por el usuario
      axios.get(`https://public-api.birdeye.so/public/price?address=${userMessage}`, options)
        .then(response => {
          const responseData = response.data;

          // Envia la respuesta al chat del usuario
          bot.sendMessage(chatId, `Datos del token:
Nombre del token:OMNICAT
Precio del Token: ${responseData.data.value}`);  // Agrega los demás datos que deseas mostrar
//contrato de prueba 7mmXL6Et4SbpDs2iXoZQ3oPEeXeAiyETxh1QjDNi5qnV
          // Restablece el estado del usuario después de procesar la solicitud
          delete userState[chatId];
        })
        .catch(error => {
          console.error(error);

          // Envia un mensaje de error al chat del usuario
          bot.sendMessage(chatId, 'Error al obtener los datos del token. Por favor, verifica el contrato e inténtalo de nuevo.');

          // Restablece el estado del usuario después de procesar la solicitud
          delete userState[chatId];
        });
    } else {
      // Si el usuario no proporciona un contrato válido
      bot.sendMessage(chatId, 'El contrato proporcionado no es válido. Por favor, inténtalo nuevamente.');

      // Restablece el estado del usuario después de procesar la solicitud
      delete userState[chatId];
    }
  }
});
