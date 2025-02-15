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

  // Current URL for sharing
  const currentUrl = window.location.href;

  // Function to fetch user's IP address
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

  // Function to add video impression
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

  // Function to copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopySuccess('Link copied to clipboard!');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Toggle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error attempting to enable full-screen mode:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p className="text-white ml-4 text-lg">Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-900">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p className="text-red-500 text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {/* Video Player Container */}
      <div className="w-full max-w-6xl px-4">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-700">
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
          />

          {/* Custom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-blue-400 transition-all">
                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-blue-400 transition-all">
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
            <button onClick={toggleFullScreen} className="text-white hover:text-blue-400 transition-all">
              <FaExpand size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="w-full max-w-6xl px-4 mt-6">
        <div className="flex items-center justify-center space-x-2">
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
            <FaCopy className="mr-2" /> Copy
          </button>
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
