import React from 'react'

const Image = ({src, ...rest}) => {
    src = src && src.includes('https://') 
    ? src 
    : 'https://makeourtripbackend.onrender.com/uploads/'+src;
  return (
    <img {...rest} src={src} alt={''} />
  )
}

export default Image
