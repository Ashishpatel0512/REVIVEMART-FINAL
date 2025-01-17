const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
       name: {
      type:String,
      required: true
       },
       emailid: {
        type:String,
        required: true
      },
      password: {
        type:String,
        required: true
      },
      status: {
        type:String,
        default:"Active"

      },
      role: {
        type:String,
        default:"User"
      },
      image: 
        {
        url:{
          type:String,
        default:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
        },
        filename:{
           type:String,
        default:"image.png"
        }
        }
}
 );


  
module.exports= mongoose.model("Users", userSchema);
