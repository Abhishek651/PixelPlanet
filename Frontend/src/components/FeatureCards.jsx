import React from 'react';
import styled from 'styled-components';

const FeatureCards = () => {
  const features = [
    {
      title: "Play & Learn Games",
      description: "Transform learning into an adventure! Engage with interactive eco-games that make sustainability fun and rewarding.",
      features: [
        "Waste Segregation Challenge",
        "Climate Quiz Battles",
        "Real-time Multiplayer",
        "Instant Eco-Points Rewards"
      ],
      cta: "Start Playing Now",
      gradient: "linear-gradient(43deg, rgb(16, 185, 129) 0%, rgb(5, 150, 105) 46%, rgb(4, 120, 87) 100%)"
    },
    {
      title: "Unlock Epic Badges",
      description: "Showcase your environmental achievements! Collect exclusive badges and climb the ranks as you make a real difference.",
      features: [
        "50+ Unique Achievement Badges",
        "Rare Legendary Rewards",
        "Profile Showcase System",
        "Streak Milestone Bonuses"
      ],
      cta: "Claim Your First Badge",
      gradient: "linear-gradient(43deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 46%, rgb(21, 128, 61) 100%)"
    },
    {
      title: "Track Your Impact",
      description: "See your environmental footprint shrink! Monitor your contributions and inspire others with measurable results.",
      features: [
        "Personal Impact Dashboard",
        "CO₂ Reduction Metrics",
        "Global Leaderboard Rankings",
        "Institute-wide Statistics"
      ],
      cta: "View Your Impact",
      gradient: "linear-gradient(43deg, rgb(5, 150, 105) 0%, rgb(4, 120, 87) 46%, rgb(6, 95, 70) 100%)"
    },
    {
      title: "Teacher Benefits",
      description: "Empower your classroom with tools that make environmental education engaging and measurable.",
      features: [
        "Create Custom Challenges",
        "Track Student Progress",
        "Automated Grading System",
        "Curriculum Integration Tools"
      ],
      cta: "Explore Teacher Tools",
      gradient: "linear-gradient(43deg, rgb(6, 95, 70) 0%, rgb(4, 120, 87) 46%, rgb(5, 150, 105) 100%)"
    }
  ];

  return (
    <StyledWrapper>
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">Why Students & Teachers Love PixelPlanet</h2>
          <p className="section-subtitle">Join thousands making a difference through gamified learning</p>
        </div>

        <div className="cards-grid">
          {features.map((feature, index) => (
            <div className="container noselect" key={index}>
              <div className="canvas">
                <div className="tracker tr-1" />
                <div className="tracker tr-2" />
                <div className="tracker tr-3" />
                <div className="tracker tr-4" />
                <div className="tracker tr-5" />
                <div className="tracker tr-6" />
                <div className="tracker tr-7" />
                <div className="tracker tr-8" />
                <div className="tracker tr-9" />
                <div className="tracker tr-10" />
                <div className="tracker tr-11" />
                <div className="tracker tr-12" />
                <div className="tracker tr-13" />
                <div className="tracker tr-14" />
                <div className="tracker tr-15" />
                <div className="tracker tr-16" />
                <div className="tracker tr-17" />
                <div className="tracker tr-18" />
                <div className="tracker tr-19" />
                <div className="tracker tr-20" />
                <div className="tracker tr-21" />
                <div className="tracker tr-22" />
                <div className="tracker tr-23" />
                <div className="tracker tr-24" />
                <div className="tracker tr-25" />
                <div className="card" style={{ background: feature.gradient }}>

                  <div className="card_title__container">
                    <span className="card_title">{feature.title}</span>
                    <p className="card_paragraph">{feature.description}</p>
                  </div>
                  <hr className="line" />
                  <ul className="card__list">
                    {feature.features.map((item, idx) => (
                      <li className="card__list_item" key={idx}>
                        <span className="check">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="check_svg">
                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="list_text">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="button">{feature.cta}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .features-container {
    width: 100%;
    padding: 3rem 1rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 800;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.75rem;
  }

  .section-subtitle {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: hsl(0, 0%, 60%);
    max-width: 600px;
    margin: 0 auto;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 3rem;
    justify-items: center;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  /* Card Container */
  .container {
    position: relative;
    width: 100%;
    max-width: 380px;
    height: 440px;
    transition: 200ms;
    
    @media (max-width: 768px) {
      height: 460px;
    }
  }

  .container:active {
    transform: scale(0.97);
  }

  /* Main Card */
  .card {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1.5rem;
    gap: 1rem;
    border-radius: 20px;
    transition: 700ms;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .card::before {
    content: '';
    background: inherit;
    filter: blur(2rem);
    opacity: 30%;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    transition: 200ms;
    border-radius: 20px;
    inset: 0;
  }

  .container:hover .card::before {
    transition: 200ms;
    opacity: 80%;
  }



  /* Card Content */
  .card_title__container {
    width: 100%;
    z-index: 10;
  }

  .card_title {
    font-size: clamp(1.2rem, 2.5vw, 1.5rem);
    font-weight: 700;
    color: white;
    line-height: 1.3;
    display: block;
  }

  .card_paragraph {
    margin-top: 0.5rem;
    width: 100%;
    font-size: clamp(0.8rem, 1.5vw, 0.9rem);
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.5;
  }

  .line {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    z-index: 10;
  }

  .card__list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    z-index: 10;
  }

  .card__list_item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .check {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .check_svg {
    width: 0.85rem;
    height: 0.85rem;
    fill: rgb(5, 150, 105);
  }

  .list_text {
    font-size: clamp(0.75rem, 1.5vw, 0.85rem);
    color: white;
    line-height: 1.4;
  }

  .button {
    cursor: pointer;
    padding: 0.85rem 1.5rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    font-size: clamp(0.85rem, 1.5vw, 0.95rem);
    font-weight: 600;
    color: rgb(5, 150, 105);
    border: 0;
    border-radius: 9999px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 10;
    margin-top: auto;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      background: white;
    }

    &:active {
      transform: translateY(0);
    }
  }

  /* Tracker Grid */
  .canvas {
    perspective: 800px;
    inset: 0;
    z-index: 200;
    position: absolute;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    grid-template-areas: 
      "tr-1 tr-2 tr-3 tr-4 tr-5"
      "tr-6 tr-7 tr-8 tr-9 tr-10"
      "tr-11 tr-12 tr-13 tr-14 tr-15"
      "tr-16 tr-17 tr-18 tr-19 tr-20"
      "tr-21 tr-22 tr-23 tr-24 tr-25";
  }

  .tracker {
    position: absolute;
    z-index: 200;
    width: 100%;
    height: 100%;
  }

  .tracker:hover {
    cursor: pointer;
  }

  .tracker:hover ~ .card {
    transition: 300ms;
    filter: brightness(1.1);
  }

  /* Grid Areas */
  .tr-1 { grid-area: tr-1; }
  .tr-2 { grid-area: tr-2; }
  .tr-3 { grid-area: tr-3; }
  .tr-4 { grid-area: tr-4; }
  .tr-5 { grid-area: tr-5; }
  .tr-6 { grid-area: tr-6; }
  .tr-7 { grid-area: tr-7; }
  .tr-8 { grid-area: tr-8; }
  .tr-9 { grid-area: tr-9; }
  .tr-10 { grid-area: tr-10; }
  .tr-11 { grid-area: tr-11; }
  .tr-12 { grid-area: tr-12; }
  .tr-13 { grid-area: tr-13; }
  .tr-14 { grid-area: tr-14; }
  .tr-15 { grid-area: tr-15; }
  .tr-16 { grid-area: tr-16; }
  .tr-17 { grid-area: tr-17; }
  .tr-18 { grid-area: tr-18; }
  .tr-19 { grid-area: tr-19; }
  .tr-20 { grid-area: tr-20; }
  .tr-21 { grid-area: tr-21; }
  .tr-22 { grid-area: tr-22; }
  .tr-23 { grid-area: tr-23; }
  .tr-24 { grid-area: tr-24; }
  .tr-25 { grid-area: tr-25; }

  /* 3D Rotation Effects */
  .tr-1:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(-10deg) rotateZ(0deg); }
  .tr-2:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(-5deg) rotateZ(0deg); }
  .tr-3:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(0deg) rotateZ(0deg); }
  .tr-4:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(5deg) rotateZ(0deg); }
  .tr-5:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(20deg) rotateY(10deg) rotateZ(0deg); }
  
  .tr-6:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(-10deg) rotateZ(0deg); }
  .tr-7:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(-5deg) rotateZ(0deg); }
  .tr-8:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(0deg) rotateZ(0deg); }
  .tr-9:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(5deg) rotateZ(0deg); }
  .tr-10:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(10deg) rotateY(10deg) rotateZ(0deg); }
  
  .tr-11:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(-10deg) rotateZ(0deg); }
  .tr-12:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(-5deg) rotateZ(0deg); }
  .tr-13:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  .tr-14:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(5deg) rotateZ(0deg); }
  .tr-15:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(0deg) rotateY(10deg) rotateZ(0deg); }
  
  .tr-16:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(-10deg) rotateZ(0deg); }
  .tr-17:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(-5deg) rotateZ(0deg); }
  .tr-18:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(0deg) rotateZ(0deg); }
  .tr-19:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(5deg) rotateZ(0deg); }
  .tr-20:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-10deg) rotateY(10deg) rotateZ(0deg); }
  
  .tr-21:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(-10deg) rotateZ(0deg); }
  .tr-22:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(-5deg) rotateZ(0deg); }
  .tr-23:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg); }
  .tr-24:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(5deg) rotateZ(0deg); }
  .tr-25:hover ~ .card { transition: 125ms ease-in-out; transform: rotateX(-20deg) rotateY(10deg) rotateZ(0deg); }

  /* No Select */
  .noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

export default FeatureCards;
