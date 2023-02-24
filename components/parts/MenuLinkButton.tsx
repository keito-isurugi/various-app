import { useRouter } from 'next/router'
import styles from '@/public/css/pokemon.module.css'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const MenuLinkButton = (props) => {
	const router = useRouter()
	const { children, linkPath, imgPath, externalLink } = props

	const onClickLink = () => {
		if(externalLink) {
			window.open(linkPath, '_blank');
		} else {
			router.push(linkPath)
		}
	}

	return (
		<li className={`
			lg:text-l md:text-x text-[14px] 
			flex justify-center items-center gap-3 
			border py-3 px-2 rounded-lg shadow-xl cursor-pointer 
			lg:w-[20%] md:w-[50%] sm:w-[250px] max-w-[250px] 
			${styles.card}
			`} 
			onClick={() => onClickLink()}
		>
			<div className='w-10'>
				<img className="" src={imgPath} alt="" />
			</div>
			<p className=''>{children}</p>
			{externalLink ? 
				<div className='w-10'>
					<OpenInNewIcon />
				</div>
				: <div></div>
			}
		</li>
	)
}

export default MenuLinkButton