package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	app := fiber.New()

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())

	// Basic route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Lolo Livestream Backend (Fiber) is running!")
	})

	// SRS Webhooks (Placeholder)
	api := app.Group("/api/v1")
	srs := api.Group("/srs")
	
	srs.Post("/publish", func(c *fiber.Ctx) error {
		log.Println("SRS Publish Webhook received")
		// TODO: Validate stream key
		return c.SendStatus(200)
	})

	srs.Post("/unpublish", func(c *fiber.Ctx) error {
		log.Println("SRS Unpublish Webhook received")
		return c.SendStatus(200)
	})

	log.Fatal(app.Listen(":8081"))
}
