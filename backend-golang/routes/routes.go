package routes

import (
	"go-newsfeed/handlers"
	"go-newsfeed/middlewares"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	api := app.Group("/api")

	api.Post("/register", handlers.Register)
	api.Post("/login", handlers.Login)
	api.Post("/logout", handlers.Logout)
	api.Post("/refresh", handlers.RefreshToken)

	api.Get("/users/suggested", middlewares.AuthRequired, handlers.GetSuggestedUsers)
	api.Post("/posts", middlewares.AuthRequired, handlers.CreatePost)
	api.Get("/feed", middlewares.AuthRequired, handlers.GetFeed)

	api.Post("/follow/:userid", middlewares.AuthRequired, handlers.FollowUser)
	api.Delete("/follow/:userid", middlewares.AuthRequired, handlers.UnfollowUser)
}
