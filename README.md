# CloudPrinter Base App Center Application

## What is this Base App?

This is a **base template application** for the CloudPrinter App Center marketplace. CloudPrinter.com has an App Center that allows developers to create apps and place them in the CloudPrinter marketplace for users to discover and use.

This base app demonstrates:
- **OAuth2 Authentication** with CloudPrinter accounts
- **CloudPrinter API Integration** with example API calls
- **Ready-to-deploy** Next.js application with Docker support

**Purpose**: This template serves as a starting point for developers who want to build applications for the CloudPrinter marketplace. It handles the complex OAuth2 authentication flow and provides working examples of CloudPrinter API integration.

## How to Start Using This Base App

### Step 1: Create an App in CloudPrinter App Center

Before you can use this base app, you need to register your application with CloudPrinter:

1. **Visit the CloudPrinter App Center Developer Portal**
   - Sign in with your CloudPrinter account
   - Go to the CloudPrinter Development -> App Center

2. **Create a New Application**
   - Click "Create New App" or similar option
   - Fill in your app details (name, description, etc.)
   - Set the **Redirect URI** to: `http://localhost:3000/api/auth/callback/cloudprinter`

3. **Get Your OAuth2 Credentials**
   - After creating the app, you'll receive:
     - **Client ID** - Your app's public identifier
     - **Client Secret** - Your app's private key (keep this secure!)

### Step 2: Clone and Configure This Base App

1. **Clone this repository:**
   ```bash
   git clone <your-repo-url>
   cd cloudprinter-base-appcenter-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure your `.env.local` file with your OAuth2 credentials:**
   ```env
   # NextAuth.js Configuration
   NEXTAUTH_SECRET=your-nextauth-secret-key-here

   # CloudPrinter OAuth2 Configuration (from App Center)
   CLOUDPRINTER_CLIENT_ID=your-cloudprinter-client-id
   CLOUDPRINTER_CLIENT_SECRET=your-cloudprinter-client-secret

   # CloudPrinter API Base URL
   CLOUDPRINTER_BASE_URL=https://api.cloudprinter.com
   ```

5. **Generate a NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and use it as your `NEXTAUTH_SECRET`

## How to Run the App

Once you have completed the setup steps above, you can run the application using one of these methods:

### Method 1: Local Development (Recommended for Development)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Test the authentication:**
   - Click "Sign in with Cloudprinter account"
   - You'll be redirected to CloudPrinter's OAuth2 authorization page
   - After successful authentication, you'll be redirected back to the dashboard

### Method 2: Docker Compose (Recommended for Production-like Environment)

1. **Build and run with Docker:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000)

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Method 3: Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## Learn More

- [CloudPrinter API Documentation](https://docs.cloudprinter.com/connected-apps)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [OAuth2 Specification](https://tools.ietf.org/html/rfc6749)
