import { useEffect,useState } from "react";
import { useParams,Link,Navigate } from "react-router-dom"
import Navbar from "./Navbar";
import './product.css'

function Showads(){

    // let {productid,productuserid}=useParams();
    const [data,setdata]=useState([]);
  const [showdata,setshowdata]=useState([]);
    const [user,setuser]=useState([]);
    const [url,seturl]=useState([]);

 

//setshowdata
    useEffect(()=>{
     setshowdata(data)
    },[data])

    
    const Approve=()=>{
      const status = data.filter(data => data.status === "Approve");
      setshowdata(status)
    }
    const Reject=()=>{
      const status = data.filter(data => data.status === "Reject");
      setshowdata(status)
    }
    

    const showform = async (e) => {
      const form=document.querySelector(".filterstatus").classList.toggle("myStyle");
      }

    useEffect(()=>{
        fetch(`http://localhost:3001/ad`,{
            headers:{
            "Authorization":localStorage.getItem("token")
             }})
        .then(res => res.json())
        .then((data)=>{
          setuser(data.user)
          seturl(data.user.image.url)
          setdata(data.data)
        }
        );
      },[])
    
    if(user.role=="User"){
      return (
         <>
         <Navigate to="/error" replace={true} />
         </>
      )
     }


    return (
<>
<Navbar user={user} url={url}></Navbar>
<h3 className='header'>Show Sponsored</h3>
<div className='table'>
<table>
  <tr>
  <th scope="col">products</th>
            <th >name</th>
            <th >price</th>
            <th >category</th>
            <th>age</th>
            <th >status</th>
            <th>Added on</th>
            <th>Action</th>
  </tr>
  
  {showdata.reverse().map((product) => (
        <tr>
       <td><img src={product.Productid.image[0].url} alt="" /><img src={product.Productid.image[1].url} className="poimg2" alt="" /></td>
       
        <td>{product.Productid.name}</td>
        <td>{product.Productid.price}</td>
        <td>{product.Productid.catagory}</td>
        <td>{product.Productid.age}</td>
        <td>{product.status}</td>
        <td>{product.Productid.createAt}</td>
        <td>
<button className="promote-btn"><Link to={`/ad/approve/${product._id}`} className="promote-btn">Approve</Link></button><br /> <br />
<button className="deletebtn"><Link to={`/ad/reject/${product._id}`} className="deletebtn">Reject</Link></button>

        </td>

      </tr>
      ))}
  
  
</table><br />
</div>

</>

    )
}

export default Showads