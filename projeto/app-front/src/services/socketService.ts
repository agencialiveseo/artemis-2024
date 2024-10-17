// src/services/socketService.js
import { io } from 'socket.io-client';
import { ref, onUnmounted } from 'vue';

const socketService = () => {
  const socket = ref();

  const connect = () => {
    socket.value = io('http://localhost:3000/crawler'); // Conectar ao namespace /crawler
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
    }
  };

  const onCrawlerUpdate = (callback: Function) => {
    if (socket.value) {
      socket.value.on('CRAWLER.UPDATE', callback);
    }
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    connect,
    onCrawlerUpdate,
    disconnect,
  };
};

export default socketService;
