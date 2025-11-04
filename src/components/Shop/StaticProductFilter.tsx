'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import CategoryService from '@/services/category.service'
import { useRouter } from 'next/navigation'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

interface FilterState {
  selectedCategories: string[]
  selectedBrands: string[]
  selectedMaterials: string[]
  selectedTypes: string[]
  selectedColors: string[]
  selectedProcessors: string[]
  selectedRAM: string[]
  selectedFeatures: string[]
  selectedDisplaySizes: string[]
  selectedOperatingSystems: string[]
  selectedCapacities: string[]
  minPrice: number
  maxPrice: number
}

interface StaticProductFilterProps {
  products: any[]
  allProducts: any[] // All products for counting and filtering
  onFilterChange: (filters: FilterState) => void
  initialPriceRange?: { min: number; max: number }
  externalFilterState?: FilterState
}

const StaticProductFilter: React.FC<StaticProductFilterProps> = ({
  products,
  allProducts,
  onFilterChange,
  initialPriceRange,
  externalFilterState
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { categories } = useSelector((state: any) => state.categories)
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([])
  const [selectedRAM, setSelectedRAM] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedDisplaySizes, setSelectedDisplaySizes] = useState<string[]>([])
  const [selectedOperatingSystems, setSelectedOperatingSystems] = useState<string[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [tempMinPrice, setTempMinPrice] = useState<number>(0)
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(0)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null)
  
  const prevExternalFilterStateRef = useRef<string>('')
  const isInternalUpdateRef = useRef(false)

  // Format price in BDT format (e.g., "BDT 4,999")
  const formatPrice = (price: number): string => {
    if (price === 0) return 'BDT 0'
    return `BDT ${price.toLocaleString('en-US')}`
  }

  // Calculate max price from filtered products (products displayed on right-hand side) for display
  const maxPriceFromProducts = useMemo(() => {
    // Use products (filtered) instead of allProducts for price range calculation
    const productsToUse = products && products.length > 0 ? products : allProducts
    if (!productsToUse || productsToUse.length === 0) return 0
    
    const prices = productsToUse.map((product: any) => product.discountPrice || product.actualPrice || 0).filter((p: number) => p > 0)
    if (prices.length === 0) return 0
    
    return Math.ceil(Math.max(...prices))
  }, [products, allProducts])

  // Initialize price range based on filtered products
  useEffect(() => {
    // Only reset if maxPriceFromProducts changes significantly (when filtered products change)
    if (maxPriceFromProducts > 0) {
      // If current tempMaxPrice is greater than new max, reset it
      if (tempMaxPrice > maxPriceFromProducts || tempMaxPrice === 0) {
        setTempMaxPrice(maxPriceFromProducts)
      }
      // If current tempMinPrice is greater than new max, reset it
      if (tempMinPrice > maxPriceFromProducts) {
        setTempMinPrice(0)
      }
    } else {
      setTempMinPrice(0)
      setTempMaxPrice(0)
    }
  }, [maxPriceFromProducts])

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

  // Extract unique values from ALL products (not filtered products)
  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>()
    allProducts.forEach(product => {
      if (product.brandId?.name) {
        brands.add(product.brandId.name)
      } else if (product.brand) {
        brands.add(product.brand)
      }
    })
    return Array.from(brands).sort()
  }, [allProducts])

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>()
    allProducts.forEach(product => {
      if (product.typeId?.name) {
        types.add(product.typeId.name)
      } else if (product.type) {
        types.add(product.type)
      }
    })
    return Array.from(types).sort()
  }, [allProducts])

  const uniqueProcessors = useMemo(() => {
    const processors = new Set<string>()
    allProducts.forEach(product => {
      if (product.processor) {
        processors.add(product.processor)
      }
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
  }, [allProducts])

  const uniqueRAM = useMemo(() => {
    const ramOptions = new Set<string>()
    allProducts.forEach(product => {
      if (product.ram) {
        ramOptions.add(product.ram)
      }
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
  }, [allProducts])

  const uniqueFeatures = useMemo(() => {
    const features = new Set<string>()
    allProducts.forEach(product => {
      if (product.features && Array.isArray(product.features)) {
        product.features.forEach((feature: string) => {
          if (feature) {
            features.add(feature.trim())
          }
        })
      }
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
  }, [allProducts])

  const uniqueDisplaySizes = useMemo(() => {
    const displaySizes = new Set<string>()
    allProducts.forEach(product => {
      if (product.displaySize) {
        displaySizes.add(product.displaySize)
      }
      if (product.specifications) {
        product.specifications.forEach((spec: any) => {
          if (spec.name?.toLowerCase().includes('display')) {
            if (spec.detail) {
              spec.detail.forEach((detail: any) => {
                if (detail.value) {
                  displaySizes.add(detail.value)
                }
              })
            }
          }
        })
      }
    })
    return Array.from(displaySizes).sort()
  }, [allProducts])

  const uniqueOperatingSystems = useMemo(() => {
    const operatingSystems = new Set<string>()
    allProducts.forEach(product => {
      if (product.operatingSystem) {
        operatingSystems.add(product.operatingSystem)
      }
      if (product.specifications) {
        product.specifications.forEach((spec: any) => {
          if (spec.name?.toLowerCase().includes('operating') || spec.name?.toLowerCase().includes('os')) {
            if (spec.detail) {
              spec.detail.forEach((detail: any) => {
                if (detail.value) {
                  operatingSystems.add(detail.value)
                }
              })
            }
          }
        })
      }
    })
    return Array.from(operatingSystems).sort()
  }, [allProducts])

  const uniqueCapacities = useMemo(() => {
    const capacities = new Set<string>()
    allProducts.forEach(product => {
      if (product.capacity) {
        capacities.add(product.capacity)
      }
      if (product.specifications) {
        product.specifications.forEach((spec: any) => {
          if (spec.name?.toLowerCase().includes('capacity') || spec.name?.toLowerCase().includes('storage')) {
            if (spec.detail) {
              spec.detail.forEach((detail: any) => {
                if (detail.value) {
                  capacities.add(detail.value)
                }
              })
            }
          }
        })
      }
    })
    return Array.from(capacities).sort()
  }, [allProducts])

  // Toggle section
  const toggleSection = (section: string) => {
    setActiveFilterSection(prev => prev === section ? null : section)
  }

  // Get product counts from ALL products
  const getCategoryCount = (categoryName: string) => {
    return allProducts.filter(product => {
      if (typeof product.categoryId === 'object' && product.categoryId?.name) {
        return product.categoryId.name === categoryName
      } else if (typeof product.categoryId === 'string') {
        return product.categoryId === categoryName
      }
      return false
    }).length
  }

  const getBrandCount = (brandName: string) => {
    return allProducts.filter(product => {
      if (product.brandId?.name) {
        return product.brandId.name === brandName
      } else if (product.brand) {
        return product.brand === brandName
      }
      return false
    }).length
  }

  const getTypeCount = (typeName: string) => {
    return allProducts.filter(product => {
      if (product.typeId?.name) {
        return product.typeId.name === typeName
      } else if (product.type) {
        return product.type === typeName
      }
      return false
    }).length
  }

  const getProcessorCount = (processor: string) => {
    return allProducts.filter(product => {
      if (product.processor === processor) return true
      if (product.specifications) {
        return product.specifications.some((spec: any) => {
          if (spec.name?.toLowerCase().includes('processor') || spec.name?.toLowerCase().includes('cpu')) {
            return spec.detail?.some((detail: any) => detail.value === processor)
          }
          return false
        })
      }
      return false
    }).length
  }

  const getRAMCount = (ram: string) => {
    return allProducts.filter(product => {
      if (product.ram === ram) return true
      if (product.specifications) {
        return product.specifications.some((spec: any) => {
          if (spec.name?.toLowerCase().includes('memory') || spec.name?.toLowerCase().includes('ram')) {
            return spec.detail?.some((detail: any) => detail.value === ram)
          }
          return false
        })
      }
      return false
    }).length
  }

  const getFeatureCount = (feature: string) => {
    return allProducts.filter(product => {
      if (product.features && Array.isArray(product.features)) {
        if (product.features.some((f: string) => f.trim() === feature)) return true
      }
      if (product.specifications) {
        return product.specifications.some((spec: any) => {
          if (spec.name?.toLowerCase().includes('feature')) {
            return spec.detail?.some((detail: any) => detail.value === feature)
          }
          return false
        })
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
    // Ensure min is less than or equal to max
    // If tempMaxPrice is 0 or not set, use maxPriceFromProducts
    const effectiveMaxPrice = tempMaxPrice > 0 ? tempMaxPrice : maxPriceFromProducts
    const finalMinPrice = Math.max(0, Math.min(tempMinPrice, effectiveMaxPrice))
    const finalMaxPrice = Math.max(tempMinPrice, effectiveMaxPrice)
    
    // Only apply filter if we have valid price range
    if (finalMinPrice >= 0 && finalMaxPrice > 0 && finalMaxPrice >= finalMinPrice) {
      setMinPrice(finalMinPrice)
      setMaxPrice(finalMaxPrice)
      
      // Immediately call onFilterChange to apply the filter
      onFilterChange({
        selectedCategories,
        selectedBrands,
        selectedMaterials,
        selectedTypes,
        selectedColors,
        selectedProcessors,
        selectedRAM,
        selectedFeatures,
        selectedDisplaySizes,
        selectedOperatingSystems,
        selectedCapacities,
        minPrice: finalMinPrice,
        maxPrice: finalMaxPrice
      })
    }
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
    setSelectedDisplaySizes([])
    setSelectedOperatingSystems([])
    setSelectedCapacities([])
    setTempMinPrice(0)
    setTempMaxPrice(0)
    setMinPrice(0)
    setMaxPrice(0)
    
    onFilterChange({
      selectedCategories: [],
      selectedBrands: [],
      selectedMaterials: [],
      selectedTypes: [],
      selectedColors: [],
      selectedProcessors: [],
      selectedRAM: [],
      selectedFeatures: [],
      selectedDisplaySizes: [],
      selectedOperatingSystems: [],
      selectedCapacities: [],
      minPrice: 0,
      maxPrice: 0
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
        selectedDisplaySizes: externalFilterState.selectedDisplaySizes || [],
        selectedOperatingSystems: externalFilterState.selectedOperatingSystems || [],
        selectedCapacities: externalFilterState.selectedCapacities || [],
        minPrice: externalFilterState.minPrice || 0,
        maxPrice: externalFilterState.maxPrice || 0
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
        setSelectedDisplaySizes(externalFilterState.selectedDisplaySizes || [])
        setSelectedOperatingSystems(externalFilterState.selectedOperatingSystems || [])
        setSelectedCapacities(externalFilterState.selectedCapacities || [])
        setMinPrice(externalFilterState.minPrice || 0)
        setMaxPrice(externalFilterState.maxPrice || 0)
        setTempMinPrice(externalFilterState.minPrice || 0)
        setTempMaxPrice(externalFilterState.maxPrice || 0)
        prevExternalFilterStateRef.current = currentExternalState
        
        setTimeout(() => {
          isInternalUpdateRef.current = false
        }, 0)
      } else if (currentExternalState !== prevExternalFilterStateRef.current) {
        prevExternalFilterStateRef.current = currentExternalState
      }
    }
  }, [externalFilterState])

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
      selectedDisplaySizes,
      selectedOperatingSystems,
      selectedCapacities,
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
      selectedDisplaySizes: externalFilterState.selectedDisplaySizes || [],
      selectedOperatingSystems: externalFilterState.selectedOperatingSystems || [],
      selectedCapacities: externalFilterState.selectedCapacities || [],
      minPrice: externalFilterState.minPrice || 0,
      maxPrice: externalFilterState.maxPrice || 0
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
        selectedDisplaySizes,
        selectedOperatingSystems,
        selectedCapacities,
        minPrice,
        maxPrice
      })
      prevExternalFilterStateRef.current = currentInternalState
    }
  }, [selectedCategories, selectedBrands, selectedMaterials, selectedTypes, selectedColors, selectedProcessors, selectedRAM, selectedFeatures, selectedDisplaySizes, selectedOperatingSystems, selectedCapacities, minPrice, maxPrice, onFilterChange, externalFilterState])

  return (
    <div className="static-filter-sidebar bg-white w-full lg:w-[280px] max-h-[calc(100vh-100px)] overflow-y-auto">
      {/* Header */}
      <div className="filter-header border-gray-200 p-4 sticky top-0 bg-white z-10">
        <div className="text-xl font-bold text-gray-900">Filter</div>
      </div>

      <div className="filter-content">
        {/* Products Section - Moved to Top */}
        <div className="filter-section border-b border-gray-200">
          <div 
            className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('products')}
          >
            <div className="text-base font-medium text-gray-900">Products</div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">({allProducts?.length || 0})</div>
              <Icon.CaretRight 
                size={16} 
                className={`transition-transform text-gray-500 ${activeFilterSection === 'products' ? 'rotate-90' : ''}`}
              />
            </div>
          </div>
          {activeFilterSection === 'products' && (
            <div className="section-content px-4 pb-4 max-h-60 overflow-y-auto">
              {allProducts && allProducts.length > 0 ? (
                <div className="space-y-2">
                  {allProducts.map((product: any, index: number) => (
                    <div
                      key={product._id || index}
                      className="text-sm text-gray-700 py-1.5 hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={() => {
                        // Navigate to product detail page
                        if (product._id) {
                          router.push(`/product/default?id=${product._id}`);
                        }
                      }}
                    >
                      {product.title || product.name || `Product ${index + 1}`}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 py-4 text-center">No products available</div>
              )}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="filter-section border-gray-200">
          <div 
            className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('category')}
          >
            <div className="text-base font-medium text-gray-900">Category</div>
            <Icon.CaretRight 
              size={16} 
              className={`transition-transform text-gray-500 ${activeFilterSection === 'category' ? 'rotate-90' : ''}`}
            />
          </div>
          {activeFilterSection === 'category' && (
            <div className="section-content px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
              {loadingCategories ? (
                <div className="text-sm text-gray-500 py-2">Loading...</div>
              ) : (
                categories && categories.length > 0 ? (
                  categories.map((category: any) => {
                    const categoryName = category.name || category
                    const count = getCategoryCount(categoryName)
                    return (
                      <div
                        key={category._id || categoryName}
                        className={`filter-item flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          selectedCategories.includes(categoryName) 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleCategoryToggle(categoryName)}
                      >
                        <div className='text-sm text-gray-700 capitalize'>{categoryName}</div>
                        <div className='text-xs text-gray-500'>({count})</div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-sm text-gray-500 py-2">No categories</div>
                )
              )}
            </div>
          )}
        </div>

        {/* Brand Filter */}
        {uniqueBrands.length > 0 && (
          <div className="filter-section border-b border-gray-200">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('brand')}
            >
              <div className="text-base font-medium text-gray-900">Brand</div>
              <Icon.CaretRight 
                size={16} 
                className={`transition-transform text-gray-500 ${activeFilterSection === 'brand' ? 'rotate-90' : ''}`}
              />
            </div>
            {activeFilterSection === 'brand' && (
              <div className="section-content px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueBrands.map((brandName, index) => {
                  const count = getBrandCount(brandName)
                  return (
                    <div
                      key={index}
                      className={`filter-item flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        selectedBrands.includes(brandName) 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleBrandToggle(brandName)}
                    >
                      <div className='text-sm text-gray-700'>{brandName}</div>
                      <div className='text-xs text-gray-500'>({count})</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Processor Filter */}
        {uniqueProcessors.length > 0 && (
          <div className="filter-section border-b border-gray-200">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('processor')}
            >
              <div className="text-base font-medium text-gray-900">Processor</div>
              <Icon.CaretRight 
                size={16} 
                className={`transition-transform text-gray-500 ${activeFilterSection === 'processor' ? 'rotate-90' : ''}`}
              />
            </div>
            {activeFilterSection === 'processor' && (
              <div className="section-content px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueProcessors.map((processor, index) => {
                  const count = getProcessorCount(processor)
                  return (
                    <div
                      key={index}
                      className={`filter-item flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        selectedProcessors.includes(processor) 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleProcessorToggle(processor)}
                    >
                      <div className='text-sm text-gray-700'>{processor}</div>
                      <div className='text-xs text-gray-500'>({count})</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* RAM Filter */}
        {uniqueRAM.length > 0 && (
          <div className="filter-section border-b border-gray-200">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('ram')}
            >
              <div className="text-base font-medium text-gray-900">RAM(GB)</div>
              <Icon.CaretRight 
                size={16} 
                className={`transition-transform text-gray-500 ${activeFilterSection === 'ram' ? 'rotate-90' : ''}`}
              />
            </div>
            {activeFilterSection === 'ram' && (
              <div className="section-content px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueRAM.map((ram, index) => {
                  const count = getRAMCount(ram)
                  return (
                    <div
                      key={index}
                      className={`filter-item flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        selectedRAM.includes(ram) 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleRAMToggle(ram)}
                    >
                      <div className='text-sm text-gray-700'>{ram}</div>
                      <div className='text-xs text-gray-500'>({count})</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Feature Filter */}
        {uniqueFeatures.length > 0 && (
          <div className="filter-section border-b border-gray-200">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('feature')}
            >
              <div className="text-base font-medium text-gray-900">Feature</div>
              <Icon.CaretRight 
                size={16} 
                className={`transition-transform text-gray-500 ${activeFilterSection === 'feature' ? 'rotate-90' : ''}`}
              />
            </div>
            {activeFilterSection === 'feature' && (
              <div className="section-content px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueFeatures.map((feature, index) => {
                  const count = getFeatureCount(feature)
                  return (
                    <div
                      key={index}
                      className={`filter-item flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        selectedFeatures.includes(feature) 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleFeatureToggle(feature)}
                    >
                      <div className='text-sm text-gray-700'>{feature}</div>
                      <div className='text-xs text-gray-500'>({count})</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Display Size Filter */}
        {uniqueDisplaySizes.length > 0 && (
          <div className="filter-section border-b border-gray-200">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('displaySize')}
            >
              <div className="text-base font-medium text-gray-900">Display Size (Inches)</div>
              <Icon.CaretRight 
                size={16} 
                className={`transition-transform text-gray-500 ${activeFilterSection === 'displaySize' ? 'rotate-90' : ''}`}
              />
            </div>
            {activeFilterSection === 'displaySize' && (
              <div className="section-content px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueDisplaySizes.map((displaySize, index) => (
                  <div
                    key={index}
                    className={`filter-item flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      selectedDisplaySizes.includes(displaySize) 
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDisplaySizes(prev => 
                      prev.includes(displaySize) 
                        ? prev.filter(d => d !== displaySize)
                        : [...prev, displaySize]
                    )}
                  >
                    <div className='text-sm text-gray-700'>{displaySize}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Operating System Filter */}
        {uniqueOperatingSystems.length > 0 && (
          <div className="filter-section border-b border-gray-200">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('operatingSystem')}
            >
              <div className="text-base font-medium text-gray-900">Operating System</div>
              <Icon.CaretRight 
                size={16} 
                className={`transition-transform text-gray-500 ${activeFilterSection === 'operatingSystem' ? 'rotate-90' : ''}`}
              />
            </div>
            {activeFilterSection === 'operatingSystem' && (
              <div className="section-content px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueOperatingSystems.map((os, index) => (
                  <div
                    key={index}
                    className={`filter-item flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      selectedOperatingSystems.includes(os) 
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedOperatingSystems(prev => 
                      prev.includes(os) 
                        ? prev.filter(o => o !== os)
                        : [...prev, os]
                    )}
                  >
                    <div className='text-sm text-gray-700'>{os}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Capacity Filter */}
        {uniqueCapacities.length > 0 && (
          <div className="filter-section border-b border-gray-200">
            <div 
              className="section-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('capacity')}
            >
              <div className="text-base font-medium text-gray-900">Capacity</div>
              <Icon.CaretRight 
                size={16} 
                className={`transition-transform text-gray-500 ${activeFilterSection === 'capacity' ? 'rotate-90' : ''}`}
              />
            </div>
            {activeFilterSection === 'capacity' && (
              <div className="section-content px-4 pb-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueCapacities.map((capacity, index) => (
                  <div
                    key={index}
                    className={`filter-item flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      selectedCapacities.includes(capacity) 
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCapacities(prev => 
                      prev.includes(capacity) 
                        ? prev.filter(c => c !== capacity)
                        : [...prev, capacity]
                    )}
                  >
                    <div className='text-sm text-gray-700'>{capacity}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Range Filter */}
        <div className="filter-section border-b border-gray-200">
          <div className="section-header p-4">
            <div className="text-base font-medium text-gray-900 mb-4">Price Range</div>
            
            {/* Enhanced Price Range Display */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-500 mb-1">Min</div>
                  <div className="text-base font-bold text-gray-900">{formatPrice(tempMinPrice || 0)}</div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-500 mb-1">Max</div>
                  <div className="text-base font-bold text-gray-900">{formatPrice(tempMaxPrice > 0 ? tempMaxPrice : (maxPriceFromProducts || 0))}</div>
                </div>
              </div>
              
              {/* Ant Design Range Slider */}
              {maxPriceFromProducts > 0 && (
                <div className="mb-4 px-1">
                  <Slider
                    range
                    min={0}
                    max={maxPriceFromProducts}
                    step={Math.max(1, Math.floor(maxPriceFromProducts / 1000))}
                    value={[tempMinPrice, tempMaxPrice]}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        setTempMinPrice(value[0])
                        setTempMaxPrice(value[1])
                      }
                    }}
                    trackStyle={[
                      { backgroundColor: '#0ea5e9', height: 8 },
                      { backgroundColor: '#0ea5e9', height: 8 }
                    ]}
                    handleStyle={[
                      {
                        backgroundColor: '#ffffff',
                        borderColor: '#0ea5e9',
                        borderWidth: 2,
                        width: 20,
                        height: 20,
                        marginTop: -6,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                      },
                      {
                        backgroundColor: '#ffffff',
                        borderColor: '#0ea5e9',
                        borderWidth: 2,
                        width: 20,
                        height: 20,
                        marginTop: -6,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                      }
                    ]}
                    railStyle={{
                      backgroundColor: '#e5e7eb',
                      height: 8,
                      opacity: 0.6
                    }}
                  />
                </div>
              )}
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleApplyPriceFilter()
              }}
              className="w-full px-4 py-3 bg-black text-white rounded-lg text-sm font-semibold border border-gray-800 shadow-lg hover:bg-gray-900 transition-all hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Apply Price Range
            </button>
          </div>
        </div>
      </div>

      {/* Clear All Button - Always Visible */}
      <div className="filter-footer p-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleClearAll()
          }}
          className="w-full px-4 py-3 bg-black text-white rounded-lg text-sm font-semibold border border-gray-800 shadow-lg hover:bg-gray-900 transition-all hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}

export default StaticProductFilter
export type { FilterState }