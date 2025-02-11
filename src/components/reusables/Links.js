import React from 'react'
import { Link } from 'react-router-dom'

const Links = ({linkArray}) => {
  return (
    <div className='linksContainer'>
        {linkArray.map((iconObj, index) => {
            return <Link key={index} to={iconObj.linkUrl} title={iconObj.title} style={{display: 'flex'}}>
                {iconObj.icon}
            </Link>
        })}
    </div>
  )
}

export default Links