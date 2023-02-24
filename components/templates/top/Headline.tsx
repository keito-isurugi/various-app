import WorkIcon from '@mui/icons-material/Work';

const Headline = (props) => {
	const {children, icon} = props

	return (
		<div className='flex border-black border-b-2 mb-5 gap-2'>
			{icon()}
			<h1 className='text-3xl'>{children}</h1>
		</div>
)
}

export default Headline