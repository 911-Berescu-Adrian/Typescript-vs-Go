package handlers

import (
	"github.com/gorilla/mux"
)

var (
    clientID     string
    clientSecret string
    baseURL      = "https://accounts.spotify.com/api"
)

func RegisterRoutes(r *mux.Router, spotifyClientID, spotifyClientSecret string) {
    clientID = spotifyClientID
    clientSecret = spotifyClientSecret

    r.HandleFunc("/api/cds", GetAllCDs).Methods("GET")
    r.HandleFunc("/api/cds/details/{id}", GetCDDetails).Methods("GET")
    r.HandleFunc("/api/cds/add", AddCD).Methods("POST")
}
