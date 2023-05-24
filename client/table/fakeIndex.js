const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const baseURI = "http://localhost:3000/admin";

// Testing
const loginModalObj = new bootstrap.Modal(
    document.getElementById("loginModal"),
    {}
);
const registerModalObj = new bootstrap.Modal(
    document.getElementById("registerModal"),
    {}
);
const testLoginButton = document.getElementById("testLoginButton");
testLoginButton.addEventListener("click", (e) => {
    loginModalObj.hide();
});

const showErrorDialog = (target, title, message) => {
    const button = document.getElementById("errButton");
    document.getElementById("errModalLabel").innerText = title;
    document.getElementById("errMessage").innerText = message;
    document.getElementById("errModalButton").dataset.bsTarget = target;
    button.click();
};

loginForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        const { email, password } = loginForm.elements;
        const body = { email: email.value, password: password.value };
        console.log(baseURI + "/login", body);
        axios
            .post(baseURI + "/login", body)
            .then((res) => {
                localStorage.setItem("jwtToken", res.data.accessToken);
                window.location.href = "table.html";
            })
            .catch((err) => {
                const title = `${err.response.status} - ${err.response.data.title}`;
                const message = err.response.data.message;
                showErrorDialog("#loginModal", title, message);
            });
    },
    false
);

registerForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        const { email, password } = registerForm.elements;
        const body = { email: email.value, password: password.value };
        axios
            .post(baseURI + "/register", body)
            .then((res) => {
                registerModalObj.hide();
                loginModalObj.show();
                // document.getElementById("loginInputEmail").value = email.value;
                // document.getElementById("loginInputPassword").value =
                //     password.value;
                // const button = document.getElementById("loginButton");
                // button.click();
            })
            .catch((err) => {
                const title = `${err.response.status} - ${err.response.data.title}`;
                const message = err.response.data.message;
                showErrorDialog("#registerModal", title, message);
            });
    },
    false
);
// // Selecionar os formulários de login e registro pelos IDs dos modais
// let loginForm = document.querySelector("#loginModal form");
// let registerForm = document.querySelector("#registerModal form");
// let button = document.querySelector("#loginForm button");
// console.log("Entrou no modulo");
// console.log(loginForm);
// // Função para lidar com a submissão do formulário
// function formSubmitHandler(e) {
//     e.preventDefault(); // Evitar o comportamento padrão de submissão do formulário
//     console.log("entrou na funcao");
//     let form = e.target;
//     let data = {};

//     // Loop em cada elemento do formulário para coletar os dados
//     for (let i = 0; i < form.length; i++) {
//         let input = form[i];
//         // Ignorar botões e outros tipos de input não-necessários
//         if (input.type === "submit" || input.type === "button" || !input.id)
//             continue;

//         data[input.id] = input.value;
//     }

//     // Fazendo log dos dados no console
//     console.log(data);
// }

// // Adicionar os manipuladores de eventos de submissão
// loginForm.addEventListener("submit", formSubmitHandler);
// registerForm.addEventListener("submit", formSubmitHandler);
