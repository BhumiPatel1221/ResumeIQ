# ResumeIQ — Deployment Guide

> Steps to deploy the ResumeIQ backend to production (Render, AWS EC2, or similar).

---

## Option 1: Deploy to Render (Recommended — Free Tier)

### Steps

1. **Push code to GitHub** (ensure `.env` is in `.gitignore`)

2. **Create a Render account** at [render.com](https://render.com)

3. **Create a new Web Service**
   - Connect your GitHub repository
   - Set **Root Directory** to `backend`
   - Set **Build Command** to `npm install`
   - Set **Start Command** to `npm start`
   - Set **Environment** to `Node`

4. **Add Environment Variables** in Render dashboard:

   | Key               | Value                              |
   | ----------------- | ---------------------------------- |
   | `PORT`            | `5000`                             |
   | `NODE_ENV`        | `production`                       |
   | `MONGO_URI`       | Your MongoDB Atlas connection string |
   | `JWT_SECRET`      | A strong random string             |
   | `JWT_EXPIRES_IN`  | `7d`                               |
   | `OPENAI_API_KEY`  | `sk-...`                           |
   | `OPENAI_MODEL`    | `gpt-4o-mini`                      |
   | `CORS_ORIGIN`     | Your frontend URL                  |
   | `MAX_FILE_SIZE_MB`| `5`                                |

5. **Deploy** — Render will automatically build and deploy

---

## Option 2: Deploy to AWS EC2

### Steps

1. **Launch an EC2 instance** (Ubuntu 22.04, t2.micro free tier)

2. **SSH into the instance**
   ```bash
   ssh -i your-key.pem ubuntu@<public-ip>
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install MongoDB** (or use MongoDB Atlas)
   ```bash
   # For local MongoDB:
   sudo apt-get install -y mongodb
   sudo systemctl start mongodb
   ```

5. **Clone and set up the project**
   ```bash
   git clone <repo-url>
   cd backend
   npm install
   ```

6. **Create `.env` file**
   ```bash
   nano .env
   # Paste all environment variables
   ```

7. **Install PM2 for process management**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name resumeiq-backend
   pm2 startup
   pm2 save
   ```

8. **Set up Nginx reverse proxy**
   ```bash
   sudo apt-get install -y nginx
   ```

   Create config:
   ```nginx
   # /etc/nginx/sites-available/resumeiq
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_cache_bypass $http_upgrade;

           # File upload limit
           client_max_body_size 10M;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/resumeiq /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## MongoDB Atlas (Cloud Database)

For production, use **MongoDB Atlas** instead of a local MongoDB instance:

1. Create a free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your server IP (or use `0.0.0.0/0` for Render)
4. Get the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resumeiq?retryWrites=true&w=majority
   ```
5. Set this as `MONGO_URI` in your environment variables

---

## Production Considerations

### 1. Environment

```
NODE_ENV=production
```

- Disables stack traces in error responses
- Enables production optimizations in Express

### 2. File Uploads in Production

On platforms like Render (ephemeral filesystem), uploaded files are lost on redeploy. For production:

- Use **AWS S3** or **Cloudinary** for file storage
- Update Multer config to use `multer-s3` or similar

### 3. Logging

Add structured logging for production:

```bash
npm install winston
```

### 4. Health Checks

The `/api/health` endpoint can be used by:
- Load balancers
- Monitoring services (UptimeRobot, Pingdom)
- Render's health check configuration

### 5. Security Hardening

```bash
npm install helmet express-rate-limit
```

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

### 6. CORS in Production

Update `CORS_ORIGIN` to your actual frontend URL:

```
CORS_ORIGIN=https://resumeiq.yourdomain.com
```

---

## Deployment Checklist

| Item                                    | Status |
| --------------------------------------- | ------ |
| Environment variables configured        | ☐      |
| MongoDB Atlas connection working        | ☐      |
| OpenAI API key valid                    | ☐      |
| CORS origin set to frontend URL         | ☐      |
| NODE_ENV set to production              | ☐      |
| SSL/HTTPS enabled                       | ☐      |
| File upload storage solution decided    | ☐      |
| Health check endpoint accessible        | ☐      |
| PM2 or similar process manager running  | ☐      |
| Monitoring/logging configured           | ☐      |

---

## Interview Explanation

> "For deployment, I'd use Render for quick hosting or AWS EC2 for more control. The backend uses environment variables for all secrets, which are configured in the hosting dashboard. MongoDB Atlas provides a cloud database. PM2 manages the Node.js process on EC2, while Nginx acts as a reverse proxy. I'd use Let's Encrypt for free SSL certificates. For file uploads in production, I'd switch to S3 since platforms like Render have ephemeral filesystems."
