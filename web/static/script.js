function clearCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
}
function getCookieValue(name) {
  const cookies = document.cookie.split("; "); // Diviser la chaîne de cookies par "; "
  for (const cookie of cookies) {
    const [key, value] = cookie.split("="); // Diviser chaque cookie en clé et valeur
    if (key === name) {
      return value; // Retourner la valeur si la clé correspond
    }
  }
  return null; // Retourner null si le cookie n'existe pas
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("msg_writer");
  const send = document.getElementById("send");

  //Change with the folowing right value
  const ws = new WebSocket("ws://[IPv4]:8080/ws");

  clearCookie("username");

  document.getElementById("submitUsername").onclick = function () {
    const username = document.getElementById("usernameInput").value;
    if (username) {
      document.cookie = "username=" + username + "; path=/;";
      document.getElementById("loginModal").style.display = "none";
    }
    console.log("Bonjour ", username);
  };

  const usernameInput = document.getElementById("usernameInput");
  const loginModal = document.getElementById("loginModal");

  // Ajoutez l'écouteur d'événements pour détecter la touche "Entrée" dans l'input du nom d'utilisateur
  usernameInput.addEventListener("keydown", function (event) {
    // Vérifie si "Entrée" est pressé et si l'input n'est pas vide
    if (event.key === "Enter" && usernameInput.value.trim() !== "") {
      const username = usernameInput.value.trim();
      // Stocke le nom d'utilisateur dans un cookie
      document.cookie = "username=" + username + "; path=/;";
      // Cache le modal de connexion après validation
      loginModal.style.display = "none";

      console.log("Bonjour ", username);
    }
  });

  // Envoie le message lorsque "Entrée" est pressé
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  send.addEventListener("click", function () {
    sendMessage();
  });

  ws.onopen = () => {
    console.log("WebSocket open.");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const messagesDiv = document.getElementById("messages");

    if (getCookieValue("username") === null) {
      document.getElementById("loginModal").style.display = "flex";
      return;
    }

    const username = getCookieValue("username");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message-bubble");
    if (username === data.username) {
      messageDiv.classList.add("sent");
    } else {
      messageDiv.classList.add("received");
    }

    messageDiv.innerHTML = `<div class="username">${data.username}</div>${data.message}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  ws.onclose = () => {
    console.log("WebSocket closed.");
  };

  function sendMessage() {
    const messageBox = document.getElementById("msg_writer");
    const message = messageBox.value.trim(); // Enlever les espaces
    const username = getCookieValue("username");

    if (message && username) {
      const data = JSON.stringify({ username: username, message: message });
      ws.send(data); // Ajouter un saut de ligne
      messageBox.value = ""; // Réinitialiser la zone de saisie
      messageBox.focus(); // Garder le focus sur la zone de saisie
    } else {
      console.log("Empty message"); // Log pour vérifier
    }
  }

  function showLoginModal() {
    document.getElementById("loginModal").style.display = "flex";
  }
});
