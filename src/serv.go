package prvMessager

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

//Launch a server on the following port given in program argument
func Launch(){
	port := "8080"
	ip := "localhost"
	if len(os.Args) == 2 && len(os.Args[1]) == 4{
		port = os.Args[1]
		if _, err := strconv.Atoi(port); err != nil || len(port) < 2 || len(port) > 5 {
			log.Fatal("Invalid port number")
		}
	}
	if len(os.Args) == 3{
		ip = os.Args[2]
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/", ConnectionHandler)
	mux.HandleFunc("/ws", WSHandler)

	mux.Handle("/web/static/", http.StripPrefix("/web/static/", http.FileServer(http.Dir("./web/static"))))
	mux.Handle("/web/favicon/", http.StripPrefix("/web/favicon/", http.FileServer(http.Dir("./web/favicon"))))

	server := &http.Server{
		Addr: ip+":"+port,
		Handler: mux,
		MaxHeaderBytes: 1 <<20, //1Mb
		IdleTimeout: 120 * time.Second,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
		ReadHeaderTimeout: 10 * time.Second,
	}

	log.Println("Listening on http://"+server.Addr)
	if err := server.ListenAndServe(); err != nil{
		log.Fatal(err)
	}
}