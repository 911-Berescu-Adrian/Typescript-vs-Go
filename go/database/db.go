package database

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    connStr := os.Getenv("DATABASE_URL")
    if connStr == "" {
        log.Fatal("DATABASE_URL environment variable not set")
    }

    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    if err := db.Ping(); err != nil {
        log.Fatal("Failed to ping database:", err)
    }

    DB = db
}
