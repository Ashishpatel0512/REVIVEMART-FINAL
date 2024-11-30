
import { useEffect } from "react"
import { useParams,Navigate } from "react-router-dom"
import axios from "axios";

function Unblock(){

    let {userid}=useParams();
    useEffect(()=>{
       /* updating title of product with id 1 */
fetch(`http://localhost:3001/unblock/${userid}`, {
    method: 'PUT', /* or PATCH */
    headers: { 
        'Content-Type': 'application/json',
        "Authorization":localStorage.getItem("token")


     },
    
  })
  .then(res => res.json())

      },[])
return(
    <>
      <Navigate to="/admin/Users" replace={true} />

    </>
)
}

export default Unblock