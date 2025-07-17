import Benefits from "../../components/homepage/Benefits";
import HeroSection from "../../components/homepage/HeroSection";
import TopPolicies from "../../components/homepage/TopPolicies";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <TopPolicies />
      <Benefits />

      {/* Other sections will go here */}
    </div>
  );
};

export default Home;
