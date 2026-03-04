import React from 'react'
import aboutHeaderBg from '@/Images/About.png'
import about2Img from '@/Images/About2.png'
import './AboutPage.css'

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div 
          className="page-header"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${aboutHeaderBg})`
          }}
        >
          <h1 className="page-title">Empowering Local Farmers</h1>
          <p className="page-subtitle">A Government Initiative Connecting Farmers Directly with Consumers</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <div className="section-text">
              <h2>Who We Are</h2>
              <p>
                Rythu Sampada is a government-backed initiative promoting sustainable agriculture and 
                empowering local farming communities. We provide a direct marketplace connecting farmers 
                with consumers, eliminating middlemen and ensuring fair prices for agricultural produce.
              </p>
              <p>
                From fresh vegetables and fruits to organic grains, dairy products, and traditional farm 
                produce—each product represents the hard work, dedication, and sustainable farming practices 
                of our local farmers.
              </p>
            </div>
            <div className="section-image">
              <img src={about2Img} alt="Local farmer with fresh produce" />
            </div>
          </section>

          <section className="values-section">
            <h2>What Makes Us Different</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">✓</div>
                <h3>Verified Farmers</h3>
                <p>Every farmer is verified by government authorities, ensuring quality and authenticity of produce.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🗣</div>
                <h3>Direct Communication</h3>
                <p>Connect directly with farmers to discuss products, bulk orders, and build relationships.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">◈</div>
                <h3>Government Backed</h3>
                <p>Supported by government initiatives for trust, transparency, and farmer welfare.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌱</div>
                <h3>Sustainable Agriculture</h3>
                <p>Promoting organic farming, traditional methods, and environmentally friendly practices.</p>
              </div>
            </div>
          </section>

          <section className="impact-section">
            <h2>Our Reach</h2>
            <div className="impact-stats">
              <div className="stat-card">
                <div className="stat-number">150+</div>
                <div className="stat-label">Registered Farmers</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Villages Covered</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Farm Products</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">2,000+</div>
                <div className="stat-label">Satisfied Customers</div>
              </div>
            </div>
          </section>

          <section className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Explore</h3>
                <p>Browse fresh vegetables, fruits, grains, dairy products, and organic produce from local farmers.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Learn</h3>
                <p>Discover the farmers behind each product, their farming practices, and product details.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Connect</h3>
                <p>Reach out to farmers directly through the platform to discuss products, quantities, and orders.</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Purchase</h3>
                <p>Complete your purchase directly with the farmer through your preferred payment method.</p>
              </div>
            </div>
          </section>

          <section className="platform-purpose">
            <h2>About This Platform</h2>
            <div className="purpose-content">
              <p>
                This is a communication and discovery platform designed to bring visibility to local farmers 
                and their produce. We provide a space where farmers can showcase their products and consumers 
                can discover fresh, authentic agricultural products directly from the source.
              </p>
              <p>
                All transactions, negotiations, and payments happen directly between buyers and farmers. We don't
                process payments or handle logistics—our role is to facilitate connections and provide a trusted
                space for these interactions to flourish.
              </p>
              <div className="trust-indicators">
                <div className="trust-item">
                  <span className="trust-icon">🛡</span>
                  <span>Government Verified Farmers</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">📞</span>
                  <span>Direct Farmer Contact</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">🌾</span>
                  <span>Fresh Farm Products Only</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
