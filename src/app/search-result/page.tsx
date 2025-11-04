"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { ProductType } from "@/type/ProductType";
import productData from "@/data/Product.json";
import Product from "@/components/Product/Product";
import HandlePagination from "@/components/Other/HandlePagination";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useSelector } from "react-redux";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import StaticProductFilter, { FilterState } from "@/components/Shop/StaticProductFilter";

const SearchResult = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
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
  });
  
  // Get all products from Redux for filter counts
  const { products: allProducts } = useSelector((state: any) => state.products)
  const { categories } = useSelector((state: any) => state.categories)
  
  const searchParams = useSearchParams();
  const query = searchParams.get("query") as string || "";

  // First filter by search query to get base products for filtering
  const searchFilteredProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    
    if (!query) return allProducts;
    
    const searchQuery = query.toLowerCase();
    return allProducts.filter((product) => {
      return (
        product.title?.toLowerCase().includes(searchQuery) ||
        product.name?.toLowerCase().includes(searchQuery) ||
        product.typeId?.name?.toLowerCase().includes(searchQuery) ||
        product.type?.toLowerCase().includes(searchQuery) ||
        product.brandId?.name?.toLowerCase().includes(searchQuery) ||
        product.brand?.toLowerCase().includes(searchQuery) ||
        product.categoryId?.name?.toLowerCase().includes(searchQuery) ||
        product.category?.toLowerCase().includes(searchQuery)
      );
    });
  }, [allProducts, query]);

  const calculatePriceRange = () => {
    if (!allProducts || allProducts.length === 0) return { min: 0, max: 1000 };
    
    const prices = allProducts.map((product: any) => product.discountPrice || product.actualPrice || 0).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 1000 };
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const padding = (maxPrice - minPrice) * 0.1 || 100;
    return {
      min: Math.floor(Math.max(0, minPrice - padding)),
      max: Math.ceil(maxPrice + padding)
    };
  };

  const initialPriceRange = useMemo(() => calculatePriceRange(), [allProducts]);
  
  const productsPerPage = 8;
  const offset = currentPage * productsPerPage;

  const router = useRouter();

  const handleSearch = (value: string) => {
    router.push(`/search-result?query=${value}`);
    setSearchKeyword("");
  };

  const handleOpenSidebar = () => {
    setOpenSidebar(toggleOpen => !toggleOpen)
    setCurrentPage(0);
  }

  const handleShowOnlySale = () => {
    setShowOnlySale(toggleSelect => !toggleSelect)
    setCurrentPage(0);
  }

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0);
  };

  const handleFilterChange = (filters: FilterState) => {
    setFilterState(filters);
    setCurrentPage(0);
  };

  const handleClearAll = () => {
    setSortOption('');
    setShowOnlySale(false);
    const clearedState: FilterState = {
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
    };
    setFilterState(clearedState);
    handleFilterChange(clearedState);
    setCurrentPage(0);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filterState.selectedCategories.length > 0 ||
      filterState.selectedBrands.length > 0 ||
      filterState.selectedMaterials.length > 0 ||
      filterState.selectedTypes.length > 0 ||
      filterState.selectedColors.length > 0 ||
      filterState.selectedProcessors.length > 0 ||
      filterState.selectedRAM.length > 0 ||
      filterState.selectedFeatures.length > 0 ||
      filterState.selectedDisplaySizes.length > 0 ||
      filterState.selectedOperatingSystems.length > 0 ||
      filterState.selectedCapacities.length > 0 ||
      filterState.minPrice !== 0 ||
      filterState.maxPrice !== 0 ||
      showOnlySale
    );
  }, [filterState, showOnlySale]);

  // Filter products from ALL products
  // When filters are active, show ALL matching products regardless of search query
  // When no filters are active, apply search query
  const filteredData = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    
    // Start with ALL products
    let filtered = allProducts;

    // Apply filter state - these take priority
    filtered = filtered.filter((product) => {
      // Category filter
      if (filterState.selectedCategories.length > 0) {
        const categoryName = typeof product.categoryId === 'object' 
          ? product.categoryId?.name 
          : product.categoryId || product.category;
        if (!categoryName || !filterState.selectedCategories.includes(categoryName)) {
          return false;
        }
      }

      // Brand filter
      if (filterState.selectedBrands.length > 0) {
        const brandName = product.brandId?.name || product.brand;
        if (!brandName || !filterState.selectedBrands.includes(brandName)) {
          return false;
        }
      }

      // Material filter
      if (filterState.selectedMaterials.length > 0) {
        const materialName = product.materialId?.name || product.material;
        if (!materialName || !filterState.selectedMaterials.includes(materialName)) {
          return false;
        }
      }

      // Type filter
      if (filterState.selectedTypes.length > 0) {
        const typeName = product.typeId?.name || product.type;
        if (!typeName || !filterState.selectedTypes.includes(typeName)) {
          return false;
        }
      }

      // Color filter
      if (filterState.selectedColors.length > 0) {
        const productColors = product.colors || [];
        const hasSelectedColor = filterState.selectedColors.some(color => 
          productColors.some((pc: string) => pc.trim() === color)
        );
        if (!hasSelectedColor) {
          return false;
        }
      }

      // Processor filter
      if (filterState.selectedProcessors.length > 0) {
        let hasProcessor = false;
        if (product.processor && filterState.selectedProcessors.includes(product.processor)) {
          hasProcessor = true;
        }
        // Check in specifications
        if (!hasProcessor && product.specifications) {
          hasProcessor = product.specifications.some((spec: any) => {
            if (spec.name?.toLowerCase().includes('processor') || spec.name?.toLowerCase().includes('cpu')) {
              return spec.detail?.some((detail: any) => 
                filterState.selectedProcessors.includes(detail.value)
              );
            }
            return false;
          });
        }
        if (!hasProcessor) {
          return false;
        }
      }

      // RAM filter
      if (filterState.selectedRAM.length > 0) {
        let hasRAM = false;
        if (product.ram && filterState.selectedRAM.includes(product.ram)) {
          hasRAM = true;
        }
        // Check in specifications
        if (!hasRAM && product.specifications) {
          hasRAM = product.specifications.some((spec: any) => {
            if (spec.name?.toLowerCase().includes('memory') || spec.name?.toLowerCase().includes('ram')) {
              return spec.detail?.some((detail: any) => 
                filterState.selectedRAM.includes(detail.value)
              );
            }
            return false;
          });
        }
        if (!hasRAM) {
          return false;
        }
      }

      // Feature filter
      if (filterState.selectedFeatures.length > 0) {
        let hasFeature = false;
        if (product.features && Array.isArray(product.features)) {
          hasFeature = filterState.selectedFeatures.some(feature => 
            product.features.some((pf: string) => pf.trim() === feature)
          );
        }
        // Check in specifications
        if (!hasFeature && product.specifications) {
          hasFeature = product.specifications.some((spec: any) => {
            if (spec.name?.toLowerCase().includes('feature')) {
              return spec.detail?.some((detail: any) => 
                filterState.selectedFeatures.includes(detail.value)
              );
            }
            return false;
          });
        }
        if (!hasFeature) {
          return false;
        }
      }

      // Display Size filter
      if (filterState.selectedDisplaySizes.length > 0) {
        let hasDisplaySize = false;
        if (product.displaySize && filterState.selectedDisplaySizes.includes(product.displaySize)) {
          hasDisplaySize = true;
        }
        // Check in specifications
        if (!hasDisplaySize && product.specifications) {
          hasDisplaySize = product.specifications.some((spec: any) => {
            if (spec.name?.toLowerCase().includes('display') || spec.name?.toLowerCase().includes('screen')) {
              return spec.detail?.some((detail: any) => 
                filterState.selectedDisplaySizes.includes(detail.value)
              );
            }
            return false;
          });
        }
        if (!hasDisplaySize) {
          return false;
        }
      }

      // Operating System filter
      if (filterState.selectedOperatingSystems.length > 0) {
        let hasOS = false;
        if (product.operatingSystem && filterState.selectedOperatingSystems.includes(product.operatingSystem)) {
          hasOS = true;
        }
        // Check in specifications
        if (!hasOS && product.specifications) {
          hasOS = product.specifications.some((spec: any) => {
            if (spec.name?.toLowerCase().includes('os') || spec.name?.toLowerCase().includes('operating system')) {
              return spec.detail?.some((detail: any) => 
                filterState.selectedOperatingSystems.includes(detail.value)
              );
            }
            return false;
          });
        }
        if (!hasOS) {
          return false;
        }
      }

      // Capacity filter
      if (filterState.selectedCapacities.length > 0) {
        let hasCapacity = false;
        if (product.capacity && filterState.selectedCapacities.includes(product.capacity)) {
          hasCapacity = true;
        }
        // Check in specifications
        if (!hasCapacity && product.specifications) {
          hasCapacity = product.specifications.some((spec: any) => {
            if (spec.name?.toLowerCase().includes('capacity') || spec.name?.toLowerCase().includes('storage')) {
              return spec.detail?.some((detail: any) => 
                filterState.selectedCapacities.includes(detail.value)
              );
            }
            return false;
          });
        }
        if (!hasCapacity) {
          return false;
        }
      }

      // Price range filter - only apply if price range is set (not 0-0)
      if (filterState.minPrice !== 0 || filterState.maxPrice !== 0) {
        const productPrice = product.discountPrice || product.actualPrice || 0;
        if (filterState.maxPrice === 0) {
          // If max is 0 but min is set, check if price is >= min
          if (productPrice < filterState.minPrice) {
            return false;
          }
        } else {
          // Both min and max are set
          if (productPrice < filterState.minPrice || productPrice > filterState.maxPrice) {
            return false;
          }
        }
      }

      // Sale filter
      if (showOnlySale) {
        if ((product.discountPrice || 0) >= (product.actualPrice || 0)) {
          return false;
        }
      }

      return true;
    });

    // Only apply search query if NO filters are active
    // If filters are active, show ALL products matching those filters
    if (query && !hasActiveFilters) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter((product) => {
        return (
          product.title?.toLowerCase().includes(searchQuery) ||
          product.name?.toLowerCase().includes(searchQuery) ||
          product.typeId?.name?.toLowerCase().includes(searchQuery) ||
          product.type?.toLowerCase().includes(searchQuery) ||
          product.brandId?.name?.toLowerCase().includes(searchQuery) ||
          product.brand?.toLowerCase().includes(searchQuery) ||
          product.categoryId?.name?.toLowerCase().includes(searchQuery) ||
          product.category?.toLowerCase().includes(searchQuery)
        );
      });
    }

    return filtered;
  }, [allProducts, query, filterState, showOnlySale, hasActiveFilters]);

  // Sort products
  let sortedData = [...filteredData];
  if (sortOption === 'soldQuantityHighToLow') {
    sortedData = filteredData.sort((a: any, b: any) => Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100))
  }
  if (sortOption === 'discountHighToLow') {
    sortedData = filteredData.sort((a: any, b: any) => {
      const discountA = Math.floor(100 - (((a.discountPrice || 0) / ((a.actualPrice || 1) || 1)) * 100))
      const discountB = Math.floor(100 - (((b.discountPrice || 0) / ((b.actualPrice || 1) || 1)) * 100))
      return discountB - discountA
    })
  }
  if (sortOption === 'priceHighToLow') {
    sortedData = filteredData.sort((a: any, b: any) => (b.discountPrice || 0) - (a.discountPrice || 0))
  }
  if (sortOption === 'priceLowToHigh') {
    sortedData = filteredData.sort((a: any, b: any) => (a.discountPrice || 0) - (b.discountPrice || 0))
  }

  let finalFilteredData = sortedData;

  if (finalFilteredData.length === 0) {
    finalFilteredData = [
      {
        id: "no-data",
        category: "no-data",
        type: "no-data",
        name: "no-data",
        gender: "no-data",
        new: false,
        sale: false,
        rate: 0,
        price: 0,
        originPrice: 0,
        brand: "no-data",
        sold: 0,
        quantity: 0,
        quantityPurchase: 0,
        size: [],
        variation: [],
        thumbImage: [],
        images: [],
        description: "no-data",
        action: "no-data",
        slug: "no-data",
      },
    ];
  }

  // Find page number base on filteredData
  const pageCount = Math.ceil(finalFilteredData.length / productsPerPage);

  // If page number 0, set current page = 0
  if (pageCount === 0) {
    setCurrentPage(0);
  }

  // Get product data for current page
  let currentProducts: any;

  if (finalFilteredData.length > 0) {
    currentProducts = finalFilteredData.slice(offset, offset + productsPerPage);
  } else {
    currentProducts = [];
  }

  const handlePageChange = (selected: number) => {
    setIsLoading(true);
    // Scroll to top of product list
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setCurrentPage(selected);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const { products : productsArray } = useSelector((state: any) => state.products)
  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb heading="Search Result" subHeading="Search Result" />
      </div>
      <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
        <div className="container">
          <div className="heading flex flex-col items-center">
            <div className="heading4 text-center">
              Found {finalFilteredData.length} results {query && <>for {String.raw`"`}{query}{String.raw`"`}</>}
            </div>
            <div className="input-block lg:w-1/2 sm:w-3/5 w-full md:h-[52px] h-[44px] sm:mt-8 mt-5">
              <div className="w-full h-full relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="caption1 w-full h-full pl-4 md:pr-[150px] pr-32 rounded-xl border border-line"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch(searchKeyword)
                  }
                />
                <button
                  className="button-main absolute top-1 bottom-1 right-1 flex items-center justify-center"
                  onClick={() => handleSearch(searchKeyword)}
                >
                  search
                </button>
              </div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="filter-heading flex items-center justify-between gap-5 flex-wrap pt-8 mb-6">
            <div className="left flex has-line items-center flex-wrap gap-5">
              <div className="check-sale flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="filterSale"
                  id="filter-sale"
                  className='border-line'
                  onChange={handleShowOnlySale}
                  checked={showOnlySale}
                />
                <label htmlFor="filter-sale" className='caption1 cursor-pointer'>Show only products on sale</label>
              </div>
            </div>
            <div className="right flex items-center gap-3">
              <label htmlFor='select-filter' className="caption1 capitalize">Sort by</label>
              <div className="select-block relative">
                <select
                  id="select-filter"
                  name="select-filter"
                  className='caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line'
                  onChange={(e) => { handleSortChange(e.target.value) }}
                  value={sortOption}
                >
                  <option value="" disabled>Sorting</option>
                  <option value="soldQuantityHighToLow">Best Selling</option>
                  <option value="discountHighToLow">Best Discount</option>
                  <option value="priceHighToLow">Price High To Low</option>
                  <option value="priceLowToHigh">Price Low To High</option>
                </select>
                <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-4 right-2' />
              </div>
            </div>
          </div>

          {/* Main Layout with Filter Sidebar and Products */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Static Filter Sidebar */}
            <div className="hidden lg:block flex-shrink-0">
              <StaticProductFilter
                products={allProducts}
                allProducts={allProducts}
                onFilterChange={handleFilterChange}
                initialPriceRange={initialPriceRange}
                externalFilterState={filterState}
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden w-full mb-4">
              <button
                onClick={handleOpenSidebar}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 21V14" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 10V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 21V12" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 8V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 21V16" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 12V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 14H7" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 8H15" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 16H23" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Filters</span>
              </button>
            </div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Enhanced Filter Display */}
              <div className="top-filter-bar">
                <div className="flex items-center justify-between">
                  <div className="total-product text-lg font-semibold">
                    {finalFilteredData.length}
                    <span className='text-secondary pl-1 font-normal'>Products Found</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {query && `Search: "${query}"`}
                  </div>
                </div>
                
                {/* Active Filters */}
                {(filterState.selectedCategories.length > 0 || 
                  filterState.selectedBrands.length > 0 || 
                  filterState.selectedMaterials.length > 0 || 
                  filterState.selectedTypes.length > 0 || 
                  filterState.selectedColors.length > 0 ||
                  filterState.selectedProcessors.length > 0 ||
                  filterState.selectedRAM.length > 0 ||
                  filterState.selectedFeatures.length > 0) && (
                  <div className="filter-chips">
                    {filterState.selectedCategories.map((cat) => (
                      <div 
                        key={cat} 
                        className="filter-chip"
                        onClick={() => {
                          const newState = {
                            ...filterState,
                            selectedCategories: filterState.selectedCategories.filter(c => c !== cat)
                          };
                          setFilterState(newState);
                          handleFilterChange(newState);
                          setCurrentPage(0);
                        }}
                      >
                        <span>Category: {cat}</span>
                        <Icon.X className='remove-icon' size={14} />
                      </div>
                    ))}
                    {filterState.selectedBrands.map((brand) => (
                      <div 
                        key={brand} 
                        className="filter-chip"
                        onClick={() => {
                          const newState = {
                            ...filterState,
                            selectedBrands: filterState.selectedBrands.filter(b => b !== brand)
                          };
                          setFilterState(newState);
                          handleFilterChange(newState);
                          setCurrentPage(0);
                        }}
                      >
                        <span>Brand: {brand}</span>
                        <Icon.X className='remove-icon' size={14} />
                      </div>
                    ))}
                    {filterState.selectedTypes.map((type) => (
                      <div 
                        key={type} 
                        className="filter-chip"
                        onClick={() => {
                          const newState = {
                            ...filterState,
                            selectedTypes: filterState.selectedTypes.filter(t => t !== type)
                          };
                          setFilterState(newState);
                          handleFilterChange(newState);
                          setCurrentPage(0);
                        }}
                      >
                        <span>Type: {type}</span>
                        <Icon.X className='remove-icon' size={14} />
                      </div>
                    ))}
                    {filterState.selectedProcessors.map((processor) => (
                      <div 
                        key={processor} 
                        className="filter-chip"
                        onClick={() => {
                          const newState = {
                            ...filterState,
                            selectedProcessors: filterState.selectedProcessors.filter(p => p !== processor)
                          };
                          setFilterState(newState);
                          handleFilterChange(newState);
                          setCurrentPage(0);
                        }}
                      >
                        <span>Processor: {processor}</span>
                        <Icon.X className='remove-icon' size={14} />
                      </div>
                    ))}
                    {filterState.selectedRAM.map((ram) => (
                      <div 
                        key={ram} 
                        className="filter-chip"
                        onClick={() => {
                          const newState = {
                            ...filterState,
                            selectedRAM: filterState.selectedRAM.filter(r => r !== ram)
                          };
                          setFilterState(newState);
                          handleFilterChange(newState);
                          setCurrentPage(0);
                        }}
                      >
                        <span>RAM: {ram}</span>
                        <Icon.X className='remove-icon' size={14} />
                      </div>
                    ))}
                    {filterState.selectedFeatures.map((feature) => (
                      <div 
                        key={feature} 
                        className="filter-chip"
                        onClick={() => {
                          const newState = {
                            ...filterState,
                            selectedFeatures: filterState.selectedFeatures.filter(f => f !== feature)
                          };
                          setFilterState(newState);
                          handleFilterChange(newState);
                          setCurrentPage(0);
                        }}
                      >
                        <span>Feature: {feature}</span>
                        <Icon.X className='remove-icon' size={14} />
                      </div>
                    ))}
                    <div
                      className="filter-chip clear-all-chip"
                      onClick={handleClearAll}
                    >
                      <span>Clear All</span>
                      <Icon.X className='remove-icon' size={14} />
                    </div>
                  </div>
                )}
              </div>

              <div className="list-product-block relative">
                  {query && <div className="heading6 mb-4">Search Results for: "{query}"</div>}
                  
                  {isLoading ? (
                    <div className="enhanced-product-grid">
                      <div className="loading-skeleton grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-[30px] gap-[20px]">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div key={index} className="skeleton-item h-80 rounded-lg"></div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="enhanced-product-grid">
                      <div
                        className={`list-product hide-product-sold grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-[30px] gap-[20px]`}
                      >
                        {currentProducts.map((item: any) =>
                          item.id === "no-data" ? (
                            <div key={item.id} className="no-data-product flex items-center justify-center h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 col-span-full">
                              <div className="text-center">
                                <Icon.MagnifyingGlass size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 text-lg font-medium">No products found</p>
                                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
                              </div>
                            </div>
                          ) : (
                            <div key={item.id} className="product-item">
                              <Product data={item} type="grid" />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {pageCount > 1 && (
                    <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                      <HandlePagination
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          <div 
            className={`lg:hidden enhanced-filter-sidebar ${openSidebar ? 'open' : ''}`}
            onClick={handleOpenSidebar}
          >
            <div className="filter-sidebar-main" onClick={(e) => { e.stopPropagation() }}>
              <div className="filter-header flex items-center justify-between p-6 border-b border-line bg-white">
                <div className="heading4 font-bold text-gray-900">Filter</div>
                <Icon.X 
                  size={24} 
                  weight='bold' 
                  onClick={handleOpenSidebar} 
                  className='cursor-pointer hover:text-red-500 transition-colors' 
                />
              </div>
              <div className="p-4">
                <StaticProductFilter
                  products={allProducts}
                  allProducts={allProducts}
                  onFilterChange={handleFilterChange}
                  initialPriceRange={initialPriceRange}
                  externalFilterState={filterState}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResult;
