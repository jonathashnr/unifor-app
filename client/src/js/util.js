import MyDialog from "./myDialog";

// Constantes
const DEGREES = [
    "Administração",
    "Análise e Desenvolvimento de Sistemas",
    "Ciências Contábeis",
    "Gestão Financeira",
    "Inteligência de Negócios",
    "Marketing Digital",
];
const GENDERS = ["Feminino", "Masculino", "Outro"];

// Funções de Dialog
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
const lameErrorDialog = (err) => {
    const errDialog = new MyDialog();
    errDialog.setTitle("Erro Inesperado", "danger");
    errDialog.setMessage("Verique o console para detalhes.");
    errDialog.setPrimaryButton("Fechar", "danger");
    console.error("Erro: ", err);
    errDialog.show();
};

export default { genericErrorDialog, lameErrorDialog, DEGREES, GENDERS };
