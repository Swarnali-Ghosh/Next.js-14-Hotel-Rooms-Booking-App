import React from 'react'

const PageTitle = ({ title }: { title: string }) => {
    return (
        <div className='text-xl text-gray-500 font-bold'>{title}</div>
    )
}

export default PageTitle