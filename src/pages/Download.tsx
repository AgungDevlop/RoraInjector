import { FaDownload } from 'react-icons/fa';

export function Download() {
  const videoUrl = sessionStorage.getItem('videoUrl'); // Get video URL from session storage
  const videoTitle = sessionStorage.getItem('videoTitle'); // Get video title from session storage

  // Array of URLs for pop-under links
  const randomUrls = [
    "https://so-gr3at3.com/go/1237187",
    "https://malakingannets.com/ic4wSTmH5JgaK77X/94691",
    "https://meowadvertising.com/hc70ax5ct2?key=7df760c08ecfe3653c332fbdce13d42a",
    "https://superficial-work.com/ba3RV.0YPk3Xp/v/b/mOVsJHZqDV0Y0KO/DVQWzkOvD/MK3pLvT/QJ4JNmDyM/4MMozHgS"
  ];

  const handleDownload = () => {
    if (videoUrl) {
      // Open the video URL in a new tab
      window.open(videoUrl, '_blank');

      // Redirect the current tab to a random URL after 2 seconds
      setTimeout(() => {
        const randomUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)];
        window.location.href = randomUrl;
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container mx-auto p-4 text-center"> {/* Center text */}
        <h1 className="text-2xl font-bold mb-4">Download Video {videoTitle ? `- ${videoTitle}` : ''}</h1>
        {videoUrl ? (
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white p-4 rounded flex items-center justify-center mx-auto"
          >
            <FaDownload className="mr-2" />
            Download Video
          </button>
        ) : (
          <p className="text-red-500">Tidak ada URL video yang tersedia untuk diunduh.</p>
        )}
      </div>
    </div>
  );
}
