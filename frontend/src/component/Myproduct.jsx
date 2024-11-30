import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './Myproduct.css'
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
function FileUpload() {
    const [file, setFile] = useState(null);
    const [file2, setFile2] = useState(null);

const [name,Changname]=useState(null);
const [descriptions,Changdescription]=useState(null);
const [catagorys,Changcatagory]=useState(null);
const [prices,Changprice]=useState(null);
const [ages,Changage]=useState(null);
const [locations,Changlocation]=useState(null);
const [others,Changother]=useState(null);
const [data,setdata]=useState([]);
const [user,setuser]=useState("undefined");
const [url,seturl]=useState([]);
const [ads,setads]=useState([]);
const [loader,setloader] = useState(false);
console.log("tokenn",localStorage.getItem("token"))

useEffect(()=>{
    fetch('http://localhost:3001/user/products',{
        headers:{
            "Authorization":localStorage.getItem("token")

        }
    })
    .then(res => res.json())
    .then((data)=>{
        setads(data.ads)
    setuser(data.user)
    setdata(data.data)
    seturl(data.user.image.url)
    }
    );
  },[])
    // Function to handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };const handleFileChanges = (e) => {
        const selectedFile = e.target.files[0];
        setFile2(selectedFile);
    };
    const Name = (e) => {
        const selectedFile = e.target.value;
        Changname(selectedFile)
    };
    const description = (e) => {
        const selectedFile = e.target.value;
        Changdescription(selectedFile)
    };
    const price = (e) => {
        const selectedFile = e.target.value;
        Changprice(selectedFile)
    };
    const age = (e) => {
        const selectedFile = e.target.value;
        Changage(selectedFile)
    };
    const location = (e) => {
        const selectedFile = e.target.value;
        Changlocation(selectedFile)
    };
    const other = (e) => {
        const selectedFile = e.target.value;
        Changother(selectedFile)
    };
    const catagory = (e) => {
        const selectedFile = e.target.value;
        Changcatagory(selectedFile)
    };
    const showform = async (e) => {
      const form=document.querySelector(".form").classList.toggle("myStyle");;
      const table=document.querySelector("table").classList.toggle("opcity");
    //   table.style.opacity="0.2"
      }

    // Function to handle file upload
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(catagorys==null) {
            return alert("catagory is empty please fill now");
        }
        if(others==null) {
            return alert("other is empty please fill now");
        }
        if (!file) return;
         setloader(true)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file2', file2);

        formData.append('name', name);
        formData.append('description', descriptions);
        formData.append('price', prices);
        formData.append('age', ages);
        formData.append('location', locations);
        formData.append('catagory', catagorys);
        formData.append('other', others);
        
        try {
             axios.post('http://localhost:3001/index',formData,{
                headers:{
                    "Authorization":localStorage.getItem("token")

                }
            }).then((data)=>{
                if(data.data.success){
                    setloader(false)
                  alert(data.data.message);
            const form=document.querySelector(".form").classList.toggle("myStyle");
            const table=document.querySelector("table").classList.toggle("opcity");

            <Navigate to="/myproduct" replace={true} />

                }
                else{
                    alert("error is "+data.data.error)
                }
            });
            
        } catch (error) {
            console.error("product upload error:", error);
        }
    };

//admin error
 if(user.role=="Admin"){
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
        {loader?<div><div class="loader"></div><div className='loadtime'><Navbar   user={user} url={url} ></Navbar>
        <h3 className='header'>My Products</h3>
        <div className='table'>
        <button onClick={showform} className='button-24'>Add Product</button>
        <table>
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
          
          {data.reverse().map((product) => (
                <tr>
                <td><img src={product.image[0].url} alt="" /></td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.catagory}</td>
                <td>{product.age}</td>
                <td>{product.status}</td>
                <td>{product.createAt}</td>
                 <td className='action-btns'>
                <Link to={`/showbids/${product._id}`} className='bidshows'><u>Showbids</u></Link> 
                <Link to={`/edit/${product._id}`}>
                    <button className='editbtn'>Edit</button>
                </Link>
                  {
               ads.find(ad => ad.Productid._id ===product._id)?"":<Link to={`/Advertize/${product._id}`}>
                    <button className='promote-btn'>Promote</button>
                  </Link> 
                }
                  <Link to={`/delete/${product._id}`}>
                    <button className='deletebtn'>Delete</button>
                  </Link> &nbsp;  &nbsp;
                </td>
              </tr>
              ))}
          
          
        </table><br />
        </div>
                <form onSubmit={handleSubmit} className='form myStyle'>
                    <h4>New Product</h4>
                    <p onClick={showform} className='p'>&times;</p>
                    <input type="text" name='name' placeholder='Product name'  onChange={Name} required/><br />
                    <textarea name="description"placeholder='Product description' onChange={description}  required></textarea><br />
                    <input type="text" name='price' placeholder='Product price'onChange={price}  required/><br />
                    <input type="text" name='age'placeholder='Product age' onChange={age}  required/><br />
                    <input type="text" name='location' placeholder='Your location'  onChange={location} required/><br />
                    <select name="catagory" id="catagory" onChange={catagory}>
                     <option value="Furniture">Furniture</option>
                     <option value="Electronics">Electronics</option>
                     <option value="Vehicle">Vehicle</option>
                     <option value="Other">Other</option>
                     </select><br />
                     <select name="other" id="catagory" onChange={other}>
                     <option value="Warranty">Warranty</option>
                     <option value="Guarantee">Guarantee</option>
                     <option value="Warranty-Guarantee">Warranty-Guarantee</option>
                     </select><br />
                    {/* <input type="text" name='other' onChange={other} /><br /> */}
                    <input type="file" className='input-file' onChange={handleFileChange}  /><br />
                    <input type="file" className='input-file' onChange={handleFileChanges}  /><br />
        
                    <button type="submit" className='button-68'>Save</button><br />
        
                </form></div></div>:
        <div>
        <Navbar   user={user} url={url} ></Navbar>
        <h3 className='header'>My Products</h3>
        <div className='table'>
        <button onClick={showform} className='button-24'>Add Product</button>
        <table>
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
          
          {data.reverse().map((product) => (
                <tr>
                <td><img src={product.image[0].url} alt="" /></td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.catagory}</td>
                <td>{product.age}</td>
                <td>{product.status}</td>
                <td>{product.createAt}</td>
                 <td className='action-btns'>
                <Link to={`/showbids/${product._id}`} className='bidshows'><u>Showbids</u></Link> 
                <Link to={`/edit/${product._id}`}>
                    <button className='editbtn'>Edit</button>
                </Link>
                  {
               ads.find(ad => ad.Productid._id ===product._id)?"":<Link to={`/Advertize/${product._id}`}>
                    <button className='promote-btn'>Promote</button>
                  </Link> 
                }
                  <Link to={`/delete/${product._id}`}>
                    <button className='deletebtn'>Delete</button>
                  </Link> &nbsp;  &nbsp;
                </td>
              </tr>
              ))}
          
          
        </table><br />
        </div>
                <form onSubmit={handleSubmit} className='form myStyle'>
                    <h4>New Product</h4>
                    <p onClick={showform} className='p'>&times;</p>
                    <input type="text" name='name' placeholder='Product name'  onChange={Name} required/><br />
                    <textarea name="description"placeholder='Product description' onChange={description}  required></textarea><br />
                    <input type="text" name='price' placeholder='Product price'onChange={price}  required/><br />
                    <input type="text" name='age'placeholder='Product age' onChange={age}  required/><br />
                    <input type="text" name='location' placeholder='Your location'  onChange={location} required/><br />
                    <select name="catagory" id="catagory" onChange={catagory}>
                     <option value="Furniture">Furniture</option>
                     <option value="Electronics">Electronics</option>
                     <option value="Vehicle">Vehicle</option>
                     <option value="Other">Other</option>
                     </select><br />
                     <select name="other" id="catagory" onChange={other}>
                     <option value="Warranty">Warranty</option>
                     <option value="Guarantee">Guarantee</option>
                     <option value="Warranty-Guarantee">Warranty-Guarantee</option>
                     <option value="Not Availble">None</option>
        
                     </select><br />
                    {/* <input type="text" name='other' onChange={other} /><br /> */}
                    <input type="file" className='input-file' onChange={handleFileChange}  required/><br />
                    <input type="file" className='input-file' onChange={handleFileChanges}  required/><br />
        
                    <button type="submit" className='button-68'>Save</button><br />
        
                </form>
                </div>
        }
                </>
            );
}
    
}

export default FileUpload;
