import { Link } from 'react-router'

const Card = ({ club }) => {
  const { _id, name, image, price, category } = club || {}

  return (
    <Link
      to={`/club/${_id}`}
      className='col-span-1 cursor-pointer group shadow-xl p-3 rounded-xl bg-white'
    >
      <div className='flex flex-col gap-2 w-full'>
        <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
          <img
            className='object-cover h-full w-full group-hover:scale-110 transition duration-300'
            src={image}
            alt={name || 'Club Image'}
          />
        </div>
        <div className='font-semibold text-lg'>{name}</div>
        <div className='font-semibold text-lg'>Category: {category}</div>
        <div className='flex flex-row items-center gap-1'>
          <div className='font-semibold'> Entry Fee: {price}$</div>
        </div>
      </div>
    </Link>
  )
}

export default Card