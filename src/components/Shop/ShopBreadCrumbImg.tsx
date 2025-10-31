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
import ProductFilter, { FilterState } from './ProductFilter';
import { useSelector } from 'react-redux';

interface Props {
    data: Array<any>;
    productPerPage: number
    dataType: string | null
    categoryImage?: string
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
    // Calculate dynamic price range from products
    const calculatePriceRange = () => {
        if (!data || data.length === 0) return { min: 0, max: 1000 };
        
        const prices = data.map(product => product.discountPrice || product.actualPrice || 0);
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
        minPrice: initialPriceRange.min,
        maxPrice: initialPriceRange.max
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


    // Filter product
    const filteredData = useMemo(() => {
        return data.filter(product => {
            // Sale filter
        let isShowOnlySaleMatched = true;
        if (showOnlySale) {
                isShowOnlySaleMatched = (product.discountPrice || 0) < (product.actualPrice || 0);
        }

            // Category filter - handle special categories first
        let isCategoryMatched = true;
        if (dataType) {
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

            // Price range filter
            const productPrice = product.discountPrice || product.actualPrice || 0;
            if (productPrice < filterState.minPrice || productPrice > filterState.maxPrice) {
                return false;
            }

            return isShowOnlySaleMatched && isCategoryMatched;
        })
    }, [data, dataType, showOnlySale, filterState])

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
    console.log('these are the current products', currentProducts)

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
                    <div className="list-product-block relative">
                        <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
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
                                    <label htmlFor="filter-sale" className='cation1 cursor-pointer'>Show only products on sale</label>
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
                            products={data}
                            onFilterChange={handleFilterChange}
                            openSidebar={openSidebar}
                            onToggleSidebar={handleOpenSidebar}
                            initialPriceRange={initialPriceRange}
                            externalFilterState={filterState}
                        />

                        <div className="list-filtered flex items-center gap-3 mt-4">
                            <div className="total-product">
                                {totalProducts}
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

                        {isLoading ? (
                            <div className="loading-spinner flex items-center justify-center py-20">
                                <div className="relative w-16 h-16">
                                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        ) : (
                        <div className={`list-product hide-product-sold grid ${layoutCol ? `lg:grid-cols-${layoutCol}` : 'lg:grid-cols-4'} sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7`}>
                            {currentProducts.map((item) => (
                                item._id === 'no-data' ? (
                                    <div key={item._id} className="no-data-product">No products match the selected criteria.</div>
                                ) : (
                                    <Product key={item._id} data={convertToLegacyProduct(item)} type='grid' />
                                )
                            ))}
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
        </>
    )
}

export default ShopBreadCrumbImg