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
  minPrice: number
  maxPrice: number
}

interface ProductFilterProps {
  products: any[]
  onFilterChange: (filters: FilterState) => void
  openSidebar?: boolean
  onToggleSidebar?: () => void
  initialPriceRange?: { min: number; max: number }
  externalFilterState?: FilterState // To sync with parent's filterState
}

const ProductFilter: React.FC<ProductFilterProps> = ({
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
  const [minPrice, setMinPrice] = useState<number>(initialPriceRange?.min || 0)
  const [maxPrice, setMaxPrice] = useState<number>(initialPriceRange?.max || 1000)
  const [tempMinPrice, setTempMinPrice] = useState<number>(initialPriceRange?.min || 0)
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(initialPriceRange?.max || 1000)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const prevExternalFilterStateRef = useRef<string>('')
  const isInternalUpdateRef = useRef(false)

  // Calculate price range from products prop (filtered products, not all products)
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
  }, [priceRange.min, priceRange.max]) // Only update when price range bounds change

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

  // Extract unique values from products prop (filtered products, not all products)
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

  const uniqueMaterials = useMemo(() => {
    const materials = new Set<string>()
    products.forEach(product => {
      if (product.materialId?.name) {
        materials.add(product.materialId.name)
      } else if (product.material) {
        materials.add(product.material)
      }
    })
    return Array.from(materials).sort()
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

  const uniqueColors = useMemo(() => {
    const colors = new Set<string>()
    products.forEach(product => {
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach((color: string) => {
          if (color) {
            colors.add(color.trim())
          }
        })
      }
    })
    return Array.from(colors).sort()
  }, [products])

  // Get product counts for each filter option (using products prop - filtered products)
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

  const getMaterialCount = (materialName: string) => {
    return products.filter(product => {
      if (product.materialId?.name) {
        return product.materialId.name === materialName
      } else if (product.material) {
        return product.material === materialName
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

  const getColorCount = (colorName: string) => {
    return products.filter(product => {
      if (product.colors && Array.isArray(product.colors)) {
        return product.colors.some((color: string) => color.trim() === colorName)
      }
      return false
    }).length
  }

  // Color name to hex mapping
  const getColorHex = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'pink': '#F4C5BF',
      'red': '#EF4444',
      'green': '#22C55E',
      'yellow': '#FBBF24',
      'purple': '#A855F7',
      'black': '#000000',
      'white': '#F6EFDD',
      'blue': '#3B82F6',
      'orange': '#F97316',
      'brown': '#92400E',
      'gray': '#6B7280',
      'grey': '#6B7280',
    }
    return colorMap[colorName.toLowerCase()] || '#CCCCCC'
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

  const handleMaterialToggle = (materialName: string) => {
    setSelectedMaterials(prev => 
      prev.includes(materialName) 
        ? prev.filter(m => m !== materialName)
        : [...prev, materialName]
    )
  }

  const handleTypeToggle = (typeName: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeName) 
        ? prev.filter(t => t !== typeName)
        : [...prev, typeName]
    )
  }

  const handleColorToggle = (colorName: string) => {
    setSelectedColors(prev => 
      prev.includes(colorName) 
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    )
  }

  const handleApplyPriceFilter = () => {
    // Ensure minPrice doesn't exceed maxPrice and vice versa
    const newMinPrice = Math.min(tempMinPrice, tempMaxPrice)
    const newMaxPrice = Math.max(tempMinPrice, tempMaxPrice)
    
    setMinPrice(newMinPrice)
    setMaxPrice(newMaxPrice)
    
    // Immediately notify parent of price filter change
    onFilterChange({
      selectedCategories,
      selectedBrands,
      selectedMaterials,
      selectedTypes,
      selectedColors,
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
    setTempMinPrice(priceRange.min)
    setTempMaxPrice(priceRange.max)
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    // Immediately notify parent of cleared state
    onFilterChange({
      selectedCategories: [],
      selectedBrands: [],
      selectedMaterials: [],
      selectedTypes: [],
      selectedColors: [],
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    })
  }

  // Sync internal state with external filterState when it changes from parent
  useEffect(() => {
    if (externalFilterState) {
      const currentExternalState = JSON.stringify({
        selectedCategories: externalFilterState.selectedCategories || [],
        selectedBrands: externalFilterState.selectedBrands || [],
        selectedMaterials: externalFilterState.selectedMaterials || [],
        selectedTypes: externalFilterState.selectedTypes || [],
        selectedColors: externalFilterState.selectedColors || [],
        minPrice: externalFilterState.minPrice || priceRange.min,
        maxPrice: externalFilterState.maxPrice || priceRange.max
      })

      // Only sync if external state actually changed
      if (currentExternalState !== prevExternalFilterStateRef.current && !isInternalUpdateRef.current) {
        isInternalUpdateRef.current = true
        setSelectedCategories(externalFilterState.selectedCategories || [])
        setSelectedBrands(externalFilterState.selectedBrands || [])
        setSelectedMaterials(externalFilterState.selectedMaterials || [])
        setSelectedTypes(externalFilterState.selectedTypes || [])
        setSelectedColors(externalFilterState.selectedColors || [])
        setMinPrice(externalFilterState.minPrice || priceRange.min)
        setMaxPrice(externalFilterState.maxPrice || priceRange.max)
        setTempMinPrice(externalFilterState.minPrice || priceRange.min)
        setTempMaxPrice(externalFilterState.maxPrice || priceRange.max)
        prevExternalFilterStateRef.current = currentExternalState
        
        // Reset flag after state update
        setTimeout(() => {
          isInternalUpdateRef.current = false
        }, 0)
      } else if (currentExternalState !== prevExternalFilterStateRef.current) {
        prevExternalFilterStateRef.current = currentExternalState
      }
    }
  }, [externalFilterState, priceRange.min, priceRange.max])

  // Notify parent of filter changes (but skip if we're currently syncing from external state)
  useEffect(() => {
    // Skip if this is an internal update from syncing external state
    if (isInternalUpdateRef.current) {
      return
    }

    // Only notify if internal state doesn't match external state
    const currentInternalState = JSON.stringify({
      selectedCategories,
      selectedBrands,
      selectedMaterials,
      selectedTypes,
      selectedColors,
      minPrice,
      maxPrice
    })

    const currentExternalState = externalFilterState ? JSON.stringify({
      selectedCategories: externalFilterState.selectedCategories || [],
      selectedBrands: externalFilterState.selectedBrands || [],
      selectedMaterials: externalFilterState.selectedMaterials || [],
      selectedTypes: externalFilterState.selectedTypes || [],
      selectedColors: externalFilterState.selectedColors || [],
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
        minPrice,
        maxPrice
      })
      prevExternalFilterStateRef.current = currentInternalState
    }
  }, [selectedCategories, selectedBrands, selectedMaterials, selectedTypes, selectedColors, minPrice, maxPrice, onFilterChange, externalFilterState, priceRange.min, priceRange.max])

  return (
    <div 
      className={`sidebar style-canvas ${openSidebar ? 'open' : ''}`}
      onClick={onToggleSidebar}
    >
      <div className="sidebar-main" onClick={(e) => { e.stopPropagation() }}>
        {/* Header */}
        <div className="heading flex items-center justify-between mb-6">
          <div className="heading5">Filters</div>
          <Icon.X 
            size={20} 
            weight='bold' 
            onClick={onToggleSidebar} 
            className='cursor-pointer hover:text-primary transition-colors' 
          />
        </div>

        {/* Categories Filter */}
        <div className="filter-category pb-8 border-b border-line">
          <div className="heading6 mb-4">Category</div>
          {loadingCategories ? (
            <div className="caption1 text-secondary2">Loading categories...</div>
          ) : (
            <div className="list-category">
              {categories && categories.length > 0 ? (
                categories.map((category: any) => {
                  const categoryName = category.name || category
                  const count = getCategoryCount(categoryName)
                  return (
                    <div
                      key={category._id || categoryName}
                      className={`item flex items-center justify-between cursor-pointer mb-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors ${selectedCategories.includes(categoryName) ? 'active bg-gray-100' : ''}`}
                      onClick={() => handleCategoryToggle(categoryName)}
                    >
                      <div className='text-secondary has-line-before hover:text-black capitalize'>{categoryName}</div>
                      <div className='text-secondary2'>({count})</div>
                    </div>
                  )
                })
              ) : (
                <div className="caption1 text-secondary2">No categories available</div>
              )}
            </div>
          )}
        </div>

        {/* Brand Filter */}
        <div className="filter-brand pb-8 border-b border-line mt-8">
          <div className="heading6 mb-4">Brand</div>
          <div className="list-brand">
            {uniqueBrands.length > 0 ? (
              uniqueBrands.map((brandName, index) => {
                const count = getBrandCount(brandName)
                return (
                  <div
                    key={index}
                    className={`brand-item flex items-center justify-between mb-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors ${selectedBrands.includes(brandName) ? 'active bg-gray-100' : ''}`}
                    onClick={() => handleBrandToggle(brandName)}
                  >
                    <div className="left flex items-center cursor-pointer">
                      <div className="block-input relative">
                        <input
                          type="checkbox"
                          name={brandName}
                          id={`brand-${index}`}
                          checked={selectedBrands.includes(brandName)}
                          onChange={() => handleBrandToggle(brandName)}
                          className="opacity-0 absolute"
                        />
                        <Icon.CheckSquare 
                          size={20} 
                          weight={selectedBrands.includes(brandName) ? 'fill' : 'regular'}
                          className={`icon-checkbox absolute ${selectedBrands.includes(brandName) ? 'text-primary' : 'text-line'}`}
                        />
                      </div>
                      <label htmlFor={`brand-${index}`} className="brand-name capitalize pl-2 cursor-pointer">{brandName}</label>
                    </div>
                    <div className='text-secondary2'>({count})</div>
                  </div>
                )
              })
            ) : (
              <div className="caption1 text-secondary2">No brands available</div>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div className="filter-type pb-8 border-b border-line mt-8">
          <div className="heading6 mb-4">Type</div>
          <div className="list-type">
            {uniqueTypes.length > 0 ? (
              uniqueTypes.map((typeName, index) => {
                const count = getTypeCount(typeName)
                return (
                  <div
                    key={index}
                    className={`item flex items-center justify-between cursor-pointer mb-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors ${selectedTypes.includes(typeName) ? 'active bg-gray-100' : ''}`}
                    onClick={() => handleTypeToggle(typeName)}
                  >
                    <div className='text-secondary has-line-before hover:text-black capitalize'>{typeName}</div>
                    <div className='text-secondary2'>({count})</div>
                  </div>
                )
              })
            ) : (
              <div className="caption1 text-secondary2">No types available</div>
            )}
          </div>
        </div>

        {/* Material Filter */}
        <div className="filter-material pb-8 border-b border-line mt-8">
          <div className="heading6 mb-4">Material</div>
          <div className="list-material">
            {uniqueMaterials.length > 0 ? (
              uniqueMaterials.map((materialName, index) => {
                const count = getMaterialCount(materialName)
                return (
                  <div
                    key={index}
                    className={`item flex items-center justify-between cursor-pointer mb-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors ${selectedMaterials.includes(materialName) ? 'active bg-gray-100' : ''}`}
                    onClick={() => handleMaterialToggle(materialName)}
                  >
                    <div className='text-secondary has-line-before hover:text-black capitalize'>{materialName}</div>
                    <div className='text-secondary2'>({count})</div>
                  </div>
                )
              })
            ) : (
              <div className="caption1 text-secondary2">No materials available</div>
            )}
          </div>
        </div>

        {/* Color Filter */}
        <div className="filter-color pb-8 border-b border-line mt-8">
          <div className="heading6 mb-4">Color</div>
          <div className="list-color flex items-center flex-wrap gap-3 gap-y-3">
            {uniqueColors.length > 0 ? (
              uniqueColors.map((colorName, index) => {
                const count = getColorCount(colorName)
                const colorHex = getColorHex(colorName)
                return (
                  <div
                    key={index}
                    className={`color-item px-3 py-2 flex items-center justify-center gap-2 rounded-full border-2 cursor-pointer transition-all ${selectedColors.includes(colorName) ? 'active border-primary shadow-md scale-105' : 'border-line hover:border-gray-400'}`}
                    onClick={() => handleColorToggle(colorName)}
                    title={`${colorName} (${count})`}
                  >
                    <div className="color w-5 h-5 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: colorHex }}></div>
                    <div className="caption1 capitalize">{colorName}</div>
                  </div>
                )
              })
            ) : (
              <div className="caption1 text-secondary2">No colors available</div>
            )}
          </div>
        </div>

        {/* Budget Filter */}
        <div className="filter-price pb-8 border-b border-line mt-8">
          <div className="heading6 mb-4">Budget</div>
          <div className="price-block flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="caption1 text-secondary2 mb-1 block">Min Price</label>
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
                  onBlur={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isNaN(value) || value < priceRange.min) {
                      setTempMinPrice(priceRange.min);
                    } else if (value > priceRange.max) {
                      setTempMinPrice(Math.min(priceRange.max, tempMaxPrice || priceRange.max));
                    } else if (value > (tempMaxPrice || priceRange.max)) {
                      setTempMinPrice(tempMaxPrice || priceRange.max);
                    } else {
                      setTempMinPrice(value);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-line caption1 focus:border-primary focus:outline-none transition-colors"
                  placeholder={`Min: ${priceRange.min}`}
                />
              </div>
              <div className="flex-1">
                <label className="caption1 text-secondary2 mb-1 block">Max Price</label>
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
                  onBlur={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isNaN(value) || value > priceRange.max) {
                      setTempMaxPrice(priceRange.max);
                    } else if (value < priceRange.min) {
                      setTempMaxPrice(Math.max(priceRange.min, tempMinPrice || priceRange.min));
                    } else if (value < (tempMinPrice || priceRange.min)) {
                      setTempMaxPrice(tempMinPrice || priceRange.min);
                    } else {
                      setTempMaxPrice(value);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-line caption1 focus:border-primary focus:outline-none transition-colors"
                  placeholder={`Max: ${priceRange.max}`}
                />
              </div>
            </div>
            <button
              onClick={handleApplyPriceFilter}
              className="cursor-pointer text-button-uppercase text-red"
            >
              Apply Budget
            </button>
          </div>
        </div>

        {/* Clear All Button */}
        {(selectedCategories.length > 0 || 
          selectedBrands.length > 0 || 
          selectedMaterials.length > 0 || 
          selectedTypes.length > 0 || 
          selectedColors.length > 0 || 
          minPrice !== priceRange.min || 
          maxPrice !== priceRange.max) && (
          <div className="mt-8">
            <button
              onClick={handleClearAll}
              className="w-full px-4 py-3 border-2 border-red text-red rounded-lg caption1 font-medium hover:bg-red hover:text-white transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductFilter
export type { FilterState }

