package prvMessager

import (
	"log"
	"net/http"
	"text/template"
)

var(
	index, err = template.ParseFiles("./web/templates/index.html")
)

func ConnectionHandler(w http.ResponseWriter, r *http.Request) {

	if err != nil{
		log.Fatal(err)
	}


	if r.URL.Path == "/"{
		index.Execute(w,nil)
	}else{
		w.WriteHeader(http.StatusNotFound)
	}
}