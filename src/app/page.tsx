// app/page.tsx
import { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LandingPage from '../components/landing-page/LandingPage';

// ✅ SEO metadata
export const metadata: Metadata = {
  title: 'MyType – Discover Your Typeface Instantly',
  description:
    'MyType helps designers find the perfect font in seconds. Explore curated typography, streamline your workflow, and integrate with tools like Figma and Adobe.',
};

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
    </>
  );
}
