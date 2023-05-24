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

loginForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
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
    },
    false
);

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
