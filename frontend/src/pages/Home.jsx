import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <section className="hero">
  <div className="hero-content">
    <h1 className="hero-title">
      Find your best Product <br /> and make your work easy
    </h1>

    <p className="hero-subtitle">
      Discover high-quality products designed to help you in faster way,
      and do their work efficiently.
    </p>

    
  </div>

  <div className="hero-carousel">
    <div
      id="heroCarousel"
      className="carousel slide carousel-fade hero-slider"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="image-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
            alt="Learning"
          />
        </div>

        <div className="carousel-item">
          <div className="image-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            alt="Programming"
          />
        </div>

        <div className="carousel-item">
          <div className="image-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
            alt="Coding"
          />
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  )
}

export default Home
