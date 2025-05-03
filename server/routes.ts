import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health/Status endpoint
  app.get("/api/status", (req, res) => {
    res.json({ status: "ok", version: "1.0.0" });
  });
  
  // Proxy endpoint for WHO Global Health Observatory
  app.get("/api/health", async (req, res) => {
    try {
      const response = await fetch("https://ghoapi.azureedge.net/api/WHOSIS_000001");
      if (!response.ok) {
        throw new Error(`WHO API responded with ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching health data:", error);
      res.status(500).json({ error: "Failed to fetch health data" });
    }
  });
  
  // Get world happiness report data
  app.get("/api/happiness", async (req, res) => {
    try {
      // In a real app, you would fetch this from the World Happiness Report API
      // For demo, we'll return a message to use the client-side implementation
      res.json({ 
        message: "For demonstration purposes, happiness data is served directly from the client-side"
      });
    } catch (error) {
      console.error("Error fetching happiness data:", error);
      res.status(500).json({ error: "Failed to fetch happiness data" });
    }
  });
  
  // Get environmental performance data
  app.get("/api/environmental", async (req, res) => {
    try {
      // In a real app, you would fetch this from EPI or similar source
      // For demo, we'll return a message to use the client-side implementation
      res.json({ 
        message: "For demonstration purposes, environmental data is served directly from the client-side"
      });
    } catch (error) {
      console.error("Error fetching environmental data:", error);
      res.status(500).json({ error: "Failed to fetch environmental data" });
    }
  });
  
  // Get quality of life / poverty data
  app.get("/api/quality-of-life", async (req, res) => {
    try {
      // In a real app, you would fetch this from World Bank API
      // For demo, we'll return a message to use the client-side implementation
      res.json({ 
        message: "For demonstration purposes, quality of life data is served directly from the client-side"
      });
    } catch (error) {
      console.error("Error fetching quality of life data:", error);
      res.status(500).json({ error: "Failed to fetch quality of life data" });
    }
  });
  
  // Get violence/peace data
  app.get("/api/violence", async (req, res) => {
    try {
      // In a real app, you would fetch this from GPI or similar source
      // For demo, we'll return a message to use the client-side implementation
      res.json({ 
        message: "For demonstration purposes, violence/peace data is served directly from the client-side"
      });
    } catch (error) {
      console.error("Error fetching violence data:", error);
      res.status(500).json({ error: "Failed to fetch violence data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
