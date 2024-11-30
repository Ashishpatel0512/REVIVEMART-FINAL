import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import "./index.css";
import Example from "./component/Home";
import Show from "./component/Show";
import Mybids from "./component/Mybids";
import Login from "./component/login";
import Myproduct from "./component/Myproduct";
import DeleteProduct from "./component/Deleteproduct";
import Update from "./component/Update"
import Myprofile from "./component/Myprofile";
import Showbids from "./component/showbids";
import Products from "./component/Products";
import Approve from "./component/Approve";
import Reject from "./component/Reject";
import Users from "./component/Users";
import Block from "./component/Block";
import Resister from "./component/Resister";
import Logout from "./component/logout";
import Error from "./component/error";
import Unblock from "./component/unblock";
import Forgot from "./component/forgot";
import Ads from "./component/ads";
import Showads from "./component/showads";
import AdsApprove from "./component/adsapprove";
import Adsreject from "./component/adsreject";
import AdminDashbord from "./component/adminDashbord";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />

  },
  {
    path: "/home",
    element: <Example />

  },
  {
    path: "/resister",
    element: <Resister />

  },
  {
    path: "/logout",
    element: <Logout />

  },
  {
    path: "/forgot",
    element: <Forgot />

  },
  {
    path: "/Myproduct",
    element: <Myproduct />

  },
  {
    path: "/show/:productid",
    element: <Show />

  },
  {
    path: "/mybids",
    element: <Mybids />

  },
  {
    path: "/showbids/:productid",
    element: <Showbids />

  },
  {
    path: "/myprofile",
    element: <Myprofile />

  },
  {
    path: "/delete/:productid",
    element: <DeleteProduct />

  },
  {
    path: "/edit/:productid",
    element: <Update />

  },
  {
    path: "/Advertize/:productid",
    element: <Ads/>

  },
  {
    path: "/approve/:productid",
    element: <Approve />

  },
  {
    path: "/ad/approve/:productid",
    element: <AdsApprove/>

  },
  {
    path: "/reject/:productid",
    element: <Reject />

  },
  {
    path: "/ad/reject/:productid",
    element: <Adsreject />

  },
  {
    path: "/block/:userid",
    element: <Block />

  },
  {
    path: "/unblock/:userid",
    element: <Unblock/>

  },
  {
    path: "/admin/Products",
    element: <Products />

  },
  {
    path: "/admin/Users",
    element: <Users />

  },
  {
    path: "/showads",
    element: <Showads/>

  },
  {
    path: "/error",
    element: <Error />

  },
  {
    path: "/admin",
    element: <AdminDashbord />

  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);