import axios from "axios";
import "../scss/styles.scss";
import MyDialog from "./myDialog";
import { Modal } from "bootstrap";
import Util from "./util";

// Define os modais que podem ser manipulados via js
const addStudentModal = new Modal("#addStudentModal", {});
const loginModal = new Modal("#loginModal", {});
const editStudentModal = new Modal("#editStudentModal", {});

// Define acesso via axios
const accessToken = localStorage.getItem("uniScriptToken");
const url = "http://localhost:3000/";
const authAxios = axios.create({
    baseURL: url,
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
});

// Verificação de Acesso e Renderização da tabela.
window.addEventListener("load", () => {
    authAxios
        .get("student/")
        .then((res) => {
            displayStudents(res.data);
            document
                .getElementById("effectiveBody")
                .classList.remove("visually-hidden");
        })
        .catch((err) => {
            loginModal.show();
        });
});

function displayStudents(data) {
    for (let i = 0; i < data.length; i++) {
        const { fullname, email, dateOfBirth, gender, degree, _id } = data[i];
        let stringDoB = new Date(dateOfBirth).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        const tableRow = createRow(
            _id,
            i + 1,
            fullname,
            email,
            stringDoB,
            gender,
            degree
        );
        document.querySelector("tbody").appendChild(tableRow);
    }
}

function createRow(id, row, name, email, dob, gender, degree) {
    const tr = document.createElement("tr");
    const content = `
                    <th scope="row">${row}</td>
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${dob}</td>
                    <td>${gender}</td>
                    <td>${degree}</td> 
                    <td>
                        <i class='fa-solid fa-pen-to-square text-warning' data-id="${id}"></i>
                    </td>  
                    <td>
                        <i class='fa-solid fa-trash text-danger' data-id="${id}" data-name="${name}"></i>
                    </td>
                    `;
    tr.insertAdjacentHTML("afterbegin", content);
    tr.querySelector(".fa-trash").addEventListener("click", openDeleteDialog);
    tr.querySelector(".fa-pen-to-square").addEventListener(
        "click",
        openEditDialog
    );
    return tr;
}

// Controle do "Carregar Mais"
let currentData = 20;
window.loadMore = loadMore;
function loadMore() {
    let bodyRow = [...document.querySelectorAll("tbody tr")];
    let endTable = currentData + 20;

    if (endTable >= bodyRow.length) {
        endTable = bodyRow.length;
        document
            .getElementById("buttonLoadMore")
            .setAttribute("style", "display: none");
    }

    for (let i = currentData; i < endTable; i++) {
        bodyRow[i].style.display = "table-row";
    }
    currentData = endTable;
}

// Confirmação e Exclusão de registros
function openDeleteDialog(event) {
    const id = event.target.dataset.id;
    const name = event.target.dataset.name;
    const confirmationDialog = new MyDialog();
    confirmationDialog.setTitle("Confirmação", "danger");
    confirmationDialog.setMessage(
        `Você tem certeza que deseja excluir o registro de ${name.toUpperCase()}.`
    );
    confirmationDialog.setPrimaryButton("Sim", "danger", () => {
        deleteItem(id);
        confirmationDialog.hide();
    });
    confirmationDialog.setSecondaryButton("Não");
    confirmationDialog.show();
}

function deleteItem(id) {
    authAxios
        .delete(`student/${id}`)
        .then(() => {
            location.reload();
        })
        .catch((err) => {
            if (err.response) {
                if (err.response.status == 403) {
                    loginModal.show();
                } else {
                    Util.genericErrorDialog(
                        `${err.response.status} - ${err.response.data.title}`,
                        err.response.data.message
                    );
                }
            } else {
                console.error("Erro: ", err);
                Util.genericErrorDialog(
                    "Erro Inesperado",
                    "Aconteceu um erro inesperado, cheque o console para detalhes"
                );
            }
        });
}

// Formulário de ADICIONAR estudantes

// Popula selects com as opções de genero e cursos
fillSelect(document.getElementById("addStudentGender"), Util.GENDERS);
fillSelect(document.getElementById("addStudentDegree"), Util.DEGREES);
function fillSelect(selectElement, optionsArr) {
    optionsArr.forEach((option, i) => {
        const optElement = document.createElement("option");
        optElement.value = option;
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
            gender: gender.value,
            degree: degree.value,
        };
        authAxios
            .post("student/", body)
            .then((res) => {
                form.reset();
                form.classList.remove("was-validated");
                addStudentModal.hide();
                const successDialog = new MyDialog(false);
                successDialog.setTitle("Sucesso!", "success");
                successDialog.setMessage(
                    "Novo estudante cadastrado com sucesso! Clique em OK para voltar a tela de administração."
                );
                successDialog.setPrimaryButton("OK", "success", () => {
                    successDialog.hide();
                    location.reload();
                });
                successDialog.show();
            })
            .catch((err) => {
                addStudentModal.hide();
                if (err.response) {
                    if (err.response.status == 403) {
                        loginModal.show();
                    } else {
                        Util.genericErrorDialog(
                            `${err.response.status} - ${err.response.data.title}`,
                            err.response.data.message,
                            addStudentModal
                        );
                    }
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

// Validação de email do estudante
document
    .getElementById("addStudentEmail")
    .addEventListener("input", Util.emailValidationHandler);

// Formulário EDITAR estudantes

// Abre Dialog de edição e busca valores
// atualizados no servidor.
function openEditDialog(event) {
    const id = event.target.dataset.id;
    authAxios
        .get(`student/${id}`)
        .then((res) => {
            populateEditDialog(res.data);
            editStudentModal.show();
        })
        .catch((err) => {
            if (err.response) {
                if (err.response.status == 403) {
                    loginModal.show();
                } else {
                    Util.genericErrorDialog(
                        `${err.response.status} - ${err.response.data.title}`,
                        err.response.data.message
                    );
                }
            } else {
                console.error("Erro: ", err);
                Util.genericErrorDialog(
                    "Erro Inesperado",
                    "Aconteceu um erro inesperado, cheque o console para detalhes"
                );
            }
        });
}

// Popula o formulario de edição com os valores atuais
function populateEditDialog(studentData) {
    const {
        _id,
        fullname,
        email,
        dateOfBirth,
        gender,
        degree,
        createdAt,
        updatedAt,
    } = studentData;
    document.getElementById("editStudentId").value = _id;
    document.getElementById("editStudentCreatedAt").value = new Date(
        createdAt
    ).toLocaleString();
    document.getElementById("editStudentUpdatedAt").value = new Date(
        updatedAt
    ).toLocaleString();
    document.getElementById("editStudentName").value = fullname;
    document.getElementById("editStudentEmail").value = email;
    document.getElementById("editStudentDOB").value = dateOfBirth.split("T")[0];
    document.getElementById("editStudentGender").value = gender;
    document.getElementById("editStudentDegree").value = degree;
}

// Popula selects com as opções de genero e cursos
fillSelect(document.getElementById("editStudentGender"), Util.GENDERS);
fillSelect(document.getElementById("editStudentDegree"), Util.DEGREES);

// Submit no formulário de edição de estudante
const editStudentForm = document.getElementById("editStudentForm");

editStudentForm.addEventListener("submit", editStudentSubmitHandler);
editStudentForm.addEventListener("reset", (e) =>
    e.target.classList.remove("was-validated")
);

function editStudentSubmitHandler(event) {
    const form = event.target;
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");
    if (form.checkValidity()) {
        const { id, fullname, email, dateOfBirth, gender, degree } =
            form.elements;
        const body = {
            fullname: fullname.value,
            email: email.value,
            dateOfBirth: dateOfBirth.value,
            gender: gender.value,
            degree: degree.value,
        };
        authAxios
            .put(`student/${id.value}`, body)
            .then((res) => {
                form.reset();
                form.classList.remove("was-validated");
                editStudentModal.hide();
                const successDialog = new MyDialog(false);
                successDialog.setTitle("Sucesso!", "success");
                successDialog.setMessage(
                    "O registro do estudante foi editado! Clique em OK para voltar a tela de administração."
                );
                successDialog.setPrimaryButton("OK", "success", () => {
                    successDialog.hide();
                    location.reload();
                });
                successDialog.show();
            })
            .catch((err) => {
                editStudentModal.hide();
                if (err.response) {
                    if (err.response.status == 403) {
                        loginModal.show();
                    } else {
                        Util.genericErrorDialog(
                            `${err.response.status} - ${err.response.data.title}`,
                            err.response.data.message,
                            editStudentModal
                        );
                    }
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

// Validação de email do estudante
document
    .getElementById("editStudentEmail")
    .addEventListener("input", Util.emailValidationHandler);

// Formulário de Login

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
        authAxios
            .post("admin/login", body)
            .then((res) => {
                form.reset();
                form.classList.remove("was-validated");
                localStorage.setItem("uniScriptToken", res.data.accessToken);
                location.reload();
            })
            .catch((err) => {
                loginModal.hide();
                if (err.response) {
                    const title = `${err.response.status} - ${err.response.data.title}`;
                    const message = err.response.data.message;
                    const errDialog = new MyDialog(false);
                    errDialog.setTitle(title, "danger");
                    errDialog.setMessage(message);
                    errDialog.setPrimaryButton(
                        "Tentar novamente",
                        "danger",
                        () => {
                            errDialog.hide();
                            loginModal.show();
                        }
                    );
                    errDialog.setSecondaryButton(
                        "Voltar",
                        "secondary",
                        () => (window.location.href = "index.html")
                    );
                    errDialog.show();
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
