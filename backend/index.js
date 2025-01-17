require('dotenv').config();

var cors = require('cors')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const mongoose = require("mongoose");
const Users = require("./modules/user.js");
const Otp = require("./modules/otp.js");

const Listing = require("./modules/listings.js");
const biding = require("./modules/biding.js");
const Notify = require("./modules/notification.js");
const Ads = require("./modules/ads.js");
const path = require("path");
const methodoverride = require("method-override");
const engine = require('ejs-mate');
const { register } = require('module');
var cookieParser = require('cookie-parser')
const multer = require('multer')
const { storage } = require("./cloudConfig.js")
const upload = multer({ storage })
const session = require("express-session")
const MongoStore = require('connect-mongo');
const wrapAsync = require("./utils/wrapAsyc.js")
const ExpressError = require("./utils/ExpressError.js");
const listRoute = require("./routers/indexrouter.js");
const { receiveMessageOnPort } = require('worker_threads');
const flash = require("connect-flash");

const passport = require("./config/passport");
const pass = require("passport");
const { error } = require('console');
const sendMail = require("./config/sendmail.js")


const url = process.env.ATLASDB_URL;


main().then(() => {
  console.log("connected to database");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Revivemart');
}



app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());
app.use(passport.initialize())




const corsOptions = {
  // Only allow GET and POST requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));
mongoose.set('strictPopulate', false)


// const store= MongoStore.create({
//   mongoUrl: url,
//   crypto: {
//     secret: process.env.SECRET
//   },
//   touchAfter:24*3600
// })

// store.on("error",()=>{
//   console.log("error in mongo store",err)
// })

const sessionOption = {
  // store,
  secret: process.env.SECRET || "hello",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}




app.use(session(sessionOption));

app.use("/", listRoute)

app.post("/otp", async (req, res) => {

  let { emailid } = req.body;
  console.log(emailid)
  if (!emailid) {
    return res.json({
      success: false, // Proceed to password change
      message: "email is required!"
    });
  }
  const user = await Users.findOne({ emailid: emailid })
  if (!user) {
    return res.json({
      success: false, // Proceed to password change
      message: "emailid is not found!"
    });
  }
  async function generateOtp(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    // Remove any existing OTP for the email
    await Otp.deleteMany({ email });

    // Create a new OTP entry
    await Otp.create({ email, otp });

    sendMail(otp, email)
    console.log(`OTP for ${email}: ${otp}`);
    res.json({ success: true, email })
  }
  generateOtp(emailid)

})

app.post("/verify", (req, res, next) => {
  try {
    let { emailid, otp } = req.body;
    console.log(otp)
    console.log(emailid)

    async function verifyOtp(email, inputOtp) {
      const otpRecord = await Otp.findOne({ email, otp: inputOtp });

      if (otpRecord) {
        console.log('OTP verified');
        // Remove the OTP document after verification
        await Otp.deleteOne({ _id: otpRecord._id });
        return res.json({ success: true, email });
      }
      else {
        console.log('Invalid or expired OTP');
        return res.json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }
    }
    verifyOtp(emailid, otp);
  } catch (error) {
    next(error)
  }

})

// change password

app.post("/forgot/password", (req, res) => {
  let { emailid, password } = req.body;

  if (!emailid || !password) {
    return res.json({
      success: false,
      message: "emailid && password is empty please fill now"
    })
  }
  else {
    const salt = bcrypt.genSaltSync(10);
    let update = Users.findOneAndUpdate({ emailid }, { password: bcrypt.hashSync(password, salt) }, {
      new: true,
      upsert: true
    }).then((data) => {
      console.log(data);
      if (!data) {
        return res.json({
          success: false,
          message: "emailid && password is false please try again"
        })
      }
      else {
        res.json({ success: true, message: "password update successfully" })
      }
    })

  }
})
//

// update user profile

// app.post("/change/profile", pass.authenticate("jwt", { session: false }), (req, res) => {
//   let id = req.user._id;
//   let { name, emailid } = req.body;
//   console.log(name, emailid);
//   let user = Users.findByIdAndUpdate(id, { name: name, emailid: emailid }).then((data) => {
//     console.log(data)
//   });
//   res.json({ success: true, message: "update profiles successfully" })
// })
// app.post("/resister", async (req, res) => {

//   try {

//     let { name, emailid, password } = req.body;
//     console.log(name + "," + emailid + "," + password)

//     const salt = bcrypt.genSaltSync(10);

//     let newuser = new Users({
//       name,
//       emailid,
//       password: bcrypt.hashSync(password, salt)
//     })

//     newuser.save().then((data) => {
//       res.status(200).json({
//         success: true,
//         message: "register completed"
//       }
//       )
//     });

//   }
//   catch (error) {
//     res.status(404).json({
//       success: false,
//       message: "somthing went wrong"
//     });
//   }
// })


app.post("/change/profile", pass.authenticate("jwt", { session: false }), async(req, res) => {
  let id = req.user._id;
  let { name, emailid } = req.body;
  console.log(name, emailid);
  const user = await Users.findOne({ emailid: emailid })
   if(!user||emailid==req.user.emailid){
  let user = Users.findByIdAndUpdate(id, { name: name, emailid: emailid }).then((data) => {
    console.log(data)
  });
  res.json({ success: true, message: "update profiles successfully" })
}
else{
  return res.json({ success: false, message: "Emailid is alredy exits" })

}
})
app.post("/resister", async (req, res) => {

  try {

    let { name, emailid, password } = req.body;
    console.log(name + "," + emailid + "," + password)

    const user = await Users.findOne({ emailid: emailid })
  if (!user) {
    const salt = bcrypt.genSaltSync(10);

    let newuser = new Users({
      name,
      emailid,
      password: bcrypt.hashSync(password, salt)
    })

    newuser.save().then((data) => {
      res.status(200).json({
        success: true,
        message: "register completed"
      }
      )
    });
  }
    
else{
  res.status(404).json({
    success: false,
    message: "User already exists!"
  });
}
  }
  catch (error) {
    res.status(404).json({
      success: false,
      message: "somthing went wrong"
    });
  }
})





app.post("/login", wrapAsync(async (req, res, next) => {


  let { emailid, password } = req.body;
  console.log(emailid + "" + password)
  if (emailid == null || password == null) {
    next(new ExpressError(404, "emailid&&password fill please"))
  }
  else {
    let info;
    let admin1 = await Users.find({ emailid, role: "Admin" }).then((data) => {
      console.log(data)
      //new added
      if (data == "") {
        let user = Users.find({ emailid, role: "User" }).then((data) => {
          console.log(data)
          d = data[0];
          console.log(d)
          if (data == "") {
            return res.status(400).json({
              error: "register after login please"
            })
          }
          if (d.status == "Block") {
            return res.status(400).json(
              {
                error: "THIS USER IS BLOCK",
              }
            )
          }
          console.log(data.password)

          if (!(bcrypt.compareSync(password, d.password))) {
            return res.json({ error: "password is incorrect" })
          }

          const token = jwt.sign({ d }, "revivemartcom", { expiresIn: "1d" })
          return res.status(200).json({
            success: true,
            message: "login successgfully",
            token: "Bearer " + token,
            userrole:d.role,
          })

        })
      }
      else {

        let d = data[0];
        //react
        // res.cookie("data", d).redirect("/show");
        if (!(bcrypt.compareSync(password, d.password))) {
          return res.json({ error: "password in incorect" })
        }

        const token = jwt.sign({ d }, "revivemartcom", { expiresIn: "1d" })
        return res.status(200).json({
          success: true,
          message: " admin login successgfully",
          token: "Bearer " + token,
          userrole:d.role,

        })

      }
    })
  }

}));


app.get("/hello", pass.authenticate("jwt", { session: false }), (req, res) => {
  res.send(
    req.user
  );
})


//home page
app.get('/show', pass.authenticate("jwt", { session: false }),
  wrapAsync(async (req, res) => {
    console.log("catagory", req.query.catagory);

    let list;
    let catagory = req.query.catagory;
    let greater = parseInt(req.query.greater, 10);
    let less = parseInt(req.query.less, 10);
    console.log(greater);
    console.log(less);
    if (!isNaN(greater) && !isNaN(less)) {
      list = await Listing.find({ status: "Approve", age: { $gt: greater, $lt: less } });
      console.log("age", list)
    }
    // console.log("this sesssion id....."+req.session.data)
    if (catagory != "undefined") {
      list = await Listing.find({ status: "Approve", catagory: catagory });
      console.log(list)
    }
    if (catagory != "undefined" && (!isNaN(greater) && !isNaN(less))) {
      list = await Listing.find({ status: "Approve", catagory: catagory, age: { $gt: greater, $lt: less } });
      console.log("age", list)
    }
    if (catagory == "undefined" && isNaN(greater)) {
      list = await Listing.find({ status: "Approve" });
      console.log(list)
    }

    console.log(req.user)


    let data = req.user;
    console.log(data);
    if (data == undefined) {

      data = null
    }
    let ads;
    // if(req.session.item){
    let adss = Ads.find().populate("Productid").then((ad) => {
      console.log(ad)
      ads = ad;
      res.json({ list, data, ads })
    })
    //  }
    //  else{
    // req.session.item="null";
    // ads=[];
    // res.json( { list, data,ads })
    // }
  }))

//show page
app.get('/listings/:id', pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let user = req.user;
  let bidings;
  let { id } = req.params;
  let listing = await Listing.findById(id);
  console.log(listing)
  let bids = await biding.find({ "Productid": id }).populate("Productid").then((bid) => {
    console.log("this is bids")
    bidings = bid;
  })
  let users = await Listing.findById(id).populate("User").then((data) => {
    console.log("userrrrrrrr" + data)
    let name = data.name;
    console.log("pppppp" + name);
    //let ads=Ads.find({productname:name}).then((data)=>{
    //console.log("user ads data.................."+data)
    req.session.item = name;
    //})
    //let item=data.image[0].url;
    //req.session.item=item;

    //  res.json(listing)

    res.json({ listing, data, bidings, user })

  });

  // console.log(listing.bidings)

  // let newListing= new Listing({...req.body.listing})
  // newListing.save();
}));


///bidings
app.post("/listings/bidings/:id", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let userid = req.user._id;
  console.log(req.body)
  let d;
  let info;
  // let User = Users.findById(req.params.userid).then((data) => {
  d = req.user;
  // })
  let listing = await Listing.findById(req.params.id).then((ListingData) => {
    info = ListingData;
  })
  let id = req.params.id
  // let bidings = req.body;
  let { bidamounts, messages, buyers, contacts, sellers } = req.body
  console.log(bidamounts, messages, buyers, contacts, sellers)
  let newbidings = new biding({ bidamount: bidamounts, message: messages, buyer: buyers, contact: contacts, seller: sellers, d, listing });
  newbidings.User.push(d);
  newbidings.Productid = info;

  console.log(newbidings)
  // listing.bidings.push(newbidings);
  await newbidings.save()
  // await listing.save()
  // res.redirect(`/listings/${id}`)
  res.json("bids add completed")
}))

// PROFILE..................................................................................................................................

app.get("/user/products", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let userid = req.user._id;
  let user = req.user;

  let product = Listing.find({ "User": userid }).then((data) => {
    console.log(data)

    let adss = Ads.find().populate("Productid").then((ad) => {
      console.log("ad", ad)

      res.json({ userid, data, user, ads: ad })
    })
  })
}));

app.get("/user/mybids", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let userid = req.user._id;
  let user;
  Users.findById(userid).then((users) => {
    console.log(users)
    user = users
  });
  let bids = await biding.find({ "User": userid }).populate({
    path: 'Productid',
    populate: { path: 'User' }
  }).populate('User')
    .then((bid) => {
      console.log(bid);

      // res.render("mybid.ejs", { bid,user })
      res.json({ bid, user })


    })


}))
//show bids
app.get("/showbids/:id", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let { id } = req.params;
  let user = req.user;
  let listing = await biding.find({ "Productid": id }).populate({
    path: 'Productid',
    populate: { path: 'User' }
  }).populate('User').then((data) => {
    console.log(data)
    // res.render("showbids.ejs",{data})
    res.json({ data, user })

  });
}))

app.get("/user/general", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let id = req.user._id;
  await Users.findById(id).then((data) => {
    console.log(data)
    // res.render("general.ejs",{data})
    res.json({ data })

  })

}))
//upload image
app.post('/upload', pass.authenticate("jwt", { session: false }), upload.single('file'), wrapAsync(async (req, res) => {
  console.log(req.file.filename + "," + req.file.path)
  let filename = req.file.filename;
  let url = req.file.path;
  let id = req.user._id;



  let newListing = await Users.findByIdAndUpdate(id)

  newListing.image = { url, filename }
  newListing.save()
  // res.redirect(`/user/general`)    
  res.json({
    success: true,
    message: "Image Upload Successfully"
  })

}))
//admin //
app.get("/products", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let user = req.user;
  let product = await Listing.find().populate("User").then((data) => {
    console.log(data)
    // res.render("admin.ejs", {data})
    res.json({ data, user })

  });

}))

app.put("/approve/:_id", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let { _id } = req.params;

  console.log(_id)
  let product = await Listing.findByIdAndUpdate(_id, { status: "Approve" }).then((data) => {
    console.log(data)
    // res.redirect(`/products`)
    res.json("approve this item")

  })

}))
app.put("/reject/:_id/", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let { _id } = req.params;
  console.log(_id)
  let product = await Listing.findByIdAndUpdate(_id, { status: "Reject" }).then((data) => {
    console.log(data)
    // res.redirect(`/products`)
    res.json("reject this item")
  })

}))


//user data for admin side
app.get("/userdata", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let user = req.user;
  let users = await Users.find({ role: "User" }).then((data) => {
    console.log(data)
    // res.render("users.ejs",{data})
    res.json({ data, user })

  })
}))


//block user and user all listings for admin
app.put("/block/:_id/", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let { _id } = req.params;
  console.log(_id)
  let product = await Users.findByIdAndUpdate(_id, { status: "Block" }).then((data) => {
    // let bids = Listing.findOneAndUpdate({ "User": _id },{status:"block"}).then((bid) => {
    //   console.log(bid);  
    // })
    let bids = Listing.updateMany({ "User": _id }, { $set: { status: 'block' } }).then((bid) => {
      console.log(bid);
    })
    console.log(data)
    // res.redirect("/userdata")
    res.json("user is block")

  })

}))
app.put("/unblock/:_id/", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let { _id } = req.params;
  console.log(_id)
  let product = await Users.findByIdAndUpdate(_id, { status: "Active" }).then((data) => {
    // let bids = Listing.findOneAndUpdate({ "User": _id },{status:"block"}).then((bid) => {
    //   console.log(bid);  
    // })
    let bids = Listing.updateMany({ "User": _id }, { $set: { status: 'pending' } }).then((bid) => {
      console.log(bid);
    })
    console.log(data)
    // res.redirect("/userdata")
    res.json("user is unblock")

  })

}))

app.get("/ads/:productid", pass.authenticate("jwt", { session: false }), wrapAsync((req, res) => {
  let productid = req.params.productid;

  let newads = new Ads({ Productid: productid })
  newads.save()
  // res.redirect("/user/products")
  res.json({
    success: true,
  })

}))
//ads manage admin
app.get("/ad", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let user = req.user;
  let product = await Ads.find().populate("Productid").then((data) => {
    console.log(data)
    // res.render("admin.ejs", {data})
    res.json({ data, user })

  });

}))
//ads approve reject
app.put("/ads/approve/:_id", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let { _id } = req.params;

  console.log(_id)
  let product = await Ads.findByIdAndUpdate(_id, { status: "Approve" }).then((data) => {
    console.log(data)
    // res.redirect(`/products`)
    res.json("approve this item")

  })

}))
app.put("/ads/reject/:_id/", pass.authenticate("jwt", { session: false }), wrapAsync(async (req, res) => {
  let { _id } = req.params;
  console.log(_id)
  let product = await Ads.findByIdAndUpdate(_id, { status: "Reject" }).then((data) => {
    console.log(data)
    // res.redirect(`/products`)
    res.json("reject this item")
  })

}))
//count dashbord admin side 

app.get("/count", pass.authenticate("jwt", { session: false }),async (req, res) => {
  let totaluser;
  let totalproduct;
  let totalads;
  let users = await Users.countDocuments().then((user) => {
    console.log(user);
    totaluser = user;
  });
  let listing = await Listing.countDocuments().then((list) => {
    console.log(list);
    totalproduct = list;
  });
  let ad = await Ads.countDocuments().then((ads) => {
    console.log(ads);
    totalads = ads;
  });
  res.json({
    totaluser, totalproduct, totalads
  });

})

//show ads

app.get("/sponsored", pass.authenticate("jwt", { session: false }),(req,res)=>{
  let ads;
  let adss = Ads.find().populate("Productid").then((data) => {
    console.log("adsdata",data)
    res.json({data})
  })
   
})



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "somethig went wrong please try again"))
})


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "somethings went wrong" } = err;
  //react
  console.log("msg", message)
  // res.status(statusCode).render("error.ejs",{message});
  return res.json({
    success: false,
    error: message
  })
  // res.status(statusCode).json({message});
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})