
import { useEffect,useState } from "react"
import { useParams,Navigate } from "react-router-dom"
import axios from 'axios';


function Update(){
    const [file, setFile] = useState(null);
    
    const [file2, setFile2] = useState(null);

    const [names,Changname]=useState(null);
    const [descriptions,Changdescription]=useState(null);
    const [prices,Changprice]=useState(null);
    const [ages,Changages]=useState(null);
    const [locations,Changlocation]=useState(null);
    const [catagorys,Changcatagory]=useState(null);

    const [others,Changother]=useState(null);
    
    let {productid}=useParams();
    const [data,setdata]=useState([]);
    const [success,setsuccess]=useState(null);
    const [url,seturl]=useState([]);
    const [loader,setloader] = useState(false);

    useEffect(()=>{
        fetch(`http://localhost:3001/edit/${productid}`,{
            headers:{
                "Authorization":localStorage.getItem("token")


            }
        })
        .then(res => res.json())
        .then((data)=>{
            setdata(data.data);
            seturl(data.data.image[0].url)
        }
        );
      },[])


  //update
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
     // Debug: check if the file is selected
};
const handleFileChanges = (e) => {
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
    Changages(selectedFile)
};
const location = (e) => {
    const selectedFile = e.target.value;
    Changlocation(selectedFile)
};
const catagory = (e) => {
    const selectedFile = e.target.value;
    Changcatagory(selectedFile)
};
const other = (e) => {
    const selectedFile = e.target.value;
    Changother(selectedFile)
};
// Function to handle file upload
const handleSubmit = async (e) => {
    e.preventDefault();
    setloader(true)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file2', file2);

    formData.append('name', names||data.name);
    formData.append('description', descriptions||data.description);
    formData.append('price', prices||data.price);
    formData.append('catagory',catagorys||data.catagory);
    formData.append('age', ages||data.age);
    formData.append('location', locations||data.location);
    formData.append('other', others||data.other);


    try {
         axios.post(`http://localhost:3001/update/${productid}`,formData,{
            headers:{
                "Authorization":localStorage.getItem("token")

            }
        }).then((data)=>{
            if(data.data.success){
                setloader(false)
            alert(data.data.message);
            setsuccess("true");
            }
            else{
                alert("error is"+data.data.error)
            }
        });
        
        
    } catch (error) {
        console.error("File update error:", error);
    }
};
    return (
        
        <>
    {loader?<div><div className="loader"></div><div className="loadtime">{success=="true"?<Navigate to="/myproduct" replace={true} />:
        <div>
            <h1>Edit Product</h1>
        <form onSubmit={handleSubmit} className="form">
            <input type="text" name='name' value={names==null?data.name:names}  onChange={Name} required/><br />
            <input type="text" name='description' value={descriptions==null?data.description:descriptions} onChange={description} required/><br />
            <input type="text" name='price' value={prices==null?data.price:prices} onChange={price} required/><br />
            <input type="text" name='age'   value={ages==null?data.age:ages}  onChange={age} required/><br />
            <input type="text" name='location' value={locations==null?data.location:locations} onChange={location}required/><br />
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
            {/* <input type="text" name='other'value={others==null?data.other:others} onChange={other} /><br /> */}
            {/* <img src={url} alt="" className="formimg" /><br /> */}
            <input type="file" onChange={handleFileChange}  /><br />
            <input type="file" onChange={handleFileChanges}  /><br />

            <button type="submit" className="updatebtn">Update</button><br />
        </form>
        </div>
        
}</div></div>:


        <div>
        {success=="true"?<Navigate to="/myproduct" replace={true} />:
        <div>
            <h1>Edit Product</h1>
        <form onSubmit={handleSubmit} className="form">
            <input type="text" name='name' value={names==null?data.name:names}  onChange={Name} required/><br />
            <input type="text" name='description' value={descriptions==null?data.description:descriptions} onChange={description} required/><br />
            <input type="text" name='price' value={prices==null?data.price:prices} onChange={price} required/><br />
            <input type="text" name='age'   value={ages==null?data.age:ages}  onChange={age} required/><br />
            <input type="text" name='location' value={locations==null?data.location:locations} onChange={location}required/><br />
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
            {/* <input type="text" name='other'value={others==null?data.other:others} onChange={other} /><br /> */}
            {/* <img src={url} alt="" className="formimg" /><br /> */}
            <input type="file" onChange={handleFileChange}  /><br />
            <input type="file" onChange={handleFileChanges}  /><br />

            <button type="submit" className="updatebtn">Update</button><br />
        </form>
        </div>
        
}
</div>
}
        </>
    )
}

export default Update