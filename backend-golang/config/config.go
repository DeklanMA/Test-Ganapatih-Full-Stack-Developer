package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var JwtSecret []byte // t


func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using system env")
	}

	JwtSecret = []byte(os.Getenv("JWT_SECRET"))

	if len(JwtSecret) == 0 {
		log.Fatal("JWT_SECRET tidak ditemukan di .env")
	}
}

// Optional helper
func GetEnv(key string) string {
	return os.Getenv(key)
}
