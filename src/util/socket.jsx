import { io } from 'socket.io-client';
import { URL } from '../configs/api';

const token =
  localStorage.getItem('token') || localStorage.getItem('demoToken');

export const socketIo = io(URL, {
  transports: ['websocket'],
  query: {
    token,
  },
});

export const connectSocketIo = () => {
  socketIo.on('connect', (res) => {
    console.log('connect');
  });

  socketIo.on('connect_error', (res) => {
    console.error('auth', res);
  });
};
