import React from 'react'

function page() {
	return (
		<div className="px-6 md:px-20 lg:px-32 py-16 space-y-10 text-gray-800">
			{/* ABOUT US */}

			<section className='border-b border-line pb-6'>
				<h1 className="text-[25px] font-semibold text-center mb-6">ABOUT US</h1>
				<p className="leading-relaxed text-sm text-justify">
					Pickaboo.com is a leading online one-stop shopping destination in Bangladesh. Our journey began in 2016 with a
					special focus on Consumer Electronics, Smartphones, Gadgets, Mobile Phones, Computer Accessories, Lifestyle
					Essentials, and more.
				</p>
				<p className="leading-relaxed text-sm text-justify mt-4">
					Since Pickaboo’s inception, with the mantra ‘Delivering Happiness’, we have served millions of customers across
					the country, offering authentic products with official warranty, an undisputed milestone in the local industry.
					Pickaboo thrives on ensuring end-to-end customer satisfaction with a delivery fleet of its own dedicated to the
					Dhaka Metro zones.
				</p>
				<p className="leading-relaxed text-sm text-justify mt-4">
					Pickaboo has official brand partnerships with over 500 local and global vendors, with vested trust and promise
					to deliver the highest quality products at the most affordable prices. Our pride lies in our radical
					transparency, with the easiest return and refund facilities in the industry, further helping our customers
					establish a sense of trust and credibility in us. Moreover, multifaceted payment options ranging from Cash &amp;
					Card on Delivery to online payment options, including Mobile Financial Services (MFS), with a secure payment
					gateway, make online shopping seamless for our customers. Additionally, our Express Delivery service is truly
					unique, which sets us apart, ensuring same-day delivery for particular products.
				</p>
			</section>

			{/* MAKE THE BEST CHOICE */}
			<section className='border-b border-line pb-6'>
				<h1 className="text-[25px] font-semibold text-center mb-6">MAKE THE BEST CHOICE</h1>
				<p className="text-sm mb-5">
					Always Shop Authentic with Pickaboo!
				</p>
				<p className="text-sm mb-6">
					Our core value and mission are to Deliver Happiness by combining authentic products, intelligent logistics, and
					customer-first service while promoting sustainable consumption and inclusive digital growth.
				</p>
				<ul className="space-y-2 text-sm list-disc list-inside mx-auto">
					<li>With Pickaboo, experience the ultimate one-stop online Electronics shopping platform.</li>
					<li>
						Avail Pickaboo’s co-branded credit card made in collaboration with EBL &amp; Mastercard to get access to
						exclusive deals and discounts, making online shopping even more convenient with flexible payment plans.
					</li>
					<li>Most trusted online shopping platform serving millions of customers annually.</li>
					<li>Products curated from only the best local and global brands through official partnerships.</li>
					<li>Experience the fastest delivery service with Pickaboo’s Express.</li>
					<li>Easy to claim returns and refunds within 3 working days.</li>
					<li>Warranty facilities on every product.</li>
					<li>Enjoy flexible payment plans with 32 major banks.</li>
				</ul>
			</section>

			{/* GET IN TOUCH */}
			<section className='border-b border-line pb-6'>
				<h1 className="text-[25px] font-semibold text-center mb-6">Get In Touch</h1>
				<p className=" text-sm mb-6">
					Feel free to reach out to us any time through whatever channel feels most convenient.
				</p>
				<div className="space-y-3 text-sm ">
					<li className='text-sm'>Hotline: +880 9666-745 745 (10:00 AM - 8:00 PM)
					</li>
					<li className='text-sm'>
						WhatsApp: +8801708127000
					</li>
					<li className='text-sm'>
						Connect with us: LinkedIn, Facebook, Instagram
					</li>
					<li className='text-sm'>Livechat: on Pickaboo.com for product suggestions, queries, or concerns
					</li>
					<li>Email us: {" "}
						<a href="mailto:support@pickaboo.com" className="text-blue-600 font-semibold hover:underline">
							support@pickaboo.com
						</a>
					</li>
					<li>
						Expect a friendly feedback call from our customer support team after you have purchased from us in an effort to
						ensure the highest level of customer satisfaction.
					</li>
				</div>
			</section>

			{/* Experience The Fastest Product Delivery */}
			<section className='border-b border-line pb-6'>
				<h1 className="text-[25px] font-semibold text-center mb-6">Experience The Fastest Product Delivery</h1>
				<p className=" text-sm mb-6">
					Wait, but why? In an effort to make your online shopping experience convenient and seamless, you can choose from multiple product delivery/collection options.
				</p>
				<div className="space-y-3 text-sm ">
					<li className='text-sm'>Express Delivery facility ensures same-day deliveries for products with the label ‘Express’ in the Dhaka Metro region.
					</li>
					<li className='text-sm'>
						Click & Collect facility enables you to pick up your products directly from our office.
					</li>
				</div>
			</section>

			{/* Secure Checkout */}
			<section className='pb-6'>
				<h1 className="text-[25px] font-semibold text-center mb-6">Secure Checkout</h1>
				<p className=" text-sm mb-6">When shopping at Pickaboo.com, we want our customers to feel safe and at ease. Our payment gateway is SSL-encrypted and uses state-of-the-art technology, ensuring special care in securing all your personal information through various security checks. Our business is licensed and regulated with the sole purpose of ensuring our customers’ security and convenience.
				</p>
			</section>
		</div>
	);
}


export default page
