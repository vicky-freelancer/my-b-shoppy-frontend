import React, { useEffect, useState } from 'react';
import './HeroSlider.css';

const sliderFiles = [
  'Hair Accessories.png',
  'Artificial Jewels.png',
  'Hand Bags.png',
];

const slideCopy: { subtitle: string; sideText: string }[] = [
  { subtitle: 'FOR EVERY STYLE, EVERY MOOD', sideText: 'Small ♡\nAccessories\nBig Vibes' },
  { subtitle: 'STYLE IT YOUR WAY', sideText: 'Little Things\nMake\nBig Moments' },
  { subtitle: 'CARRY YOUR STYLE', sideText: 'Totes, Clutches\n& Mini\nBags' },
];

const titleFromFile = (file: string) => file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');

const slides = sliderFiles.map((file, i) => {
  const title = titleFromFile(file);
  return {
    image: `/slider/desktop/${file}`,
    imageMobile: `/slider/mobile/${file}`,
    title,
    subtitle: slideCopy[i]?.subtitle ?? title.toUpperCase(),
    sideText: slideCopy[i]?.sideText ?? '',
  };
});

export const HeroSlider: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <section className="hero-slider">
      {/* Background decoration */}
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      {/* Slides */}
      <div className="slides-wrapper">
        {slides.map((slide, index) => (
          <div
            className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
            key={index}
          >
            {/* Full-bleed background image */}
            <img
              src={isMobile && slide.imageMobile ? slide.imageMobile : slide.image}
              alt={slide.title}
              className="product-image"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.includes('/slider/mobile/') && !img.dataset.fellBack) {
                  img.dataset.fellBack = 'true';
                  img.src = img.src.replace('/slider/mobile/', '/slider/desktop/');
                }
              }}
            />

            {/* Legibility scrim */}
            <div className="hero-overlay"></div>

            {/* LEFT SIDE */}
            <div className="hero-left">
              <div className="handwritten-text">
                {slide.sideText.split('\n').map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </div>

              <div className="decor-heart heart-one">♡</div>
              <div className="decor-heart heart-two">♡</div>
            </div>

            {/* RIGHT SIDE */}
            <div className="hero-content">
              <div className="title-wrapper">
                <h1>{slide.title}</h1>

                <div className="subtitle">{slide.subtitle}</div>

                <div className="title-decoration">
                  <span></span>
                  <div className="small-heart">♡</div>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SLIDER DOTS */}
      <div className="slider-navigation">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};