import "../scss/styles.scss";
import { Modal } from "bootstrap";
import { isEmail } from "validator";
import axios from "axios";

// Define os modais que podem ser manipulados via js
const loginModal = new Modal("#loginModal", {});
const signupModal = new Modal("#signupModal", {});
const errModal = new Modal("#errModal", {});
const dialogModal = new Modal("#dialogModal", {});

// Função que prepara o modal de erros para uma mensagem de erro
// especifica, "target" é o alvo do retorno para uma nova tentativa
function showErrorDialog(target, title, message) {
    document.getElementById("errModalLabel").innerText = title;
    document.getElementById("errMessage").innerText = message;
    document.getElementById("errModalButton").dataset.bsTarget = target;
    errModal.show();
}

// Helper para URI
const endpoint = (route) => `http://localhost:3000/admin/${route}`;

// Validação da força da senha
function passwordStrenghtCheck(password) {
    let isStrong = false;
    let errMessage = "";
    if (!password) {
        errMessage = "A senha não pode estar vazia.";
    } else if (!/[@$!%*#?&]/.test(password)) {
        errMessage =
            "A senha deve conter pelo menos um símbolo: @ $ ! % * # ? &.";
    } else if (!/[0-9]/.test(password)) {
        errMessage = "A deve conter pelo menos um número.";
    } else if (!/[A-Z]/.test(password)) {
        errMessage = "A deve conter pelo menos uma letra maiúscula.";
    } else if (!/[a-z]/.test(password)) {
        errMessage = "A deve conter pelo menos uma letra minúscula.";
    } else if (password.length < 8) {
        errMessage = "A deve conter pelo menos 8 caracteres.";
    } else {
        isStrong = true;
    }
    return [isStrong, errMessage];
}

// Listeners do Formulario de Login
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", loginFormSubmitHandler);

function loginFormSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    loginForm.classList.add("was-validated");
    if (loginForm.checkValidity()) {
        const { email, password } = loginForm.elements;
        const body = { email: email.value, password: password.value };
        axios
            .post(endpoint("login"), body)
            .then((res) => {
                localStorage.setItem("uniScriptToken", res.data.accessToken);
                window.location.href = "table.html";
            })
            .catch((err) => {
                const title = `${err.response.status} - ${err.response.data.title}`;
                const message = err.response.data.message;
                loginModal.hide();
                showErrorDialog("#loginModal", title, message);
            });
    }
}

// Listeners do Formulario de Cadastro

// Validação de Email
const signupEmail = document.getElementById("signupEmail");
signupEmail.addEventListener("input", emailEventHandler);
function emailEventHandler(event) {
    if (isEmail(signupEmail.value)) {
        signupEmail.setCustomValidity("");
    } else {
        signupEmail.setCustomValidity("Inválido");
    }
}

// Validação de Password
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("signupConfirmPassword");

signupPassword.addEventListener("input", passwordEventHandler);
signupConfirmPassword.addEventListener("input", passwordEventHandler);

function passwordEventHandler(event) {
    const [isStrong, errMessage] = passwordStrenghtCheck(signupPassword.value);
    if (signupPassword.value === signupConfirmPassword.value) {
        signupConfirmPassword.setCustomValidity("");
    } else {
        signupConfirmPassword.setCustomValidity("Inválido");
        document.getElementById("signupConfirmPasswordHelper").innerText =
            "Os campos de senha e confirmação estão diferentes.";
    }
    if (isStrong) {
        signupPassword.setCustomValidity("");
    } else {
        signupPassword.setCustomValidity("Inválido");
        document.getElementById("signupPasswordHelper").innerText = errMessage;
    }
}

// Submit no formulário de cadastro
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", signupFormSubmitHandler);

function signupFormSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    signupForm.classList.add("was-validated");
    if (signupForm.checkValidity()) {
        const { email, password } = signupForm.elements;
        const body = {
            email: email.value,
            password: password.value,
        };
        axios
            .post(endpoint("register"), body)
            .then((res) => {
                signupModal.hide();
                dialogModal.show();
            })
            .catch((err) => {
                event.stopPropagation();
                const title = `${err.response.status} - ${err.response.data.title}`;
                const message = err.response.data.message;
                signupModal.hide();
                showErrorDialog("#signupModal", title, message);
            });
    }
}
