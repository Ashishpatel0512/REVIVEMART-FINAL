import { Link, useParams,Navigate } from 'react-router-dom'
import './Show.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function Show() {
 
  let { productid } = useParams();

  const [product, setproduct] = useState([])
  const [user, setuser] = useState([])
  const [users, setusers] = useState([])
  const [url, seturl] = useState("")
    const [url2, seturl2] = useState("")
    const [showurl, setshowurl] = useState("")

  const [bidamounts,Changamount]=useState(null);
  const [messages,Changmessage]=useState(null);
  const [buyers,Changbuyer]=useState(null);
  const [contacts,Changcontact]=useState(null);
  const [sellers,Changseller]=useState(null);
  const [urls,seturls]=useState(null);


  useEffect(() => {
    fetch(`http://localhost:3001/listings/${productid}`,{
      headers: { 
          "Authorization":localStorage.getItem("token")
     }
      
    })
      .then(res => res.json())
      .then((listing) => {
        setproduct(listing.data)
        setuser(listing.data.User[0])
        setusers(listing.user)
        seturls(listing.user.image.url)
 setshowurl(listing.data.image[0].url)
        seturl(listing.data.image[0].url)
        seturl2(listing.data.image[1].url)

      });
  }, [])

  const bidamount = (e) => {
    const selectedFile = e.target.value;
    Changamount(selectedFile)
};
const message = (e) => {
    const selectedFile = e.target.value;
    Changmessage(selectedFile)
};
const buyer = (e) => {
    const selectedFile = e.target.value;
    Changbuyer(selectedFile)
};
const contact = (e) => {
    const selectedFile = e.target.value;
    Changcontact(selectedFile)
};

const showform = async (e) => {
  const form=document.querySelector(".bidform").classList.toggle("myStyle");;

 }
 const imgchange2 = async (e) => {
  setshowurl(url2);
 }
 const imgchange1 = async (e) => {
  setshowurl(url);
 }

// Function to handle file upload
const handleSubmit = async (e) => {
    e.preventDefault();

    // const formData = new FormData();
    // formData.append('bidamount', bidamounts);
    // formData.append('message', messages);
    // formData.append('buyer', buyers);
    // formData.append('contact', contacts);
    // formData.append('seller', sellers);


    try {
        await axios.post(`http://localhost:3001/listings/bidings/${productid}`,{
          bidamounts,
          messages,
          buyers,
          contacts,
          sellers:user.name
        },{
            headers:{
                "Authorization": localStorage.getItem("token")

            }
        });
        alert("bid uploaded successfully");
         const form=document.querySelector(".bidform").classList.toggle("myStyle");
         <Navigate to="/show" replace={true} />

        // Navigate("/Myproduct")
    } catch (error) {
        console.error(" upload error:", error);
    }
};

  return (
    <>
    <Navbar user={users}  url={urls}></Navbar>
      <div className="grid-container">
        <div className='first' >
          <img className='img' src={showurl} alt="" /><br />
          <img className='img1' src={url} alt="" onClick={imgchange1} />
          <img className='img1' src={url2} alt="" onClick={imgchange2} /><br />

          <p className='date'>Added On</p>
          <p className='date'>{product.createAt}</p>
        </div>
        <div className='detailsdata'>

          <h3 className='nametitle'>{product.name}</h3><hr />
          <h5 className='show-product-sub-titile'>Details</h5>
          <p className="show-product-text">price: {product.price}</p>
          <p className="show-product-text">catagories: {product.catagory}</p>
          <p className="show-product-text">other: {product.other}</p>
          <p className="show-product-text">location: {product.location}</p>
          <hr />
          <h5 className='show-product-sub-titile'>Description</h5>
          <p className="show-product-text">{product.description}</p>
          <hr />
          <h5 className='show-product-sub-titile'>OwnerInfo</h5>
          <p className="show-product-text">emailid: {user.emailid}</p>
          <p className="show-product-text">user: {user.name}</p>
          <hr />
          <form action="" className='bidform myStyle' onSubmit={handleSubmit}>
            <h4>Add Bids</h4>
          <p onClick={showform} className='p'>&times;</p>
            <input type="number" name='bidamount' placeholder='enter bid amount' onChange={bidamount} required/>
            <input type="text" name='message' placeholder='enter massage' onChange={message} required/>
            {/* <input type="text" name='buyer' placeholder='enter your name' onChange={buyer} required/> */}
            <input type="number" name='contact'placeholder='enter your mo no..' onChange={contact} required/>
            <input type="submit" className='bidbtn' value="submit"/>
          </form>



             {users.role=="Admin"?<button onClick={showform} className='newbids' disabled> New Bids</button>
  :
            <button onClick={showform} className='newbids'>New Bids</button>
              }
            </div>
      </div>

    </>

  )
}

export default Show