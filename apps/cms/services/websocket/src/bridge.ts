import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.WS_PORT || 3001;
const INTERNAL_SECRET = process.env.WS_INTERNAL_SECRET || 'dev-secret-123';

const server = http.createServer((req, res) => {
  // 1. API: Internal Emission Endpoint
  if (req.url === '/emit' && req.method === 'POST') {
    if (req.headers['x-internal-secret'] !== INTERNAL_SECRET) {
      res.writeHead(401);
      return res.end('Unauthorized');
    }

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        io.emit('telemetry_signal', payload);
        res.writeHead(200);
        res.end('OK');
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid Payload');
      }
    });
    return;
  }

  // 2. UI: Status Page
  if (req.url === '/status' && req.method === 'GET') {
    const clients = io.engine.clientsCount;
    const uptime = Math.floor(process.uptime());
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
    <html>
        <head>
            <title>WebSocket Bridge Status</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <meta http-equiv="refresh" content="5">
        </head>
        <body class="bg-zinc-950 text-zinc-100 font-mono p-12 min-h-screen flex items-center justify-center">
            <div class="w-full max-w-2xl border border-zinc-800 rounded-[2rem] p-10 bg-zinc-900/50 shadow-2xl backdrop-blur-xl">
                <div class="flex items-center justify-between mb-10">
                    <div>
                        <h1 class="text-3xl font-black tracking-tighter text-white uppercase">Socket<span class="text-indigo-500">_Bridge</span></h1>
                        <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2">Real-time Telemetry Hub</p>
                    </div>
                    <div class="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]"></div>
                </div>

                <div class="grid grid-cols-2 gap-8 mb-10">
                    <div class="p-6 bg-black/40 rounded-2xl border border-zinc-800">
                        <p class="text-zinc-500 text-[9px] uppercase font-black tracking-widest mb-2">System Uptime</p>
                        <p class="text-4xl font-black tracking-tight">${uptime}<span class="text-sm text-zinc-600 ml-1">s</span></p>
                    </div>
                    <div class="p-6 bg-black/40 rounded-2xl border border-zinc-800">
                        <p class="text-zinc-500 text-[9px] uppercase font-black tracking-widest mb-2">Active Clients</p>
                        <p class="text-4xl font-black tracking-tight text-indigo-400">${clients}</p>
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <div class="flex justify-between items-center text-xs text-zinc-400 py-3 border-b border-zinc-800/50">
                        <span class="font-bold uppercase tracking-wider">Protocol</span>
                        <span class="font-mono text-zinc-500">Socket.IO v4</span>
                    </div>
                    <div class="flex justify-between items-center text-xs text-zinc-400 py-3">
                        <span class="font-bold uppercase tracking-wider">Status</span>
                        <span class="font-mono text-emerald-500 font-bold">OPERATIONAL</span>
                    </div>
                </div>
            </div>
        </body>
    </html>
    `);
    return;
  }

  // 3. Redirect / to /status
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(302, { 'Location': '/status' });
    res.end();
    return;
  }

  res.writeHead(404);
  res.end();
});

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`[WS] Dashboard connected: ${socket.id}`);
});

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 WebSocket Bridge listening on port ${PORT}`);
});

export default io;
