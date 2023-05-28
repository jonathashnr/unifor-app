import axios from "axios";
import "../scss/styles.scss";
import MyDialog from "./myDialog";
import { Modal } from "bootstrap";
import { isEmail } from "validator";

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
const addStudentModal = new Modal("#addStudentModal", {});

const accessToken = localStorage.getItem("uniScriptToken");
const url = "http://localhost:3000/";
const authAxios = axios.create({
    baseURL: url,
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
});
let currentData = 20;

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
                        <i class='fa-solid fa-pen-to-square text-warning' data-id=${id}></i>
                    </td>  
                    <td>
                        <i class='fa-solid fa-trash text-danger' data-id=${id}></i>
                    </td>
                    `;
    tr.insertAdjacentHTML("afterbegin", content);
    tr.querySelector(".fa-trash").addEventListener(
        "click",
        openConfirmationModal
    );
    return tr;
}

function displayStudents() {
    authAxios
        .get("student/")
        .then((res) => {
            let data = res.data;

            for (let i = data.length - 1; i >= 0; i--) {
                const { fullname, email, dateOfBirth, gender, degree, _id } =
                    data[i];
                let stringDoB = new Date(dateOfBirth).toLocaleDateString(
                    "pt-BR",
                    {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }
                );
                const tableRow = createRow(
                    _id,
                    data.length - i,
                    fullname,
                    email,
                    stringDoB,
                    gender,
                    degree
                );
                document.querySelector("tbody").appendChild(tableRow);
            }
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}
displayStudents();

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

window.openConfirmationModal = openConfirmationModal;
function openConfirmationModal(event) {
    const id = event.target.dataset.id;
    const confirmationDialog = new MyDialog();
    confirmationDialog.setTitle("Confirmação", "danger");
    confirmationDialog.setMessage(
        "Você tem certeza que deseja excluir esse registro?"
    );
    confirmationDialog.setPrimaryButton("Sim", "danger", () => {
        deleteItem(id);
        confirmationDialog.hide();
    });
    confirmationDialog.setSecondaryButton("Não");
    confirmationDialog.show();
}

function deleteItem(IDItem) {
    authAxios
        .delete(`student/${IDItem}`)
        .then(() => {
            location.reload();
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
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
                const title = `${err.response.status} - ${err.response.data.title}`;
                const message = err.response.data.message;
                addStudentModal.hide();
                const errDialog = new MyDialog();
                errDialog.setTitle(title, "danger");
                errDialog.setMessage(err.response.data.message);
                errDialog.setPrimaryButton("Tentar novamente", "danger", () => {
                    errDialog.hide();
                    addStudentModal.show();
                });
                errDialog.show();
            });
    }
}

// Validação de email do estudante
document
    .getElementById("addStudentEmail")
    .addEventListener("input", emailValidationHandler);

function emailValidationHandler(event) {
    const email = event.target;
    if (isEmail(email.value)) {
        email.setCustomValidity("");
    } else {
        email.setCustomValidity("Inválido");
    }
}
