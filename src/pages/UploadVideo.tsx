import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaStepBackward, FaStepForward, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface VideoData {
  video_id: number;
  video_url: string;
  title: string;
  description?: string;
  duration?: string;
}

const PlayVideo: React.FC = () => {
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
  const navigate = useNavigate();

  const currentUrl = window.location.href;

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
        console.log(`Impression (${type}) added successfully`);
      } else {
        throw new Error(`Failed to add impression (${type})`);
      }
    } catch (error) {
      console.error('Error adding impression:', error);
    }
  };

  const recordFullScreen = async () => {
    addImpression('full_screen');
  };

  const seekBackward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(currentTime - 10, 0));
    }
  };

  const seekForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10);
    }
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`https://videyhost.my.id/api/video/${id}`);
        if (!response.ok) {
          throw new Error('Video not found.');
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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.getInternalPlayer()?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const shareVideo = () => {
    if (navigator.share) {
      navigator.share({
        title: videoData?.title || 'Video',
        url: currentUrl
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      toast.info('Share not supported on this browser. Copy the link manually.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
        <p className="text-white ml-4 text-lg">Loading video...</p>
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
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <header className="w-full max-w-6xl px-4 py-6">
        <h1 className="text-4xl font-bold mb-2 text-center break-words">{videoData?.title}</h1>
        {videoData?.description && (
          <p className="text-gray-400 text-center mb-4">{videoData.description}</p>
        )}
        {videoData?.duration && (
          <p className="text-gray-500 text-sm text-center">Duration: {videoData.duration}</p>
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
            style={{ marginTop: '10px' }}
          />

          <div className="watermark absolute top-2 left-2 text-sm text-white opacity-70">
            Vidify
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-purple-800 bg-opacity-75 p-2 flex flex-col items-center text-white">
            <div className="flex justify-between items-center w-full">
              <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-purple-300 transition-all">
                {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
              </button>
              <button onClick={seekBackward} className="hover:text-purple-300 transition-all">
                <FaStepBackward size={16} />
              </button>
              <button onClick={seekForward} className="hover:text-purple-300 transition-all">
                <FaStepForward size={16} />
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className="hover:text-purple-300 transition-all">
                {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
              </button>
              <button onClick={toggleFullScreen} className="hover:text-purple-300 transition-all">
                <FaExpand size={16} />
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
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;
