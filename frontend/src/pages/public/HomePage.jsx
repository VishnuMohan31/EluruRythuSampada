import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductCard from '@components/product/ProductCard'
import { mockProducts, mockCategories } from '@/data/mockData'
import './HomePage.css'

const HomePage = () => {
  const { t } = useTranslation()
  const topProducts = mockProducts.slice(0, 4)
  const recentProducts = mockProducts.slice(4, 8)
  const contactedProducts = mockProducts.slice(8, 12)

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Authentic
              <span className="hero-highlight"> SHG Heritage</span>
            </h1>
            <p className="hero-description">
              Handcrafted products from India's SHG artisans, preserving culture
              and empowering communities. Each piece tells a story of tradition,
              skill, and heritage passed down through generations.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-outline btn-large">
                Explore Products
              </Link>
              <Link to="/about" className="btn btn-outline btn-large">
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-description">
              Explore our diverse collection of authentic SHG products
            </p>
          </div>
          
          <div className="categories-grid">
            {mockCategories.map(category => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="category-card"
              >
                <div className="category-image">
                  <img src={category.image} alt={category.name} loading="lazy" />
                  <div className="category-overlay"></div>
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <span className="category-count">
                    {category.productCount} products
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Top Viewed Products</h2>
            <p className="section-description">
              Discover what others are loving
            </p>
          </div>
          
          <div className="products-grid">
            {topProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="section-footer">
            <Link to="/products" className="btn btn-outline btn-large">
              View More Products
            </Link>
          </div>
        </div>
      </section>

      {/* Most Contacted Products Section */}
      <section className="featured-section alternate-bg">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Most Contacted Products</h2>
            <p className="section-description">
              Products buyers are reaching out about
            </p>
          </div>
          
          <div className="products-grid">
            {contactedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="section-footer">
            <Link to="/products" className="btn btn-outline btn-large">
              Explore More Products
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Added Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Recently Added Products</h2>
            <p className="section-description">
              Fresh arrivals from our artisans
            </p>
          </div>
          
          <div className="products-grid">
            {recentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="section-footer">
            <Link to="/products" className="btn btn-outline btn-large">
              See All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* About / SHG Heritage Section */}
      <section className="featured-section alternate-bg heritage-section">
        <div className="container">
          <div className="section-header heritage-header">
            <h2 className="section-title">Celebrating Andhra Pradesh's SHG Heritage</h2>
            <p className="section-description heritage-description">
              Swayam Eluru Market Place is a government-backed platform supported by TRIFED 
              and the Government of Andhra Pradesh. We showcase the exceptional craftsmanship 
              of SHG communities from across Andhra Pradesh—from the Nallamala forests to 
              the Eastern Ghats.
            </p>
            <p className="section-description heritage-description">
              Our platform connects you directly with skilled SHG artisans including the 
              Chenchu, Lambadi, Gond, and Koya communities. Each product represents centuries 
              of traditional knowledge, passed down through generations. From bamboo weaving 
              to Dhokra metalwork, from natural forest honey to handloom textiles—discover 
              authentic SHG crafts that tell stories of heritage and skill.
            </p>
            <Link to="/about" className="btn btn-outline btn-large">
              Discover Our Artisans
            </Link>
          </div>
          <div className="heritage-images">
            <img src="/src/Images/TribalPic1.png" alt="SHG bamboo weaving craftsmanship" loading="lazy" />
            <img src="/src/Images/TibePic3.png" alt="Traditional SHG handicraft artisan" loading="lazy" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
