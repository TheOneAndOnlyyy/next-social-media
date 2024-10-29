import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const path = '/api/socket';
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      const userId = socket.handshake.auth.userId;
      
      if (userId) {
        socket.join(`user:${userId}`);
        
        socket.on('disconnect', () => {
          socket.leave(`user:${userId}`);
        });
      }
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const GET = ioHandler;
export const POST = ioHandler;