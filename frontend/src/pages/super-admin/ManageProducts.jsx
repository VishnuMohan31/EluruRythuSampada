import { useState, useEffect } from 'react'
import { Edit2, Trash2, RotateCcw, X } from 'lucide-react'
import Button from '@components/common/Button'
import CustomSelect from '@components/common/CustomSelect'
import { api, logger, showToast, API_BASE_URL } from '@/utils/api'
import '../admin/Dashboard.css'

const ManageProducts = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [shgFilter, setShgFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 50
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [farmers, setSHGs] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Location dropdowns state
  const [mandals, setMandals] = useState([])
  const [villages, setVillages] = useState([])
  const [loadingMandals, setLoadingMandals] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    shgName: '',
    mandal: '',
    village: '',
    price: '',
    maxQuantity: '',
    description: '',
    images: [],  // Array of {file, preview, url} objects
    mainImageIndex: 0,  // Index of main image
    youtubeLink: '',
    instagramLink: '',
    status: 'Active'
  })

  // Fetch products, categories, and Farmers from API
  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSHGs()
  }, [])

  // Fetch mandals when modal opens
  useEffect(() => {
    if (showModal) {
      fetchMandals()
    }
  }, [showModal])

  // Fetch villages when mandal changes
  useEffect(() => {
    if (formData.mandal) {
      fetchVillages(formData.mandal)
    } else {
      setVillages([])
      setFormData(prev => ({ ...prev, village: '' }))
    }
  }, [formData.mandal])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      logger.info('Fetching Products', 'include_inactive=true')
      
      const data = await api.get('/api/products/?include_inactive=true')
      logger.success('Fetched Products', `${data.length} products`)
      
      // Map backend data to frontend format
      const mappedData = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        category: { name: product.category?.name || '' },
        shgName: product.farmer?.name || '',
        shgId: product.farmer_id,
        mandal: product.farmer?.mandal || '',
        village: product.farmer?.village || '',
        price: product.price || '',
        maxQuantity: product.max_quantity || '',
        images: product.images || [],  // Array of image URLs
        mainImageIndex: product.main_image_index || 0,
        image: product.images && product.images.length > 0 
          ? `${API_BASE_URL}${product.images[product.main_image_index || 0]}` 
          : (product.image_url ? `${API_BASE_URL}${product.image_url}` : null),  // Fallback to old single image
        youtubeLink: product.youtube_link || '',
        instagramLink: product.instagram_link || '',
        status: product.is_active ? 'Active' : 'Inactive'
      }))
      setProducts(mappedData)
    } catch (error) {
      logger.error('Fetch Products Failed', error.message)
      showToast('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      logger.info('Fetching Categories', 'for dropdown')
      const data = await api.get('/api/categories/')
      logger.success('Fetched Categories', `${data.length} categories`)
      setCategories(data)
    } catch (error) {
      logger.error('Fetch Categories Failed', error.message)
    }
  }

  const fetchSHGs = async () => {
    try {
      logger.info('Fetching Farmers', 'for dropdown')
      const data = await api.get('/api/farmers/')
      logger.success('Fetched Farmers', `${data.length} Farmers`)
      setSHGs(data)
    } catch (error) {
      logger.error('Fetch Farmers Failed', error.message)
    }
  }

  const fetchMandals = async () => {
    try {
      setLoadingMandals(true)
      logger.info('Fetching Mandals', 'from locations API')
      const data = await api.get('/api/locations/mandals')
      setMandals(data.mandals || [])
      logger.success('Fetched Mandals', `${data.mandals?.length || 0} mandals`)
    } catch (error) {
      logger.error('Fetch Mandals Failed', error.message)
      showToast('Failed to load mandals', 'error')
      setMandals([])
    } finally {
      setLoadingMandals(false)
    }
  }

  const fetchVillages = async (mandal) => {
    try {
      setLoadingVillages(true)
      logger.info('Fetching Villages', `for mandal: ${mandal}`)
      const data = await api.get(`/api/locations/villages?mandal=${encodeURIComponent(mandal)}`)
      setVillages(data.villages || [])
      logger.success('Fetched Villages', `${data.villages?.length || 0} villages`)
    } catch (error) {
      logger.error('Fetch Villages Failed', error.message)
      showToast('Failed to load villages', 'error')
      setVillages([])
    } finally {
      setLoadingVillages(false)
    }
  }

  // Get unique values for filters
  const uniqueCategories = categories.map(c => c.name).filter(Boolean).sort()
  const uniqueFarmers = farmers.map(s => s.name).filter(Boolean).sort()

  // Filter logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesCategory = !categoryFilter || product.category?.name === categoryFilter
    const matchesFarmer = !shgFilter || product.shgName === shgFilter
    const matchesStatus = !statusFilter || product.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesFarmer && matchesStatus
  })

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('')
    setShgFilter('')
    setStatusFilter('')
    setCurrentPage(1)
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, shgFilter, statusFilter])

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleEdit = (product) => {
    setEditingProduct(product)
    
    // Convert product images to format needed by form
    const productImages = product.images && product.images.length > 0
      ? product.images.map(url => ({
          file: null,
          preview: null,
          url: `${API_BASE_URL}${url}`
        }))
      : product.image  // Fallback to old single image if exists
        ? [{ file: null, preview: null, url: product.image }]
        : []
    
    setFormData({
      name: product.name || '',
      category: product.category?.name || '',
      shgName: product.shgName || '',
      mandal: product.mandal || '',
      village: product.village || '',
      price: product.price || '',
      maxQuantity: product.maxQuantity || '',
      description: product.description || '',
      images: productImages,
      mainImageIndex: product.mainImageIndex || 0,
      youtubeLink: product.youtubeLink || '',
      instagramLink: product.instagramLink || '',
      status: product.status || 'Active'
    })
    setShowModal(true)
  }

  const handleDeactivate = async (productId) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return
    
    try {
      logger.info('Deactivating Product', productId)
      await api.put(`/api/products/${productId}/deactivate`)
      logger.success('Product Deactivated', productId)
      
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, status: 'Inactive' } : product
      ))
      showToast('Product deactivated successfully!', 'success')
    } catch (error) {
      logger.error('Deactivate Product Failed', error.message)
      showToast('Failed to deactivate product', 'error')
    }
  }

  const handleReactivate = async (productId) => {
    if (!window.confirm('Are you sure you want to reactivate this product?')) return
    
    try {
      logger.info('Reactivating Product', productId)
      await api.put(`/api/products/${productId}/reactivate`)
      logger.success('Product Reactivated', productId)
      
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, status: 'Active' } : product
      ))
      showToast('Product reactivated successfully!', 'success')
    } catch (error) {
      logger.error('Reactivate Product Failed', error.message)
      showToast('Failed to reactivate product', 'error')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // When mandal changes, reset village
    if (name === 'mandal') {
      setFormData(prev => ({ ...prev, mandal: value, village: '' }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files)
    
    // Check if adding these files would exceed the limit
    if (formData.images.length + files.length > 5) {
      showToast('Maximum 5 images allowed', 'error')
      return
    }
    
    // Validate and process each file
    const validFiles = []
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} is not an image file`, 'error')
        continue
      }
      // Validate file size (max 3MB for products)
      if (file.size > 3 * 1024 * 1024) {
        showToast(`${file.name} is too large. Please upload images within 3MB`, 'error')
        continue
      }
      validFiles.push(file)
    }
    
    // Read and add valid files
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { file, preview: reader.result, url: null }]
        }))
      }
      reader.readAsDataURL(file)
    })
    
    // Reset input
    e.target.value = ''
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index)
      // Adjust main image index if needed
      let newMainIndex = prev.mainImageIndex
      if (index === prev.mainImageIndex) {
        newMainIndex = 0  // Reset to first image
      } else if (index < prev.mainImageIndex) {
        newMainIndex = prev.mainImageIndex - 1
      }
      return {
        ...prev,
        images: newImages,
        mainImageIndex: newMainIndex
      }
    })
  }

  const handleSetMainImage = (index) => {
    setFormData(prev => ({ ...prev, mainImageIndex: index }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prevent double submission
    if (submitting) return

    // Validate at least one image
    if (formData.images.length === 0) {
      showToast('Please upload at least one product image', 'error')
      return
    }

    setSubmitting(true)
    try {
      // Upload new images
      const imageUrls = []
      for (const img of formData.images) {
        if (img.file) {
          // New image - upload it
          logger.info('Uploading Product Image', img.file.name)
          const imageFormData = new FormData()
          imageFormData.append('file', img.file)
          
          const uploadData = await api.post('/api/products/upload-image', imageFormData)
          imageUrls.push(uploadData.image_url)
          logger.success('Image Uploaded', uploadData.image_url)
        } else if (img.url) {
          // Existing image - strip API_BASE_URL if present
          const cleanUrl = img.url.startsWith(API_BASE_URL) 
            ? img.url.replace(API_BASE_URL, '') 
            : img.url
          imageUrls.push(cleanUrl)
        }
      }

      // Find category and Farmer IDs
      const category = categories.find(c => c.name === formData.category)
      const farmer = farmers.find(s => s.name === formData.shgName)

      if (!category || !farmer) {
        showToast('Please select valid category and Farmer', 'error')
        return
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        category_id: category.id,
        farmer_id: farmer.id,
        price: formData.price || null,
        max_quantity: formData.maxQuantity || null,
        images: imageUrls,
        main_image_index: formData.mainImageIndex,
        youtube_link: formData.youtubeLink || null,
        instagram_link: formData.instagramLink || null
      }

      if (editingProduct) {
        // Update existing product
        logger.info('Updating Product', editingProduct.id)
        const updated = await api.put(`/api/products/${editingProduct.id}`, productData)
        logger.success('Product Updated', updated)
        
        showToast('Product updated successfully!', 'success')
      } else {
        // Create new product
        logger.info('Creating Product', formData.name)
        const created = await api.post('/api/products/', productData)
        logger.success('Product Created', created)
        
        showToast('Product added successfully!', 'success')
      }
      
      fetchProducts()
      closeModal()
    } catch (error) {
      logger.error('Save Product Failed', error.message)
      showToast('Failed to save product', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      category: '',
      shgName: '',
      mandal: '',
      village: '',
      price: '',
      maxQuantity: '',
      description: '',
      images: [],
      mainImageIndex: 0,
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
            <CustomSelect
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: '', label: 'All Categories' },
                ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
              ]}
              placeholder="All Categories"
            />
          </div>

          {/* Farmer Filter */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Farmer
            </label>
            <CustomSelect
              value={shgFilter}
              onChange={(e) => setShgFilter(e.target.value)}
              options={[
                { value: '', label: 'All Farmers' },
                ...uniqueFarmers.map(farmer => ({ value: farmer, label: farmer }))
              ]}
              placeholder="All Farmers"
            />
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Status
            </label>
            <CustomSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
              placeholder="All Status"
            />
          </div>

          {/* Clear Filters Button */}
          <Button 
            variant="outline" 
            onClick={clearFilters}
            style={{ height: '44px', whiteSpace: 'nowrap', alignSelf: 'end' }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
          <span>
            Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} products
          </span>
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={pageBtn(currentPage === 1)}>«</button>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} style={pageBtn(currentPage === 1)}>‹</button>
              <span style={{ padding: '0 0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} style={pageBtn(currentPage === totalPages)}>›</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={pageBtn(currentPage === totalPages)}>»</button>
            </div>
          )}
        </div>
        <div className="dashboard-table-wrapper">
          <table className="data-table" style={{ minWidth: '1400px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '100px' }}>Image</th>
                <th style={{ width: '200px' }}>Name</th>
                <th style={{ width: '140px' }}>Category</th>
                <th style={{ width: '160px' }}>Farmer Name</th>
                <th style={{ width: '120px' }}>Mandal</th>
                <th style={{ width: '120px' }}>Village</th>
                <th style={{ width: '100px' }}>Price</th>
                <th style={{ width: '120px' }}>Max Quantity</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid var(--color-border)'
                          }}
                        />
                      ) : (
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          backgroundColor: 'var(--color-overlay)', 
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          color: 'var(--color-text-light)'
                        }}>
                          No
                        </div>
                      )}
                    </td>
                    <td style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }} title={product.name}>
                      {product.name}
                    </td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.category?.name}>{product.category?.name || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.shgName}>{product.shgName || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.mandal}>{product.mandal || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.village}>{product.village || '-'}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.price ? `₹${product.price}` : '-'}
                    </td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.maxQuantity}>
                      {product.maxQuantity || '-'}
                    </td>
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
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.875rem' }}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={pageBtn(currentPage === 1)}>«</button>
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} style={pageBtn(currentPage === 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) => p === '...'
                ? <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem' }}>…</span>
                : <button key={p} onClick={() => setCurrentPage(p)} style={{ ...pageBtn(false), fontWeight: p === currentPage ? '700' : '400', backgroundColor: p === currentPage ? 'var(--color-primary)' : 'transparent', color: p === currentPage ? 'white' : 'var(--color-text)' }}>{p}</button>
              )
            }
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} style={pageBtn(currentPage === totalPages)}>›</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={pageBtn(currentPage === totalPages)}>»</button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal} style={{ paddingTop: '7rem', paddingBottom: '2rem' }}>
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
                  <CustomSelect
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    options={[
                      { value: '', label: 'Select Category' },
                      ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
                    ]}
                    placeholder="Select Category"
                  />
                </div>

                {/* Farmer Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Farmer Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <CustomSelect
                    name="shgName"
                    value={formData.shgName}
                    onChange={handleInputChange}
                    required
                    options={[
                      { value: '', label: 'Select Farmer' },
                      ...uniqueFarmers.map(farmer => ({ value: farmer, label: farmer }))
                    ]}
                    placeholder="Select Farmer"
                  />
                </div>

                {/* Mandal */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Mandal <span style={{ color: 'red' }}>*</span>
                  </label>
                  <CustomSelect
                    name="mandal"
                    value={formData.mandal}
                    onChange={handleInputChange}
                    required
                    disabled={loadingMandals}
                    options={[
                      { value: '', label: loadingMandals ? 'Loading mandals...' : 'Select mandal' },
                      ...mandals.map(mandal => ({ value: mandal, label: mandal }))
                    ]}
                    placeholder="Select mandal"
                  />
                </div>

                {/* Village */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Village <span style={{ color: 'red' }}>*</span>
                  </label>
                  <CustomSelect
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.mandal || loadingVillages}
                    options={[
                      { 
                        value: '', 
                        label: !formData.mandal 
                          ? 'Select mandal first' 
                          : loadingVillages 
                          ? 'Loading villages...' 
                          : 'Select village'
                      },
                      ...villages.map(village => ({ value: village.village, label: village.village }))
                    ]}
                    placeholder="Select village"
                  />
                </div>

                {/* Price */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Price (₹)
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price (e.g., 99.99)"
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Max Quantity */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Maximum Supply Quantity
                  </label>
                  <input
                    type="text"
                    name="maxQuantity"
                    value={formData.maxQuantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity (e.g., 100 kg)"
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Product Images (up to 5) */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Product Images (Max 5) {formData.images.length === 0 && <span style={{ color: 'red' }}>*</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    disabled={formData.images.length >= 5}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: formData.images.length >= 5 ? '#f3f4f6' : 'white',
                      cursor: formData.images.length >= 5 ? 'not-allowed' : 'pointer'
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-text-light)', fontSize: '0.75rem' }}>
                    {formData.images.length}/5 images uploaded. Select main image with radio button.
                  </small>
                  
                  {/* Image Previews with Radio Buttons */}
                  {formData.images.length > 0 && (
                    <div style={{ 
                      marginTop: '1rem', 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                      gap: '1rem' 
                    }}>
                      {formData.images.map((img, index) => (
                        <div 
                          key={index} 
                          style={{ 
                            position: 'relative',
                            border: formData.mainImageIndex === index ? '3px solid var(--color-primary)' : '2px solid var(--color-border)',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            backgroundColor: formData.mainImageIndex === index ? 'var(--color-overlay)' : 'transparent'
                          }}
                        >
                          <img 
                            src={img.preview || img.url} 
                            alt={`Product ${index + 1}`} 
                            style={{ 
                              width: '100%', 
                              height: '100px', 
                              objectFit: 'cover', 
                              borderRadius: '4px'
                            }}
                          />
                          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                              <input
                                type="radio"
                                name="mainImage"
                                checked={formData.mainImageIndex === index}
                                onChange={() => handleSetMainImage(index)}
                                style={{ cursor: 'pointer' }}
                              />
                              <span>Main</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              style={{
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                width: '24px',
                                height: '24px'
                              }}
                              title="Remove image"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
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
                <Button type="button" variant="outline" onClick={closeModal} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const pageBtn = (disabled) => ({
  padding: '0.35rem 0.65rem',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  background: 'transparent',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.4 : 1,
  fontSize: '0.875rem',
  color: 'var(--color-text)'
})

export default ManageProducts
