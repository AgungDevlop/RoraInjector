import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaShareAlt, FaFastBackward, FaFastForward, FaCompress, FaDownload } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

interface VideoData {
  id: number;
  video_url: string;
  file_name: string;
  short_key: string;
  size: number; // dalam bytes
  tanggal: string;
}

export function PlayVideo() {
  const { id } = useParams<{ id: string }>();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const playerRef = useRef<ReactPlayer | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const currentUrl = window.location.href;

  const adLinks = [
    "https://example.com/ad1",
    "https://example.com/ad2",
    "https://example.com/ad3",
  ];

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`http://192.168.1.64:8080/api.php?short_key=${id}`, {
          headers: {
            'Authorization': 'Bearer VideHost',
          },
        });
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
  }, [id]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

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
        title: `Vide Host - ${videoData?.file_name || 'Video'}`,
        url: currentUrl,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Share not supported on this browser. Copy the link manually.');
    }
  };

  const seekBackward = () => {
    playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 10, 'seconds');
  };

  const seekForward = () => {
    playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10, 'seconds');
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (videoData) {
      sessionStorage.setItem('download_file_name', videoData.file_name);
      sessionStorage.setItem('download_video_url', videoData.video_url);

      const randomAdLink = adLinks[Math.floor(Math.random() * adLinks.length)];
      window.open('/download', '_blank');
      setTimeout(() => {
        window.location.href = randomAdLink;
      }, 500);
    }
  };

  // Fungsi untuk mengkonversi ukuran file dari bytes ke format yang lebih mudah dibaca
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fungsi untuk memformat tanggal menjadi "DD/MM/YYYY"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
        <title>{`Vide Host - ${videoData?.file_name || 'Video'}`}</title>
      </Helmet>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
        <header className="w-full max-w-6xl px-4 py-6">
          <h1 className="text-3xl font-bold mb-2 text-center break-words">{videoData?.file_name}</h1>
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

            <div className={`absolute bottom-0 left-0 right-0 z-50 ${isFullScreen ? 'bg-purple-800 opacity-80' : 'bg-purple-800 bg-opacity-75'} p-1 flex flex-col items-center text-white`}>
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
            {/* Watermark dan Ukuran File */}
            <div className="absolute top-2 left-2 text-white text-xs p-1 bg-purple-800 rounded flex flex-col items-start">
              <span>Vide Host</span>
              <span>{videoData?.size ? formatFileSize(videoData.size) : 'N/A'}</span>
            </div>
            {/* Tanggal di Pojok Kanan Atas */}
            <div className="absolute top-2 right-2 text-white text-xs p-1 bg-purple-800 rounded">
              <span>{formatDate(videoData?.tanggal || '')}</span>
            </div>
          </div>

          {/* Tombol Download */}
          <div className="mt-4 flex flex-col items-center">
            <button
              onClick={handleDownload}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center justify-center"
            >
              <FaDownload className="mr-2" size={16} />
              Download Video
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlayVideo;