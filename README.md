# 🏡 Wanderlust – Airbnb Clone

**Wanderlust** is a full-stack web application inspired by Airbnb, built using Node.js, Express.js, MongoDB, EJS, and CSS. It allows users to browse, list, and filter properties, with features like user authentication, reviews, category filtering, and responsive design. This project was developed as part of the **MERN Stack Development Course** at **Apna College**, under the mentorship of **Shardha Kapra** and **Aman Dattarwala**.

---

## 🌟 Features

- 🔐 **User Authentication** – Secure session-based login and signup using Passport.js.
- 🏠 **Property Listings** – Add, update, and delete listings with image uploads.
- 🗂️ **Category Filtering** – Filter properties by type (e.g., rooms, farms, trending).
- 🔎 **Search by City or Location** – Quickly find properties by typing city names.
- 📝 **User Reviews and Ratings** – Post and read reviews to make informed choices.
- 📱 **Responsive Design** – Works across all screen sizes (mobile to desktop).

---

## 💻 Tech Stack

| Layer       | Technology       |
|-------------|------------------|
| **Frontend** | EJS, HTML, CSS     |
| **Backend**  | Node.js, Express.js |
| **Database** | MongoDB (Atlas)   |
| **Auth**     | Passport.js       |
| **Storage**  | Cloudinary        |
| **Map & Geo**| Mapbox            |

---

## 🚀 Getting Started

**🚀 How to Install and Run Locally**

Clone the Repository:

```git clone https://github.com/your-username/wanderlust.git```

Navigate to the Project Directory:

```cd wanderlust```

Install Dependencies:

```npm install```

**Set Up Environment Variables:**

Create a .env file in the root directory and add the following:

CLOUD_NAME=your_cloud_name_here

CLOUD_API_KEY=your_cloud_api_key_here

CLOUD_API_SECRET=your_cloud_api_secret_here

MAP_TOKEN=your_mapbox_access_token_here

ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority

SECRET=your_secret_code_here

Run the Application:

```npm start``` 

**📈 Future Enhancements**

💳 Payment Integration – Add online payment gateway for bookings.

🧠 Recommendation Engine – Suggest listings based on user behavior.

**📚 Acknowledgements**

🙏 Thanks to Apna College and mentors Shardha Kapra & Aman Dattarwala for their guidance during the MERN Stack course.

💡 Inspired by Airbnb
