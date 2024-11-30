import { useEffect,useState } from "react";
import { useParams,Link,Navigate } from "react-router-dom"
import Navbar from "./Navbar";

function Users(){

    // let {productid,productuserid}=useParams();
    // console.log(productid,productuserid)
    const [data,setdata]=useState([]);
    const [user,setuser]=useState([]);
    const [url,seturl]=useState([]);
    //add
    const [searchitem,setsearch] = useState(undefined)
    const [showdata,setshowdata] = useState([])
//

//add
    useEffect(() => {
        setshowdata(data);
      }, [data]); 
  //

    useEffect(()=>{
        fetch(`http://localhost:3001/userdata`,{
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

      //add
      const search = (e) => {
        let value=e.target.value;
        setsearch(value)
        const result = (data.filter(product => product.emailid.startsWith(`${value}`)));
        setshowdata(result)
      };
//

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
<br />
{/* add */}
<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="text"
        name="search"
        value={searchitem}
        onChange={search}
        placeholder="Search Emailid.."
        style={{ position: "fixed" ,top:"80px",marginBottom:"-100px", marginLeft:"20%",padding: "5px 8px 5px 18px", width: "1000px", border: "1px solid lightgrey", borderRadius: "25px", fontSize:"18px", color: "gray" }}
      />
          </div>
          {/* // */}
<h3 className='header'>Users</h3>
<div className='table'>
<table>
  <tr>
            <th scope="col">user</th>
            <th scope="col">name</th>
           <th scope="col">emailid</th>
            <th scope="col">status</th>
            <th scope="col">Action</th>

  </tr>
  {/* add chage data to show data */}
  {showdata.reverse().map((data) => (
        <tr>
       <th scope="row"><img src={data.image.url} alt=""  height="30px" width="30px"/></th>
              <td>{data.name}</td>
              <td>{data.emailid}</td>
              <td>{data.status}</td>
              <td>
                <button className="deletebtn"><Link to={`/block/${data._id}/` } className="deletebtn">Block</Link></button>&nbsp; &nbsp;
                <button className="promote-btn"><Link to={`/unblock/${data._id}/` } className="promote-btn">Unblock</Link></button>
            </td>
\
      </tr>
      ))}
  
  
</table><br />
</div>
</>

    )
  }
}

export default Users