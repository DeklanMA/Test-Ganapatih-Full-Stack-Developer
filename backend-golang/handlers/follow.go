package handlers

import (
	"net/http"
	"time"
	"strconv"

	"go-newsfeed/database"
	"go-newsfeed/models"

	"github.com/gofiber/fiber/v2"
)

func FollowUser(c *fiber.Ctx) error {
    followerID := c.Locals("userID").(uint)
    
    // Ambil :userid dari path
    idParam := c.Params("userid")
    followeeID64, err := strconv.ParseUint(idParam, 10, 64)
    if err != nil {
        return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid user id"})
    }
    followeeID := uint(followeeID64)

    if followerID == followeeID {
        return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "cannot follow yourself"})
    }

    f := models.Follow{
        FollowerID: followerID,
        FolloweeID: followeeID,
        CreatedAt:  time.Now(),
    }

    if err := database.DB.Create(&f).Error; err != nil {
        return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "user not found"})
    }

    return c.JSON(fiber.Map{"message": "you are now following user " + idParam})
}

func UnfollowUser(c *fiber.Ctx) error {
    followerID := c.Locals("userID").(uint)

    idParam := c.Params("userid")
    followeeID64, err := strconv.ParseUint(idParam, 10, 64)
    if err != nil {
        return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid user id"})
    }
    followeeID := uint(followeeID64)

    if err := database.DB.Delete(&models.Follow{}, "follower_id = ? AND followee_id = ?", followerID, followeeID).Error; err != nil {
        return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "relationship not found"})
    }

    return c.JSON(fiber.Map{"message": "you unfollowed user " + idParam})
}

