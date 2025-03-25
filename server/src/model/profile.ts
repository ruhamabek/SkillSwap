import mongoose from "mongoose"

const profileSchema = new mongoose.Schema({
     title:{
          type: String,
          required: true
     } ,
     university:{
          type: String,
          required: true
     },
    location:{
         type: String,
         required: true,
    },
    bio: {
         type: String,
         required: true
    },
     skillsToTeach: {
           type: [String],
           required: true
     },
     skillsToLearn: {
           type: [String],
           required: true
     }
 });
 const Profile = mongoose.model('Profile', profileSchema, 'my_custom_collection_name');

 export default Profile;