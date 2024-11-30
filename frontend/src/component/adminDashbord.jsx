
import { useEffect,useState } from "react"
import { useParams,Navigate,Link } from "react-router-dom"
import axios from "axios";
import './admindash.css'
import Show from "./Show";


function AdminDashbord(){


    const [count, setcount] = useState([])
    const [product, setproduct] = useState([])
    const [users, setusers] = useState([])
    const [user, setuser] = useState([])
    const [url, seturl] = useState([])
    const [show, setshow] = useState("product")
    const [ads, setads] = useState([])





    useEffect(()=>{
fetch(`http://localhost:3001/count`, {
    method: 'GET', /* or PATCH */
    headers: { 
        'Content-Type': 'application/json',
        "Authorization":localStorage.getItem("token")
  },
    
  })
  .then(res => res.json())
  .then((data)=>{
    setcount(data)
  });

      },[])

      //product details 

      useEffect(()=>{
        fetch(`http://localhost:3001/products`,{
            headers:{
            "Authorization":localStorage.getItem("token")
             }})
        .then(res => res.json())
        .then((data)=>{
          setproduct(data.data)
        }
        );
      },[])

      //user data
      useEffect(()=>{
        fetch(`http://localhost:3001/userdata`,{
            headers:{
            "Authorization":localStorage.getItem("token")
             }})
        .then(res => res.json())
        .then((data)=>{
            setusers(data.data)
            setuser(data.user)
            seturl(data.user.image.url)

        }
        );
      },[])

//ads data
useEffect(()=>{
    fetch(`http://localhost:3001/sponsored`,{
        headers:{
        "Authorization":localStorage.getItem("token")
         }})
    .then(res => res.json())
    .then((data)=>{
        setads(data.data)
    }
    );
  },[])

function Showproduct(){
    setshow("product");
}
function Showuser(){
    setshow("user");
}
function Showads(){
    setshow("ads");
}



//last add user condition enter
if(user.role=="User"){
  return (
     <>
     <Navigate to="/error" replace={true} />
     </>
  )
 }
//login validation

if(localStorage.getItem("token")==null){
  return(
      <>
      {alert("please login..")}
     <Navigate to="/" replace={true} />

      </>
  )
}
else{

return(
    <>
    <div className="adminbord">
      <h1 className="adminwordtitle">Admin Dashboard</h1>
      <div className="count">
        <div className="co1" onClick={Showproduct}><h1>Total Products</h1><br /><h1>{count.totalproduct}</h1></div><hr />
        <div className="co1" onClick={Showuser}><h1>Total User</h1><br /><h1>{count.totaluser}</h1></div><hr />
        <div className="co1" onClick={Showads}><h1>Total Ads</h1><br /><h1>{count.totalads}</h1></div>
       </div>
       <br />
       <div className="dashdata">
        <p>Details</p>
    {show=="product"?
       <table>
  <tr>
  <th scope="col">productid</th>
            <th >Productname</th>
            <th >status</th>
            <th>Added on</th>
            
  </tr>
  
  {product.reverse().map((product) => (
        <tr>
        <td>{product._id}</td>
        <td>{product.name}</td>
        <td>{product.status}</td>
        <td>{product.createAt}</td>
      </tr>
      ))}
  
  
</table>:""}
{show=="user"?

<table>
  <tr>
  <th scope="col">Userid</th>
            <th >Username</th>
            <th >Useremail</th>
            <th >status</th>
            
  </tr>
  
  {users.reverse().map((user) => (
        <tr>
        <td>{user._id}</td>
        <td>{user.name}</td>
        <td>{user.emailid}</td>
        <td>{user.status}</td>
      </tr>
      ))}
  
  
</table>:""}
{show=="ads"?

<table>
  <tr>
  <th scope="col">Adsid</th>
            <th >Productid</th>
            <th >Productname</th>
            <th >status</th>
            
  </tr>
  
  {ads.reverse().map((ads) => (
        <tr>
        <td>{ads._id}</td>
        <td>{ads.Productid._id}</td>
        <td>{ads.Productid.name}</td>
        <td>{ads.status}</td>
      </tr>
      ))}
  
  
</table>:""}
       </div>
       </div>

       {/* dropdown */}
       <div className="adminnav">
        <h4 className="sidetitle">ReviveMart</h4>
        <br /><hr />
       <Link to={"/home"} className='l12'>HOME</Link><br /><br /><br /><hr />
       <Link to={"/admin/products"} className='l12'>PRODUCTS</Link><br /><br /><br /><hr />
       <Link to={"/admin/users"} className='l12'>USERS</Link><br /><br /><br /><hr />
      <Link to={"/showads"} className='l12'>SPONSORED</Link><br /><br /><br /><hr />
       <Link to={"/logout"} className='l12'>LOGOUT</Link><br /><br /><br /><hr />

       </div>
    </>
)
}
}

export default AdminDashbord