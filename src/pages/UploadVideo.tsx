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

  // Batas maksimum ukuran file (100MB dalam byte)
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  // API Token
  const API_TOKEN = 'VideHost';

  // Function to generate a random short_key with 10 characters
  const generateShortKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Extract the title from the video filename and remove extension
  const extractFileName = (fileName: string) => {
    const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
    return nameWithoutExtension;
  };

  // Format tanggal ke ISO string untuk database
  const generateTanggal = () => {
    return new Date().toISOString();
  };

  // Handle file selection with size validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setError('Ukuran file melebihi batas maksimum 100MB.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  // Copy shortlink to clipboard
  const copyToClipboard = () => {
    if (shortlink) {
      navigator.clipboard.writeText(shortlink);
      setCopySuccess('Shortlink berhasil disalin!');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  // Handle video upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Pilih file video terlebih dahulu.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('Ukuran file melebihi batas maksimum 100MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    const shortKey = generateShortKey();
    const fileName = extractFileName(selectedFile.name);
    const fileSize = selectedFile.size;

    // Upload ke videy.co
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    });

    xhr.open('POST', 'https://videy.co/api/upload', true);

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.id) {
          const videoUrl = `https://cdn.videy.co/${response.id}.mp4`;
          setUploadProgress(null);

          // POST ke api.php
          const payload = {
            video_url: videoUrl,
            short_key: shortKey,
            file_name: fileName,
            size: fileSize,
            tanggal: generateTanggal(),
          };

          try {
            const res = await fetch('http://192.168.1.64:8080/api.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`,
              },
              body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.status === 201) {
              const host = window.location.host;
              setShortlink(`https://${host}/e/${shortKey}`);
              setSuccessMessage('Video berhasil diunggah!');
              setTimeout(() => setSuccessMessage(null), 3000);
            } else {
              setError(data.error || 'Gagal menyimpan data ke server.');
            }
          } catch (err) {
            console.error('Gagal menyimpan data:', err);
            setError('Gagal menyimpan data ke server.');
          }
        } else {
          setError('Respons server tidak valid.');
          setUploadProgress(null);
        }
      } else {
        setError('Gagal mengunggah video ke videy.co.');
        setUploadProgress(null);
      }
    };

    xhr.onerror = () => {
      setError('Gagal mengunggah karena masalah jaringan.');
      setUploadProgress(null);
    };

    xhr.send(formData);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full text-white"
      style={{ background: 'radial-gradient(circle at center, #2c003e, #1a0027)' }}
    >
      {/* Informasi batas ukuran file */}
      <p className="text-gray-300 text-sm mb-4">
        Maksimum ukuran file: 100MB. Format yang didukung: video (MP4, AVI, dll).
      </p>

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
            const file = e.dataTransfer.files[0];
            if (file.size > MAX_FILE_SIZE) {
              setError('Ukuran file melebihi batas maksimum 100MB.');
              setSelectedFile(null);
              return;
            }
            setSelectedFile(file);
            setError(null);
          }
        }}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        {selectedFile ? (
          <p className="text-white font-semibold text-lg break-words">
            File Terpilih: {selectedFile.name}
          </p>
        ) : (
          <>
            <p className="text-white font-semibold text-lg mb-4">Seret dan Lepas Video Anda</p>
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
                d="M12 8v8m4-4H8m16 12V6a2 2 0 00-2-2H6a2 0 00-2 2v16a2 2 0 002 2h16a2 0 002-2z"
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
        Unggah Video
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