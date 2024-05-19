package models

type CD struct {
	ID           int     `json:"id"`
	Title        string  `json:"title"`
	ReleasedYear int     `json:"releasedYear"`
	Artist       string  `json:"artist"`
	Genre        string  `json:"genre"`
	Image        string  `json:"image"`
	Price        float64 `json:"price"`
}
