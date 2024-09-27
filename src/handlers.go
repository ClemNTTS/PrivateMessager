package prvMessager

import (
	"log"
	"net/http"
	"sync"
	"text/template"

	"github.com/gorilla/websocket"
)

var (
    index       *template.Template
    connections = make(map[*websocket.Conn]bool)
    clientsMu   sync.Mutex
    upgrader    = websocket.Upgrader{} // Crée un nouvel Upgrader
)

func init() {
    var err error
    index, err = template.ParseFiles("./web/templates/index.html")
    if err != nil {
        log.Fatal(err)
    }
}

// Fonction pour gérer les requêtes HTTP
func ConnectionHandler(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path == "/" {
        if err := index.Execute(w, nil); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
    } else {
        w.WriteHeader(http.StatusNotFound)
    }
}

// Fonction pour gérer les connexions WebSocket
func WSHandler(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil) // Mise à niveau de la connexion
    if err != nil {
        log.Println("Connection error:", err)
        return
    }
    defer conn.Close()
    handleConn(conn)
}

// Fonction pour gérer la connexion d'un client
func handleConn(conn *websocket.Conn) {
    defer conn.Close()

    clientsMu.Lock()
    connections[conn] = true
    clientsMu.Unlock()

    for {
        _, message, err := conn.ReadMessage() // Lecture du message
        if err != nil {
            log.Println("Error at reading:", err)
            break
        }
        broadcastMessage(message)
    }

    clientsMu.Lock()
    delete(connections, conn)
    clientsMu.Unlock()
}

// Fonction pour diffuser les messages à tous les clients
func broadcastMessage(msg []byte) {
    clientsMu.Lock()
    defer clientsMu.Unlock()

    for connection := range connections {
        err := connection.WriteMessage(websocket.TextMessage, msg) // Envoi du message
        if err != nil {
            log.Println("Error at sending:", err)
            connection.Close()
            delete(connections, connection)
        }
    }
}
