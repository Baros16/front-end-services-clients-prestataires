const messages = [ 
     {   
         id: 1,
         type: "received",  
         text: "Hi there! I saw your request for pipe repair. Could you send me a couple of photos of the leak         under the sink? It helps me bring the right parts.",
         time: "10:14 AM",
         avatar: "/images/sarah.jpg",
     },
     { 
       id: 2,
       type: "sent", 
       text: "Hello Sarah, sure thing. Here are the pictures of the pipes. It looks like it's coming from the         main joint.",
       time: "10:18 AM", 
     }, 
    {    
        id: 3,
        type: "image",
        imageUrl: "/images/pipe.jpg",
        time: "10:19 AM", 
    }, 
    {
         id: 4, 
         type: "received",
        text: "Thanks for the photos! Yes, it's the P-trap joint. I have the exact PVC replacement in my truck. I         can be there by 2 PM today. I'll send over the final quote now for you to approve.", 
         time: "10:22 AM", 
        avatar: "/images/sarah.jpg",
     },
 ];
export default messages;