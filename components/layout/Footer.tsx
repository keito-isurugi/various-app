const Footer = () => {
	return (
<footer className="p-4 shadow md:flex md:items-center md:justify-between md:p-6 bg-gray-800 w-full">
			<span className="text-sm  sm:text-center text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite™</a>. All Rights Reserved.
			</span>
			<ul className="flex flex-wrap items-center mt-3 text-sm text-gray-400 sm:mt-0">
				<li>
						<a href="#" className="mr-4 hover:underline md:mr-6 ">About</a>
				</li>
				<li>
						<a href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
				</li>
				<li>
						<a href="#" className="mr-4 hover:underline md:mr-6">Licensing</a>
				</li>
				<li>
						<a href="#" className="hover:underline">Contact</a>
				</li>
			</ul>
		</footer>
	)
}

export default Footer