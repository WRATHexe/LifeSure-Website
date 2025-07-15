import { useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa"; // Import from fa instead of fa6
import {
  FaAward,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaUsers,
} from "react-icons/fa6";
import { useNavigate } from "react-router";

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider data
  const heroSlides = [
    {
      id: 1,
      heading: "Secure Your Tomorrow Today",
      tagline:
        "Protect what matters most with comprehensive insurance coverage tailored for your future",
      buttonText: "Get a Free Quote",
      backgroundImage: "https://i.postimg.cc/rwytbdYB/image.png",
      stats: { clients: "50K+", claims: "98%", experience: "15+" },
    },
    {
      id: 2,
      heading: "Life Insurance Made Simple",
      tagline:
        "Get instant quotes and secure your family's financial future with our easy-to-understand policies",
      buttonText: "Explore Plans",
      backgroundImage: "https://i.postimg.cc/bw62jz7s/image.png",
      stats: { clients: "50K+", claims: "98%", experience: "15+" },
    },
    {
      id: 3,
      heading: "Your Family's Safety Net",
      tagline:
        "Join thousands of families who trust LifeSure for comprehensive protection and peace of mind",
      buttonText: "Start Today",
      backgroundImage: "https://i.postimg.cc/brXtF3Kg/image.png",
      stats: { clients: "50K+", claims: "98%", experience: "15+" },
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [heroSlides.length]); // Added dependency

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleGetQuote = () => {
    navigate("/get-quote");
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Overlay */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.backgroundImage}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Heading with Animation */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block opacity-0 animate-fadeInUp">
                  {currentSlideData.heading.split(" ").slice(0, 2).join(" ")}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 opacity-0 animate-fadeInUp animation-delay-300">
                  {currentSlideData.heading.split(" ").slice(2).join(" ")}
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-2xl leading-relaxed opacity-0 animate-fadeInUp animation-delay-500">
                {currentSlideData.tagline}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fadeInUp animation-delay-700">
              <button
                onClick={handleGetQuote}
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center"
              >
                <FaShieldAlt className="mr-3 group-hover:animate-bounce" />
                {currentSlideData.buttonText}
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </button>

              <button className="group border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 flex items-center justify-center">
                <FaPlay className="mr-3 group-hover:animate-pulse" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 opacity-0 animate-fadeInUp animation-delay-900">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-300">
                  {currentSlideData.stats.clients}
                </div>
                <div className="text-blue-100 text-xs sm:text-sm uppercase tracking-wide">
                  Happy Clients
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-300">
                  {currentSlideData.stats.claims}
                </div>
                <div className="text-blue-100 text-xs sm:text-sm uppercase tracking-wide">
                  Claims Settled
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-300">
                  {currentSlideData.stats.experience}
                </div>
                <div className="text-blue-100 text-xs sm:text-sm uppercase tracking-wide">
                  Years Experience
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Animated Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              {/* Main Shield */}
              <div className="w-80 h-80 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-blue-600/40 to-cyan-500/40 rounded-full animate-pulse animation-delay-600"></div>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <FaShieldAlt className="text-white text-4xl" />
                  </div>
                </div>

                {/* Floating Icons */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-1000">
                  <FaUsers className="text-blue-500 text-xl" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-1500">
                  <FaAward className="text-green-500 text-xl" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-2000">
                  <span className="text-purple-500 text-xl">💰</span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-500">
                  <span className="text-red-500 text-xl">❤️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            aria-label="Previous slide"
          >
            <FaChevronLeft />
          </button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            aria-label="Next slide"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
          }}
        />
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-900 {
          animation-delay: 0.9s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
