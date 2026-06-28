import React from "react";


const QuoteDraftCard=({

title="Quote Draft Initiated",

description="Sarah is preparing your final quote based on the details provided."

})=>{


return (

<div className="mx-auto my-10 w-96 p-6 bg-white border rounded-xl text-center shadow">


<div className="text-teal-900 text-xl">
■
</div>


<h3 className="font-semibold mt-3">
{title}
</h3>


<p className="text-gray-500 text-sm mt-2">
{description}
</p>


</div>

)

}


export default QuoteDraftCard;