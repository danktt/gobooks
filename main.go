package main

import (
	"fmt"
)

func isAdmin(role, username string) (string, error) {
	if role == "admin" {
		return fmt.Sprintf("Hello %s, you are an admin!", username), nil
	}
	return "", fmt.Errorf("User %s is not an admin", username)
}

func main() {

	r, err := isAdmin("admin", "Danilo")

	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(r)
	}

}
