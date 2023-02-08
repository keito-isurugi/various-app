import styels from '@/public/css/pokemon.module.css'

const BallSpinner = () => {
	return (
		<div className='w-[100%] text-center py-20'>
			<img className={`my-0 mx-auto ${styels.ball}`} width={80} src="/img/pokemon/ball.svg" alt="" />
		</div>
	)
}

export default BallSpinner