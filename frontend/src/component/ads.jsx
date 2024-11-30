
import { useEffect,useState } from "react"
import { useParams,Navigate } from "react-router-dom"
import axios from 'axios';


function Ads(){
    
    const [success,setsuccess]=useState(null);
    let {productid}=useParams();
// Function to handle file upload

    useEffect(()=>{
        try {
             axios.get(`http://localhost:3001/ads/${productid}`,{
                headers:{
                    "Authorization":localStorage.getItem("token")
    
                }
            }).then((data)=>{
                if(data.data.success){
                    alert("product ads successfully");
                    setsuccess("true");
                }
            });
            
            
        } catch (error) {
            console.error(" ads update error:", error);
        }

},[])
    return (
        
        <>
        {success=="true"?<Navigate to="/myproduct" replace={true} />:""}
       
        

        </>
    )
}

export default Ads