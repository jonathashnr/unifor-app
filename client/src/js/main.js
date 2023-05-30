import "../scss/styles.scss";
import { Modal } from "bootstrap";
import MyDialog from "./myDialog";
import Util from "./util";
import axios from "axios";

// Define os modais que podem ser manipulados via js
const loginModal = new Modal("#loginModal", {});
const signupModal = new Modal("#signupModal", {});

// Helper para URI
const endpoint = (route) => `http://localhost:3000/admin/${route}`;

// Listeners do Formulario de Login
document
    .getElementById("loginForm")
    .addEventListener("submit", loginSubmitHandler);

function loginSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target;
    form.classList.add("was-validated"); // Mostra campos inválidos.
    if (form.checkValidity()) {
        const { email, password } = form.elements;
        const body = { email: email.value, password: password.value };
        axios
            .post(endpoint("login"), body)
            .then((res) => {
                form.reset();
                form.classList.remove("was-validated");
                localStorage.setItem("uniScriptToken", res.data.accessToken);
                window.location.href = "table.html";
            })
            .catch((err) => {
                loginModal.hide();
                if (err.response) {
                    Util.genericErrorDialog(
                        `${err.response.status} - ${err.response.data.title}`,
                        err.response.data.message,
                        loginModal
                    );
                } else {
                    console.error("Erro: ", err);
                    Util.genericErrorDialog(
                        "Erro Inesperado",
                        "Aconteceu um erro inesperado, cheque o console para detalhes"
                    );
                }
            });
    }
}

// Listeners do Formulario de Cadastro

// Validação de Email
document
    .getElementById("signupEmail")
    .addEventListener("input", Util.emailValidationHandler);

// Validação de Password
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("signupConfirmPassword");

signupPassword.addEventListener("input", passValidationHandler);
signupConfirmPassword.addEventListener("input", passValidationHandler);

function passValidationHandler(event) {
    const [isStrong, errMessage] = Util.passwordStrenghtCheck(
        signupPassword.value
    );
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
document
    .getElementById("signupForm")
    .addEventListener("submit", signupSubmitHandler);

function signupSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target;
    form.classList.add("was-validated");
    if (form.checkValidity()) {
        const { email, password } = form.elements;
        const body = {
            email: email.value,
            password: password.value,
        };
        axios
            .post(endpoint("register"), body)
            .then((res) => {
                form.reset();
                form.classList.remove("was-validated");
                signupModal.hide();
                const successDialog = new MyDialog();
                successDialog.setTitle("Sucesso!", "success");
                successDialog.setMessage(
                    "Seu cadastro como administrador foi um sucesso"
                );
                successDialog.setPrimaryButton("Fazer Login", "success", () => {
                    successDialog.hide();
                    loginModal.show();
                });
                successDialog.show();
            })
            .catch((err) => {
                signupModal.hide();
                if (err.response) {
                    Util.genericErrorDialog(
                        `${err.response.status} - ${err.response.data.title}`,
                        err.response.data.message,
                        signupModal
                    );
                } else {
                    console.error("Erro: ", err);
                    Util.genericErrorDialog(
                        "Erro Inesperado",
                        "Aconteceu um erro inesperado, cheque o console para detalhes"
                    );
                }
            });
    }
}

//
// main.js anterior
//

/*  abre e fecha o menu quando clicar no icone: hamburguer e x */
const nav = document.querySelector("#header nav");
const toggle = document.querySelectorAll("nav .toggle");

for (const element of toggle) {
    element.addEventListener("click", function () {
        nav.classList.toggle("show");
    });
}

/* quando clicar em um item do menu, esconder o menu */
const links = document.querySelectorAll("nav ul li a");

for (const link of links) {
    link.addEventListener("click", function () {
        nav.classList.remove("show");
    });
}

/* mudar o header da página quando der scroll */
const header = document.querySelector("#header");
const navHeight = header.offsetHeight;

/* Menu ativo conforme a seção visível na página */
const sections = document.querySelectorAll("main section[id]");
window.activateMenuAtCurrentSection = activateMenuAtCurrentSection;
function activateMenuAtCurrentSection() {
    const checkpoint = window.pageYOffset + (window.innerHeight / 8) * 4;

    for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        const checkpointStart = checkpoint >= sectionTop;
        const checkpointEnd = checkpoint <= sectionTop + sectionHeight;

        if (checkpointStart && checkpointEnd) {
            document
                .querySelector("nav ul li a[href*=" + sectionId + "]")
                .classList.add("active");
        } else {
            document
                .querySelector("nav ul li a[href*=" + sectionId + "]")
                .classList.remove("active");
        }
    }
}
