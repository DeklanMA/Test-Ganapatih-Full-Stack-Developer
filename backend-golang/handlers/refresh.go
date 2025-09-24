package handlers

import (
	"net/http"
	"os"
	"time"

	"go-newsfeed/database"
	"go-newsfeed/middlewares"
	"go-newsfeed/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func RefreshToken(c *fiber.Ctx) error {
	var data struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := c.BodyParser(&data); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(data.RefreshToken, claims, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "invalid refresh token"})
	}

	userID := uint(claims["user_id"].(float64))

	// cek refresh token di DB
	var session models.UserSession
	if err := database.DB.Where("user_id = ? AND refresh_token = ?", userID, data.RefreshToken).First(&session).Error; err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "refresh token not found"})
	}

	if time.Now().After(session.ExpiresAt) {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "refresh token expired"})
	}

	// buat access token baru
	newAccess, _ := middlewares.GenerateToken(userID, time.Minute*15)

	return c.JSON(fiber.Map{
		"access_token": newAccess,
	})
}
