import AudioPlayer from '../AudioPlayer';

export default function AudioPlayerExample() {
  // Using a sample audio URL - in production this would be a real audio file
  const sampleAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <AudioPlayer audioUrl={sampleAudioUrl} fileName="Sample Audio.mp3" />
    </div>
  );
}
