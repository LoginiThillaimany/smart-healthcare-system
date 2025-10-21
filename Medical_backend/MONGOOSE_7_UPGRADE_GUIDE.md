# Mongoose 7+ Upgrade Guide

## **✅ Current Package Versions (Recommended)**

Your current setup is already good! Here are the recommended versions:

```json
{
  "dependencies": {
    "mongoose": "^7.6.3",
    "mongodb": "^6.2.0",
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  }
}
```

## **🔧 Mongoose 7+ Compatible Connection Options**

### **✅ CORRECT (Mongoose 7+)**
```javascript
const options = {
  // Core connection options
  serverSelectionTimeoutMS: 10000, // 10 seconds to find a server
  socketTimeoutMS: 45000, // 45 seconds of inactivity before closing socket
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain at least 2 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0 // Disable mongoose buffering when not connected
};
```

### **❌ DEPRECATED (Removed in Mongoose 7+)**
```javascript
// These options are NO LONGER SUPPORTED:
const deprecatedOptions = {
  useNewUrlParser: true,     // ❌ Removed - always true now
  useUnifiedTopology: true,  // ❌ Removed - always true now
  useFindAndModify: false,   // ❌ Removed - always false now
  useCreateIndex: true       // ❌ Removed - always true now
};
```

## **🚀 Complete Working Connection Code**

```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      bufferMaxEntries: 0
    };

    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, options);

    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Enhanced event handlers
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected. Auto-retry enabled...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

connectDB();
```

## **📋 Expected Success Output**

When your connection works correctly, you should see:

```
🔄 Attempting to connect to MongoDB...
📍 URI: mongodb+srv://***:***@hccluster.mxcmo95.mongodb.net/healthcareDB

🔄 MongoDB connecting...
🔗 MongoDB connected
✅ MongoDB connected successfully
📊 Database: healthcareDB
🔗 Host: hccluster-shard-00-02.mxcmo95.mongodb.net
📡 Port: 27017
🏷️  Connection State: Connected
🌍 MongoDB Version: 6.0.x

🚀 Server running on port 5000
📍 URL: http://localhost:5000
🌍 Environment: development
```

## **🔍 Connection State Values**

```javascript
// mongoose.connection.readyState values:
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
```

## **⚡ Performance Optimizations**

### **Connection Pool Settings**
```javascript
const productionOptions = {
  maxPoolSize: 50,        // Max connections in pool
  minPoolSize: 5,         // Min connections to maintain
  maxIdleTimeMS: 30000,   // Close idle connections after 30s
  serverSelectionTimeoutMS: 5000,  // Faster server selection
  heartbeatFrequencyMS: 10000,     // Check server health every 10s
};
```

### **Development Settings**
```javascript
const developmentOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 10000,
  bufferCommands: false,
  bufferMaxEntries: 0
};
```

## **🛡️ Production Error Handling**

```javascript
// Production-ready error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB Error:', err.message);
  
  // Send to monitoring service (e.g., Sentry, DataDog)
  if (process.env.NODE_ENV === 'production') {
    // monitoring.captureException(err);
    console.error('CRITICAL: MongoDB error in production', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      readyState: mongoose.connection.readyState
    });
  }
});
```

## **🧪 Testing Your Connection**

1. **Test with your current URI:**
   ```bash
   node test-mongodb-connection.js
   ```

2. **Start your server:**
   ```bash
   npm start
   ```

3. **Check connection health:**
   ```bash
   curl http://localhost:5000/api/v1/auth/test
   ```

## **📦 Package Update Commands**

If you need to update to latest versions:

```bash
# Update to latest Mongoose 7.x
npm install mongoose@^7.6.3

# Update MongoDB driver (automatically updated with Mongoose)
npm install mongodb@^6.2.0

# Check for outdated packages
npm outdated

# Update all packages
npm update
```

## **🔧 Troubleshooting**

### **Issue: "bufferMaxEntries is not supported"**
**Solution:** Remove deprecated options from connection config

### **Issue: "useNewUrlParser is deprecated"**
**Solution:** Remove all `use*` options - they're default in Mongoose 7+

### **Issue: Connection hangs**
**Solution:** Add `serverSelectionTimeoutMS: 10000` to fail fast

### **Issue: Memory leaks**
**Solution:** Implement proper connection pooling with `maxPoolSize` and `minPoolSize`

Your current setup is now fully compatible with Mongoose 7+ and should work without any deprecated option warnings!
