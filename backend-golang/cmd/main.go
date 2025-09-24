package main

import (
	"go-newsfeed/config"
	"go-newsfeed/database"
	"go-newsfeed/models"
	"go-newsfeed/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config.LoadEnv()
	database.Connect()
	database.DB.AutoMigrate(&models.User{}, &models.Post{}, &models.Follow{}, &models.UserSession{})

	app := fiber.New()


	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", 
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	}))

	// Setup routes
	routes.Setup(app)

	app.Listen(":8080")
}
