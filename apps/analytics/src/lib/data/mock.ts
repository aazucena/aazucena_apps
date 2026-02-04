// Helper to generate monthly dates from a start year to now
const generateMonthlyDates = (startYear: number) => {
  const dates = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  for (let year = startYear; year <= currentYear; year++) {
    const endMonth = year === currentYear ? currentMonth : 11;
    for (let month = 0; month <= endMonth; month++) {
      dates.push(new Date(year, month, 1).toISOString().split('T')[0]);
    }
  }
  return dates;
};

export const ALL_CATEGORIES = ['Page View', 'Music Play', 'Interaction', 'Form Submit', 'Error'];

// Generate data starting from 2016
const DATES = generateMonthlyDates(2016);

/**
 * 1. Heatmap Data (Density Analysis)
 * Used by Heatmap.tsx
 */
export const MOCK_VISITORS = DATES.map((date) => ({
  date,
  count: Math.floor(Math.random() * 50) + 10,
  category: ['Page View', 'Music Play', 'Interaction'][Math.floor(Math.random() * 3)],
  categoryDistribution: {
    'Page View': Math.floor(Math.random() * 20),
    'Music Play': Math.floor(Math.random() * 15),
    'Interaction': Math.floor(Math.random() * 10),
    'Form Submit': Math.floor(Math.random() * 5),
    'Error': Math.floor(Math.random() * 2),
  }
}));

/**
 * 2. Stream Graph Data (Event Momentum)
 * Used by StreamGraph.tsx
 */
export const MOCK_EVENTS_STREAM = DATES.map((date) => ({
  date,
  'Page View': Math.floor(Math.random() * 100) + 50,
  'Music Play': Math.floor(Math.random() * 80) + 20,
  'Interaction': Math.floor(Math.random() * 60) + 10,
  'Form Submit': Math.floor(Math.random() * 20),
  'Error': Math.floor(Math.random() * 5),
}));

/**
 * 3. Recent Logs (Raw Telemetry)
 * Used by TelemetryFeed.tsx
 */
export const MOCK_RECENT_LOGS = [
  {
    id: '1',
    event: 'Page View',
    timestamp: new Date().toISOString(),
    url: '/projects/analytics-dashboard',
    sessionId: 'sess_9921x',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    country: 'CA',
    data: { referrer: 'google.com', performance_ms: 120 }
  },
  {
    id: '2',
    event: 'Music Play',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    url: '/music',
    sessionId: 'sess_4412z',
    userAgent: 'iPhone / Safari 17.2',
    country: 'US',
    data: { track: 'Neon Lights', volume: 80 }
  },
  {
    id: '3',
    event: 'Error',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    url: '/api/contact',
    sessionId: 'sess_9921x',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    country: 'DE',
    data: { code: '500', message: 'Database connection timeout' }
  },
  {
    id: '4',
    event: 'Interaction',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    url: '/',
    sessionId: 'sess_1102a',
    userAgent: 'Chrome 120.0.0',
    country: 'UK',
    data: { component: 'Hero3D', action: 'rotate_camera' }
  },
  {
    id: '5',
    event: 'Form Submit',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    url: '/contact',
    sessionId: 'sess_8821b',
    userAgent: 'Android / Chrome Mobile',
    country: 'JP',
    data: { form_type: 'collaboration', success: true }
  }
];

/**
 * 4. Top Music Tracks (Audio Intelligence)
 * Used by Music Analytics Page
 */
export const MOCK_MUSIC_TRACKS = [
  { rank: 1, title: 'Neon Lights', artist: 'Azucena', plays: 1245, completionRate: 88, genre: 'Synthwave' },
  { rank: 2, title: 'Cyberpunk City', artist: 'Azucena', plays: 982, completionRate: 75, genre: 'Cyberpunk' },
  { rank: 3, title: 'Midnight Drive', artist: 'Azucena', plays: 856, completionRate: 92, genre: 'Synthwave' },
  { rank: 4, title: 'Digital Rain', artist: 'Azucena', plays: 654, completionRate: 60, genre: 'Ambient' },
  { rank: 5, title: 'System Core', artist: 'Azucena', plays: 432, completionRate: 45, genre: 'Industrial' },
];

export const MOCK_GENRE_DISTRIBUTION = [
  { name: 'Synthwave', value: 45 },
  { name: 'Cyberpunk', value: 30 },
  { name: 'Ambient', value: 15 },
  { name: 'Industrial', value: 10 },
];

/**
 * 5. Performance Metrics (System Integrity)
 * Used by Performance Page
 */
export const MOCK_PERFORMANCE_METRICS = [
  { label: 'API Latency', value: '42ms', status: 'optimal', trend: '-5ms' },
  { label: 'Database IOPS', value: '1.2k', status: 'optimal', trend: '+120' },
  { label: 'Memory Usage', value: '64%', status: 'warning', trend: '+8%' },
  { label: 'Error Rate', value: '0.02%', status: 'optimal', trend: '0.00%' },
];

export const MOCK_LATENCY_HISTORY = DATES.map((date) => ({
  date,
  'API': Math.floor(Math.random() * 50) + 20,
  'Database': Math.floor(Math.random() * 30) + 10,
  'Cache': Math.floor(Math.random() * 10) + 2,
}));


// --- MOCK DATA ---
export const MOCK_TRAJECTORIES = [
  {
    id: 'AGENT_SESSION_LX42',
    agent: 'Intel_Analyst_v1 (LangGraph)',
    timestamp: new Date().toISOString(),
    totalReward: 1.0, // Binary success/fail
    length: 4,
    steps: [
      { 
        step: 0, 
        observation: 'User Query: "Why is the portfolio latency high?"', 
        action: 'PLAN_REASONING', 
        reward: 0, 
        probability: 0.99, 
        metadata: { 
          intent: 'infrastructure_diagnosis',
          initial_hypothesis: 'ClickHouse buffer congestion'
        } 
      },
      { 
        step: 1, 
        observation: 'Awaiting data from performance metrics table.', 
        action: 'CALL_TOOL: query_clickhouse', 
        reward: 0.2, 
        probability: 0.95, 
        metadata: { 
          query: 'SELECT avg(latency_ms) FROM telemetry_events WHERE event = "PerformanceMetric"',
          result_latency: '142ms' 
        } 
      },
      { 
        step: 2, 
        observation: 'Latency is within normal HTTP range, but TTFB is high.', 
        action: 'CALL_TOOL: check_ufw_status', 
        reward: 0.5, 
        probability: 0.88, 
        metadata: { 
          command: 'sudo ufw status',
          detected_issue: 'Port 4321 throttle active' 
        } 
      },
      { 
        step: 3, 
        observation: 'Issue identified: Firewall throttling on the host bridge.', 
        action: 'FINALIZE_RESPONSE', 
        reward: 1.0, 
        probability: 0.99, 
        metadata: { 
          resolution: 'Recommend running "sudo ufw allow in on docker0"',
          confidence: 'high'
        } 
      },
    ]
  }
];