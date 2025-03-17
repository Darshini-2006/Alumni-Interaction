
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import LatestEvents from '@/components/home/LatestEvents';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <LatestEvents />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
