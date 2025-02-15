import { Link } from "react-router-dom";
import {
  FaPlay,
  FaMoneyBillWave,
  FaCreditCard,
  FaGlobe,
  FaCheckCircle,
  FaVideo,
  FaCloud,
  FaChartBar,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="container mx-auto p-4 text-white">
      {/* Hero Section */}
      <section
        className="text-center my-12"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://i.ibb.co.com/d0jb4q4Q/Picsart-25-02-16-02-43-02-394.jpg"
            alt="Vidify Logo"
            className="w-32 h-32 object-cover rounded-lg" // object-cover untuk thumbnail, rounded-lg untuk sudut membulat
            loading="lazy"
          />
        </div>
        <h1 className="text-5xl font-extrabold mb-4">
          Selamat Datang di Vidify
        </h1>
        <p className="text-xl mb-6 text-gray-300">
          Platform hosting video yang memungkinkan Anda menghasilkan uang dari setiap tampilan, dengan teknologi terdepan dan dukungan penuh.
        </p>
        <div className="flex justify-center space-x-6">
          <Link
            to="/register"
            className="px-8 py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded transition duration-300"
          >
            Daftar Sekarang
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded transition duration-300"
          >
            Login
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section
        className="my-16"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Menghasilkan Uang dari Video Anda
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              Vidify memungkinkan Anda mengupload video dan mendapatkan pendapatan dengan model CPM. Mulailah menghasilkan dari konten yang Anda buat!
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <FaCheckCircle className="mr-2 text-purple-500" />
                Interface ramah pengguna untuk upload video yang cepat dan mudah.
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="mr-2 text-purple-500" />
                Verifikasi tampilan untuk keakuratan pendapatan, memastikan Anda mendapatkan apa yang Anda layak.
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="mr-2 text-purple-500" />
                Laporan pendapatan real-time untuk transparansi dan kontrol penuh atas keuangan Anda.
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="mr-2 text-purple-500" />
                Metode pembayaran beragam untuk kenyamanan Anda dalam menerima penghasilan.
              </li>
            </ul>
          </div>
          <div className="flex justify-center" data-aos="zoom-in" data-aos-duration="1200">
            <FaVideo className="text-purple-500" size={200} />
          </div>
        </div>
      </section>

      {/* Payment Methods & CPM Section */}
      <section
        className="my-16"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          Metode Pembayaran & CPM di Vidify
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Metode Pembayaran */}
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="flip-left"
            data-aos-duration="1200"
          >
            <FaCreditCard className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              Metode Pembayaran
            </h3>
            <p className="text-gray-300">
              Dukungan untuk <strong>Dana</strong>, <strong>Ovo</strong>, <strong>LinkAja</strong>, <strong>Gojek</strong>, dan <strong>Bank</strong> untuk memudahkan pencairan dana Anda.
            </p>
          </div>
          {/* CPM Indonesia */}
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="flip-left"
            data-aos-duration="1200"
            data-aos-delay="200"
          >
            <FaGlobe className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              CPM Indonesia
            </h3>
            <p className="text-gray-300">
              CPM mulai dari <strong>$0,5</strong> hingga <strong>$2</strong> per 1.000 tampilan, memberikan potensi penghasilan yang kompetitif.
            </p>
          </div>
          {/* Pendapatan Nyata */}
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="flip-left"
            data-aos-duration="1200"
            data-aos-delay="400"
          >
            <FaMoneyBillWave className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              Pendapatan Nyata
            </h3>
            <p className="text-gray-300">
              Dapatkan penghasilan dari setiap tampilan video yang valid, dengan sistem pembayaran yang jujur dan transparan.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section
        className="my-16"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          Mengapa Memilih Vidify?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Existing Features */}
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="zoom-in"
            data-aos-duration="1200"
          >
            <FaPlay className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              Mudah & Cepat
            </h3>
            <p className="text-gray-300">
              Upload video dalam hitungan menit dengan interface yang intuitif, memungkinkan Anda fokus pada kreativitas.
            </p>
          </div>
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-delay="200"
          >
            <FaCloud className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              Penyimpanan Aman
            </h3>
            <p className="text-gray-300">
              Video Anda aman di cloud kami dengan enkripsi terbaik, memberikan Anda ketenangan pikiran.
            </p>
          </div>
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-delay="400"
          >
            <FaChartBar className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              Analisis Terperinci
            </h3>
            <p className="text-gray-300">
              Dapatkan laporan analitik mendalam tentang performa video, membantu Anda untuk mengoptimalkan konten.
            </p>
          </div>
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-delay="600"
          >
            <FaShieldAlt className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              Keamanan & Privasi
            </h3>
            <p className="text-gray-300">
              Kami menjaga privasi dan keamanan data Anda dengan serius, memberikan perlindungan terbaik.
            </p>
          </div>
          {/* New Feature */}
          <div
            className="bg-transparent border-2 border-purple-500 p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition duration-300"
            data-aos="zoom-in"
            data-aos-duration="1200"
            data-aos-delay="800"
          >
            <FaUsers className="text-purple-500 mx-auto mb-4" size={40} />
            <h3 className="text-2xl font-semibold mb-2">
              Komunitas Kreator
            </h3>
            <p className="text-gray-300">
              Bergabunglah dengan komunitas kreator untuk berkolaborasi, berbagi ide, dan mendapatkan dukungan.
            </p>
          </div>
        </div>

        {/* Additional Explanation */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Selalu Ada yang Baru di Vidify</h3>
          <p className="text-lg text-gray-300">
            Kami terus memperbarui fitur kami untuk memastikan Anda mendapatkan pengalaman terbaik dalam membuat, mengelola, dan mendistribusikan konten video Anda. Dapatkan akses ke update terbaru, panduan, dan webinar eksklusif untuk meningkatkan kemampuan kreatif Anda.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 bg-transparent border-t border-gray-700 p-4 mb-20">
        <div className="container mx-auto grid grid-cols-2 gap-4 text-sm">
          <div className="text-left">
            <h4 className="text-base font-bold mb-3">Vidify</h4>
            <p className="mb-2">
              <span className="font-semibold">Developer:</span> Agung Developer
            </p>
            <p className="mb-2">
              <span className="font-semibold">Company:</span> Bali
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> 
              <a href="mailto:support@agungwandev.com" className="text-purple-500 hover:text-purple-600 break-words">support@agungwandev.com</a>
            </p>
          </div>
          <div className="text-left">
            <h4 className="text-base font-bold mb-3">Menu</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-purple-500">Privacy Policy</Link></li>
              <li><Link to="/about-us" className="text-gray-300 hover:text-purple-500">About Us</Link></li>
              <li><Link to="/contact-us" className="text-gray-300 hover:text-purple-500">Contact Us</Link></li>
              <li><Link to="/terms-and-conditions" className="text-gray-300 hover:text-purple-500">Terms and Conditions</Link></li>
              <li><Link to="/disclaimer" className="text-gray-300 hover:text-purple-500">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;