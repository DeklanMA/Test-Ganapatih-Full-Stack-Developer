package handlers

import (
	"net/http"

	"go-newsfeed/database"
	"go-newsfeed/models"

	"github.com/gofiber/fiber/v2"
)

func GetSuggestedUsers(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var users []models.SuggestedUser

	database.DB.Raw(`
		SELECT u.id, u.username,
		       CASE 
		         WHEN f.follower_id IS NULL THEN false 
		         ELSE true 
		       END as is_followed
		FROM users u
		LEFT JOIN follows f ON f.followee_id = u.id AND f.follower_id = ?
		WHERE u.id != ?
		LIMIT 10
	`, userID, userID).Scan(&users)

	if len(users) == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "tidak ada user untuk ditampilkan"})
	}

	return c.JSON(fiber.Map{"users": users})
}
