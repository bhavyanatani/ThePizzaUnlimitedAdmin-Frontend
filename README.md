# 🍕 Pizza Unlimited – Client Frontend
**Live Site:** https://the-pizza-unlimited-client-frontend-three.vercel.app/ 
**Backend Repo:** https://github.com/bhavyanatani/ThePizzaUnlimited-Backend  
**Admin Repo:** https://github.com/bhavyanatani/ThePizzaUnlimitedAdmin-Frontend

## 🧩 Overview
Pizza Unlimited is a full-stack restaurant ordering platform built with **Next.js**, featuring menu browsing, cart management, order placement, and table reservations. It includes real-time order status updates, secure authentication, and a fully responsive modern UI.

## 🚀 Features
- 🍽️ Menu browsing with item details  
- 🛒 Add to cart, update quantities, checkout  
- 📅 Table reservation system  
- 🔄 Reorder & cancel orders  
- 📊 Real-time order status updates (polling)  
- 💰 GST & service fee calculation  
- 🔐 Clerk authentication  
- 🖼️ Cloudinary image optimization  
- 📱 Fully responsive UI  

## 🛠️ Tech Stack
- **Frontend:** Next.js, React.js, Tailwind CSS, shadcn/ui, Framer Motion  
- **Authentication:** Clerk  
- **Media:** Cloudinary  
- **Backend:** Express.js + Node.js  
- **Database:** MongoDB  

## ⚙️ Setup Instructions
1️⃣ Clone the repository  
git clone https://github.com/bhavyanatani/ThePizzaUnlimitedClient-Frontend 
cd <project_folder>  

2️⃣ Install dependencies  
npm install  

3️⃣ Add environment variables  
Create a `.env.local` file and add:  
NEXT_PUBLIC_API_BASE_URL=<your_backend_url>  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_key>  
CLERK_SECRET_KEY=<your_key>  
CLOUDINARY_CLOUD_NAME=<your_cloud_name>  

4️⃣ Run the development server  
npm run dev  
The app will run at **http://localhost:3000**

## ⚠️ Note
Backend and Admin dashboard may take a few seconds to respond if deployed on free-tier hosting.

## 🧑‍💻 Author
**Bhavya Natani**
