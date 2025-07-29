### Technologies Used
- Node.js
- Express.js
- TypeScript
- zod
- MongoDB
- Mongoose
- dotenv

### How to Run the Project Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/faisal-akbar/node-express-starter.git
   ```
2. Navigate to the project directory:
   ```bash
    cd node-express-starter
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory and add your MongoDB connection string:
    ```plaintext
    PORT=5000
    DB_URL=mongodb+srv://<db_user>:<db_password>@cluster0.4pnfxkm.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster0
    NODE_ENV=development

    replace <username> and <password> with your MongoDB credentials.
    ```
5. Start the development server:
    ```bash
    npm run dev
    ```
6. The API will be running on `http://localhost:5000`.