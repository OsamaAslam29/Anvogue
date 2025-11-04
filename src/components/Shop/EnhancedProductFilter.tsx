'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import CategoryService from '@/services/category.service'

interface FilterState {
  selectedCategories: string[]
  selectedBrands: string[]
  selectedMaterials: string[]
  selectedTypes: string[]
  selectedColors: string[]
  selectedProcessors: string[]
  selectedRAM: string[]
  selectedFeatures: string[]
  minPrice: number
  maxPrice: number
}

interface EnhancedProductFilterProps {
  products: any[]
  onFilterChange: (filters: FilterState) => void
  openSidebar?: boolean
  onToggleSidebar?: () => void
  initialPriceRange?: { min: number; max: number }
  externalFilterState?: FilterState
}

const EnhancedProductFilter: React.FC<EnhancedProductFilterProps> = ({
  products,
  onFilterChange,
  openSidebar = false,
  onToggleSidebar,
  initialPriceRange,
  externalFilterState
}) => {
  const dispatch = useDispatch()
  const { categories } = useSelector((state: any) => state.categories)
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([])
  const [selectedRAM, setSelectedRAM] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<number>(initialPriceRange?.min || 0)
  const [maxPrice, setMaxPrice] = useState<number>(initialPriceRange?.max || 1000)
  const [tempMinPrice, setTempMinPrice] = useState<number>(initialPriceRange?.min || 0)
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(initialPriceRange?.max || 1000)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    category: true,
    type: false,
    brand: false,
    processor: false,
    ram: false,
    feature: false,
    price: false
  })
  
  const prevExternalFilterStateRef = useRef<string>('')
  const isInternalUpdateRef = useRef(false)

  // Calculate price range from products prop
  const priceRange = useMemo(() => {
    if (initialPriceRange) return initialPriceRange
    
    if (!products || products.length === 0) return { min: 0, max: 1000 }
    
    const prices = products.map(product => product.discountPrice || product.actualPrice || 0).filter(p => p > 0)
    if (prices.length === 0) return { min: 0, max: 1000 }
    
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const padding = (maxPrice - minPrice) * 0.1 || 100
    
    return {
      min: Math.floor(Math.max(0, minPrice - padding)),
      max: Math.ceil(maxPrice + padding)
    }
  }, [products, initialPriceRange])

  // Initialize price range when products or initialPriceRange changes
  useEffect(() => {
    const newMinPrice = priceRange.min
    const newMaxPrice = priceRange.max
    
    setMinPrice(newMinPrice)
    setMaxPrice(newMaxPrice)
    setTempMinPrice(newMinPrice)
    setTempMaxPrice(newMaxPrice)
  }, [priceRange.min, priceRange.max])

  // Fetch categories if not in Redux
  useEffect(() => {
    const fetchCategories = async () => {
      if (!categories || categories.length === 0) {
        setLoadingCategories(true)
        try {
          await CategoryService.getAll(dispatch)
        } catch (error) {
          console.error('Error fetching categories:', error)
        } finally {
          setLoadingCategories(false)
        }
      }
    }
    fetchCategories()
  }, [categories, dispatch])

  // Extract unique values from products
  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>()
    products.forEach(product => {
      if (product.brandId?.name) {
        brands.add(product.brandId.name)
      } else if (product.brand) {
        brands.add(product.brand)
      }
    })
    return Array.from(brands).sort()
  }, [products])

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>()
    products.forEach(product => {
      if (product.typeId?.name) {
        types.add(product.typeId.name)
      } else if (product.type) {
        types.add(product.type)
      }
    })
    return Array.from(types).sort()
  }, [products])

  const uniqueProcessors = useMemo(() => {
    const processors = new Set<string>()
    products.forEach(product => {
      if (product.processor) {
        processors.add(product.processor)
      }
      // Extract from specifications if available
      if (product.specifications) {
        product.specifications.forEach((spec: any) => {
          if (spec.name?.toLowerCase().includes('processor') || spec.name?.toLowerCase().includes('cpu')) {
            if (spec.detail) {
              spec.detail.forEach((detail: any) => {
                if (detail.value) {
                  processors.add(detail.value)
                }
              })
            }
          }
        })
      }
    })
    return Array.from(processors).sort()
  }, [products])

  const uniqueRAM = useMemo(() => {
    const ramOptions = new Set<string>()
    products.forEach(product => {
      if (product.ram) {
        ramOptions.add(product.ram)
      }
      // Extract from specifications if available
      if (product.specifications) {
        product.specifications.forEach((spec: any) => {
          if (spec.name?.toLowerCase().includes('memory') || spec.name?.toLowerCase().includes('ram')) {
            if (spec.detail) {
              spec.detail.forEach((detail: any) => {
                if (detail.value) {
                  ramOptions.add(detail.value)
                }
              })
            }
          }
        })
      }
    })
    return Array.from(ramOptions).sort()
  }, [products])

  const uniqueFeatures = useMemo(() => {
    const features = new Set<string>()
    products.forEach(product => {
      if (product.features && Array.isArray(product.features)) {
        product.features.forEach((feature: string) => {
          if (feature) {
            features.add(feature.trim())
          }
        })
      }
      // Extract from specifications if available
      if (product.specifications) {
        product.specifications.forEach((spec: any) => {
          if (spec.name?.toLowerCase().includes('feature')) {
            if (spec.detail) {
              spec.detail.forEach((detail: any) => {
                if (detail.value) {
                  features.add(detail.value)
                }
              })
            }
          }
        })
      }
    })
    return Array.from(features).sort()
  }, [products])

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Get product counts for each filter option
  const getCategoryCount = (categoryName: string) => {
    return products.filter(product => {
      if (typeof product.categoryId === 'object' && product.categoryId?.name) {
        return product.categoryId.name === categoryName
      } else if (typeof product.categoryId === 'string') {
        return product.categoryId === categoryName
      }
      return false
    }).length
  }

  const getBrandCount = (brandName: string) => {
    return products.filter(product => {
      if (product.brandId?.name) {
        return product.brandId.name === brandName
      } else if (product.brand) {
        return product.brand === brandName
      }
      return false
    }).length
  }

  const getTypeCount = (typeName: string) => {
    return products.filter(product => {
      if (product.typeId?.name) {
        return product.typeId.name === typeName
      } else if (product.type) {
        return product.type === typeName
      }
      return false
    }).length
  }

  // Handle filter selection
  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    )
  }

  const handleBrandToggle = (brandName: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) 
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    )
  }

  const handleTypeToggle = (typeName: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeName) 
        ? prev.filter(t => t !== typeName)
        : [...prev, typeName]
    )
  }

  const handleProcessorToggle = (processor: string) => {
    setSelectedProcessors(prev => 
      prev.includes(processor) 
        ? prev.filter(p => p !== processor)
        : [...prev, processor]
    )
  }

  const handleRAMToggle = (ram: string) => {
    setSelectedRAM(prev => 
      prev.includes(ram) 
        ? prev.filter(r => r !== ram)
        : [...prev, ram]
    )
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handleApplyPriceFilter = () => {
    const newMinPrice = Math.min(tempMinPrice, tempMaxPrice)
    const newMaxPrice = Math.max(tempMinPrice, tempMaxPrice)
    
    setMinPrice(newMinPrice)
    setMaxPrice(newMaxPrice)
    
    onFilterChange({
      selectedCategories,
      selectedBrands,
      selectedMaterials,
      selectedTypes,
      selectedColors,
      selectedProcessors,
      selectedRAM,
      selectedFeatures,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice
    })
  }

  const handleClearAll = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedMaterials([])
    setSelectedTypes([])
    setSelectedColors([])
    setSelectedProcessors([])
    setSelectedRAM([])
    setSelectedFeatures([])
    setTempMinPrice(priceRange.min)
    setTempMaxPrice(priceRange.max)
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    
    onFilterChange({
      selectedCategories: [],
      selectedBrands: [],
      selectedMaterials: [],
      selectedTypes: [],
      selectedColors: [],
      selectedProcessors: [],
      selectedRAM: [],
      selectedFeatures: [],
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    })
  }

  // Sync internal state with external filterState
  useEffect(() => {
    if (externalFilterState) {
      const currentExternalState = JSON.stringify({
        selectedCategories: externalFilterState.selectedCategories || [],
        selectedBrands: externalFilterState.selectedBrands || [],
        selectedMaterials: externalFilterState.selectedMaterials || [],
        selectedTypes: externalFilterState.selectedTypes || [],
        selectedColors: externalFilterState.selectedColors || [],
        selectedProcessors: externalFilterState.selectedProcessors || [],
        selectedRAM: externalFilterState.selectedRAM || [],
        selectedFeatures: externalFilterState.selectedFeatures || [],
        minPrice: externalFilterState.minPrice || priceRange.min,
        maxPrice: externalFilterState.maxPrice || priceRange.max
      })

      if (currentExternalState !== prevExternalFilterStateRef.current && !isInternalUpdateRef.current) {
        isInternalUpdateRef.current = true
        setSelectedCategories(externalFilterState.selectedCategories || [])
        setSelectedBrands(externalFilterState.selectedBrands || [])
        setSelectedMaterials(externalFilterState.selectedMaterials || [])
        setSelectedTypes(externalFilterState.selectedTypes || [])
        setSelectedColors(externalFilterState.selectedColors || [])
        setSelectedProcessors(externalFilterState.selectedProcessors || [])
        setSelectedRAM(externalFilterState.selectedRAM || [])
        setSelectedFeatures(externalFilterState.selectedFeatures || [])
        setMinPrice(externalFilterState.minPrice || priceRange.min)
        setMaxPrice(externalFilterState.maxPrice || priceRange.max)
        setTempMinPrice(externalFilterState.minPrice || priceRange.min)
        setTempMaxPrice(externalFilterState.maxPrice || priceRange.max)
        prevExternalFilterStateRef.current = currentExternalState
        
        setTimeout(() => {
          isInternalUpdateRef.current = false
        }, 0)
      } else if (currentExternalState !== prevExternalFilterStateRef.current) {
        prevExternalFilterStateRef.current = currentExternalState
      }
    }
  }, [externalFilterState, priceRange.min, priceRange.max])

  // Notify parent of filter changes
  useEffect(() => {
    if (isInternalUpdateRef.current) {
      return
    }

    const currentInternalState = JSON.stringify({
      selectedCategories,
      selectedBrands,
      selectedMaterials,
      selectedTypes,
      selectedColors,
      selectedProcessors,
      selectedRAM,
      selectedFeatures,
      minPrice,
      maxPrice
    })

    const currentExternalState = externalFilterState ? JSON.stringify({
      selectedCategories: externalFilterState.selectedCategories || [],
      selectedBrands: externalFilterState.selectedBrands || [],
      selectedMaterials: externalFilterState.selectedMaterials || [],
      selectedTypes: externalFilterState.selectedTypes || [],
      selectedColors: externalFilterState.selectedColors || [],
      selectedProcessors: externalFilterState.selectedProcessors || [],
      selectedRAM: externalFilterState.selectedRAM || [],
      selectedFeatures: externalFilterState.selectedFeatures || [],
      minPrice: externalFilterState.minPrice || priceRange.min,
      maxPrice: externalFilterState.maxPrice || priceRange.max
    }) : ''

    if (!externalFilterState || currentInternalState !== currentExternalState) {
      onFilterChange({
        selectedCategories,
        selectedBrands,
        selectedMaterials,
        selectedTypes,
        selectedColors,
        selectedProcessors,
        selectedRAM,
        selectedFeatures,
        minPrice,
        maxPrice
      })
      prevExternalFilterStateRef.current = currentInternalState
    }
  }, [selectedCategories, selectedBrands, selectedMaterials, selectedTypes, selectedColors, selectedProcessors, selectedRAM, selectedFeatures, minPrice, maxPrice, onFilterChange, externalFilterState, priceRange.min, priceRange.max])

  return (
    <div 
      className={`enhanced-filter-sidebar ${openSidebar ? 'open' : ''}`}
      onClick={onToggleSidebar}
    >
      <div className="filter-sidebar-main" onClick={(e) => { e.stopPropagation() }}>
        {/* Header */}
        <div className="filter-header flex items-center justify-between p-6 border-b border-line bg-white sticky top-0 z-10">
          <div className="heading4 font-bold text-gray-900">Filter</div>
          <Icon.X 
            size={24} 
            weight='bold' 
            onClick={onToggleSidebar} 
            className='cursor-pointer hover:text-red-500 transition-colors' 
          />
        </div>

        <div className="filter-content overflow-y-auto max-h-[calc(100vh-120px)]">
          {/* Category Filter */}
          <div className="filter-section border-b border-line">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('category')}
            >
              <div className="text-lg font-semibold text-gray-900">Category</div>
              <Icon.CaretRight 
                size={20} 
                className={`transition-transform ${expandedSections.category ? 'rotate-90' : ''}`}
              />
            </div>
            {expandedSections.category && (
              <div className="section-content px-4 pb-4">
                {loadingCategories ? (
                  <div className="text-sm text-gray-500">Loading categories...</div>
                ) : (
                  <div className="space-y-2">
                    {categories && categories.length > 0 ? (
                      categories.map((category: any) => {
                        const categoryName = category.name || category
                        const count = getCategoryCount(categoryName)
                        return (
                          <div
                            key={category._id || categoryName}
                            className={`filter-item flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedCategories.includes(categoryName) 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleCategoryToggle(categoryName)}
                          >
                            <div className='text-gray-700 capitalize'>{categoryName}</div>
                            <div className='text-gray-500 text-sm'>({count})</div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-sm text-gray-500">No categories available</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="filter-section border-b border-line">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('type')}
            >
              <div className="text-lg font-semibold text-gray-900">Type</div>
              <Icon.CaretRight 
                size={20} 
                className={`transition-transform ${expandedSections.type ? 'rotate-90' : ''}`}
              />
            </div>
            {expandedSections.type && (
              <div className="section-content px-4 pb-4">
                <div className="space-y-2">
                  {uniqueTypes.length > 0 ? (
                    uniqueTypes.map((typeName, index) => {
                      const count = getTypeCount(typeName)
                      return (
                        <div
                          key={index}
                          className={`filter-item flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                            selectedTypes.includes(typeName) 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleTypeToggle(typeName)}
                        >
                          <div className='text-gray-700 capitalize'>{typeName}</div>
                          <div className='text-gray-500 text-sm'>({count})</div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-sm text-gray-500">No types available</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div className="filter-section border-b border-line">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('brand')}
            >
              <div className="text-lg font-semibold text-gray-900">Brand</div>
              <Icon.CaretRight 
                size={20} 
                className={`transition-transform ${expandedSections.brand ? 'rotate-90' : ''}`}
              />
            </div>
            {expandedSections.brand && (
              <div className="section-content px-4 pb-4">
                <div className="space-y-2">
                  {uniqueBrands.length > 0 ? (
                    uniqueBrands.map((brandName, index) => {
                      const count = getBrandCount(brandName)
                      return (
                        <div
                          key={index}
                          className={`filter-item flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                            selectedBrands.includes(brandName) 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleBrandToggle(brandName)}
                        >
                          <div className='text-gray-700 capitalize'>{brandName}</div>
                          <div className='text-gray-500 text-sm'>({count})</div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-sm text-gray-500">No brands available</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Processor Filter */}
          {uniqueProcessors.length > 0 && (
            <div className="filter-section border-b border-line">
              <div 
                className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('processor')}
              >
                <div className="text-lg font-semibold text-gray-900">Processor</div>
                <Icon.CaretRight 
                  size={20} 
                  className={`transition-transform ${expandedSections.processor ? 'rotate-90' : ''}`}
                />
              </div>
              {expandedSections.processor && (
                <div className="section-content px-4 pb-4">
                  <div className="space-y-2">
                    {uniqueProcessors.map((processor, index) => (
                      <div
                        key={index}
                        className={`filter-item flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedProcessors.includes(processor) 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleProcessorToggle(processor)}
                      >
                        <div className='text-gray-700 text-sm'>{processor}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RAM Filter */}
          {uniqueRAM.length > 0 && (
            <div className="filter-section border-b border-line">
              <div 
                className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('ram')}
              >
                <div className="text-lg font-semibold text-gray-900">RAM(GB)</div>
                <Icon.CaretRight 
                  size={20} 
                  className={`transition-transform ${expandedSections.ram ? 'rotate-90' : ''}`}
                />
              </div>
              {expandedSections.ram && (
                <div className="section-content px-4 pb-4">
                  <div className="space-y-2">
                    {uniqueRAM.map((ram, index) => (
                      <div
                        key={index}
                        className={`filter-item flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedRAM.includes(ram) 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleRAMToggle(ram)}
                      >
                        <div className='text-gray-700'>{ram}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feature Filter */}
          {uniqueFeatures.length > 0 && (
            <div className="filter-section border-b border-line">
              <div 
                className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('feature')}
              >
                <div className="text-lg font-semibold text-gray-900">Feature</div>
                <Icon.CaretRight 
                  size={20} 
                  className={`transition-transform ${expandedSections.feature ? 'rotate-90' : ''}`}
                />
              </div>
              {expandedSections.feature && (
                <div className="section-content px-4 pb-4">
                  <div className="space-y-2">
                    {uniqueFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className={`filter-item flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedFeatures.includes(feature) 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleFeatureToggle(feature)}
                      >
                        <div className='text-gray-700 text-sm'>{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Price Range Filter */}
          <div className="filter-section">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('price')}
            >
              <div className="text-lg font-semibold text-gray-900">Price Range</div>
              <Icon.CaretRight 
                size={20} 
                className={`transition-transform ${expandedSections.price ? 'rotate-90' : ''}`}
              />
            </div>
            {expandedSections.price && (
              <div className="section-content px-4 pb-4">
                <div className="price-inputs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 mb-1 block">Min Price</label>
                      <input
                        type="number"
                        min={priceRange.min}
                        max={priceRange.max}
                        step="1"
                        value={tempMinPrice}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue === '') {
                            setTempMinPrice(priceRange.min);
                          } else {
                            const numValue = parseFloat(inputValue);
                            if (!isNaN(numValue)) {
                              setTempMinPrice(numValue);
                            }
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder={`Min: ${priceRange.min}`}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 mb-1 block">Max Price</label>
                      <input
                        type="number"
                        min={priceRange.min}
                        max={priceRange.max}
                        step="1"
                        value={tempMaxPrice}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue === '') {
                            setTempMaxPrice(priceRange.max);
                          } else {
                            const numValue = parseFloat(inputValue);
                            if (!isNaN(numValue)) {
                              setTempMaxPrice(numValue);
                            }
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder={`Max: ${priceRange.max}`}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleApplyPriceFilter}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Apply Price Range
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clear All Button */}
        {(selectedCategories.length > 0 || 
          selectedBrands.length > 0 || 
          selectedMaterials.length > 0 || 
          selectedTypes.length > 0 || 
          selectedColors.length > 0 ||
          selectedProcessors.length > 0 ||
          selectedRAM.length > 0 ||
          selectedFeatures.length > 0 || 
          minPrice !== priceRange.min || 
          maxPrice !== priceRange.max) && (
          <div className="filter-footer p-4 border-t border-line bg-white sticky bottom-0">
            <button
              onClick={handleClearAll}
              className="w-full px-4 py-3 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedProductFilter
export type { FilterState }