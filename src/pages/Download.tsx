import { FaDownload } from 'react-icons/fa';

export function Download() {
  const videoUrl = sessionStorage.getItem('videoUrl'); // Mengambil URL video dari session storage
  const videoTitle = sessionStorage.getItem('videoTitle'); // Mengambil judul video dari session storage

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container mx-auto p-4 text-center"> {/* Menggunakan text-center untuk memusatkan teks */}
        <h1 className="text-2xl font-bold mb-4">Download Video {videoTitle ? `- ${videoTitle}` : ''}</h1>
        {videoUrl ? (
          <a
            href={videoUrl}
            download
            className="bg-green-500 text-white p-4 rounded flex items-center justify-center mx-auto"
          >
            <FaDownload className="mr-2" />
            Download Video
          </a>
        ) : (
          <p className="text-red-500">Tidak ada URL video yang tersedia untuk diunduh.</p>
        )}
      </div>
    </div>
  );
}
