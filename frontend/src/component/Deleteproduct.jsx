
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Navigate } from "react-router-dom";

function DeleteProduct(){

    let {productid}=useParams();

    useEffect(()=>{
        fetch(`http://localhost:3001/delete/${productid}`,{
            headers:{
                "Authorization":localStorage.getItem("token")

            }
        })
        .then(res => res.json())
        .then((data)=>{
            console.log(data)
    }
        );
      },[])

  
    return (
        <>
        {alert("product delete successfully")}
        <Navigate to="/myproduct" replace={true} />
        </>
    )
}

export default DeleteProduct