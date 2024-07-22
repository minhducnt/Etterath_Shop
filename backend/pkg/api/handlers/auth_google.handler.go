package handlers

import (
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
	"etterath_shop_feature/pkg/services/tokens"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

// UserGoogleAuthLoginPage godoc
//
//	@Summary		To load google login page (User)
//	@Description	API for user to load google login page
//	@Id				UserGoogleAuthLoginPage
//	@Tags			User Authentication
//	@Router			/auth/google-auth [get]
//	@Success		200	{object}	responses.Response{}	"Successfully google login page loaded"
func (c *AuthHandler) UserGoogleAuthLoginPage(ctx *gin.Context) {

	ctx.HTML(200, "goauth.html", nil)
}

// UserGoogleAuthInitialize godoc
//
//	@Summary		Initialize google auth (User)
//	@Description	API for user to initialize google auth
//	@Id				UserGoogleAuthInitialize
//	@Tags			User Authentication
//	@Router			/auth/google-auth/initialize [get]
func (c *AuthHandler) UserGoogleAuthInitialize(ctx *gin.Context) {

	// setup the google provider
	goauthClientID := c.config.GoathClientID
	goauthClientSecret := c.config.GoauthClientSecret
	callbackUrl := c.config.GoauthCallbackUrl

	// setup privier
	goth.UseProviders(
		google.New(goauthClientID, goauthClientSecret, callbackUrl, "email", "profile"),
	)

	// start the google login
	gothic.BeginAuthHandler(ctx.Writer, ctx.Request)
}

// UserGoogleAuthCallBack godoc
//
//	@Summary		Google auth callback (User)
//	@Description	API for google to callback after authentication
//	@Id				UserGoogleAuthCallBack
//	@Tags			User Authentication
//	@Router			/auth/google-auth/callback [post]
//	@Success		200	{object}	responses.Response{}	"Successfully logged in with google"
//	@Failure		500	{object}	responses.Response{}	"Failed Login with google"
func (c *AuthHandler) UserGoogleAuthCallBack(ctx *gin.Context) {

	googleUser, err := gothic.CompleteUserAuth(ctx.Writer, ctx.Request)

	if err != nil {
		responses.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to get user details from google", err, nil)
		return
	}

	user := models.User{
		FirstName:   googleUser.FirstName,
		LastName:    googleUser.LastName,
		Email:       googleUser.Email,
		GoogleImage: googleUser.AvatarURL,
	}

	userID, err := c.authUseCase.GoogleLogin(ctx, user)
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to login with google", err, nil)
		return
	}

	c.setupTokenAndResponse(ctx, tokens.User, userID)
}
