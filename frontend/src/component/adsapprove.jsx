
import { useEffect } from "react"
import { useParams,Navigate } from "react-router-dom"
import axios from "axios";

function AdsApprove(){

    let {productid}=useParams();
    useEffect(()=>{
       /* updating title of product with id 1 */
fetch(`http://localhost:3001/ads/approve/${productid}`, {
    method: 'PUT', /* or PATCH */
    headers: { 
        'Content-Type': 'application/json',
        "Authorization":localStorage.getItem("token")


     },
    
  })
  .then(res => res.json())
  .then(console.log);

      },[])
return(
    <>
      <Navigate to="/showads" replace={true} />

    </>
)
}

export default AdsApprove