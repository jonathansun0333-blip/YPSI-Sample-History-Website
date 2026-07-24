import type { ArchiveAudioTrack } from "@/data/archive-entries";
import { withBasePath } from "@/lib/asset-path";

type ArchiveAudioPlayerProps = {
  tracks: ArchiveAudioTrack[];
};

export function ArchiveAudioPlayer({
  tracks,
}: ArchiveAudioPlayerProps) {
  if (!tracks.length) return null;

  const multipleTracks = tracks.length > 1;

  return (
    <section className="archive-audio" aria-labelledby="archive-audio-heading">
      <h3 id="archive-audio-heading">
        {multipleTracks ? "Audio recordings" : "Audio recording"}
      </h3>
      <div className="archive-audio-tracks">
        {tracks.map((track) => (
          <div className="archive-audio-track" key={track.src}>
            {multipleTracks ? (
              <p className="archive-audio-label">{track.label}</p>
            ) : null}
            <audio
              controls
              preload="metadata"
              aria-label={`Audio interview with ${track.label}`}
            >
              <source src={withBasePath(track.src)} type="audio/mp4" />
              Your browser does not support embedded audio.
            </audio>
          </div>
        ))}
      </div>
    </section>
  );
}
