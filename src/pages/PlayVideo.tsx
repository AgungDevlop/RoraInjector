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
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const hasAddedImpression = useRef<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [userIp, setUserIp] = useState<string | null>(null);

  // Fetch user IP
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

  // Add impression
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

  // Fetch video data
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

  // Video event listeners
  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;

      const handlePlay = () => {
        addImpression('play');
        setIsBuffering(false);
      };

      const handleWaiting = () => {
        setIsBuffering(true);
      };

      const handleCanPlay = () => {
        setIsBuffering(false);
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

      const handleError = () => {
        setError('Gagal memutar video. Silakan coba lagi.');
      };

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('waiting', handleWaiting);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('contextmenu', handleContextMenu);
      videoElement.addEventListener('error', handleError);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleFullScreenChange);

      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('waiting', handleWaiting);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('contextmenu', handleContextMenu);
        videoElement.removeEventListener('error', handleError);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('fullscreenchange', handleFullScreenChange);
      };
    }
  }, [videoData, userIp]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p className="text-white ml-4">Memuat video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-center">
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
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center text-white break-words max-w-4xl">
        {videoData?.title}
      </h1>

      <div className="relative w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl border border-gray-700 transition-all hover:shadow-3xl">
        {isBuffering && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
          </div>
        )}
        <video
          ref={videoRef}
          src={videoData?.video_url}
          controls
          controlsList="nodownload"
          className="w-full h-auto aspect-video object-cover custom-video-player"
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
        >
          Browser Anda tidak mendukung tag video.
        </video>
      </div>
    </div>
  );
}
