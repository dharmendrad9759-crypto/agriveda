/** RainViewer free radar tiles — https://www.rainviewer.com/api.html */

interface RainViewerFrame {
  time: number;
  path: string;
}

interface RainViewerResponse {
  radar?: {
    past?: RainViewerFrame[];
    nowcast?: RainViewerFrame[];
  };
}

let cachedPath: { path: string; at: number } | null = null;

export async function getLatestRadarTilePath(): Promise<string | null> {
  if (cachedPath && Date.now() - cachedPath.at < 5 * 60 * 1000) {
    return cachedPath.path;
  }

  try {
    const res = await fetch("https://api.rainviewer.com/public/weather-maps.json", {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as RainViewerResponse;
    const frames = [...(data.radar?.past ?? []), ...(data.radar?.nowcast ?? [])];
    const latest = frames.at(-1);
    if (!latest?.path) return null;

    cachedPath = { path: latest.path, at: Date.now() };
    return latest.path;
  } catch {
    return null;
  }
}

export function rainviewerTileUrl(path: string): string {
  return `https://tilecache.rainviewer.com${path}/256/{z}/{x}/{y}/2/1_1.png`;
}
