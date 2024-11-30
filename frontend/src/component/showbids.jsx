import { useEffect,useState } from "react";
import { useParams,Navigate } from "react-router-dom"
import Navbar from "./Navbar";

function Showbids(){

    let {productid}=useParams();
    const [bids,setbids]=useState([]);
    const [user,setuser]=useState([]);
    const [url,seturl]=useState([]);


    useEffect(()=>{
        fetch(`http://localhost:3001/showbids/${productid}`,{
            headers:{
            "Authorization":localStorage.getItem("token")
             }})
        .then(res => res.json())
        .then((data)=>{
            setuser(data.user)
            seturl(data.user.image.url)
            setbids(data.data)

        }
        );
      },[])

      if(localStorage.getItem("token")==null){
        return(
            <>
            {alert("please login..")}
           <Navigate to="/" replace={true} />
    
            </>
        )
    }
else{

    return (
<>
<Navbar user={user} url={url} ></Navbar>
<h3 className='header'>Showbids</h3>
<div className='table'>
    {/* <h4>{bids[0].Productid.name}</h4> */}
<table>
  <tr>
  <th scope="col">products</th>
            <th >Name</th>
           <th >Bid Placed On</th>
            <th >Seller</th>
            <th >Offered Price</th>
            <th >Bid Amount</th>
            <th >Message</th>
            <th >Contact Details</th>
  </tr>
  
  {bids.map((data) => (
        <tr>
       <th scope="row"><img src={data.Productid.image[0].url} alt=""  height="30px" width="30px"/></th>
              <td>{data.Productid.name}</td>
              <td>{data.createAt}</td>
              <td>{data.Productid.User[0].name}</td>
              <td>{data.Productid.price}</td>
              <td>{data.bidamount}</td>
              <td>{data.message}</td>
              <td>{data.contact } <br /> {data.User[0].name}</td>
  
      </tr>
      ))}
  
  
</table><br />
</div>
</>

    )
}
}

export default Showbids