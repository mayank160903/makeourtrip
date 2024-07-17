import React from 'react'
import Image from './Image';

const PlaceImg = ({place, index=0, className=null}) => {
    if(!place.addedPhotos?.length){
        return '';
    }

    if(!className){
        className = 'object-cover';
    }

  return (
        <Image className={className} src={place.addedPhotos[index]} alt="" />
  )
}

export default PlaceImg
