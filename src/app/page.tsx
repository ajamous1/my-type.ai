// Directory: app/page.tsx
'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LandingPage from '../components/LandingPage';

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
    </>
  );
}
