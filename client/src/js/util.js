import MyDialog from "./myDialog";
import { isEmail } from "validator";

//
// Constantes
//
const DEGREES = [
    "Administração",
    "Análise e Desenvolvimento de Sistemas",
    "Ciências Contábeis",
    "Gestão Financeira",
    "Inteligência de Negócios",
    "Marketing Digital",
];
const GENDERS = ["Feminino", "Masculino", "Outro"];

//
// Funções de Dialog
//
const genericErrorDialog = (title, message, comebackDialog) => {
    const errDialog = new MyDialog();
    errDialog.setTitle(title, "danger");
    errDialog.setMessage(message);
    if (comebackDialog) {
        errDialog.setPrimaryButton("Tentar novamente", "danger", () => {
            errDialog.hide();
            comebackDialog.show();
        });
    } else {
        errDialog.setPrimaryButton("Fechar", "danger");
    }
    errDialog.show();
};

//
// Validation Helpers
//

const emailValidationHandler = (event) => {
    const email = event.target;
    if (isEmail(email.value)) {
        email.setCustomValidity("");
    } else {
        email.setCustomValidity("Inválido");
    }
};

const passwordStrenghtCheck = (password) => {
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
};
export default {
    passwordStrenghtCheck,
    emailValidationHandler,
    genericErrorDialog,
    DEGREES,
    GENDERS,
};
