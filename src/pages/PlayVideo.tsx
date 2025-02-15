import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaCopy, FaExpand } from 'react-icons/fa';

interface VideoData {
  video_id: number;
  video_url: string;
  title: string;
  description?: string;
  duration?: string;
}

export function PlayVideo() {
  const { id } = useParams<{ id: string }>();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasAddedImpression = useRef<boolean>(false);
  const [userIp, setUserIp] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);

  // Ambil URL saat ini
  const currentUrl = window.location.href;

  // Fungsi untuk mengambil alamat IP dari API
  const fetchUserIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIp(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      setUserIp('unknown');
    }
  };

  // Fungsi untuk menambahkan impression
  const addImpression = async (type: 'play' | 'full_screen') => {
    if (hasAddedImpression.current || !videoData?.video_id || !userIp) return;

    try {
      const response = await fetch('https://videyhost.my.id/api/impression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: videoData.video_id, userIp }),
      });

      if (response.ok) {
        hasAddedImpression.current = true;
        console.log(`Impression (${type}) berhasil ditambahkan`);
      } else {
        throw new Error(`Gagal menambahkan impression (${type})`);
      }
    } catch (error) {
      console.error('Error adding impression:', error);
    }
  };

  const recordFullScreen = async () => {
    addImpression('full_screen');
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`https://videyhost.my.id/api/video/${id}`);
        if (!response.ok) {
          throw new Error('Video tidak ditemukan.');
        }

        const data: VideoData = await response.json();
        setVideoData(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchVideoData();
    fetchUserIp();
  }, [id]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        recordFullScreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [videoData, userIp]);

  // Fungsi untuk copy URL ke clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopySuccess('Link copied to clipboard!');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Fungsi untuk toggle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p className="text-white ml-4 text-lg">Memuat video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-900">
        <svg
          className="w-16 h-16 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-6xl px-4 py-6">
        <h1 className="text-4xl font-bold mb-2 text-center break-words">{videoData?.title}</h1>
        {videoData?.description && (
          <p className="text-gray-400 text-center mb-4">{videoData.description}</p>
        )}
        {videoData?.duration && (
          <p className="text-gray-500 text-sm text-center">Durasi: {videoData.duration}</p>
        )}
      </header>

      {/* Video Player */}
      <div className="w-full max-w-6xl px-4">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700 transition-all hover:shadow-3xl">
          <ReactPlayer
            ref={playerRef}
            url={videoData?.video_url}
            width="100%"
            height="100%"
            playing={isPlaying}
            muted={isMuted}
            volume={volume}
            controls={false} // Nonaktifkan kontrol bawaan
            onPlay={() => {
              setIsPlaying(true);
              addImpression('play');
            }}
            onPause={() => setIsPlaying(false)}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  onContextMenu: (e: React.MouseEvent<HTMLVideoElement>) => e.preventDefault(),
                  preload: 'metadata',
                },
              },
            }}
            className="aspect-video"
          />

          {/* Kontrol Kustom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-blue-400 transition-all"
              >
                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:text-blue-400 transition-all"
              >
                {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(parseFloat(e.target.value) === 0);
                }}
                className="w-24 accent-blue-500"
              />
            </div>
            <button
              onClick={toggleFullScreen}
              className="text-white hover:text-blue-400 transition-all"
            >
              <FaExpand size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="w-full max-w-6xl px-4 mt-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
          >
            Kembali
          </button>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentUrl}
              readOnly
              className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-64"
            />
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-all flex items-center"
            >
              <FaCopy className="mr-2" />
              Copy
            </button>
          </div>
        </div>
        {copySuccess && (
          <div className="fixed bottom-4 right-4 bg-green-800 text-white px-4 py-2 rounded-lg shadow-lg">
            {copySuccess}
          </div>
        )}
      </div>
    </div>
  );
}
