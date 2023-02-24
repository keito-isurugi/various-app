import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '@/public/css/pokemon.module.css'
import WorkIcon from '@mui/icons-material/Work';
import Headline from '../templates/top/Headline';
import MenuLinkButton from '../parts/MenuLinkButton';

function icon() {
	return <WorkIcon fontSize='large'/>
}

const TopWorks = () => {
	const router = useRouter()
	return (
		<>
			<Headline icon={icon}>作ったもの</Headline>
			<ul className='flex gap-10 font-bold 
				lg:text-xl md:text-x text-[14px] px-5'
				>
				<MenuLinkButton linkPath='/pokemon' imgPath='/img/pokemon/ball.svg'>
					ポケモン図鑑
				</MenuLinkButton>
				<MenuLinkButton linkPath='/blog' imgPath='/img/notion-logo-black.svg'>
					Notionブログ
				</MenuLinkButton>
			</ul>
		</>
	)
}

export default TopWorks