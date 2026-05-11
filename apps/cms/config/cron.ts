import axios from 'axios';

export default {
  /**
   * 💓 CMS HEARTBEAT
   * Sends a periodic pulse to the Intel Bridge to update the Analytics Status Page.
   * Frequency: Every 1 minute
   */
  '*/1 * * * *': async () => {
    const bridgeUrl = process.env.INTEL_BRIDGE_URL || 'http://aazucena-intel-bridge:3001';

    try {
      await axios.post(
        `${bridgeUrl}/pulse/health`,
        {
          service: 'strapi-cms',
          status: 'UP',
          latency_ms: 0,
          message: 'CMS Core Operational',
        },
        { timeout: 5000 }
      );

      // console.log('💓 [CMS] Heartbeat pulsed successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ [CMS] Heartbeat pulse failed:', message);
    }
  },
};
