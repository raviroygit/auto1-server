module.exports = {
    apps: [
      {
        name: "Auto Ai ", // Name of your application
        script: "npm", // Use npm to run the script
        args: "start", // Argument to specify the npm script to run
        interpreter: "none", // No additional interpreter needed (npm handles it)
        instances: "max", // Use all available CPU cores
        exec_mode: "cluster", // Enable cluster mode for load balancing
        env: {
          NODE_ENV: "development", // Development environment variables
          PORT: 8001, // Port for development
        },
        env_production: {
          NODE_ENV: "production", // Production environment variables
          PORT: 8001, // Port for production
        },
      },
    ],
  };
  