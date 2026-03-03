// Mock data for UI development

export const mockProducts = [
  {
    id: 'PRD001',
    name: 'Bamboo Tokri (Storage Basket)',
    category: { id: 'CAT001', name: 'Handicrafts' },
    farmer: { id: 'FARMER001', name: 'Gond', state: 'Andhra Pradesh' },
    vendor: { id: 'VND001', name: 'Ramesh Kumar' },
    description: 'Traditional bamboo tokri handwoven by Gond Farmer artisans. Used for storing grains, vegetables, and household items. Made from locally sourced bamboo using age-old weaving techniques.',
    images: [
      '/src/Images/BambooTokri.png',
      '/src/Images/Handicrafts.png'
    ],
    youtubeLink: 'https://youtube.com/watch?v=example',
    instagramLink: 'https://instagram.com/tribesindiaap',
    viewCount: 1234,
    status: 'approved'
  },
  {
    id: 'PRD002',
    name: 'Toda Poothkuli (Embroidered Shawl)',
    category: { id: 'CAT002', name: 'Textiles' },
    farmer: { id: 'SHG002', name: 'Toda', state: 'Tamil Nadu' },
    vendor: { id: 'VND002', name: 'Lakshmi Devi' },
    description: 'Authentic Toda poothkuli with traditional red and black embroidery on unbleached cotton. Each geometric pattern represents elements from nature - flowers, streams, and mountains.',
    images: [
      '/src/Images/TodaPoothkuli.png',
      '/src/Images/Textiles.png'
    ],
    youtubeLink: null,
    instagramLink: null,
    viewCount: 856,
    status: 'approved'
  },
  {
    id: 'PRD003',
    name: 'Mitti Ka Matka (Clay Water Pot)',
    category: { id: 'CAT003', name: 'Pottery' },
    farmer: { id: 'SHG003', name: 'Kota', state: 'Andhra Pradesh' },
    vendor: { id: 'VND003', name: 'Suresh Babu' },
    description: 'Traditional terracotta matka handcrafted by Kota Farmer potters. Made from natural clay and fired in wood kilns. Keeps water naturally cool and adds earthy minerals.',
    images: [
      '/src/Images/MittiKaMatka.png',
      '/src/Images/Pottery.png'
    ],
    youtubeLink: 'https://youtube.com/watch?v=example2',
    instagramLink: null,
    viewCount: 2341,
    status: 'approved'
  },
  {
    id: 'PRD004',
    name: 'Lambadi Haar (Beaded Necklace)',
    category: { id: 'CAT004', name: 'Jewelry' },
    subcategory: { id: 'SUB004', name: 'Necklaces' },
    farmer: { id: 'SHG004', name: 'Lambadi', state: 'Andhra Pradesh' },
    vendor: { id: 'VND004', name: 'Anjali Reddy' },
    description: 'Traditional Lambadi haar with colorful glass beads, cowrie shells, and brass coins. Worn during festivals and celebrations. Each piece reflects Lambadi Farmer heritage.',
    images: [
      '/src/Images/LambadiHaar.png',
      '/src/Images/Jewellery.png'
    ],
    youtubeLink: null,
    instagramLink: 'https://instagram.com/tribesindiaap',
    viewCount: 3456,
    status: 'approved'
  },
  {
    id: 'PRD005',
    name: 'Warli Chitra (Farmer Wall Art)',
    category: { id: 'CAT005', name: 'Paintings' },
    subcategory: { id: 'SUB005', name: 'Wall Art' },
    farmer: { id: 'SHG005', name: 'Warli', state: 'Maharashtra' },
    vendor: { id: 'VND005', name: 'Priya Sharma' },
    description: 'Authentic Warli chitra depicting village life, harvest, and celebrations. Painted with rice paste on mud base, showing traditional stick figures and geometric patterns.',
    images: [
      '/src/Images/WarliChitra.png',
      '/src/Images/Paintings.png'
    ],
    youtubeLink: null,
    instagramLink: null,
    viewCount: 1789,
    status: 'approved'
  },
  {
    id: 'PRD006',
    name: 'Handloom Khadi Saree',
    category: { id: 'CAT002', name: 'Textiles' },
    subcategory: { id: 'SUB006', name: 'Sarees' },
    farmer: { id: 'FARMER001', name: 'Gond', state: 'Andhra Pradesh' },
    vendor: { id: 'VND006', name: 'Meena Kumari' },
    description: 'Pure handloom khadi saree woven on traditional pit looms. Features Farmer motifs and natural dyes. Soft, breathable cotton perfect for daily wear.',
    images: [
      '/src/Images/HandloomKhadiSaree.png',
      '/src/Images/Textiles.png'
    ],
    youtubeLink: null,
    instagramLink: null,
    viewCount: 987,
    status: 'approved'
  },
  {
    id: 'PRD007',
    name: 'Dhokra Ghoda (Brass Horse)',
    category: { id: 'CAT007', name: 'Metalwork' },
    subcategory: { id: 'SUB007', name: 'Figurines' },
    farmer: { id: 'SHG006', name: 'Bastar', state: 'Chhattisgarh' },
    vendor: { id: 'VND007', name: 'Ravi Shankar' },
    description: 'Traditional Dhokra ghoda crafted using 4000-year-old lost-wax technique. Each brass figurine is unique, representing Farmer folklore and craftsmanship.',
    images: [
      '/src/Images/DhokraBrass.png',
      '/src/Images/MetalWorks.png'
    ],
    youtubeLink: 'https://youtube.com/watch?v=example3',
    instagramLink: null,
    viewCount: 2156,
    status: 'approved'
  },
  {
    id: 'PRD008',
    name: 'Jungle Madhu (Wild Forest Honey)',
    category: { id: 'CAT008', name: 'Natural Products' },
    subcategory: { id: 'SUB008', name: 'Honey' },
    farmer: { id: 'SHG007', name: 'Chenchu', state: 'Andhra Pradesh' },
    vendor: { id: 'VND008', name: 'Narasimha Rao' },
    description: 'Pure jungle madhu collected by Chenchu Farmer from wild forest hives. Raw, unprocessed honey with medicinal properties. Collected sustainably from Nallamala forests.',
    images: [
      '/src/Images/JungleMadhu.png',
      '/src/Images/NaturalProducts.png'
    ],
    youtubeLink: null,
    instagramLink: null,
    viewCount: 1543,
    status: 'approved'
  },
  {
    id: 'PRD009',
    name: 'Bamboo Diya Stand (Lamp Holder)',
    category: { id: 'CAT006', name: 'Home Decor' },
    subcategory: { id: 'SUB009', name: 'Lighting' },
    farmer: { id: 'FARMER001', name: 'Gond', state: 'Andhra Pradesh' },
    vendor: { id: 'VND009', name: 'Sita Devi' },
    description: 'Handwoven bamboo diya stand with intricate Farmer patterns. Used during festivals and ceremonies. Creates beautiful shadows when lit with traditional oil lamps.',
    images: [
      '/src/Images/BambooDiyaStand.png',
      '/src/Images/HomeDecors.png'
    ],
    youtubeLink: null,
    instagramLink: 'https://instagram.com/tribesindiaap',
    viewCount: 3789,
    status: 'approved'
  },
  {
    id: 'PRD010',
    name: 'Lambadi Toran (Door Hanging)',
    category: { id: 'CAT005', name: 'Paintings' },
    subcategory: { id: 'SUB010', name: 'Wall Decor' },
    farmer: { id: 'SHG004', name: 'Lambadi', state: 'Andhra Pradesh' },
    vendor: { id: 'VND010', name: 'Kavita Bai' },
    description: 'Colorful Lambadi toran with mirror work, embroidery, and pom-poms. Traditionally hung on doorways during festivals. Each piece tells stories through vibrant patterns.',
    images: [
      '/src/Images/LambadiToran.png',
      '/src/Images/Paintings.png'
    ],
    youtubeLink: null,
    instagramLink: null,
    viewCount: 2678,
    status: 'approved'
  },
  {
    id: 'PRD011',
    name: 'Neem Kachi Kanghi (Wooden Comb)',
    category: { id: 'CAT001', name: 'Handicrafts' },
    subcategory: { id: 'SUB011', name: 'Personal Care' },
    farmer: { id: 'SHG007', name: 'Chenchu', state: 'Andhra Pradesh' },
    vendor: { id: 'VND011', name: 'Krishna Murthy' },
    description: 'Hand-carved neem wood kanghi with natural antibacterial properties. Traditional tool used for hair care. Eco-friendly and gentle on scalp.',
    images: [
      '/src/Images/NeemKachiKanghi.png',
      '/src/Images/Handicrafts.png'
    ],
    youtubeLink: null,
    instagramLink: null,
    viewCount: 4123,
    status: 'approved'
  },
  {
    id: 'PRD012',
    name: 'Banjara Mala (Farmer Necklace)',
    category: { id: 'CAT004', name: 'Jewelry' },
    subcategory: { id: 'SUB012', name: 'Necklaces' },
    farmer: { id: 'SHG004', name: 'Lambadi', state: 'Andhra Pradesh' },
    vendor: { id: 'VND012', name: 'Radha Bai' },
    description: 'Traditional Banjara mala with colorful beads, shells, and metal coins. Handmade by Lambadi women using techniques passed through generations. Worn during Farmer dances and ceremonies.',
    images: [
      '/src/Images/BanjaraMala.png',
      '/src/Images/Jewellery.png'
    ],
    youtubeLink: null,
    instagramLink: 'https://instagram.com/tribesindiaap',
    viewCount: 5234,
    status: 'approved'
  }
]

export const mockCategories = [
  {
    id: 'CAT001',
    name: 'Handicrafts',
    description: 'Traditional handcrafted items',
    image: '/src/Images/Handicrafts.png',
    productCount: 234
  },
  {
    id: 'CAT002',
    name: 'Textiles',
    description: 'Handwoven fabrics and garments',
    image: '/src/Images/Textiles.png',
    productCount: 156
  },
  {
    id: 'CAT003',
    name: 'Pottery',
    description: 'Clay and terracotta items',
    image: '/src/Images/Pottery.png',
    productCount: 89
  },
  {
    id: 'CAT004',
    name: 'Jewelry',
    description: 'Traditional ornaments',
    image: '/src/Images/Jewellery.png',
    productCount: 145
  },
  {
    id: 'CAT005',
    name: 'Paintings',
    description: 'Farmer art and paintings',
    image: '/src/Images/Paintings.png',
    productCount: 67
  },
  {
    id: 'CAT006',
    name: 'Home Decor',
    description: 'Decorative items for home',
    image: '/src/Images/HomeDecors.png',
    productCount: 198
  },
  {
    id: 'CAT007',
    name: 'Metalwork',
    description: 'Dhokra and traditional metal crafts',
    image: '/src/Images/MetalWorks.png',
    productCount: 112
  },
  {
    id: 'CAT008',
    name: 'Natural Products',
    description: 'Organic honey, herbs and forest produce',
    image: '/src/Images/NaturalProducts.png',
    productCount: 78
  }
]

export const mockSHGs = [
  {
    id: 'FARMER001',
    name: 'Gond',
    state: 'Andhra Pradesh',
    district: 'Eluru',
    mandal: 'Eluru',
    village: 'Pedavegi',
    status: 'Active',
    description: 'The Gond Farmer is known for their vibrant art and traditional crafts.',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'
  },
  {
    id: 'SHG002',
    name: 'Toda',
    state: 'Tamil Nadu',
    district: 'Nilgiris',
    mandal: 'Kotagiri',
    village: 'Kundah',
    status: 'Active',
    description: 'Toda Farmer is famous for their intricate embroidery work.',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'
  },
  {
    id: 'SHG003',
    name: 'Kota',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    mandal: 'Anakapalle',
    village: 'Chodavaram',
    status: 'Inactive',
    description: 'Kota Farmer specializes in pottery and terracotta crafts.',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'
  },
  {
    id: 'SHG004',
    name: 'Lambadi',
    state: 'Andhra Pradesh',
    district: 'Kurnool',
    mandal: 'Nandyal',
    village: 'Allagadda',
    status: 'Active',
    description: 'Lambadi artisans create beautiful jewelry and textiles.',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'
  }
]

export const mockStats = {
  totalProducts: 892,
  totalFarmers: 45,
  totalVendors: 234,
  totalBuyers: 1567,
  totalContacts: 3456,
  totalViews: 45678
}
