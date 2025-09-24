package middlewares

import (
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go-newsfeed/config"
)

func AuthRequired(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "missing or invalid token"})
	}

	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	claims := jwt.MapClaims{}

	_, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
		return config.JwtSecret, nil // 
	})
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "invalid token"})
	}

	c.Locals("userID", uint(claims["user_id"].(float64)))
	return c.Next()
}


func GenerateToken(userID uint, duration time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(duration).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(config.JwtSecret) // ✅ sama juga
}
