"use client";

import WheatStageVideoPlayer, { WheatStageVideoPlayerProps } from "./WheatStageVideoPlayer";

export type { WheatStageVideoPlayerProps as WheatStageVisualizerProps };

/**
 * WheatStageVisualizer - Cinematic, documentary-grade wheat stage visualizer
 * Powered by high-resolution H.264 video loops with Hindi audio narration
 * and agronomic field identification guidance for all 10 wheat growth stages.
 */
export default function WheatStageVisualizer(props: WheatStageVideoPlayerProps) {
  return <WheatStageVideoPlayer {...props} />;
}
