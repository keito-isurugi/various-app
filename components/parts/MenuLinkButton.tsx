import { useRouter } from 'next/router'
import styles from '@/public/css/pokemon.module.css'

const MenuLinkButton = (props) => {
	const router = useRouter()
	const { children, linkPath, imgPath } = props

	return (
		<li className={`lg:text-xl md:text-x text-[14px] flex justify-center items-center gap-3 border py-3 px-5 rounded-lg shadow-xl cursor-pointer lg:w-[18%] md:w-[50%] sm:w-[250px] max-w-[250px] ${styles.card}`} onClick={() => router.push(linkPath)}>
			<div className='w-12'>
				<img className="" src={imgPath} alt="" />
			</div>
			<p className=''>{children}</p>
		</li>
	)
}

export default MenuLinkButton