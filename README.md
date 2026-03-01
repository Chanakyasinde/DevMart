# 🎓 ShopEase – Full Stack E-Commerce with DevOps & CI/CD

**ShopEase** is a full-stack e-commerce web application that simulates a real-world online shopping platform.

The project goes beyond development by implementing:
- DevOps practices  
- Cloud deployment  
- CI/CD automation  

---

## 🎯 Objectives

- Build a production-ready full-stack application  
- Apply **SDLC (Software Development Life Cycle)**  
- Integrate **frontend + backend systems**  
- Containerize applications using Docker  
- Orchestrate using Kubernetes  
- Deploy on AWS cloud  
- Implement **CI/CD pipelines**  
- Automate workflows using Bash scripting  

---

## 🔄 SDLC Approach

1. **Planning**
   - Define requirements and features  

2. **Design**
   - System architecture (Frontend + Backend + DB)  

3. **Development**
   - Build application modules  

4. **Testing**
   - Unit and API testing  

5. **Deployment**
   - Docker + Kubernetes + AWS  

6. **Maintenance**
   - Updates and bug fixes  

---

## 🛍️ Core Functionalities

### 👤 User Features
- User Registration & Login (JWT Authentication)  
- Browse products  
- Search & filter products  
- View product details  
- Add/remove items from cart  
- Place orders  
- View order history  

---

## 🧰 Tech Stack

### 🖥️ Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios

### ⚙️ Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication

### 🗄️ Database
- MongoDB (Mongoose)

---

### 🐳 Docker
- Containerization of frontend and backend  
- Dockerfiles for each service  
- docker-compose for local development  

---

### ☁️ AWS Services
- EC2 → Backend hosting  
- S3 → Frontend hosting  
- MongoDB Atlas → Database  
- IAM → Access management  

---

### 🖥️ Bash Scripting
- Automate build and deployment  
- Environment setup scripts  

---

## 🔁 CI/CD Pipeline

CI/CD is implemented to automate the development workflow:

### 🔹 Continuous Integration (CI)
- Code pushed to GitHub  
- Automated build triggered  
- Run tests (frontend + backend)  

### 🔹 Continuous Deployment (CD)
- Build Docker images  
- Push images to container registry  
- Deploy to AWS using Kubernetes  

**Tools Used:**
- GitHub Actions (CI/CD pipeline)
- Docker Hub / AWS ECR (Image storage)

---

## 📂 Project Structure

```bash
shopease/
├── client/                     # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── scripts/                    # Bash scripts
│   ├── build.sh
│   ├── deploy.sh
│
├── .github/workflows/          # CI/CD pipeline
│   └── ci-cd.yml
│
└── Idea.md
│
└── README.md