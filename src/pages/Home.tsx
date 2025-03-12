import { FaVideo, FaCloud, FaShieldAlt } from "react-icons/fa";
import UploadVideo from "./UploadVideo";

const Home = () => {
  return (
    <div className="container mx-auto p-3 text-white">
      {/* Upload Video Section */}
      <section
        className="my-16"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Unggah Video Anda</h2>
        <UploadVideo />
      </section>

      {/* Features Section */}
      <section
        className="my-16"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Fitur VideHost</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="zoom-in"
            data-aos-duration="1200"
          >
            <FaVideo className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">Upload Mudah</h3>
            <p className="text-gray-300">
              Unggah video Anda dengan cepat dan mudah melalui antarmuka yang ramah pengguna.
            </p>
          </div>
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-delay="200"
          >
            <FaCloud className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">Penyimpanan Aman</h3>
            <p className="text-gray-300">
              Simpan video Anda dengan aman di cloud kami yang terenkripsi.
            </p>
          </div>
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-delay="400"
          >
            <FaShieldAlt className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">Keamanan Terjamin</h3>
            <p className="text-gray-300">
              Privasi dan keamanan video Anda adalah prioritas kami.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 bg-transparent border-t border-gray-700 p-4 mb-20">
        <div className="container mx-auto text-center text-sm">
          <h4 className="text-base font-bold mb-3">VideHost</h4>
          <p className="mb-2">© 2025 VideHost. All rights reserved.</p>
          <p className="mb-2">
            <a href="mailto:support@videhost.link" className="text-purple-500 hover:text-purple-600">
              support@videhost.link
            </a>
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="/privacy-policy" className="text-gray-300 hover:text-purple-500">
              Privacy Policy
            </a>
            <a href="/terms-and-conditions" className="text-gray-300 hover:text-purple-500">
              Terms and Conditions
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;