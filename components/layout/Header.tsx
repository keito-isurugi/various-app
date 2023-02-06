import Link from 'next/link'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { client, postMethod } from '@/lib/axios'
import { Button } from '@mui/material'
import Sidebar from './Sidebar'

const Header = () => {
  return (
		<nav className="flex items-center justify-between flex-wrap bg-teal-500 p-4">
			<div className="flex items-center gap-3 flex-shrink-0 text-white mr-6">
				<Sidebar />
				<Link href="/" className="flex items-center flex-shrink-0 text-white mr-6">
					<span className="font-semibold text-xl tracking-tight">Various App</span>
				</Link>
			</div>
			<div className="block lg:hidden">
				<button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
					<svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
				</button>
			</div>
		</nav>
  )
}

export default Header