import React from "react";


const ImageMessage=({message})=>{


const {
imageUrl,
time
}=message;



return (

<div className="flex flex-col items-end mb-6">


<div className="rounded-2xl overflow-hidden border-2 border-teal-900">

<img

src={imageUrl}

className="w-64 h-48 object-cover"

/>

</div>



<div className="text-xs text-gray-400 mt-2">

{time} ✓✓

</div>



</div>

)

}


export default ImageMessage;