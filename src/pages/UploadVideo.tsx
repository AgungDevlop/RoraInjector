import { useState } from 'react';
import { FaClipboard } from 'react-icons/fa';


const UploadVideo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shortlink, setShortlink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Function to generate a random shortlink with 10 characters
  const generateShortlink = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Extract the title from the video filename and remove .mp4
  const extractTitleFromFileName = (fileName: string) => {
    const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
    return nameWithoutExtension;
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Copy shortlink to clipboard
  const copyToClipboard = () => {
    if (shortlink) {
      navigator.clipboard.writeText(shortlink);
      setCopySuccess('Shortlink copied to clipboard!');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  // Handle video upload
  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const xhr = new XMLHttpRequest();
    const shortLink = generateShortlink();
    const title = extractTitleFromFileName(selectedFile.name);

    // Retrieve the user_id from localStorage
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const user_id = user?.user_id;

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    });

    xhr.open('POST', 'https://videy.co/api/upload', true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.id) {
          const videoUrl = `https://cdn.videy.co/${response.id}.mp4`;
          setUploadProgress(null);

          // Now send data to your local Node.js API
          const payload = {
            shortlink: shortLink,
            title: title,
            user_id: user_id,
            video_url: videoUrl,
          };

          fetch('https://videyhost.my.id/api/videos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
            .then((res) => res.json())
            .then((data) => {
// Inside the handleUpload function after the fetch call
if (data.status === 'success') {
  // Use window.location.host to get the current domain
  const host = window.location.host;
  setShortlink(`http://${host}/e/${shortLink}`);
  setSuccessMessage('Video uploaded successfully!');
  setTimeout(() => setSuccessMessage(null), 3000);
} else {
                setError('Error uploading video');
              }
            })
            .catch((err) => {
              console.error('Failed to save data:', err);
              setError('Failed to save data to server');
            });
        } else {
          setError('Invalid response from server');
          setUploadProgress(null);
        }
      } else {
        setError('Upload failed');
        setUploadProgress(null);
      }
    };

    xhr.onerror = () => {
      setError('Upload failed due to network error');
      setUploadProgress(null);
    };

    xhr.send(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full text-white" 
         style={{ background: 'radial-gradient(circle at center, #2c003e, #1a0027)' }}>
      {/* File upload UI */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 w-full ${
          isDragging ? 'border-purple-300' : 'border-purple-500'
        }`}
        style={{ backgroundColor: '#1a0027' }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            setSelectedFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        {selectedFile ? (
          <p className="text-white font-semibold text-lg break-words">
            File Selected: {selectedFile.name}
          </p>
        ) : (
          <>
            <p className="text-white font-semibold text-lg mb-4">Drag and Drop Your Video</p>
            <svg
              className="mx-auto w-16 h-16 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v8m4-4H8m16 12V6a2 2 0 00-2-2H6a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2z"
              />
            </svg>
          </>
        )}
      </div>

      <input
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />

      {uploadProgress !== null && (
        <div className="mt-4 w-full bg-purple-900 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <button
        className="mt-4 bg-purple-700 text-white px-4 py-2 w-full rounded-lg transition-all duration-300 hover:bg-purple-800"
        onClick={handleUpload}
      >
        Upload Video
      </button>

      {/* Shortlink Input with Copy Icon */}
      {shortlink && (
        <div className="mt-4 w-full flex items-center">
          <input
            type="text"
            value={shortlink}
            readOnly
            className="bg-purple-900 text-white w-full px-4 py-2 rounded-l-lg"
          />
          <button
            onClick={copyToClipboard}
            className="bg-purple-700 text-white px-4 py-2 rounded-r-lg hover:bg-purple-800"
          >
            <FaClipboard className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-800 text-white px-4 py-2 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Copy Success Notification */}
      {copySuccess && (
        <div className="fixed bottom-16 right-4 bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg">
          {copySuccess}
        </div>
      )}
    </div>
  );
};

export default UploadVideo;