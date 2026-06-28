import React from "react";


const MessageBubble=({message})=>{


const {
type,
text,
time,
avatar
}=message;



const received=type==="received";



return (

<div
className={`flex flex-col mb-6 ${
received
?"items-start"
:"items-end"
}`}
>


<div

className={`max-w-xl px-5 py-4 rounded-2xl ${
received
?"bg-white border text-gray-700"
:"bg-teal-900 text-white"
}`}

>

{text}


</div>



<div className="flex items-center gap-2 mt-2 text-xs text-gray-400">


{
received &&
<img
src={avatar}
className="w-7 h-7 rounded-full"
/>
}


{time}


{
!received &&
<span>
✓✓
</span>
}



</div>



</div>


)

}



export default MessageBubble;