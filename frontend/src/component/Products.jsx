import { useEffect,useState } from "react";
import { useParams,Link,Navigate } from "react-router-dom"
import Navbar from "./Navbar";
import './product.css'

function Products(){

    const [data,setdata]=useState([]);
  const [showdata,setshowdata]=useState([]);
    const [user,setuser]=useState([]);
    const [url,seturl]=useState([]);

 

//setshowdata
    useEffect(()=>{
     setshowdata(data)
    },[data])

    const pending=()=>{
      const status = data.filter(data => data.status === "pending");
      setshowdata(status)
    }
    const Approve=()=>{
      const status = data.filter(data => data.status === "Approve");
      setshowdata(status)
    }
    const Reject=()=>{
      const status = data.filter(data => data.status === "Reject");
      setshowdata(status)
    }
    const Block=()=>{
      const status = data.filter(data => data.status === "block");
      setshowdata(status)
    }
    const Update=()=>{
      const status = data.filter(data => data.status === "update");
      console.log("status",status)
      setshowdata(status)
    }

    const showform = async (e) => {
      const form=document.querySelector(".filterstatus").classList.toggle("myStyle");;
      console.log(form)
    //   table.style.opacity="0.2"
      }

    useEffect(()=>{
        fetch(`http://localhost:3001/products`,{
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
    console.log(data)
    console.log(user)
    
    if(user.role=="User"){
      return (
         <>
         <Navigate to="/error" replace={true} />
         </>
      )
     }

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
<Navbar user={user} url={url}></Navbar>
<h3 className='header'>Products</h3>
<div className='table'>
<button onClick={showform}  className='button-24'><b>Filters</b></button>
<table className="products-table">
  <tr>
  <th scope="col">Products</th>
            <th >Name</th>
            <th >Price</th>
            <th >Category</th>
            <th>Age</th>
            <th >Status</th>
            <th>Added on</th>
            <th>Action</th>
  </tr>
  
  {showdata.reverse().map((product) => (
        <tr>
       <td className="product-img-container"><img src={product.image[0].url} alt="" /><img src={product.image[1].url} className="poimg2" alt="" />
       </td>
        <td>{product.name}</td>
        <td>{product.price}</td>
        <td>{product.catagory}</td>
        <td>{product.age}</td>
        <td>{product.status}</td>
        <td>{product.createAt}</td>
        <td>
<button className="promote-btn"><Link to={`/approve/${product._id}`} className="promote-btn">Approve</Link></button><br /> <br />
<button className="deletebtn"><Link to={`/reject/${product._id}`} className="deletebtn">Reject</Link></button>

        </td>

      </tr>
      ))}
  
  
</table><br />
</div>
<div className="filterstatus myStyle">
   <h3 onClick={pending} className="state">Pending</h3><hr />
   <h3 onClick={Approve} className="state">Approve</h3><hr />
   <h3 onClick={Reject} className="state">Reject</h3><hr />
   <h3 onClick={Block} className="state">Block</h3><hr />
   <h3 onClick={Update} className="state">Update</h3>
</div>
</>

    )
  }
}

export default Products