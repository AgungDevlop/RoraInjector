import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaShareAlt, FaFastBackward, FaFastForward, FaCompress } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

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
  const playerRef = useRef<ReactPlayer | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const currentUrl = window.location.href;

  // Array link untuk dibuka secara acak
  const randomLinks = [
    'https://example.com/link1',
    'https://example.com/link2',
    'https://example.com/link3',
    'https://example.com/link4',
    'https://example.com/link5'
  ];

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
      setIsFullScreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        recordFullScreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [videoData, userIp]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.getInternalPlayer()?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    handleLinkClick();
  };

  const shareVideo = () => {
    if (navigator.share) {
      navigator.share({
        title: `Vidify - ${videoData?.title || 'Video'}`,
        url: currentUrl
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Share not supported on this browser. Copy the link manually.');
    }
  };

  const seekBackward = () => {
    playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 10, 'seconds');
    handleLinkClick();
  };

  const seekForward = () => {
    playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10, 'seconds');
    handleLinkClick();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    handleLinkClick();
  };

  const handleLinkClick = () => {
    const now = new Date().getTime();
    const lastClick = sessionStorage.getItem('lastClickTime');
    if (!lastClick || now - parseInt(lastClick) > 20000) {
      const randomLink = randomLinks[Math.floor(Math.random() * randomLinks.length)];
      window.open(randomLink, '_blank');
      sessionStorage.setItem('lastClickTime', now.toString());
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
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
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Vidify - ${videoData?.title || 'Video'}`}</title>
      </Helmet>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
        <header className="w-full max-w-6xl px-4 py-6">
          <h1 className="text-3xl font-bold mb-2 text-center break-words">{videoData?.title}</h1>
          {videoData?.description && (
            <p className="text-gray-400 text-center mb-4">{videoData.description}</p>
          )}
          {videoData?.duration && (
            <p className="text-gray-500 text-sm text-center">Durasi: {videoData.duration}</p>
          )}
        </header>

        <div className="w-full max-w-6xl px-4">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-purple-700 transition-all hover:shadow-3xl">
            <ReactPlayer
              ref={playerRef}
              url={videoData?.video_url}
              width="100%"
              height="100%"
              playing={isPlaying}
              muted={isMuted}
              volume={volume}
              controls={false}
              onPlay={() => setIsPlaying(true)} // Hanya mengupdate state, tidak memanggil handleLinkClick
              onPause={() => setIsPlaying(false)} // Hanya mengupdate state, tidak memanggil handleLinkClick
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

            <div className={`absolute bottom-0 left-0 right-0 ${isFullScreen ? 'bg-purple-800' : 'bg-purple-800 bg-opacity-75'} p-1 flex flex-col items-center text-white`}>
              <div className="flex w-full justify-between items-center">
                <button onClick={togglePlay} className="hover:text-purple-300 transition-all ml-2">
                  {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-purple-300 transition-all">
                  {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
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
                  className="w-20 accent-purple-500"
                />
                <div className="flex items-center space-x-2 mr-2">
                  <button onClick={seekBackward} className="hover:text-purple-300 transition-all">
                    <FaFastBackward size={14} />
                  </button>
                  <button onClick={seekForward} className="hover:text-purple-300 transition-all">
                    <FaFastForward size={14} />
                  </button>
                </div>
                <button onClick={toggleFullScreen} className="hover:text-purple-300 transition-all mr-2">
                  {isFullScreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
                </button>
              </div>
              <div className="flex items-center w-full justify-between mt-1">
                <input
                  type="text"
                  value={currentUrl}
                  readOnly
                  className="bg-gray-800 text-white px-2 py-1 rounded-l-lg w-48 text-xs"
                />
                <button
                  onClick={shareVideo}
                  className="bg-purple-600 text-white px-2 py-1 rounded-r-lg hover:bg-purple-700 transition-all flex items-center text-xs"
                >
                  <FaShareAlt className="mr-1" size={12} />
                  Share
                </button>
              </div>
            </div>
            <div className="absolute top-2 left-2 text-white text-xs p-1 bg-purple-800 rounded">
              <span>Vidify</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
