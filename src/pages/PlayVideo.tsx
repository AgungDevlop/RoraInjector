import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

interface VideoData {
  video_id: number;
  video_url: string;
  title: string;
}

export function PlayVideo() {
  const { id } = useParams<{ id: string }>();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasAddedImpression = useRef<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [userIp, setUserIp] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
    if (videoRef.current) {
      const videoElement = videoRef.current;

      const handlePlay = () => {
        setIsPlaying(true);
        addImpression('play');
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && videoElement && !videoElement.paused) {
          addImpression('play');
        }
      };

      const handleContextMenu = (e: Event) => {
        e.preventDefault();
      };

      const handleFullScreenChange = () => {
        if (document.fullscreenElement === videoElement) {
          recordFullScreen();
        }
      };

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleFullScreenChange);

      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('fullscreenchange', handleFullScreenChange);
      };
    }
  }, [videoData, userIp]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          <p className="absolute text-white text-lg font-medium">Memuat video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-center">
        <svg
          className="w-20 h-20 text-red-500 mb-6"
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
        <p className="text-red-500 text-xl font-medium mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-semibold text-white mb-6 text-center break-words">
          {videoData?.title}
        </h1>

        <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-black group">
          <video
            ref={videoRef}
            src={videoData?.video_url}
            controls
            controlsList="nodownload"
            className="w-full h-auto aspect-video object-contain"
            preload="metadata"
          >
            Browser Anda tidak mendukung tag video.
          </video>

          {/* Overlay untuk tombol play/pause */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
              isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
            onClick={togglePlayPause}
          >
            <button
              className="text-white bg-blue-600 hover:bg-blue-700 rounded-full p-4 transition-all duration-300"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
