const API_BASE = "http://127.0.0.1:3000/api/auth";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const forgotPasswordForm =
  document.getElementById("forgotPasswordForm");

const passwordInput = document.getElementById("password");

async function sendRequest(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document
      .getElementById("username")
      .value
      .trim();

    const password = passwordInput.value;

    if (!username || !password) {
      alert("Username and password are required");
      return;
    }

    try {
      const result = await sendRequest("/login", {
        username,
        password
      });

      localStorage.setItem("kktf_token", result.token);
      localStorage.setItem(
        "kktf_user",
        JSON.stringify(result.user)
      );

      if (result.user.role.toLowerCase() === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

// REGISTER
if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const namaUser = document
      .getElementById("namaUser")
      .value
      .trim();

    const username = document
      .getElementById("username")
      .value
      .trim();

    const email = document
      .getElementById("email")
      .value
      .trim();

    const password = passwordInput.value;

    const role = document
      .getElementById("role")
      .value;

    const terms = document.getElementById("terms");

    if (!namaUser || !username || !email || !password || !role) {
      alert("All fields are required");
      return;
    }

    if (!terms.checked) {
      alert("Please accept the Terms and Privacy Policy");
      return;
    }

    try {
      const result = await sendRequest("/register", {
        namaUser,
        username,
        email,
        password,
        role
      });

      alert(result.message);

      window.location.href =
        "verify-email.html?email=" +
        encodeURIComponent(email);
    } catch (error) {
      alert(error.message);
    }
  });
}

// FORGOT PASSWORD
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener(
    "submit",
    async function (event) {
      event.preventDefault();

      const email = document
        .getElementById("email")
        .value
        .trim();

      if (!email) {
        alert("Please enter your email");
        return;
      }

      try {
        const result = await sendRequest(
          "/forgot-password",
          { email }
        );

        alert(result.message);
      } catch (error) {
        alert(error.message);
      }
    }
  );
}