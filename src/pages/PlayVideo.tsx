import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCopy, FaVideo, FaPlay, FaSearch, FaDownload } from 'react-icons/fa';

export function PlayVideo() {
  const { id } = useParams<{ id: string }>();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const videosPerPage = 10;

  // Array of URLs with video ID from the list
  const videoBaseUrls = [
    "https://doobs.top/e/"
  ];

  // Array of URLs for pop-under links
  const randomUrls = [
    "https://so-gr3at3.com/go/1237187",
    "https://malakingannets.com/ic4wSTmH5JgaK77X/94691",
    "https://meowadvertising.com/hc70ax5ct2?key=7df760c08ecfe3653c332fbdce13d42a",
    "https://superficial-work.com/ba3RV.0YPk3Xp/v/b/mOVsJHZqDV0Y0KO/DVQWzkOvD/MK3pLvT/QJ4JNmDyM/4MMozHgS"
  ];

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/AgungDevlop/Viral/refs/heads/main/Video.json');
        const data = await response.json();

        // Shuffle the video data
        const shuffledData = shuffleArray(data);

        // Find the current video by id
        const video = shuffledData.find((item: { id: string }) => item.id === id);
        if (video) {
          document.title = video.Judul;
          setVideoUrl(video.Url);
          setVideoTitle(video.Judul);
          sessionStorage.setItem('videoUrl', video.Url);
          sessionStorage.setItem('videoTitle', video.Judul);
        }
        setVideos(shuffledData);
        setFilteredVideos(shuffledData);
      } catch (error) {
        console.error('Error fetching video data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${window.location.hostname}/${id}`);
    alert('Link video telah disalin ke clipboard!');
  };

  const getRandomUrlWithId = (videoId: string) => {
    const baseUrl = videoBaseUrls[Math.floor(Math.random() * videoBaseUrls.length)];
    return `${baseUrl}${videoId}`;
  };

  const getRandomPopUnderUrl = () => {
    return randomUrls[Math.floor(Math.random() * randomUrls.length)];
  };

  const handlePlayClick = (videoId: string) => {
    const randomVideoUrl = getRandomUrlWithId(videoId);
    window.open(randomVideoUrl, '_blank'); // Open video in a new tab

    // Open a random pop-under link after 2 seconds in the current tab
    setTimeout(() => {
      window.location.href = getRandomPopUnderUrl();
    }, 2000);
  };

  const handleDownloadClick = () => {
    sessionStorage.setItem('videoUrl', videoUrl); // Save video URL to sessionStorage
    window.open('/download', '_blank'); // Open download page in a new tab

    // Redirect current tab after 2 seconds to a random URL
    setTimeout(() => {
      window.location.href = getRandomPopUnderUrl();
    }, 2000);
  };

  useEffect(() => {
    const filtered = videos.filter(video =>
      video.Judul.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
    setCurrentPage(1);
  }, [searchTerm, videos]);

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
  <div className="container mx-auto max-w-2xl p-6 bg-gray-900 text-white rounded-lg shadow-lg">
    {/* Video Title */}
    <h1 className="text-2xl font-bold mb-4 text-center break-words">{videoTitle}</h1>

    {/* Video Player dengan Ukuran Tetap (Landscape) */}
    <div className="mb-4 w-full h-[360px] rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-black flex items-center justify-center">
      <video
        className="w-full h-full object-contain"
        controls
        src={videoUrl}
        preload="metadata"
      />
    </div>

    {/* Copy Video URL */}
    <div className="flex mb-4 border border-gray-700 rounded-lg overflow-hidden">
      <input
        type="text"
        value={`https://${window.location.hostname}/${id}`}
        readOnly
        className="flex-1 p-3 bg-gray-800 text-white outline-none"
      />
      <button
        onClick={handleCopy}
        className="bg-blue-500 hover:bg-blue-600 transition-colors text-white p-3"
      >
        <FaCopy />
      </button>
    </div>

    {/* Download Button */}
    <button
      onClick={handleDownloadClick}
      className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white py-3 rounded-lg flex items-center justify-center font-semibold mb-4 shadow-md"
    >
      <FaDownload className="mr-2" />
      Download
    </button>

    {/* Search Bar */}
    <div className="flex mb-4 border border-gray-700 rounded-lg overflow-hidden">
      <input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 p-3 bg-gray-800 text-white outline-none"
      />
      <button
        onClick={() => handlePageChange(1)}
        className="bg-blue-500 hover:bg-blue-600 transition-colors text-white p-3"
      >
        <FaSearch />
      </button>
    </div>

    {/* Video List */}
    <div className="grid grid-cols-1 gap-4">
      {currentVideos.map((video) => (
        <div key={video.id} className="flex items-center border border-gray-700 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors shadow-md">
          <FaVideo className="text-green-500 text-3xl mr-3" />
          <h2 className="text-white font-medium text-sm flex-1 break-words">{video.Judul}</h2>
          <button
            className="bg-blue-500 hover:bg-blue-600 transition-colors text-white text-xs px-3 py-2 rounded flex items-center shadow-md"
            onClick={() => handlePlayClick(video.id)}
          >
            <FaPlay className="mr-1" />
            Play
          </button>
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex items-center justify-between mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-gray-700 hover:bg-gray-600 transition-colors text-white py-2 px-4 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <div className="flex items-center">
        {currentPage > 3 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="mx-1 p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-white"
            >
              1
            </button>
            <span className="mx-1 text-gray-400">...</span>
          </>
        )}

        {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => {
          const pageNumber = index + Math.max(currentPage - 1, 1);
          if (pageNumber <= totalPages) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`mx-1 p-2 rounded ${currentPage === pageNumber ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-600 transition-colors text-white`}
              >
                {pageNumber}
              </button>
            );
          }
          return null;
        })}

        {currentPage < totalPages - 2 && (
          <>
            <span className="mx-1 text-gray-400">...</span>
            <button
              onClick={() => handlePageChange(totalPages)}
              className="mx-1 p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-white"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-gray-700 hover:bg-gray-600 transition-colors text-white py-2 px-4 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);


}
