import axios from 'axios';
import React, { useState } from 'react'
import Image from './Image';

const PhotosUploader = ({addedPhotos, onChange}) => {
    const [photoLink, setPhotoLink] = useState("");

    async function addPhotoByLink(ev){
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link', {link : photoLink})
        onChange(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
      }
    
      function uploadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        for(let i = 0; i< files.length ; i++){
            data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
            headers: {'Content-type':'multipart/form-data'}
        }).then(response => {
            const {data: filenames} = response;
            onChange(prev => {
                return [...prev, ...filenames];
            });
        })
    }

    function removePhoto(ev,filename){
        ev.preventDefault();
        onChange([...addedPhotos.filter(photo => photo !== filename)])
    }

    function selectAsMainPhoto(ev,filename){
        ev.preventDefault();
        onChange([filename, ...addedPhotos.filter(photo => photo !== filename)]);
    }

  return (
    <>
            <div className="flex gap-2">
              <input
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
                type="text"
                placeholder={"Add using a link .... jpg"}
              />
              <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">
                Add&nbsp;Photo
              </button>
            </div>
            <div className="mt-2 grid gap-2 gird-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {addedPhotos.length > 0 && addedPhotos.map(link => (
                <div className="h-40 flex relative" key={link} >
                    <Image className="rounded-2xl w-full object-cover" src={link} alt="" />
                    <button onClick={(ev) => removePhoto(ev,link)} className='cursor-pointer absolute bottom-1 right-1 text-white bg-black p-2 bg-opacity-50 rounded-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>

                    </button>
                    <button onClick={(ev) => selectAsMainPhoto(ev,link)} className='cursor-pointer absolute bottom-1 left-1 text-white bg-black p-2 bg-opacity-50 rounded-full'>
                        {link === addedPhotos[0] && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                          </svg>
                          
                        )}
                        {link !== addedPhotos[0] && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        )}
                    </button>
                </div>
            ))}
              <label className="h-40 cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-2 text-lg text-gray-500">
              <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                Upload from your Device
              </label>
            </div> 
    </>
  )
}

export default PhotosUploader