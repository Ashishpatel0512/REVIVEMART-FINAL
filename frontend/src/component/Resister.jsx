import { useEffect, useState } from "react"
import { Navigate,Link } from "react-router-dom";
import './login.css'


function Resister() {
  const [names, Changname] = useState(null);
  const [emails, Changemail] = useState(null);
  const [passwords, Changpassword] = useState(null);

  const [success, Changsuccess] = useState(null);

  const name = (e) => {
    const selectedFile = e.target.value;
    Changname(selectedFile)
  };
  const emailid = (e) => {
    const selectedFile = e.target.value;
    Changemail(selectedFile)
  };
  const password = (e) => {
    const selectedFile = e.target.value;
    Changpassword(selectedFile)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch('http://localhost:3001/resister', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "name": names,
        "emailid": emails,
        "password": passwords
      })
    })
      .then(res => res.json())
      .then((data) => {
        Changsuccess(data.success)
        if (data.success) {
          alert(data.message)


        }
        else {
          alert(data.message)
        }

      }
      );




  }
  return (
    <>
    <div className="body">
      {success == true ? <Navigate to="/" replace={true} /> : <form onSubmit={handleSubmit} className="login">
      <h3 className="revive">ReviveMart - <b className="logtitle">Register</b></h3>

        <input type="text" name='emailid' className="log" onChange={name} placeholder="Your Name" required /><br />
        <input type="email" name='emailid' className="log" onChange={emailid} placeholder="Your Email" required/><br />
        <input type="password" name='password' className="log" onChange={password} placeholder="Password" required /><br />
        <button type="submit" className="regbtn">Register</button><br />
        <Link to={"/"} className="loglink">Already have an account? login</Link><br />

      </form>}
      </div>


    </>
  )
}

export default Resister