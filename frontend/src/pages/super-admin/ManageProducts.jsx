import { useState, useEffect } from 'react'
import { Edit2, Trash2, RotateCcw } from 'lucide-react'
import Button from '@components/common/Button'
import '../admin/Dashboard.css'

const ManageProducts = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [shgFilter, setShgFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [shgs, setSHGs] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    shgName: '',
    mandal: '',
    village: '',
    description: '',
    image: null,
    imagePreview: null,
    youtubeLink: '',
    instagramLink: '',
    status: 'Active'
  })

  // Fetch products, categories, and SHGs from API
  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSHGs()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:8000/api/products?include_inactive=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      // Map backend data to frontend format
      const mappedData = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        category: { name: product.category?.name || '' },
        subcategory: product.subcategory?.name || '',
        shgName: product.shg?.name || '',
        shgId: product.shg_id,
        mandal: product.shg?.mandal || '',
        village: product.shg?.village || '',
        image: product.image_url,
        youtubeLink: product.youtube_link || '',
        instagramLink: product.instagram_link || '',
        status: product.is_active ? 'Active' : 'Inactive'
      }))
      setProducts(mappedData)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:8000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchSHGs = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:8000/api/shgs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch SHGs')
      const data = await response.json()
      setSHGs(data)
    } catch (error) {
      console.error('Error fetching SHGs:', error)
    }
  }

  // Get unique values for filters
  const uniqueCategories = categories.map(c => c.name).sort()
  const uniqueSHGs = shgs.map(s => s.name).sort()

  // Filter logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || product.category.name === categoryFilter
    const matchesSHG = !shgFilter || product.shgName === shgFilter
    const matchesStatus = !statusFilter || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesSHG && matchesStatus
  })

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('')
    setShgFilter('')
    setStatusFilter('')
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      category: product.category?.name || '',
      subcategory: product.subcategory || '',
      shgName: product.shgName || '',
      mandal: product.mandal || '',
      village: product.village || '',
      description: product.description || '',
      image: null,
      imagePreview: product.image || null,
      youtubeLink: product.youtubeLink || '',
      instagramLink: product.instagramLink || '',
      status: product.status || 'Active'
    })
    setShowModal(true)
  }

  const handleDeactivate = async (productId) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8000/api/products/${productId}/deactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to deactivate product')
      
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, status: 'Inactive' } : product
      ))
      alert('Product deactivated successfully!')
    } catch (error) {
      console.error('Error deactivating product:', error)
      alert('Failed to deactivate product')
    }
  }

  const handleReactivate = async (productId) => {
    if (!window.confirm('Are you sure you want to reactivate this product?')) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`http://localhost:8000/api/products/${productId}/reactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to reactivate product')
      
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, status: 'Active' } : product
      ))
      alert('Product reactivated successfully!')
    } catch (error) {
      console.error('Error reactivating product:', error)
      alert('Failed to reactivate product')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('authToken')
      let imageUrl = formData.imagePreview

      // Upload image if new file selected
      if (formData.image) {
        const imageFormData = new FormData()
        imageFormData.append('file', formData.image)
        
        const uploadResponse = await fetch('http://localhost:8000/api/products/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: imageFormData
        })
        
        if (!uploadResponse.ok) throw new Error('Failed to upload image')
        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.image_url
      }

      // Find category and SHG IDs
      const category = categories.find(c => c.name === formData.category)
      const shg = shgs.find(s => s.name === formData.shgName)

      if (!category || !shg) {
        alert('Please select valid category and SHG')
        return
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        category_id: category.id,
        shg_id: shg.id,
        image_url: imageUrl,
        youtube_link: formData.youtubeLink || null,
        instagram_link: formData.instagramLink || null
      }

      if (editingProduct) {
        // Update existing product
        const response = await fetch(`http://localhost:8000/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        })
        if (!response.ok) throw new Error('Failed to update product')
        
        alert('Product updated successfully!')
      } else {
        // Create new product
        const response = await fetch('http://localhost:8000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        })
        if (!response.ok) throw new Error('Failed to create product')
        
        alert('Product added successfully!')
      }
      
      fetchProducts()
      closeModal()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      category: '',
      subcategory: '',
      shgName: '',
      mandal: '',
      village: '',
      description: '',
      image: null,
      imagePreview: null,
      youtubeLink: '',
      instagramLink: '',
      status: 'Active'
    })
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Manage Products</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Product
        </Button>
      </div>

      {/* Filters Section */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '1rem', alignItems: 'end' }}>
          {/* Search */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* SHG Filter */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              SHG
            </label>
            <select
              value={shgFilter}
              onChange={(e) => setShgFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <option value="">All SHGs</option>
              {uniqueSHGs.map(shg => (
                <option key={shg} value={shg}>{shg}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <Button 
            variant="outline" 
            onClick={clearFilters}
            style={{ height: '42px', whiteSpace: 'nowrap' }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-table-wrapper">
          <table className="data-table" style={{ minWidth: '1200px', width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '100px' }}>Image</th>
                <th style={{ width: '220px' }}>Name</th>
                <th style={{ width: '140px' }}>Category</th>
                <th style={{ width: '140px' }}>SHG Name</th>
                <th style={{ width: '120px' }}>Mandal</th>
                <th style={{ width: '120px' }}>Village</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid var(--color-border)'
                          }}
                        />
                      ) : (
                        <div style={{ 
                          width: '60px', 
                          height: '60px', 
                          backgroundColor: 'var(--color-overlay)', 
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          color: 'var(--color-text-light)'
                        }}>
                          No Image
                        </div>
                      )}
                    </td>
                    <td style={{ 
                      maxWidth: '200px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }} title={product.name}>
                      {product.name}
                    </td>
                    <td>{product.category.name}</td>
                    <td>{product.shgName}</td>
                    <td>{product.mandal}</td>
                    <td>{product.village}</td>
                    <td>
                      <span className={`status-badge ${product.status.toLowerCase()}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-icon-btn edit" 
                          title="Edit"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit2 size={18} />
                        </button>
                        {product.status === 'Active' ? (
                          <button 
                            className="action-icon-btn delete" 
                            title="Deactivate"
                            onClick={() => handleDeactivate(product.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button 
                            className="action-icon-btn reactivate" 
                            title="Reactivate"
                            onClick={() => handleReactivate(product.id)}
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                    No products found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{ paddingTop: '4rem', paddingBottom: '3rem', alignItems: 'flex-start', overflowY: 'auto' }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div className="modal-header" style={{ padding: '1.25rem 1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Product Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Product Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Category <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--color-surface)'
                    }}
                  >
                    <option value="">Select Category</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Subcategory
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    placeholder="Enter subcategory"
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* SHG Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    SHG Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    name="shgName"
                    value={formData.shgName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--color-surface)'
                    }}
                  >
                    <option value="">Select SHG</option>
                    {uniqueSHGs.map(shg => (
                      <option key={shg} value={shg}>{shg}</option>
                    ))}
                  </select>
                </div>

                {/* Mandal */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Mandal <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="mandal"
                    value={formData.mandal}
                    onChange={handleInputChange}
                    placeholder="Enter mandal"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Village */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Village <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    placeholder="Enter village"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Product Image */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                  {formData.imagePreview && (
                    <div style={{ marginTop: '1rem' }}>
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        style={{ 
                          width: '150px', 
                          height: '150px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '2px solid var(--color-border)'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Description <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    required
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* YouTube Link */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    YouTube Link
                  </label>
                  <input
                    type="url"
                    name="youtubeLink"
                    value={formData.youtubeLink}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/..."
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Instagram Link */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Instagram Link
                  </label>
                  <input
                    type="url"
                    name="instagramLink"
                    value={formData.instagramLink}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageProducts
