package handlers

import (
	"net/http"
	"strings"
	"time"

	"go-newsfeed/config"
	"go-newsfeed/database"
	"go-newsfeed/middlewares"
	"go-newsfeed/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

const minCredLen = 5

type authReq struct {
	Username string `json:"username" form:"Username"`
	Password string `json:"password" form:"Password"`
}

type refreshReq struct {
	RefreshToken string `json:"refresh_token" form:"refresh_token"`
}

func Register(c *fiber.Ctx) error {
	var in authReq
	if err := c.BodyParser(&in); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}
	u := strings.TrimSpace(in.Username)
	p := strings.TrimSpace(in.Password)
	if len(u) < minCredLen || len(p) < minCredLen {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "username & password must be at least 5 characters"})
	}

	var exists int64
	if err := database.DB.Model(&models.User{}).Where("username = ?", u).Count(&exists).Error; err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "database error"})
	}
	if exists > 0 {
		return c.Status(http.StatusConflict).JSON(fiber.Map{"error": "username already exists"})
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(p), 12)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to hash password"})
	}

	user := models.User{
		Username:  u,
		Password:  string(hashed),
		CreatedAt: time.Now(),
	}
	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create user"})
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{"id": user.ID, "username": user.Username})
}

func Login(c *fiber.Ctx) error {
	var in authReq
	if err := c.BodyParser(&in); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}
	u := strings.TrimSpace(in.Username)
	p := strings.TrimSpace(in.Password)
	if len(u) < minCredLen || len(p) < minCredLen {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "username & password must be at least 5 characters"})
	}

	var user models.User
	if err := database.DB.Where("username = ?", u).First(&user).Error; err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(p)); err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
	}

	access, err := middlewares.GenerateToken(user.ID, 15*time.Minute)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create access token"})
	}
	refresh, err := middlewares.GenerateToken(user.ID, 7*24*time.Hour)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create refresh token"})
	}

	session := models.UserSession{
		UserID:       user.ID,
		RefreshToken: refresh,
		ExpiresAt:    time.Now().Add(7 * 24 * time.Hour),
	}
	if err := database.DB.Create(&session).Error; err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to persist session"})
	}

	return c.JSON(fiber.Map{
		"access_token":  access,
		"refresh_token": refresh,
	})
}

func Refresh(c *fiber.Ctx) error {
	var in refreshReq
	if err := c.BodyParser(&in); err != nil || strings.TrimSpace(in.RefreshToken) == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid refresh token"})
	}

	claims := jwt.MapClaims{}
	if _, err := jwt.ParseWithClaims(in.RefreshToken, claims, func(t *jwt.Token) (interface{}, error) {
		return config.JwtSecret, nil
	}); err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "invalid refresh token"})
	}

	uidF, ok := claims["user_id"].(float64)
	if !ok {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "invalid refresh token"})
	}
	uid := uint(uidF)

	var sess models.UserSession
	if err := database.DB.Where("user_id = ? AND refresh_token = ?", uid, in.RefreshToken).First(&sess).Error; err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "invalid refresh token"})
	}
	if time.Now().After(sess.ExpiresAt) {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "refresh token expired"})
	}

	access, err := middlewares.GenerateToken(uid, 15*time.Minute)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create access token"})
	}

	return c.JSON(fiber.Map{"access_token": access})
}

func Logout(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok || userID == 0 {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}
	if err := database.DB.Where("user_id = ?", userID).Delete(&models.UserSession{}).Error; err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "failed to logout"})
	}
	return c.SendStatus(http.StatusNoContent)
}
