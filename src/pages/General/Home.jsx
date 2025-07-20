import Benefits from "../../components/homepage/Benefits";
import CustomersReview from "../../components/homepage/CustomersReview";
import HeroSection from "../../components/homepage/HeroSection";
import Newsletter from "../../components/homepage/Newsletter";
import TopAgents from "../../components/homepage/TopAgents";
import TopBlog from "../../components/homepage/topBlog";
import TopPolicies from "../../components/homepage/TopPolicies";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <TopPolicies />
      <Benefits />
      <CustomersReview />
      <TopBlog />
      <Newsletter />
      <TopAgents />

      {/* Other sections will go here */}
    </div>
  );
};

export default Home;
