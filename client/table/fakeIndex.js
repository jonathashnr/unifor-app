const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Define os modais que podem ser manipulados via js
const loginModalObj = new bootstrap.Modal("#loginModal", {});
const registerModalObj = new bootstrap.Modal("#registerModal", {});
const errModalObj = new bootstrap.Modal("#errModal", {});
const dialogModalObj = new bootstrap.Modal("#dialogModal", {});

// Função que monta um modal para uma mensagem de erro
// especifica, "target" é o alvo do retorno para uma nova
// tentativa
const showErrorDialog = (target, title, message) => {
    document.getElementById("errModalLabel").innerText = title;
    document.getElementById("errMessage").innerText = message;
    document.getElementById("errModalButton").dataset.bsTarget = target;
    errModalObj.show();
};

// Helper para URI
const endpoint = (route) => `http://localhost:3000/admin/${route}`;

// Validação da força da senha
const passwordStrenghtCheck = (password) => {
    let isValid = false;
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
        isValid = true;
    }
    return [isValid, errMessage];
};

// Listeners do Formulario de Login
loginForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        event.stopPropagation();
        loginForm.classList.add("was-validated");
        if (loginForm.checkValidity()) {
            const { email, password } = loginForm.elements;
            const body = { email: email.value, password: password.value };
            axios
                .post(endpoint("login"), body)
                .then((res) => {
                    localStorage.setItem("jwtToken", res.data.accessToken);
                    window.location.href = "table.html";
                })
                .catch((err) => {
                    const title = `${err.response.status} - ${err.response.data.title}`;
                    const message = err.response.data.message;
                    loginModalObj.hide();
                    showErrorDialog("#loginModal", title, message);
                });
        }
    },
    false
);

// Listeners do Formulario de Cadastro
const registerPassword = document.getElementById("registerInputPassword");
const registerConfirmPassword = document.getElementById(
    "registerInputConfirmPassword"
);
const passwordEventHandler = (event) => {
    const [isStrong, errMessage] = passwordStrenghtCheck(
        registerPassword.value
    );
    if (registerPassword.value === registerConfirmPassword.value) {
        registerConfirmPassword.setCustomValidity("");
    } else {
        registerConfirmPassword.setCustomValidity("Inválido");
        document.getElementById(
            "registerInputConfirmPasswordFeedback"
        ).innerText = "Os campos de senha e confirmação estão diferentes.";
    }
    if (isStrong) {
        registerPassword.setCustomValidity("");
    } else {
        registerPassword.setCustomValidity("Inválido");
        document.getElementById("registerInputPasswordFeedback").innerText =
            errMessage;
    }
};
registerPassword.addEventListener("input", passwordEventHandler);
registerConfirmPassword.addEventListener("input", passwordEventHandler);

registerForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        event.stopPropagation();
        registerForm.classList.add("was-validated");
        if (registerForm.checkValidity()) {
            const { email, password } = registerForm.elements;
            const body = {
                email: email.value,
                password: password.value,
            };
            axios
                .post(endpoint("register"), body)
                .then((res) => {
                    registerModalObj.hide();
                    dialogModalObj.show();
                })
                .catch((err) => {
                    event.stopPropagation();
                    const title = `${err.response.status} - ${err.response.data.title}`;
                    const message = err.response.data.message;
                    registerModalObj.hide();
                    showErrorDialog("#registerModal", title, message);
                });
        }
    },
    false
);
