package main

import (
	"log"
	"net/http"
	"os"

	"cd-marketplace/database"
	"cd-marketplace/handlers"
	"cd-marketplace/middleware"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    database.Connect()

    r := mux.NewRouter()

    // Load Spotify credentials
    clientID := os.Getenv("SPOTIFY_CLIENT_ID")
    clientSecret := os.Getenv("SPOTIFY_CLIENT_SECRET")
    if clientID == "" || clientSecret == "" {
        log.Fatal("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not set")
    }

    // Pass the credentials to handlers
    handlers.RegisterRoutes(r, clientID, clientSecret)

    corsRouter := middleware.CORS(r)

    log.Println("Server is running on port 1234")
    log.Fatal(http.ListenAndServe(":1234", corsRouter))
}
