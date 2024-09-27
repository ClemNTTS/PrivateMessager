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

  clearCookie("username");

  document.getElementById("submitUsername").onclick = function () {
    const username = document.getElementById("usernameInput").value;
    if (username) {
      document.cookie = "username=" + username + "; path=/;";
      document.getElementById("loginModal").style.display = "none";
    }
    console.log("Bonjour ", username);
  };

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

  //Créé un nouveau Websocket
  const ws = new WebSocket("ws://localhost:8080/ws");

  ws.onopen = () => {
    console.log("WebSocket open.");
  };

  ws.onmessage = (event) => {
    const message = event.data;
    const messagesDiv = document.getElementById("messages");
    if (getCookieValue("username") === null) {
      document.getElementById("loginModal").style.display = "flex";
      return;
    }
    messagesDiv.innerHTML += `<div>${getCookieValue(
      "username"
    )} : ${message}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  ws.onclose = () => {
    console.log("WebSocket closed.");
  };

  function sendMessage() {
    const messageBox = document.getElementById("msg_writer");
    const message = messageBox.value.trim(); // Enlever les espaces

    if (message) {
      // Vérifier si le message n'est pas vide
      ws.send(message + "\n"); // Ajouter un saut de ligne
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
