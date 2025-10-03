'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductService from '@/services/product.service'
import CategoryService from '@/services/category.service'

const GlobalDataLoader = () => {
	const dispatch = useDispatch()
	const { products } = useSelector((state: any) => state.products)
	const { categories } = useSelector((state: any) => state.categories)

	console.log("=========>Called")
	// useEffect(() => {
	// 	ProductService.getAll(dispatch)
	// 	CategoryService.getAll(dispatch)

	// }, [dispatch, products, categories])

	// This component doesn't render anything, it just loads data
	return null
}

export default GlobalDataLoader
