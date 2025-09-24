'use client';
import React, { useState } from 'react'

const page = () => {
	const [expandedItems, setExpandedItems] = useState<number[]>([]);

	const faqData = [
		{
			question: "Do you accept DBBL Nexus card?",
			answer: "Yes, we accept DBBL Nexus cards for online payments. You can use your DBBL Nexus card during checkout by selecting the card payment option."
		},
		{
			question: "How can I avail Card on delivery?",
			answer: "Card on delivery is available for orders above a certain amount. During checkout, select 'Card on Delivery' as your payment method. Our delivery agent will bring a card machine to process your payment when delivering the order."
		},
		{
			question: "I failed to make payment while placing the order. What should I do?",
			answer: "If your payment failed, please check your card details and try again. If the issue persists, contact our customer support team at support@anvogue.com or call our helpline. We'll help you complete your order."
		},
		{
			question: "Why your agent called me and asked for advance payment?",
			answer: "Our agents may contact you for advance payment verification for high-value orders or to confirm your identity. This is a security measure to prevent fraud. Always verify the agent's identity before making any payments."
		},
		{
			question: "Can I make the payment using 'Rocket' wallet?",
			answer: "Yes, we accept payments through Rocket wallet. During checkout, select 'Mobile Wallet' as your payment method and choose Rocket from the available options."
		},
		{
			question: "What are the Payment methods?",
			answer: "We accept various payment methods including credit/debit cards, mobile banking, bKash, Rocket, Nagad, bank transfers, and cash on delivery (COD) for eligible areas."
		},
		{
			question: "Can I avail cash on delivery from outside Dhaka?",
			answer: "Cash on delivery is available in most major cities and districts. However, availability may vary by location. Please check the delivery options during checkout or contact our customer service for specific area availability."
		},
		{
			question: "Why Cash on delivery is not showing?",
			answer: "Cash on delivery may not be available due to several reasons: your location doesn't support COD, the order value is below the minimum threshold, or the product category doesn't allow COD. Please try a different payment method or contact our support team."
		}
	];

	const toggleExpanded = (index: number) => {
		setExpandedItems(prev =>
			prev.includes(index)
				? prev.filter(item => item !== index)
				: [...prev, index]
		);
	};

	return (
		<div className="min-h-screen bg-[gray] p-6">
			{/* Search Bar */}
			<div className='max-w-6xl m-auto mb-8 bg-white p-6 rounded-xl'>
				<div className="max-w-2xl mx-auto mb-8">
					<h2 className="text-center text-xl font-medium mb-4">Search Questions</h2>
					<div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
						<input
							type="text"
							placeholder="Search what you are looking for"
							className="w-full px-4 py-2 outline-none"
						/>
						<button className="bg-orange-400 text-white px-4 py-2">
							🔍
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
				{/* Left Sidebar */}
				<div className="bg-white rounded-xl shadow p-4">
					<h3 className="text-lg font-semibold mb-4">Help & Knowledge Base</h3>
					<ul className="space-y-3">
						<li className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
							<span className="text-gray-500">👤</span> My Account
						</li>
						<li className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
							<span className="text-gray-500">📦</span> My Order
						</li>
						<li>
							<div className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
								<span className="text-gray-500">💳</span> Payment & EMI
							</div>
							<ul className="ml-6 mt-2 space-y-2 text-sm text-blue-600">
								<li className="cursor-pointer hover:underline">Payment</li>
								<li className="cursor-pointer hover:underline">EMI</li>
								<li className="cursor-pointer hover:underline">Refund</li>
							</ul>
						</li>
						<li className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
							<span className="text-gray-500">🚚</span> Shipping & Delivery
						</li>
						<li className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
							<span className="text-gray-500">♻️</span> Return & Replacement
						</li>
						<li className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
							<span className="text-gray-500">🛡️</span> Warranty Policy
						</li>
						<li className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
							<span className="text-gray-500">🚗</span> Electric Vehicle
						</li>
					</ul>
				</div>

				{/* Right Content */}
				<div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
					<h3 className="text-lg font-semibold mb-4">Payment</h3>
					<div className="space-y-0">
						{faqData.map((faq, index) => (
							<div key={index} className="border-b border-gray-200 last:border-b-0">
								<button
									onClick={() => toggleExpanded(index)}
									className="w-full py-4 flex justify-between items-center text-left hover:text-orange-500 transition-colors duration-200"
								>
									<span className="font-medium pr-4">{faq.question}</span>
									<span className={`text-gray-400 transform transition-transform duration-200 ${expandedItems.includes(index) ? 'rotate-180' : ''
										}`}>
										⌄
									</span>
								</button>
								<div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedItems.includes(index)
									? 'max-h-96 opacity-100'
									: 'max-h-0 opacity-0'
									}`}>
									<div className="pb-4 pr-8 text-gray-600 leading-relaxed">
										{faq.answer}
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="mt-6 pt-4 border-t border-gray-200">
						<p className="text-sm font-medium text-gray-700">Need More Help?</p>
					</div>
				</div>
			</div>
		</div>
	);
}
export default page
