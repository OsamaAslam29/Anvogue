'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType, LegacyProductType } from '@/type/ProductType'
import Product from '../Product/Product';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import HandlePagination from '../Other/HandlePagination';
import StaticProductFilter, { FilterState } from './StaticProductFilter';
import { useSelector } from 'react-redux';

interface Props {
    data: Array<any>;
    productPerPage: number
    dataType: string | null
    categoryImage?: string
}

// Get all products from Redux for filter counts
const useAllProducts = () => {
    const { products } = useSelector((state: any) => state.products)
    return products || []
}

// Helper function to convert ProductType to LegacyProductType for Product component
const convertToLegacyProduct = (product: any): any => {
    return {
        _id: product._id,
        category: product.categoryId?.name?.toLowerCase().replace(/\s+/g, '-') || 'general',
        type: 'product',
        title: product.title || 'Untitled Product',
        gender: 'unisex',
        new: product.newArrival || false,
        sale: product.discountPrice < product.actualPrice,
        rate: 5, // Default rating
        discountPrice: product.discountPrice || 0,
        actualPrice: product.actualPrice || 0,
        brand: 'Brand', // Default brand
        sold: Math.floor(Math.random() * 100), // Random sold count
        quantity: product.stock || 0,
        quantityPurchase: 1,
        size: product.size || [],
        // variation: (product.colors || []).map((color, index) => ({
        //     color: color.replace(/[\[\]"]/g, ''),
        //     colorCode: '#000000',
        //     colorImage: product.images?.[0]?.Location || '',
        //     image: product.images?.[0]?.Location || ''
        // })),
        thumbImage: (product.images || []),
        images: (product.images || []),
        description: product.detail || '',
        action: 'add',
        slug: (product.title || 'untitled').toLowerCase().replace(/\s+/g, '-')
    };
};

const ShopBreadCrumbImg: React.FC<Props> = ({ data, productPerPage, dataType, categoryImage }) => {
    const allProducts = useAllProducts()
    
    // Calculate dynamic price range from ALL products
    const calculatePriceRange = () => {
        if (!allProducts || allProducts.length === 0) return { min: 0, max: 1000 };
        
        const prices = allProducts.map(product => product.discountPrice || product.actualPrice || 0);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // Add some padding to the range
        const padding = (maxPrice - minPrice) * 0.1;
        return {
            min: Math.floor(Math.max(0, minPrice - padding)),
            max: Math.ceil(maxPrice + padding)
        };
    };

    const initialPriceRange = calculatePriceRange();
    
    const [layoutCol, setLayoutCol] = useState<number | null>(null)
    const [showOnlySale, setShowOnlySale] = useState(false)
    const [sortOption, setSortOption] = useState('');
    const [openSidebar, setOpenSidebar] = useState(false)
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
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const productsPerPage = productPerPage;
    const offset = currentPage * productsPerPage;


    const handleLayoutCol = (col: number) => {
        setLayoutCol(col)
    }

    const handleShowOnlySale = () => {
        setShowOnlySale(toggleSelect => !toggleSelect)
        setCurrentPage(0);
    }

    const handleSortChange = (option: string) => {
        setSortOption(option);
        setCurrentPage(0);
    };

    const handleOpenSidebar = () => {
        setOpenSidebar(toggleOpen => !toggleOpen)
        setCurrentPage(0);
    }

    const handleFilterChange = (filters: FilterState) => {
        setFilterState(filters);
        setCurrentPage(0);
    }

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

    // Filter product from ALL products in Redux
    // When filters are active, show ALL matching products regardless of dataType
    // When no filters are active, apply dataType filter
    const filteredData = useMemo(() => {
        return allProducts.filter(product => {
            // Sale filter
            let isShowOnlySaleMatched = true;
            if (showOnlySale) {
                isShowOnlySaleMatched = (product.discountPrice || 0) < (product.actualPrice || 0);
            }

            // Category filter - only apply if NO filters are active
            // When filters are active, show ALL products matching those filters
            let isCategoryMatched = true;
            if (dataType && !hasActiveFilters) {
                // Handle special categories
                if (dataType === 'New Arrival') {
                    isCategoryMatched = product.newArrival === true;
                } else if (dataType === 'Best Seller') {
                    isCategoryMatched = product.bestSeller === true;
                } else {
                    // Handle regular categories by name
                    const categoryName = typeof product.categoryId === 'object' 
                        ? product.categoryId?.name 
                        : product.categoryId || product.category;
                    isCategoryMatched = categoryName === dataType;
                }
            }

            // Apply filter state categories if any
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

            return isShowOnlySaleMatched && isCategoryMatched;
        })
    }, [allProducts, dataType, showOnlySale, filterState, hasActiveFilters])

    // Create a copy array filtered to sort
    let sortedData = [...filteredData];

    if (sortOption === 'soldQuantityHighToLow') {
        sortedData = filteredData.sort((a, b) => Math.floor(Math.random() * 100) - Math.floor(Math.random() * 100))
    }

    if (sortOption === 'discountHighToLow') {
        sortedData = filteredData
            .sort((a, b) => {
                const discountA = Math.floor(100 - (((a.discountPrice || 0) / (a.actualPrice || 1)) * 100))
                const discountB = Math.floor(100 - (((b.discountPrice || 0) / (b.actualPrice || 1)) * 100))
                return discountB - discountA
            })
    }

    if (sortOption === 'priceHighToLow') {
        sortedData = filteredData.sort((a, b) => (b.discountPrice || 0) - (a.discountPrice || 0))
    }

    if (sortOption === 'priceLowToHigh') {
        sortedData = filteredData.sort((a, b) => (a.discountPrice || 0) - (b.discountPrice || 0))
    }

    let finalFilteredData = sortedData;

    const totalProducts = finalFilteredData.length

    if (finalFilteredData.length === 0) {
        finalFilteredData = [{
            _id: 'no-data',
            title: 'no-data',
            detail: 'no-data',
            actualPrice: 0,
            discountPrice: 0,
            images: [],
            colors: [],
            size: [],
            type: 'no-data',
            brand: 'no-data',
            material: 'no-data',
            categoryId: { _id: 'no-data', name: 'no-data' },
            createdAt: '',
            updatedAt: '',
            __v: 0,
            bestSeller: false,
            newArrival: false,
            stock: 0
        }];
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
        currentProducts = []
    }
    const { products: productsArray } = useSelector((state: any) => state.products)

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

    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[50px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">{dataType === null ? 'Shop' : dataType}</div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>{dataType === null ? 'Shop' : dataType}</div>
                                </div>
                            </div>
                            {/* <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                                {['t-shirt', 'dress', 'top', 'swimwear', 'shirt'].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${dataType === item ? 'active' : ''}`}
                                        onClick={() => handleType(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div> */}
                        </div>
                        {/* <div className="bg-img absolute top-2 -right-6 max-lg:bottom-0 max-lg:top-auto w-1/3 max-lg:w-[26%] z-[0] max-sm:w-[45%]">
                            <Image
                                src={categoryImage || '/images/slider/bg1-1.png'}
                                width={1000}
                                height={1000}
                                alt={dataType || 'Category'}
                                className='w-full h-full object-cover rounded-lg'
                            />
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="shop-product breadcrumb1 lg:py-5 md:py-14 py-10">
                <div className="container">
                    {/* Top Controls */}
                    <div className="filter-heading flex items-center justify-between gap-5 flex-wrap mb-6">
                        <div className="left flex has-line items-center flex-wrap gap-5">
                            <div className="choose-layout flex items-center gap-2">
                                <div
                                    className={`item three-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 3 ? 'active' : ''}`}
                                    onClick={() => handleLayoutCol(3)}
                                >
                                    <div className='flex items-center gap-0.5'>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                    </div>
                                </div>
                                <div
                                    className={`item four-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 4 ? 'active' : ''}`}
                                    onClick={() => handleLayoutCol(4)}
                                >
                                    <div className='flex items-center gap-0.5'>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                    </div>
                                </div>
                                <div
                                    className={`item five-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 5 ? 'active' : ''}`}
                                    onClick={() => handleLayoutCol(5)}
                                >
                                    <div className='flex items-center gap-0.5'>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                    </div>
                                </div>
                            </div>
                            <div className="check-sale flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="filterSale"
                                    id="filter-sale"
                                    className='border-line'
                                    onChange={handleShowOnlySale}
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
                                        {totalProducts}
                                        <span className='text-secondary pl-1 font-normal'>Products Found</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Category: {dataType || 'All Products'}
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
                                  filterState.selectedFeatures.length > 0 ||
                                  filterState.selectedDisplaySizes.length > 0 ||
                                  filterState.selectedOperatingSystems.length > 0 ||
                                  filterState.selectedCapacities.length > 0) && (
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
                                    {filterState.selectedDisplaySizes.map((size) => (
                                      <div 
                                        key={size} 
                                        className="filter-chip"
                                        onClick={() => {
                                          const newState = {
                                            ...filterState,
                                            selectedDisplaySizes: filterState.selectedDisplaySizes.filter(s => s !== size)
                                          };
                                          setFilterState(newState);
                                          handleFilterChange(newState);
                                          setCurrentPage(0);
                                        }}
                                      >
                                        <span>Display Size: {size}</span>
                                        <Icon.X className='remove-icon' size={14} />
                                      </div>
                                    ))}
                                    {filterState.selectedOperatingSystems.map((os) => (
                                      <div 
                                        key={os} 
                                        className="filter-chip"
                                        onClick={() => {
                                          const newState = {
                                            ...filterState,
                                            selectedOperatingSystems: filterState.selectedOperatingSystems.filter(o => o !== os)
                                          };
                                          setFilterState(newState);
                                          handleFilterChange(newState);
                                          setCurrentPage(0);
                                        }}
                                      >
                                        <span>OS: {os}</span>
                                        <Icon.X className='remove-icon' size={14} />
                                      </div>
                                    ))}
                                    {filterState.selectedCapacities.map((capacity) => (
                                      <div 
                                        key={capacity} 
                                        className="filter-chip"
                                        onClick={() => {
                                          const newState = {
                                            ...filterState,
                                            selectedCapacities: filterState.selectedCapacities.filter(c => c !== capacity)
                                          };
                                          setFilterState(newState);
                                          handleFilterChange(newState);
                                          setCurrentPage(0);
                                        }}
                                      >
                                        <span>Capacity: {capacity}</span>
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
                                {isLoading ? (
                                    <div className="enhanced-product-grid">
                                        <div className="loading-skeleton grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-[30px] gap-[20px]">
                                            {Array.from({ length: 9 }).map((_, index) => (
                                                <div key={index} className="skeleton-item h-80 rounded-lg"></div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="enhanced-product-grid">
                                        <div className={`list-product hide-product-sold grid ${layoutCol ? `lg:grid-cols-${layoutCol > 3 ? 3 : layoutCol}` : 'lg:grid-cols-3'} sm:grid-cols-2 grid-cols-1 sm:gap-[30px] gap-[20px]`}>
                                            {currentProducts.map((item) => (
                                                item._id === 'no-data' ? (
                                                    <div key={item._id} className="no-data-product flex items-center justify-center h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 col-span-full">
                                                        <div className="text-center">
                                                            <Icon.MagnifyingGlass size={48} className="mx-auto text-gray-400 mb-4" />
                                                            <p className="text-gray-500 text-lg font-medium">No products found</p>
                                                            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div key={item._id} className="product-item">
                                                        <Product data={convertToLegacyProduct(item)} type='grid' />
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {pageCount > 1 && (
                                    <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                                        <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
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
    )
}

export default ShopBreadCrumbImg