# PrivateMessager

PrivateMessager is a lightweight chat messaging application designed to facilitate real-time private messaging between users through a WebSocket server and client-side JavaScript. It includes a simple Go backend for managing WebSocket connections and broadcasting messages to connected clients.

![alt text](/web/static/image.png)

## Features

- **WebSocket Communication**: The app establishes a persistent WebSocket connection to facilitate instant, two-way messaging between the client and server.
- **Private Messaging**: Users can send and receive private messages.
- **Cookie-based Authentication**: The username is stored in browser cookies for identification during messaging.
- **Real-time message broadcasting**: Messages are sent in real-time, allowing seamless communication between users.
- **Ignore List**: Users can opt to ignore messages from certain people.

## Technologies Used

- **Go**: Backend server to manage WebSocket connections and broadcast messages.
- **JavaScript**: Client-side logic for handling WebSocket communication and UI interactions.
- **HTML/CSS**: Basic front-end for user interactions (not provided in detail here).
- **WebSocket**: Protocol for real-time communication between server and client.
- **Cookies**: Used for storing username to persist session data across requests.

## Installation

### Prerequisites

- Go 1.16+ installed on your machine.
- A modern web browser supporting WebSockets (Chrome, Firefox, etc.).

### Steps to run the application:

1. Clone the repository:

   ```bash
   git clone https://github.com/ClemNTTS/PrivateMessager.git
   cd PrivateMessager
   ```

2. Compile and run the Go server:

   ```bash
   go run main.go
   ```

3. Open a browser and navigate to `http://localhost:8080` (or the custom IP/port you've defined) to use the messaging application.

4. The WebSocket connection will be established on `ws://localhost:8080/ws` (or the corresponding IP/port). Ensure your front-end points to this WebSocket endpoint.

## Usage

- On page load, the user will be prompted to enter a username, which is stored in a browser cookie.
- Users can type messages and send them either by pressing "Enter" or clicking the "Send" button.
- Messages are sent to all connected clients through the WebSocket server, and each client displays the message depending on the sender.

### Commands

- **Send a message**: Type a message in the input field and press Enter or click "Send."
- **Set username**: The username is entered in the initial modal and stored via cookies.

### Go Code Breakdown

1. **`Launch()` Function**: Starts the HTTP server and WebSocket handlers on the specified IP and port.
2. **`WSHandler()` Function**: Upgrades an HTTP connection to a WebSocket and processes incoming and outgoing messages.
3. **`handleConn()` Function**: Handles each individual WebSocket connection and relays messages to all active clients.

### JavaScript Breakdown

1. **WebSocket Setup**: Establishes a connection to the WebSocket server on page load and listens for incoming messages.
2. **Cookie Management**: Stores and retrieves the username from browser cookies.
3. **Message Handling**: Displays messages in different styles depending on whether the message is sent by the user or received from another user.

## Configuration

To configure the WebSocket endpoint in the JavaScript:

```javascript
const ws = new WebSocket("ws://[IPv4]:8080/ws");
```

Replace `[IPv4]` with the correct server IP address and port if necessary.

## License

This project is under the `MIT License` - loock at the file [LICENSE.md](LICENSE) for more informations
