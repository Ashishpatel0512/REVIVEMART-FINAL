import './Nav.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar({user,url}){
    function display(){
        const form=document.querySelector(".dropdown").classList.toggle("myStyle");;

    }

    return(
        
        <>
        <div className='navbar'>
            <h1 className='title'>  <Link to={"/home"} className='title'> ReviveMart</Link></h1>
            <div className='profile' >
            <img src={url} alt="" className='prourl' />&nbsp;&nbsp;
            <p onClick={display}>{user.name}</p>
            </div>
        </div>
        {user.role=="Admin"?
        <div className='dropdown myStyle'><hr />
            <Link to={"/admin"} className='list'>DASHBOARD</Link><br /><br /><hr />
            <Link to={"/admin/products"} className='list'>PRODUCTS</Link><br /><br /><hr />
            <Link to={"/admin/users"} className='list'>USERS</Link><br /><br /><hr />
            <Link to={"/showads"} className='list'>SPONSORED</Link><br /><br /><hr />
            <Link to={"/logout"} className='list'>LOGOUT</Link><br /><br /><hr />

       </div>:
        <div className='dropdown myStyle'><hr />
            <Link to={"/myproduct"} className='list'>MYPRODUCTS</Link><br /><br /><hr />
            <Link to={"/mybids"} className='list'>MYBIDS</Link><br /><br /><hr />
            <Link to={"/myprofile"} className='list'>MYPROFILE</Link><br /><br /><hr />
            <Link to={"/logout"} className='list'>LOGOUT</Link><br /><br /><hr />

       </div>
}
        </>
    )
}

export default Navbar