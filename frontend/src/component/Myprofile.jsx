import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import './Myprofile.css'
import axios from "axios";
import { Navigate } from "react-router-dom";
function Myprofile() {
    const [data, setdata] = useState([]);
    const [image, setimage] = useState(null);
    const [file, setFile] = useState(null);
    const [url,seturl]=useState([]);
    const [names, Changname] = useState(null);
    const [emails, Changemail] = useState(null);
    const [loader,setloader] = useState(false);




    useEffect(() => {
        fetch(`http://localhost:3001/user/general`, {
            headers: {
                "Authorization":localStorage.getItem("token")

            }
        })

            .then(res => res.json())
            .then((data) => {
                setdata(data.data)
                setimage(data.data.image.url)
                seturl(data.data.image.url)

            });
    }, [])

    const Name = (e) => {
        const selectedFile = e.target.value;
        Changname(selectedFile)
    };
    const email = (e) => {
        const selectedFile = e.target.value;
        Changemail(selectedFile)
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const showform = async (e) => {
        const form=document.querySelector(".profileupform").classList.toggle("myStyle");
        }
        const uploadimage = async (e) => {
            const form=document.querySelector(".upload").classList.toggle("myStyle");
            }


        
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;
        setloader(true)
        const formData = new FormData();
        formData.append('file', file);

            await axios.post('http://localhost:3001/upload',formData,{
                headers:{
                    "Authorization":localStorage.getItem("token")
                    }
            }).then((data)=>{
                if(data.data.success){
                    setloader(false)
                   alert(data.data.message);
                    const form=document.querySelector(".upload").classList.toggle("myStyle");;
        
                    Navigate("/myprofile")
                }
                else{
                    alert("error is"+data.data.error);
 
                }
            });
           
        
    }
    const handleprofile = async (e) => {
        setloader(true)
        e.preventDefault();
        
        /* updating title of product with id 1 */
fetch('http://localhost:3001/change/profile', {
  method: 'POST', /* or PATCH */
  headers: { 'Content-Type': 'application/json',       
     "Authorization":localStorage.getItem("token")
  },
  body: JSON.stringify({
    "name":names||data.name,
    "emailid":emails||data.emailid
  })
})
.then(res => res.json())
.then((data)=>{
    if(data.success){
        setloader(false)
        alert(data.message)
    }
    else{
        setloader(false)
        alert(data.message)

    }
});
const form=document.querySelector(".profileupform").classList.toggle("myStyle");

            Navigate("/myprofile")
        
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
 return (
        <>
        {loader?<div><div class="loader"></div>
            <div className="loadtime">
<Navbar user={data} url={url}></Navbar>
<div className="photo">

            <img src={image} alt=""  className="image"/>
            <h2>Name: {data.name}</h2>
            <h2>Email id: {data.emailid}</h2>


        <form onSubmit={handleprofile} className='profileupform myStyle'>
            <h4 className="up">update profile</h4>
            <p onClick={showform} className='p'>&times;</p>
            <input type="text" name='name'  placeholder='ENTER NAME.' className="upuser" onChange={Name} /><br />
            <input type="email" name='emailid' placeholder='ENTER EMAIL.' className="upuser"  onChange={email} /><br />
            <button type="submit" className='updatebtn'>Update</button><br />

        </form>


            <form onSubmit={handleSubmit}  className="upload update myStyle">
            <h2 className="up">upload image</h2>
            <input type="file" className="upload"  onChange={handleFileChange}/><br />
            <button type="submit" className="uplaodbtn">Upload</button><br /><br /><br />
            </form>
            <button className="uplaodbtn" onClick={uploadimage} >Update Image</button>
            <button className="uplaodbtn" onClick={showform} >Update Profile</button>
</div>
</div></div>: <div>
<Navbar user={data} url={url}></Navbar>
<div className="photo">

            <img src={image} alt=""  className="image"/>
            <h2>Name: {data.name}</h2>
            <h2>Email id: {data.emailid}</h2>


        <form onSubmit={handleprofile} className='profileupform myStyle'>
            <h4 className="up">update profile</h4>
            <p onClick={showform} className='p'>&times;</p>
            <input type="text" name='name'  placeholder='ENTER NAME.' className="upuser" onChange={Name} /><br />
            <input type="email" name='emailid' placeholder='ENTER EMAIL.' className="upuser"  onChange={email} /><br />
            <button type="submit" className='updatebtn'>Update</button><br />

        </form>


            <form onSubmit={handleSubmit}  className="upload update myStyle">
            <h2 className="up">upload image</h2>
            <input type="file" className="upload"  onChange={handleFileChange}/><br />
            <button type="submit" className="uplaodbtn">Upload</button><br /><br /><br />
            </form>
            <button className="uplaodbtn" onClick={uploadimage} >Update Image</button>
            <button className="uplaodbtn" onClick={showform} >Update Profile</button>
</div>
</div>   
        }
        </>
    )
}
}

export default Myprofile