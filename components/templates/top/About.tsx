import Headline from './Headline';
import InfoIcon from '@mui/icons-material/Info';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuLinkButton from '@/components/parts/MenuLinkButton';

function icon() {
	return <InfoIcon fontSize='large'/>
}

const About = () => {
	return (
		<>
			<Headline icon={icon}>このサイトについて</Headline>
			<ul className='font-bold px-5'>
				<li className='mb-2 text-xl'>Next.jsとTypeScriptの学習用で作ったサイトです。</li>
				<MenuLinkButton linkPath='https://github.com/keito-isurugi' imgPath='/img/github-icon.svg' externalLink={true}>
					ソースコード
				</MenuLinkButton>
			</ul>
		</>
	)
}

export default About