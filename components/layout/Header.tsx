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
		</nav>
  )
}

export default Header