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

  // Fungsi untuk mengambil alamat IP dari API
  const fetchUserIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIp(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      setUserIp('unknown'); // Gunakan 'unknown' atau IP default jika gagal
    }
  };

  // Fungsi untuk menambahkan impression
  const addImpression = async (type: 'play' | 'full_screen') => {
    if (hasAddedImpression.current || !videoData?.video_id || !userIp) return;

    try {
      const response = await fetch('https://server.agungbot.my.id/api/impression', {
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

  // Fungsi untuk mencatat klik full screen
  const recordFullScreen = async () => {
    addImpression('full_screen');
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`https://server.agungbot.my.id/api/video/${id}`);
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
        addImpression('play');
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && videoElement && !videoElement.paused) {
          addImpression('play');
        }
      };

      // Nonaktifkan klik kanan pada video
      const handleContextMenu = (e: Event) => {
        e.preventDefault();
      };

      // Menangani klik pada full screen
      const handleFullScreenChange = () => {
        if (document.fullscreenElement === videoElement) {
          recordFullScreen();
        }
      };

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleFullScreenChange);

      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('fullscreenchange', handleFullScreenChange);
      };
    }
  }, [videoData, userIp]);

  if (loading) return <p className="text-white text-center">Memuat video...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4 text-center break-words">{videoData?.title}</h1>

      <div className="mb-4 w-full h-[200px] rounded-lg overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoData?.video_url}
          controls
          controlsList="nodownload"
          className="w-full h-full object-contain custom-video-player"
          preload="metadata"
        >
          Browser Anda tidak mendukung tag video.
        </video>
      </div>
    </div>
  );
}