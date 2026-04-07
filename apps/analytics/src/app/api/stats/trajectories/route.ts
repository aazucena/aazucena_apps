import { NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';

export async function GET(req: Request) {
  try {
    // 1. Get List of trajectories (Unique sessions/ids)
    const listQuery = `
      SELECT
        trajectory_id AS id,
        any(timestamp) AS timestamp,
        sum(reward) AS totalReward,
        max(step_index) + 1 AS length,
        if(startsWith(trajectory_id, 'brain_'), 'Intel_Brain_v1', 'RL_Simulation_Node') AS agent
      FROM analytics.ai_trajectories
      GROUP BY id
      ORDER BY timestamp DESC
      LIMIT 20
    `;

    // 2. Get All Steps for these trajectories (Using argMax to handle duplicates/updates)
    const stepsQuery = `
      SELECT
        trajectory_id,
        step_index AS step,
        argMax(state, timestamp) AS observation,
        argMax(action, timestamp) AS action,
        argMax(reward, timestamp) AS reward,
        argMax(metadata, timestamp) AS metadata
      FROM analytics.ai_trajectories
      WHERE trajectory_id IN (
        SELECT trajectory_id 
        FROM analytics.ai_trajectories 
        GROUP BY trajectory_id 
        ORDER BY any(timestamp) DESC 
        LIMIT 20
      )
      GROUP BY trajectory_id, step
      ORDER BY trajectory_id, step ASC
    `;

    const [listRes, stepsRes] = await Promise.all([
      mainClickhouseClient.query({
        query: listQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
      mainClickhouseClient.query({
        query: stepsQuery,
        format: 'JSONEachRow',
        abort_signal: req.signal,
      }),
    ]);

    const list = (await listRes.json()) as any[];
    const allSteps = (await stepsRes.json()) as any[];

    // 3. Map steps to trajectories
    const trajectories = list.map((t) => ({
      ...t,
      steps: allSteps
        .filter((s) => s.trajectory_id === t.id)
        .map((s) => {
          let parsedState = {} as any;
          try {
            parsedState = JSON.parse(s.observation || '{}');
          } catch (_e) {
            /* ignore malformed JSON */
          }

          // Extract the rich 'observation' field if we injected it during ingestion
          // Otherwise fallback to the full state object
          const richData = parsedState.observation || parsedState;

          return {
            ...s,
            probability: 1.0,
            metadata: JSON.parse(s.metadata || '{}'),
            // Ensure it's a string for the frontend helper
            observation:
              typeof richData === 'string' ? richData : JSON.stringify(richData, null, 2),
          };
        }),
    }));

    return NextResponse.json({
      data: trajectories,
    });
  } catch (error) {
    console.error('[Trajectories-Stats-API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trajectories' }, { status: 500 });
  }
}
