import { NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';

export async function GET() {
  try {
    // 1. Fetch Top Tracks (All time) from Daily MV
    const tracksQuery = `
      SELECT
        track_title AS title,
        genre,
        sum(total_plays) AS plays,
        round(avgMerge(avg_completion_pct)) AS completionRate
      FROM analytics.daily_music_summary
      GROUP BY title, genre
      ORDER BY plays DESC
      LIMIT 10
    `;

    // 2. Fetch Genre Distribution from Daily MV
    const genreQuery = `
      SELECT
        genre AS name,
        round(sum(total_plays) * 100.0 / (SELECT sum(total_plays) FROM analytics.daily_music_summary)) AS value
      FROM analytics.daily_music_summary
      GROUP BY name
      ORDER BY value DESC
    `;

    // 3. Overall Stats from Daily MV
    const statsQuery = `
      SELECT
        sum(total_plays) AS total_streams,
        sum(total_downloads) AS total_downloads,
        uniqCombinedMerge(unique_listeners) AS unique_listeners,
        round(avgMerge(avg_completion_pct)) AS avg_completion
      FROM analytics.daily_music_summary
    `;

    const [tracksRes, genreRes, statsRes] = await Promise.all([
      mainClickhouseClient.query({ query: tracksQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: genreQuery, format: 'JSONEachRow' }),
      mainClickhouseClient.query({ query: statsQuery, format: 'JSONEachRow' }),
    ]);

    const tracks = await tracksRes.json();
    const genres = await genreRes.json();
    const stats = await statsRes.json();

    return NextResponse.json({
      data: {
        tracks: tracks.map((t: any, i: number) => ({ ...t, rank: i + 1 })),
        genres,
        stats: stats[0] || {}
      }
    });
  } catch (error) {
    console.error('Music Stats Fetch Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
