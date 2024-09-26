package main

import (
	"net/http"
	prvMessager "prvMessager/src"
)

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./web/static"))) )
	prvMessager.Launch()
}