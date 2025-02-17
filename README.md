## **Technologies Used**

- **Backend**: NestJS, Mongoose, MongoDB (executed via Docker).
- **Database**: MongoDB.
- **Infrastructure**: Docker Compose to orchestrate services.

---

## **How to Run the Backend**

### **1. Prerequisites**

Make sure you have the following tools installed:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### **2. Environment Configuration**

1. Clone the repository:

   ```bash
   git clone https://github.com/gabrielpellizzon/seller-project.git

   ```

2. Set up the .env file:
   - Copy the .env.example file to .env
   - Edit the environment variables as needs (database credentials, ports, etc).

### **3. Running the Backend**

1. Navigate to the root folder:

   ```bash
   cd seller-project
   ```

2. Start the Docker container with the database:

   ```bash
   docker-compose up -d --build
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm run start:dev
   ```

## Project Structure

```plaintext
seller-project/
│ └── src/
│ └── test/
│ └── .env.example
│ └── docker-compose.yml
│ └── Dockerfile
│ └── package.json
│ └── package-lock.json/
│ └── README.md
│ └── .gitignore
│ └── .dockerignore
└──
```
