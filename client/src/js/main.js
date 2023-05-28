import "../scss/styles.scss";
import { Modal } from "bootstrap";
import MyDialog from "./myDialog";
import { isEmail } from "validator";
import axios from "axios";

const DEGREES = [
    "Administração",
    "Análise e Desenvolvimento de Sistemas",
    "Ciências Contábeis",
    "Gestão Financeira",
    "Inteligência de Negócios",
    "Marketing Digital",
];

const GENDERS = ["Feminino", "Masculino", "Outro"];

// Define os modais que podem ser manipulados via js
const loginModal = new Modal("#loginModal", {});
const signupModal = new Modal("#signupModal", {});


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
                const title = `${err.response.status} - ${err.response.data.title}`;
                const message = err.response.data.message;
                loginModal.hide();
                const errDialog = new MyDialog();
                errDialog.setTitle(title, "danger");
                errDialog.setMessage(err.response.data.message);
                errDialog.setPrimaryButton("Tentar novamente", "danger", () => {
                    errDialog.hide();
                    loginModal.show();
                });
                errDialog.show();
            });
    }
}

// Listeners do Formulario de Cadastro

// Validação de Email
document
    .getElementById("signupEmail")
    .addEventListener("input", emailValidationHandler);

function emailValidationHandler(event) {
    const email = event.target;
    if (isEmail(email.value)) {
        email.setCustomValidity("");
    } else {
        email.setCustomValidity("Inválido");
    }
}

// Validação de Password
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("signupConfirmPassword");

signupPassword.addEventListener("input", passValidationHandler);
signupConfirmPassword.addEventListener("input", passValidationHandler);

function passValidationHandler(event) {
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
                event.stopPropagation();
                const title = `${err.response.status} - ${err.response.data.title}`;
                const message = err.response.data.message;
                signupModal.hide();
                const errDialog = new MyDialog();
                errDialog.setTitle(title, "danger");
                errDialog.setMessage(err.response.data.message);
                errDialog.setPrimaryButton("Tentar novamente", "danger", () => {
                    errDialog.hide();
                    signupModal.show();
                });
                errDialog.show();
            });
    }
}
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
