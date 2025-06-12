import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { FaAngleDoubleRight } from "react-icons/fa";

interface SkinData {
  id: string;
  hero: string;
  name: string;
  type: string;
  role: string[];
  img1: string;
  img2: string;
  url: string;
}

const ViewSkin: React.FC = () => {
  const [skins, setSkins] = useState<SkinData[]>([]);
  const [filteredSkins, setFilteredSkins] = useState<SkinData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const hero = sessionStorage.getItem("selectedHero");
    setSelectedHero(hero);

    const fetchSkins = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/AgungDevlop/InjectorMl/main/Skin.json"
        );
        const skinsData = response.data;
        if (!Array.isArray(skinsData)) {
          throw new Error("Skin.json is not a valid array");
        }
        setSkins(skinsData);
        setFilteredSkins(skinsData);

        skinsData.forEach((skin: SkinData) => {
          (['img1', 'img2'] as const).forEach((imgType) => {
            const img = new Image();
            img.src = getImageUrl(skin[imgType]);
            img.onload = () => {
              setLoadedImages((prev) => new Set(prev).add(`${skin.id}-${imgType}`));
              clearTimeout(timeoutRefs.current.get(`${skin.id}-${imgType}`));
            };
            img.onerror = () => {
              setLoadedImages((prev) => new Set(prev).add(`${skin.id}-${imgType}`));
              clearTimeout(timeoutRefs.current.get(`${skin.id}-${imgType}`));
            };

            const timeout = setTimeout(() => {
              setLoadedImages((prev) => new Set(prev).add(`${skin.id}-${imgType}`));
            }, 5000);
            timeoutRefs.current.set(`${skin.id}-${imgType}`, timeout);
          });
        });
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? `${err.message} (Status: ${err.response?.status})`
            : "Unknown error";
        setError(`Failed to fetch skins: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkins();

    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  useEffect(() => {
    const filtered = skins
      .filter((skin) => {
        const matchesHero = selectedHero ? skin.hero === selectedHero : true;
        return matchesHero;
      })
      .sort((a, b) => a.hero.localeCompare(b.hero));
    setFilteredSkins(filtered);
  }, [skins, selectedHero]);

  const getImageUrl = (url: string): string => {
    try {
      const decodedUrl = url.replace(/\\+/g, '');
      if (decodedUrl.includes("static.wikia.nocookie.net")) {
        const baseUrl = decodedUrl.split("/revision/latest")[0];
        return baseUrl;
      }
      return decodedUrl;
    } catch (e) {
      return "https://via.placeholder.com/40?text=Skin";
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-3 text-white">
      <style>
        {`
          @keyframes pulse-ring {
            0% { transform: scale(0.33); opacity: 1; }
            80%, 100% { opacity: 0; }
          }
          @keyframes pulse-dot {
            0% { transform: scale(0.8); }
            50% { transform: scale(1); }
            100% { transform: scale(0.8); }
          }
          .custom-spinner {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .custom-spinner::before {
            content: '';
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: #3b82f6;
            animation: pulse-ring 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            position: absolute;
          }
          .custom-spinner::after {
            content: '';
            width: 50%;
            height: 50%;
            background: #3b82f6;
            border-radius: 50%;
            animation: pulse-dot 1.2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
            position: absolute;
          }
        `}
      </style>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-400 mb-4 sm:mb-6 md:mb-8 tracking-tight text-center drop-shadow-[0_2px_4px_rgba(59,130,246,0.8)]">
        View Skins {selectedHero ? `for ${selectedHero}` : ""}
      </h1>

      {error && (
        <div className="mb-6 p-3 bg-red-900/60 text-red-200 rounded-lg text-xs sm:text-sm backdrop-blur-sm border border-red-400/50 animate-neon-pulse">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <div className="w-6 h-6 relative animate-ios-spinner">
            <div className="absolute inset-0 rounded-full border-t-2 border-gray-400 opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-gray-400 animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-3">
          {filteredSkins.length === 0 && !error && (
            <p className="text-center text-blue-300 text-sm sm:text-base">
              No skins found{selectedHero ? ` for ${selectedHero}` : ""}.
            </p>
          )}
          {filteredSkins.map((skin) => (
            <div
              key={skin.id}
              className="flex items-center justify-between bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 border-2 border-blue-400 rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-none shadow-xl p-2 sm:p-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {!loadedImages.has(`${skin.id}-img1`) && (
                  <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center">
                    <div className="custom-spinner"></div>
                  </div>
                )}
                <img
                  src={getImageUrl(skin.img1)}
                  alt={`${skin.name} img1`}
                  className={`w-8 sm:w-10 h-8 sm:h-10 object-cover rounded-full border-2 border-blue-400 animate-neon-pulse ${loadedImages.has(`${skin.id}-img1`) ? '' : 'hidden'}`}
                  loading="lazy"
                />
                <FaAngleDoubleRight className="text-blue-300 mx-1 text-sm sm:text-base animate-neon-pulse" />
                {!loadedImages.has(`${skin.id}-img2`) && (
                  <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center">
                    <div className="custom-spinner"></div>
                  </div>
                )}
                <img
                  src={getImageUrl(skin.img2)}
                  alt={`${skin.name} img2`}
                  className={`w-8 sm:w-10 h-8 sm:h-10 object-cover rounded-full border-2 border-blue-400 animate-neon-pulse ${loadedImages.has(`${skin.id}-img2`) ? '' : 'hidden'}`}
                  loading="lazy"
                />
                <h2 className="font-bold text-xs sm:text-sm text-blue-300 tracking-tight drop-shadow-[0_1px_2px_rgba(59,130,246,0.8)]">
                  {skin.type === "Backup" ? `Remove ${skin.name}` : skin.name}
                </h2>
              </div>
              <a
                href={skin.url}
                target="_blank"
                rel="noreferrer"
                className="bg-gradient-to-r from-gray-900 via-blue-950 to-purple-950 text-blue-300 py-1 px-2 sm:py-1 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold border border-blue-400 animate-neon-pulse hover:bg-gradient-to-r hover:from-blue-950 hover:via-purple-950 hover:to-gray-900 hover:shadow-[0_0_8px_rgba(59,130,246,0.8),0_0_15px_rgba(59,130,246,0.6)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300"
              >
                Inject
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewSkin;