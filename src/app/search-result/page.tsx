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
import ProductFilter, { FilterState } from "@/components/Shop/ProductFilter";

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
    minPrice: 0,
    maxPrice: 1000
  });
  
  // Calculate dynamic price range from products
  const { products } = useSelector((state: any) => state.products)
  const { categories } = useSelector((state: any) => state.categories)
  
  const searchParams = useSearchParams();
  const query = searchParams.get("query") as string || "";

  // First filter by search query to get base products for filtering
  const searchFilteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    if (!query) return products;
    
    const searchQuery = query.toLowerCase();
    return products.filter((product) => {
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
  }, [products, query]);

  const calculatePriceRange = () => {
    const productsToUse = searchFilteredProducts.length > 0 ? searchFilteredProducts : products;
    if (!productsToUse || productsToUse.length === 0) return { min: 0, max: 1000 };
    
    const prices = productsToUse.map((product: any) => product.discountPrice || product.actualPrice || 0).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 1000 };
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const padding = (maxPrice - minPrice) * 0.1 || 100;
    return {
      min: Math.floor(Math.max(0, minPrice - padding)),
      max: Math.ceil(maxPrice + padding)
    };
  };

  const initialPriceRange = useMemo(() => calculatePriceRange(), [searchFilteredProducts, products]);
  
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
    const clearedState = {
      selectedCategories: [],
      selectedBrands: [],
      selectedMaterials: [],
      selectedTypes: [],
      selectedColors: [],
      minPrice: initialPriceRange.min,
      maxPrice: initialPriceRange.max
    };
    setFilterState(clearedState);
    handleFilterChange(clearedState);
    setCurrentPage(0);
  };

  // Filter products based on search query and filters
  const filteredData = useMemo(() => {
    if (!searchFilteredProducts || searchFilteredProducts.length === 0) return [];
    
    let filtered = searchFilteredProducts;

    // Apply filter state
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

      // Price range filter
      const productPrice = product.discountPrice || product.actualPrice || 0;
      if (productPrice < filterState.minPrice || productPrice > filterState.maxPrice) {
        return false;
      }

      // Sale filter
      if (showOnlySale) {
        if ((product.discountPrice || 0) >= (product.actualPrice || 0)) {
          return false;
        }
      }

      return true;
    });

    return filtered;
  }, [searchFilteredProducts, filterState, showOnlySale]);

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

          <div className="filter-heading flex items-center justify-between gap-5 flex-wrap pt-8">
            <div className="left flex has-line items-center flex-wrap gap-5">
              <div
                className="filter-sidebar-btn flex items-center gap-2 cursor-pointer"
                onClick={handleOpenSidebar}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              </div>
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

          <ProductFilter
            products={searchFilteredProducts}
            onFilterChange={handleFilterChange}
            openSidebar={openSidebar}
            onToggleSidebar={handleOpenSidebar}
            initialPriceRange={initialPriceRange}
            externalFilterState={filterState}
          />

          <div className="list-filtered flex items-center gap-3 mt-4">
            <div className="total-product">
              {finalFilteredData.length}
              <span className='text-secondary pl-1'>Products Found</span>
            </div>
            {
              (filterState.selectedCategories.length > 0 || 
               filterState.selectedBrands.length > 0 || 
               filterState.selectedMaterials.length > 0 || 
               filterState.selectedTypes.length > 0 || 
               filterState.selectedColors.length > 0) && (
                <>
                  <div className="list flex items-center gap-3">
                    <div className='w-px h-4 bg-line'></div>
                    {filterState.selectedCategories.map((cat) => (
                      <div 
                        key={cat} 
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer hover:opacity-80"
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
                        <Icon.X className='cursor-pointer' size={14} />
                        <span>{cat}</span>
                      </div>
                    ))}
                    {filterState.selectedBrands.map((brand) => (
                      <div 
                        key={brand} 
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer hover:opacity-80"
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
                        <Icon.X className='cursor-pointer' size={14} />
                        <span>{brand}</span>
                      </div>
                    ))}
                    {filterState.selectedMaterials.map((material) => (
                      <div 
                        key={material} 
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer hover:opacity-80"
                        onClick={() => {
                          const newState = {
                            ...filterState,
                            selectedMaterials: filterState.selectedMaterials.filter(m => m !== material)
                          };
                          setFilterState(newState);
                          handleFilterChange(newState);
                          setCurrentPage(0);
                        }}
                      >
                        <Icon.X className='cursor-pointer' size={14} />
                        <span>{material}</span>
                      </div>
                    ))}
                    {filterState.selectedTypes.map((type) => (
                      <div 
                        key={type} 
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer hover:opacity-80"
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
                        <Icon.X className='cursor-pointer' size={14} />
                        <span>{type}</span>
                      </div>
                    ))}
                    {filterState.selectedColors.map((color) => (
                      <div 
                        key={color} 
                        className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize cursor-pointer hover:opacity-80"
                        onClick={() => {
                          const newState = {
                            ...filterState,
                            selectedColors: filterState.selectedColors.filter(c => c !== color)
                          };
                          setFilterState(newState);
                          handleFilterChange(newState);
                          setCurrentPage(0);
                        }}
                      >
                        <Icon.X className='cursor-pointer' size={14} />
                        <span>{color}</span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                    onClick={handleClearAll}
                  >
                    <Icon.X color='rgb(219, 68, 68)' className='cursor-pointer' />
                    <span className='text-button-uppercase text-red'>Clear All</span>
                  </div>
                </>
              )
            }
          </div>

          <div className="list-product-block relative md:pt-10 pt-6">
              {query && <div className="heading6">product Search: {query}</div>}
              
              {isLoading ? (
                <div className="loading-spinner flex items-center justify-center py-20">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : (
                <div
                  className={`list-product hide-product-sold grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-5`}
                >
                  {currentProducts.map((item: any) =>
                    item.id === "no-data" ? (
                      <div key={item.id} className="no-data-product">
                        No products match the selected criteria.
                      </div>
                    ) : (
                      <Product key={item.id} data={item} type="grid" />
                    )
                  )}
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
    </>
  );
};

export default SearchResult;
