import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductCard from '@components/product/ProductCard'
import { API_BASE_URL } from '@utils/api'
import './HomePage.css'
import BannerImage from '../../Images/Banner.png'
import Banner1 from '../../Images/Banner1.png'
import Banner2 from '../../Images/Banner2.png'
import Banner3 from '../../Images/Banner3.png'
import TribalPic1 from '../../Images/TribalPic1.png'
import TibePic3 from '../../Images/TibePic3.png'

const HERO_BANNERS = [
  { id: 0, src: BannerImage, alt: 'Eluru Rythu Sampada - Fresh farm produce' },
  { id: 1, src: Banner1, alt: 'Farm to home - Local farmers' },
  { id: 2, src: Banner2, alt: 'Bridging farms to homes digitally' },
  { id: 3, src: Banner3, alt: 'Fresh fields and farm to home' }
]

const AUTO_PLAY_INTERVAL_MS = 5500

const HomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [contactedProducts, setContactedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroSlideIndex, setHeroSlideIndex] = useState(0)

  const goToSlide = useCallback((index) => {
    setHeroSlideIndex((index + HERO_BANNERS.length) % HERO_BANNERS.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_BANNERS.length)
    }, AUTO_PLAY_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      
      // Fetch categories, all products, recent products, and most contacted products
      const [categoriesRes, allProductsRes, recentRes, contactedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/categories/`),
        fetch(`${API_BASE_URL}/api/products/`),
        fetch(`${API_BASE_URL}/api/products/recent/?limit=4`),
        fetch(`${API_BASE_URL}/api/products/most-contacted/?limit=4`)
      ])
      
      if (categoriesRes.ok && allProductsRes.ok) {
        const categoriesData = await categoriesRes.json()
        const allProducts = await allProductsRes.json()
        
        // Add first product image to each category
        const categoriesWithImages = categoriesData
          .filter(cat => cat.is_active)
          .map(category => {
            // Find first product in this category
            const firstProduct = allProducts.find(p => p.category_id === category.id && p.is_active)
            
            // Get image from new images array or fallback to old image_url
            let sampleImage = null
            if (firstProduct) {
              if (Array.isArray(firstProduct.images) && firstProduct.images.length > 0) {
                const mainIndex = firstProduct.main_image_index || 0
                sampleImage = firstProduct.images[mainIndex]
              } else if (firstProduct.image_url) {
                sampleImage = firstProduct.image_url
              }
            }
            
            return {
              ...category,
              sampleImage
            }
          })
        
        setCategories(categoriesWithImages)
      }
      
      if (recentRes.ok) {
        const recentData = await recentRes.json()
        setRecentProducts(recentData)
      }
      
      if (contactedRes.ok) {
        const contactedData = await contactedRes.json()
        setContactedProducts(contactedData)
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Count products per category
  const getCategoryProductCount = (categoryId) => {
    // This will be calculated from products in real implementation
    return 0 // Placeholder
  }

  // Handle navigation with scroll to top
  const handleNavigation = (path) => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    navigate(path)
  }

  return (
    <div className="home-page">
      {/* Hero Section - Auto-rotating banner carousel */}
      <section className="hero-section">
        <div className="hero-carousel" aria-label="Hero banner carousel">
          <div className="hero-carousel-track">
            {HERO_BANNERS.map((banner, index) => (
              <div
                key={banner.id}
                className={`hero-carousel-slide ${index === heroSlideIndex ? 'hero-carousel-slide--active' : ''}`}
                style={{ backgroundImage: `url(${banner.src})` }}
                aria-hidden={index !== heroSlideIndex}
              />
            ))}
          </div>
          <div className="hero-carousel-overlay" aria-hidden="true" />
        </div>
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container hero-content-wrapper">
          <div className="hero-content">
            <h1 className="hero-title">
              Eluru Rythu Sampada,
              <span className="hero-highlight"> Bridging farms to homes digitally</span>
            </h1>
          </div>
        </div>
        <div className="hero-carousel-indicators" role="tablist" aria-label="Banner slides">
          {HERO_BANNERS.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === heroSlideIndex}
              aria-label={`Go to slide ${index + 1}`}
              className={`hero-carousel-dot ${index === heroSlideIndex ? 'hero-carousel-dot--active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        <div className="hero-decoration" aria-hidden="true" />
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-description">
              Explore our diverse collection of fresh farm products from local farmers
            </p>
          </div>
          
          <div className="categories-grid">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                Loading categories...
              </div>
            ) : categories.length > 0 ? (
              categories.map(category => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-card"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                >
                  <div className="category-image">
                    {category.sampleImage ? (
                      <img 
                        src={`${API_BASE_URL}${category.sampleImage}`} 
                        alt={category.name} 
                        loading="lazy"
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem'
                      }}>
                        {category.icon || '📦'}
                      </div>
                    )}
                    <div className="category-overlay"></div>
                  </div>
                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-description">Explore this category</p>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                No categories available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Most Contacted Products Section - WHITE BACKGROUND */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Most Contacted Products</h2>
            <p className="section-description">
              Products buyers are reaching out about
            </p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
          ) : contactedProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {contactedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="section-footer">
                <button 
                  onClick={() => handleNavigation('/products')} 
                  className="btn btn-outline btn-large"
                >
                  Explore More Products
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>No products available</div>
          )}
        </div>
      </section>

      {/* Recently Added Products Section - BEIGE BACKGROUND */}
      <section className="featured-section alternate-bg">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Recently Added Products</h2>
            <p className="section-description">
              Fresh arrivals from our local farmers
            </p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
          ) : recentProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {recentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="section-footer">
                <button 
                  onClick={() => handleNavigation('/products')} 
                  className="btn btn-outline btn-large"
                >
                  See All New Arrivals
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>No products available</div>
          )}
        </div>
      </section>

      {/* About / Farmer Heritage Section - WHITE BACKGROUND */}
      <section className="featured-section heritage-section">
        <div className="container">
          <div className="section-header heritage-header">
            <h2 className="section-title">Celebrating Our Farming Heritage</h2>
            <p className="section-description heritage-description">
              Rythu Sampada is a government-backed platform promoting sustainable agriculture 
              and fair trade practices. We connect consumers directly with local farmers, 
              eliminating middlemen and ensuring fair prices for their produce.
            </p>
            <p className="section-description heritage-description">
              Our platform empowers farmers by providing direct market access and supporting 
              their livelihoods. From fresh vegetables and fruits to organic grains, dairy 
              products, and traditional farm produce—discover authentic agricultural products 
              that support local farming communities and preserve traditional farming methods.
            </p>
            <Link to="/about" className="btn btn-outline btn-large">
              Discover Our Farmers
            </Link>
          </div>
          <div className="heritage-images">
            <img src={TribalPic1} alt="Local farmer working in the fields" loading="lazy" />
            <img src={TibePic3} alt="Traditional farming practices" loading="lazy" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
