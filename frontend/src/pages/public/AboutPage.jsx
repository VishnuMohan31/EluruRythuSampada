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
          <h1 className="page-title">Celebrating SHG Artisans of Andhra Pradesh</h1>
          <p className="page-subtitle">A Government Initiative Connecting Authentic Craftsmanship with Appreciative Buyers</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <div className="section-text">
              <h2>Who We Are</h2>
              <p>
                Swayam Eluru Market Place is a government-backed initiative supported by TRIFED (Tribal Cooperative
                Marketing Development Federation of India) and the Government of Andhra Pradesh. We showcase the
                rich heritage and exceptional craftsmanship of SHG communities across Andhra Pradesh.
              </p>
              <p>
                From the intricate Dhokra metalwork to vibrant Lambadi embroidery, from handwoven Chenchu baskets
                to traditional Koya pottery—each piece tells a story of generations of skill, culture, and artistry
                passed down through time.
              </p>
            </div>
            <div className="section-image">
              <img src={about2Img} alt="SHG artisan crafting" />
            </div>
          </section>

          <section className="values-section">
            <h2>What Makes Us Different</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">✓</div>
                <h3>Verified Artisans</h3>
                <p>Every vendor is verified by government authorities, ensuring authenticity and quality.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🗣</div>
                <h3>Direct Communication</h3>
                <p>Connect directly with artisans to understand their craft, discuss custom orders, and build relationships.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🏛</div>
                <h3>Government Backed</h3>
                <p>Supported by TRIFED and Andhra Pradesh Government for trust and transparency.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🎨</div>
                <h3>Cultural Heritage</h3>
                <p>Each product represents centuries of tradition, skill, and cultural identity.</p>
              </div>
            </div>
          </section>

          <section className="impact-section">
            <h2>Our Reach</h2>
            <div className="impact-stats">
              <div className="stat-card">
                <div className="stat-number">45+</div>
                <div className="stat-label">SHG Communities</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">234+</div>
                <div className="stat-label">Verified Artisans</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">892+</div>
                <div className="stat-label">Handcrafted Products</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1,567+</div>
                <div className="stat-label">Satisfied Buyers</div>
              </div>
            </div>
          </section>

          <section className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Explore</h3>
                <p>Browse authentic SHG handicrafts, textiles, jewelry, and home decor from Andhra Pradesh artisans.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Learn</h3>
                <p>Discover the stories behind each craft, the SHG communities, and traditional techniques used.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Connect</h3>
                <p>Reach out to artisans directly through the platform to discuss products, customization, and orders.</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Transact</h3>
                <p>Complete your purchase directly with the artisan through your preferred payment method.</p>
              </div>
            </div>
          </section>

          <section className="platform-purpose">
            <h2>About This Platform</h2>
            <div className="purpose-content">
              <p>
                This is a communication and discovery platform designed to bring visibility to the incredible work
                of Andhra Pradesh's SHG artisans. We provide a space where artisans can showcase their products
                and buyers can discover authentic, handcrafted treasures.
              </p>
              <p>
                All transactions, negotiations, and payments happen directly between buyers and artisans. We don't
                process payments or handle logistics—our role is to facilitate connections and provide a trusted
                space for these interactions to flourish.
              </p>
              <div className="trust-indicators">
                <div className="trust-item">
                  <span className="trust-icon">🛡</span>
                  <span>Government Verified Vendors</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">📞</span>
                  <span>Direct Artisan Contact</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">🎯</span>
                  <span>Authentic SHG Products Only</span>
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
