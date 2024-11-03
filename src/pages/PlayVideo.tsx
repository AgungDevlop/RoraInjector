import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCopy, FaVideo, FaPlay, FaSearch } from 'react-icons/fa';

export function PlayVideo() {
  const { id } = useParams<{ id: string }>();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State untuk pencarian
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]); // State untuk video yang terfilter
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const videosPerPage = 10; // Menampilkan 10 video per halaman

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
          setVideoUrl(video.Url);
          setVideoTitle(video.Judul);
          sessionStorage.setItem('videoUrl', video.Url);
          sessionStorage.setItem('videoTitle', video.Judul);
        }
        setVideos(shuffledData);
        setFilteredVideos(shuffledData); // Set initial filtered videos
      } catch (error) {
        console.error('Error fetching video data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  // Shuffle array function using Fisher-Yates algorithm
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${window.location.hostname}/${id}`);
    alert('Link video telah disalin ke clipboard!');
  };

  // Update filtered videos based on search term
  useEffect(() => {
    const filtered = videos.filter(video =>
      video.Judul.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
    setCurrentPage(1); // Reset ke halaman pertama saat mencari
  }, [searchTerm, videos]);

  // Calculate the index of the first and last video for the current page
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePlayClick = (title: string) => {
    document.title = title; // Update the document title to the video title
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Video Title Centered */}
      <h1 className="text-xl font-bold mb-4 text-center break-words">{videoTitle}</h1>

      {/* Video Player */}
      <div className="mb-4" style={{ width: '100%', height: 'auto', position: 'relative', aspectRatio: '16/9' }}>
        <video
          className="absolute top-0 left-0 w-full h-full object-contain"
          controls
          src={videoUrl}
          preload="metadata"
        />
      </div>

      {/* Input Read-Only dan Tombol Salin */}
      <div className="flex mb-4">
        <input
          type="text"
          value={`https://${window.location.hostname}/${id}`}
          readOnly
          className="flex-1 p-2 bg-gray-800 text-white border border-gray-300 rounded-l"
        />
        <button
          onClick={handleCopy}
          className="bg-gray-700 text-white p-2 rounded-r"
        >
          <FaCopy />
        </button>
      </div>

      {/* Tombol Download yang Diperbarui */}
      <Link
        to="/download"
        className="bg-orange-500 text-white p-2 rounded w-full flex items-center justify-center mb-4"
      >
        Download
      </Link>

      {/* Search Input */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 bg-gray-800 text-white border border-gray-300 rounded-l"
        />
        <button
          onClick={() => handlePageChange(1)} // Go to first page on search
          className="bg-gray-700 text-white p-2 rounded-r flex items-center"
        >
          <FaSearch />
        </button>
      </div>

      {/* List of Videos */}
      <div className="grid grid-cols-1 gap-4">
        {currentVideos.map((video) => (
          <div key={video.id} className="flex items-center border border-white p-3 rounded-lg bg-gray-800">
            {/* Icon Video */}
            <FaVideo className="text-orange-500 text-3xl mr-3" style={{ minWidth: '2rem' }} />

            {/* Video Title */}
            <h2 className="text-white font-medium text-sm flex-1 text-left break-words">
              {video.Judul}
            </h2>

            {/* Button Play with smaller font */}
            <Link
              to={`/${video.id}`}
              className="bg-blue-500 text-white text-xs p-2 rounded flex items-center"
              onClick={() => handlePlayClick(video.Judul)} // Change title on click
            >
              <FaPlay className="mr-1" />
              Play
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-700 text-white p-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        
        {/* Page Number Links */}
        <div className="flex items-center">
          {currentPage > 3 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="mx-1 p-2 rounded bg-gray-700 text-white"
              >
                1
              </button>
              <span className="mx-1 text-white">...</span>
            </>
          )}
          
          {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => {
            const pageNumber = index + Math.max(currentPage - 1, 1);
            if (pageNumber <= totalPages) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`mx-1 p-2 rounded ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
                >
                  {pageNumber}
                </button>
              );
            }
            return null;
          })}

          {totalPages > 3 && currentPage < totalPages - 2 && (
            <>
              <span className="mx-1 text-white">...</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="mx-1 p-2 rounded bg-gray-700 text-white"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-700 text-white p-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
