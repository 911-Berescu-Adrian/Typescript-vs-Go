package handlers

import (
	"cd-marketplace/database"
	"cd-marketplace/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

// SpotifyTokenResponse is used to decode the response from Spotify API
type SpotifyTokenResponse struct {
    AccessToken string `json:"access_token"`
}

// SpotifySearchResponse is used to decode the response from Spotify API search
type SpotifySearchResponse struct {
    Albums struct {
        Items []struct {
            Images []struct {
                URL string `json:"url"`
            } `json:"images"`
        } `json:"items"`
    } `json:"albums"`
}

// GetAllCDs retrieves all CDs from the database
func GetAllCDs(w http.ResponseWriter, r *http.Request) {
    rows, err := database.DB.Query(`SELECT id, title, "releasedYear", artist, genre, image, price FROM cd`)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var cds []models.CD
    for rows.Next() {
        var cd models.CD
        if err := rows.Scan(&cd.ID, &cd.Title, &cd.ReleasedYear, &cd.Artist, &cd.Genre, &cd.Image, &cd.Price); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        cds = append(cds, cd)
    }
    json.NewEncoder(w).Encode(cds)
}

func getSpotifyToken() (string, error) {
    body := strings.NewReader("grant_type=client_credentials&client_id=" + clientID + "&client_secret=" + clientSecret)
    req, err := http.NewRequest("POST", baseURL+"/token", body)
    if err != nil {
        return "", err
    }
    req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var tokenResp SpotifyTokenResponse
    if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
        return "", err
    }

    return tokenResp.AccessToken, nil
}

func getImageForAlbum(album, artist string) (string, error) {
    token, err := getSpotifyToken()
    if err != nil {
        return "", err
    }

    searchURL := fmt.Sprintf("https://api.spotify.com/v1/search?q=%s+%s&type=album", album, artist)
    req, err := http.NewRequest("GET", searchURL, nil)
    if err != nil {
        return "", err
    }
    req.Header.Set("Authorization", "Bearer "+token)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var searchResp SpotifySearchResponse
    if err := json.NewDecoder(resp.Body).Decode(&searchResp); err != nil {
        return "", err
    }

    if len(searchResp.Albums.Items) == 0 || len(searchResp.Albums.Items[0].Images) == 0 {
        return "", fmt.Errorf("no image found for album")
    }

    return searchResp.Albums.Items[0].Images[0].URL, nil
}

// AddCD adds a new CD to the database
func AddCD(w http.ResponseWriter, r *http.Request) {
    var cd models.CD
    if err := json.NewDecoder(r.Body).Decode(&cd); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    image, err := getImageForAlbum(cd.Title, cd.Artist)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    cd.Image = image

    err = database.DB.QueryRow(
        `INSERT INTO cd (title, "releasedYear", artist, genre, image, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        cd.Title, cd.ReleasedYear, cd.Artist, cd.Genre, cd.Image, cd.Price,
    ).Scan(&cd.ID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(cd)
}

// GetCDDetails retrieves CD details by ID
func GetCDDetails(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    id, err := strconv.Atoi(params["id"])
    if err != nil {
        http.Error(w, "Invalid CD ID", http.StatusBadRequest)
        return
    }

    var cd models.CD
    err = database.DB.QueryRow(`SELECT id, title, "releasedYear", artist, genre, image, price FROM cd WHERE id=$1`, id).Scan(&cd.ID, &cd.Title, &cd.ReleasedYear, &cd.Artist, &cd.Genre, &cd.Image, &cd.Price)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "CD not found", http.StatusNotFound)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(cd)
}
