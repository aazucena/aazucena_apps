console.log('🌐 Starting AZUCENA_LYTICS Infrastructure Services...');

// 1. Start the Socket.IO Broadcast Bridge
import './bridge';

// 2. Start the System Integrity Heartbeat Monitor
import './heartbeat';
