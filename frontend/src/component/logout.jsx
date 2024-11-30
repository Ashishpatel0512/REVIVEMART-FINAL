import { Navigate } from "react-router-dom";
function Logout(){
    localStorage.removeItem("token");
return(
    <>
    {alert("YOU ARE LOGOUT")}
    <Navigate to="/" replace={true} />
    </>
)
}
export default Logout