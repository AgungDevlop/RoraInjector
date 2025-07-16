import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";

interface HeroData {
  her: string;
  roll: string;
  URL: string;
}

const ViewHero: React.FC = () => {
  const [heroes, setHeroes] = useState<HeroData[]>([]);
  const [filteredHeroes, setFilteredHeroes] = useState<HeroData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const directLink = "https://obqj2.com/4/9577995"; // Your direct link

  const roleOptions = [
    "Fighter",
    "Tank",
    "Mage",
    "Marksman",
    "Assassin",
    "Support",
  ];

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/AgungDevlop/InjectorMl/refs/heads/main/Hero.json"
        );
        const heroesData = response.data;
        if (!Array.isArray(heroesData)) {
          throw new Error("list.json is not a valid array");
        }
        setHeroes(heroesData);
        setFilteredHeroes(heroesData);

        heroesData.forEach((hero: HeroData) => {
          const img = new Image();
          const imageUrl = getImageUrl(hero.URL);
          img.src = imageUrl;
          img.onload = () => {
            setLoadedImages((prev) => new Set(prev).add(hero.her));
            clearTimeout(timeoutRefs.current.get(hero.her));
          };
          img.onerror = () => {
            setLoadedImages((prev) => new Set(prev).add(hero.her));
            clearTimeout(timeoutRefs.current.get(hero.her));
          };

          const timeout = setTimeout(() => {
            setLoadedImages((prev) => new Set(prev).add(hero.her));
          }, 5000);
          timeoutRefs.current.set(hero.her, timeout);
        });
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? `${err.message} (Status: ${err.response?.status})`
            : "Unknown error";
        setError(`Failed to fetch heroes: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroes();

    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  useEffect(() => {
    const filtered = heroes
      .filter((hero) => {
        const matchesSearch =
          hero.her.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hero.roll.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter ? hero.roll === roleFilter : true;
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => a.her.localeCompare(b.her));
    setFilteredHeroes(filtered);
  }, [searchQuery, roleFilter, heroes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  const handleViewClick = (heroName: string) => {
    sessionStorage.setItem("selectedHero", heroName);
    window.open(directLink, "_blank");
  };

  const getImageUrl = (url: string): string => {
    try {
      const decodedUrl = url.replace(/\\+/g, '');
      if (decodedUrl.includes("static.wikia.nocookie.net")) {
        const baseUrl = decodedUrl.split("/revision/latest")[0];
        return baseUrl;
      }
      return decodedUrl;
    } catch (e) {
      return "https://via.placeholder.com/50?text=Hero";
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
        View Heroes
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Hero or Role"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-gray-900/50 border border-blue-400 text-blue-300 rounded-lg px-3 py-1.5 mb-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-300 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
        <div className="grid grid-cols-1 gap-4">
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="w-full bg-gray-900/50 border border-blue-400 text-blue-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-300 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          >
            <option value="" className="bg-gray-900 text-blue-300">
              All Roles
            </option>
            {roleOptions.map((role) => (
              <option
                key={role}
                value={role}
                className="bg-gray-900 text-blue-300"
              >
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900/60 text-red-200 rounded-lg text-sm backdrop-blur-sm border border-red-400/50 animate-neon-pulse">
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
          {filteredHeroes.length === 0 && !error && (
            <p className="text-center text-blue-300 text-sm sm:text-base">
              No heroes found.
            </p>
          )}
          {filteredHeroes.map((hero) => (
            <div
              key={hero.her}
              className="flex items-center justify-between bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 border-2 border-blue-400 rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-none shadow-xl p-2 sm:p-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {!loadedImages.has(hero.her) && (
                  <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center">
                    <div className="custom-spinner"></div>
                  </div>
                )}
                <img
                  src={getImageUrl(hero.URL)}
                  alt={`${hero.her} image`}
                  className={`w-8 sm:w-10 h-8 sm:h-10 object-cover rounded-full border-2 border-blue-400 animate-neon-pulse ${loadedImages.has(hero.her) ? '' : 'hidden'}`}
                  loading="lazy"
                />
                <h2 className="font-bold text-xs sm:text-sm text-blue-300 tracking-tight drop-shadow-[0_1px_2px_rgba(59,130,246,0.8)]">
                  {hero.her}
                </h2>
              </div>
              <Link
                to="/unlock-skin"
                onClick={() => handleViewClick(hero.her)}
                className="bg-gradient-to-r from-gray-900 via-blue-950 to-purple-950 text-blue-300 py-1 px-2 sm:py-1 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold border border-blue-400 animate-neon-pulse hover:bg-gradient-to-r hover:from-blue-950 hover:via-purple-950 hover:to-gray-900 hover:shadow-[0_0_8px_rgba(59,130,246,0.8),0_0_15px_rgba(59,130,246,0.6)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewHero;
