package handlers

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"go-newsfeed/database"
	"go-newsfeed/models"

	"github.com/gofiber/fiber/v2"
)

func CreatePost(c *fiber.Ctx) error {
	var data struct {
		Content string `json:"content"`
	}
	if err := c.BodyParser(&data); err != nil || len(data.Content) > 200 {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{"error": "content invalid"})
	}

	userID := c.Locals("userID").(uint)
	post := models.Post{UserID: userID, Content: data.Content, CreatedAt: time.Now()}

	database.DB.Create(&post)
	return c.Status(http.StatusCreated).JSON(post)
}

func GetFeed(c *fiber.Ctx) error {
    userID := c.Locals("userID").(uint)
    page := c.QueryInt("page", 1)
    limit := c.QueryInt("limit", 10)
    offset := (page - 1) * limit

    order := strings.ToUpper(c.Query("order", "DESC"))
    if order != "ASC" && order != "DESC" {
        order = "DESC"
    }

    var posts []models.Posts
    query := fmt.Sprintf(`
        SELECT p.id, p.user_id, u.username, p.content, p.created_at
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ? 
           OR p.user_id IN (SELECT followee_id FROM follows WHERE follower_id = ?)
        ORDER BY p.created_at %s
        LIMIT ? OFFSET ?
    `, order) 

    if err := database.DB.Raw(query, userID, userID, limit, offset).Scan(&posts).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(fiber.Map{
        "page":  page,
        "order": order,
        "posts": posts,
    })
}





