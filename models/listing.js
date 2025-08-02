const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");
const {cloudinary} = require('../cloudConfig.js');


const listingSchema = new Schema({
    title: { 
        type: String,
        required: true,
    },
    description: String,
    image: {
        // type: String,
        // default: "https://plus.unsplash.com/premium_photo-1664116928361-2972cf5d6848?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

        // set: (v) =>
        //     v===""
        //         ?"https://plus.unsplash.com/premium_photo-1664116928361-2972cf5d6848?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        //         : v,  
        url: {
            type:String,
            default: "https://plus.unsplash.com/premium_photo-1680028256635-17e7f3ebbb23?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) =>
            v===""
                ?"https://plus.unsplash.com/premium_photo-1680028256635-17e7f3ebbb23?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v,  
        },
        filename: String, 
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, //Don't do `{location: {type: String}}`
            enum: ['Point'], // "location.type" must be a point.
            required: true,
        },
          coordinates:{
            type: [Number],
            required: true,
          },
    },
    category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"],
        default: "Rooms",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing && listing.image && listing.image.filename){
        try{
            await Review.deleteMany({_id: {$in: listing.reviews}});
            await cloudinary.uploader.destroy(listing.image.filename); //deletes image from cloudinary
            // console.log(`Deleted Cloudinary image: ${listing.image.filename}`);
        }
        catch(err){
            console.error('Error deleting image from Cloudinary:', err);
        }
    }
});

// // The pre-hook for updating the listing image
// listingSchema.pre("findOneAndUpdate", async function (next) {
//     try {
//         const update = this.getUpdate();
//         const id = this.getQuery()._id; // Get the listing ID

//         // Fetch the existing listing
//         const listing = await mongoose.model("Listing").findById(id);

//         // Check if a new image is being uploaded
//         if (listing.image.url && listing.image.filename && originalImageFilename !== listing.image.filename) {
//             // Delete the old image from Cloudinary
//             await cloudinary.uploader.destroy(originalImageFilename);
//             console.log(`Deleted old Cloudinary image: ${originalImageFilename}`);
//         }

//         next(); // Proceed with the update
//     } catch (err) {
//         console.error("Error during image update in Cloudinary:", err);
//         next(err); // Proceed with the error handling
//     }
// });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
