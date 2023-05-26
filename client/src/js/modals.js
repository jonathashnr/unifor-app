import "../scss/styles.scss";
import { Modal } from "bootstrap";
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
document
    .getElementById("loginForm")
    .addEventListener("submit", loginSubmitHandler);

function loginSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target;
    form.classList.add("was-validated");
    if (form.checkValidity()) {
        const { email, password } = form.elements;
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

// Formulário de adicionar estudantes

// Popula selects com as opções de genero e cursos
fillSelect(document.getElementById("addStudentGender"), GENDERS);
fillSelect(document.getElementById("addStudentDegree"), DEGREES);
function fillSelect(selectElement, optionsArr) {
    optionsArr.forEach((option, i) => {
        const optElement = document.createElement("option");
        optElement.value = i;
        optElement.text = option;
        selectElement.add(optElement);
    });
}

// Submit no formulário de cadastro
const addStudentForm = document.getElementById("addStudentForm");

addStudentForm.addEventListener("submit", addStudentSubmitHandler);
addStudentForm.addEventListener("reset", (e) =>
    e.target.classList.remove("was-validated")
);

function addStudentSubmitHandler(event) {
    const form = event.target;
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
    if (form.checkValidity()) {
        const { fullname, email, dateOfBirth, gender, degree } = form.elements;
        const body = {
            fullname: fullname.value,
            email: email.value,
            dateOfBirth: dateOfBirth.value,
            gender: GENDERS[gender.value],
            degree: DEGREES[degree.value],
        };
        console.log(body);
    }
}

// Validação de email do estudante
document
    .getElementById("addStudentEmail")
    .addEventListener("input", emailValidationHandler);
