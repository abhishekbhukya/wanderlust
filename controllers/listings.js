const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});
const {cloudinary} = require('../cloudConfig.js');

module.exports.index = async (req, res) => {
    let filter = {}; // initialize an empty filter object
    
    // Extract search and category parameters from query
    const { destination, category } = req.query;

    // Add search criteria if provided
    if (destination) {
        // Split the search term on commas and spaces
        const terms = destination.split(/[\s,]+/).filter(term => term.trim() !== '');

        // Create conditions to match any term with either the country or location fields
        filter.$or = terms.map(term => ({
            $or: [
                { country: new RegExp(term, 'i') }, // Match term in country (case-insensitive)
                { location: new RegExp(term, 'i') } // Match term in location (case-insensitive)
            ]
        }));
    }

    // Add category to filter if it exists
    if (category) {
        filter.category = category;
    }

    try {
        // Find listings based on the constructed filter object
        const allListings = await Listing.find(filter);
        
        // Render the listings page with the filtered results
        res.render("listings/index.ejs", { allListings });
    } catch (error) {
        console.error(error);
        req.flash("error", "Could not retrieve listings.");
        res.redirect("/listings");
    }
};
//you can take its explanation from chatgpt

module.exports.renderNewForm = async(req,res)=>{
    //console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({ path : "reviews", 
        populate: {
            path: "author",
        },
        }
    )
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    // console.log(listing);

    let response = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
    })
    .send();
    listing.geometry = response.body.features[0].geometry;

    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req,res,next)=>{
    
    let response = await geocodingClient.forwardGeocode({
        // query: 'New Delhi, India',
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
        
    //   console.log(response.body.features[0].geometry);
    //   res.send("done!");

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
//console.log(savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    let originalImageFilename = listing.image.filename;
    originalImageFilename = originalImageFilename;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    // let originalCoordinates = listing.geometry.coordinates;

    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing.");
    // }
    const {id}= req.params;

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstruct

    const updatedLocation = req.body.listing.location;


    // console.log(updatedLocation);
    // console.log(listing.location);
    

    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;

    if (listing.image.filename !== filename) {
        // If the filename has changed, delete the old image from Cloudinary
        await cloudinary.uploader.destroy(listing.image.filename);
        // console.log(`Deleted old Cloudinary image: ${listing.image.filename}`);
    }

    listing.image = {url, filename};

    // Check if the location has been updated

    

    if (updatedLocation !== listing.location) {
        try {


            // const { location } = req.body.listing;
    if (updatedLocation) {
        const coordinates = await mapbox.geocodeForward(updatedLocation).send();
        listing.coordinates = coordinates.body.features[0].geometry.coordinates;
        await listing.save();
    }
            // // Geocode the new location
            // const response = await geocodingClient
            //     .forwardGeocode({
            //         query: updatedLocation,
            //         limit: 1,
            //     })
            //     .send();

            // const features = response.body.features;
            // if (features.length > 0) {
            //     listing.geometry.coordinates = features[0].geometry.coordinates; // Update geometry with new coordinates
            //     listing.geometry = {
            //         type: 'Point',
            //         coordinates: listing.geometry.coordinates, // update the coordinates
            //     };
            //     listing.location=updatedLocation;
            // } 
            else {
                req.flash('error', 'Could not find coordinates for the updated location.');
                return res.redirect(`/listings/${id}/edit`);
            }
        } catch (error) {
            console.error('Error during geocoding:', error);
            req.flash('error', 'Failed to update location. Please try again.');
            return res.redirect(`/listings/${id}/edit`);
        }
    }


    await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
