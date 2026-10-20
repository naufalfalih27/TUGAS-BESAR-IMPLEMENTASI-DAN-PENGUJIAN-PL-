// KkTF - auth.js (halaman Login dan Register)
// Satu file untuk dua halaman: kode otomatis menyesuaikan
// dengan form yang ada di halaman (loginForm / registerForm).

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// Fungsi bantu 
function setError(input, message) {
  const wrapper = input.closest(".field, .terms");
  const error = wrapper.querySelector(".field__error");
  wrapper.classList.toggle("has-error", Boolean(message));
  error.textContent = message;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

//Tampilkan / sembunyikan password 
if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
    togglePassword.setAttribute(
      "aria-label",
      isHidden ? "Sembunyikan password" : "Tampilkan password"
    );
  });
}

// LOGIN
if (loginForm) {
  const identifierInput = document.getElementById("identifier");

  // Kenali jenis input: email, nomor HP, atau username
  function detectIdentifierType(value) {
    if (value.includes("@")) return "email";
    if (/^(\+62|62|0)[0-9\s-]{7,}$/.test(value)) return "phone";
    return "username";
  }

  function validateIdentifier() {
    const value = identifierInput.value.trim();

    if (!value) {
      setError(identifierInput, "Isi username, email, atau nomor HP.");
      return false;
    }

    const type = detectIdentifierType(value);

    if (type === "email" && !isEmail(value)) {
      setError(identifierInput, "Format email belum benar.");
      return false;
    }

    if (type === "phone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 9 || digits.length > 15) {
        setError(identifierInput, "Nomor HP harus 9 sampai 15 angka.");
        return false;
      }
    }

    setError(identifierInput, "");
    return true;
  }

  function validateLoginPassword() {
    if (!passwordInput.value) {
      setError(passwordInput, "Isi password.");
      return false;
    }
    setError(passwordInput, "");
    return true;
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const okIdentifier = validateIdentifier();
    const okPassword = validateLoginPassword();
    if (!okIdentifier || !okPassword) return;

    const identifier = identifierInput.value.trim();
    const payload = {
      identifier,
      type: detectIdentifierType(identifier), // "email" | "phone" | "username"
      password: passwordInput.value,
    };

    // TODO: kirim ke backend, contoh:
    // fetch("http://localhost:3000/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    localStorage.setItem("kktf_user", JSON.stringify({ username: identifier }));
    window.location.href = "index.html";
  });

  identifierInput.addEventListener("blur", validateIdentifier);
  passwordInput.addEventListener("blur", validateLoginPassword);
}

// REGISTER
if (registerForm) {
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const termsInput = document.getElementById("terms");

  function validateUsername() {
    const value = usernameInput.value.trim();
    if (!value) {
      setError(usernameInput, "Isi username.");
      return false;
    }
    if (!/^[A-Za-z0-9_]{3,20}$/.test(value)) {
      setError(usernameInput, "Username 3 sampai 20 karakter: huruf, angka, atau underscore.");
      return false;
    }
    setError(usernameInput, "");
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      setError(emailInput, "Isi email.");
      return false;
    }
    if (!isEmail(value)) {
      setError(emailInput, "Format email belum benar.");
      return false;
    }
    setError(emailInput, "");
    return true;
  }

  function validateNewPassword() {
    if (!passwordInput.value) {
      setError(passwordInput, "Isi password.");
      return false;
    }
    if (passwordInput.value.length < 8) {
      setError(passwordInput, "Password minimal 8 karakter.");
      return false;
    }
    setError(passwordInput, "");
    return true;
  }

  function validateTerms() {
    if (!termsInput.checked) {
      setError(termsInput, "Centang persetujuan Terms & Privacy Policy.");
      return false;
    }
    setError(termsInput, "");
    return true;
  }

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = [
      validateUsername(),
      validateEmail(),
      validateNewPassword(),
      validateTerms(),
    ];
    if (results.includes(false)) return;

    const payload = {
      username: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
    };

    // TODO: kirim ke backend, contoh:
    // fetch("http://localhost:3000/api/auth/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    window.location.href = "login.html";
  });

  usernameInput.addEventListener("blur", validateUsername);
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validateNewPassword);
  termsInput.addEventListener("change", validateTerms);
}