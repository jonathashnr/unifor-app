import { Modal } from "bootstrap";

class MyDialog extends Modal {
    constructor(isExitable = true) {
        super(MyDialog._createDialog(isExitable), {
            keyboard: isExitable,
            backdrop: isExitable ? true : "static",
        });
        this._element.addEventListener("hidden.bs.modal", () => {
            this._element.remove();
            this.dispose();
        });
    }
    static _createDialog(isExitable) {
        // cria o elemento modal
        let modal = document.createElement("div");
        modal.className = "modal fade";
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-labelledby", "title");
        modal.setAttribute("aria-hidden", "true");

        // cria o elemento dialog
        let dialog = document.createElement("div");
        dialog.className = "modal-dialog modal-dialog-centered";

        // cria o conteúdo do modal
        let content = document.createElement("div");
        content.className = "modal-content";

        // cria o cabeçalho do modal
        let header = document.createElement("div");
        header.className = "modal-header";
        let title = document.createElement("h1");
        title.className = "modal-title fs-4";
        title.id = "title";
        title.textContent = "Title";
        header.appendChild(title);
        if (isExitable) {
            let closeButton = document.createElement("button");
            closeButton.className = "btn-close";
            closeButton.type = "button";
            closeButton.setAttribute("data-bs-dismiss", "modal");
            closeButton.setAttribute("aria-label", "Close");
            header.appendChild(closeButton);
        }

        // cria o corpo do modal
        let body = document.createElement("div");
        body.className = "modal-body";
        let message = document.createElement("p");
        message.id = "message";
        message.textContent = "Message";
        body.appendChild(message);

        // cria o rodapé do modal
        let footer = document.createElement("div");
        footer.className = "modal-footer";
        let primaryButton = document.createElement("button");
        primaryButton.className = "btn btn-primary";
        primaryButton.type = "button";
        primaryButton.id = "primaryButton";
        primaryButton.textContent = "Button";
        footer.appendChild(primaryButton);

        // monta o conteúdo do modal
        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);

        // monta o dialog
        dialog.appendChild(content);

        // monta o modal
        modal.appendChild(dialog);

        // adiciona o modal ao body
        document.body.appendChild(modal);

        // retorna o modal criado
        return modal;
    }
    removeAfterHidden() {
        this._element.addEventListener("hidden.bs.modal", () => {
            this._element.remove();
            this.dispose();
        });
    }
    setTitle(title, type = "default") {
        const titleElement = this._element.querySelector("#title");
        const baseClass = "modal-title fs-4 ";
        titleElement.textContent = title;
        switch (type) {
            case "success":
                titleElement.className = baseClass + "text-success";
                break;
            case "danger":
                titleElement.className = baseClass + "text-danger";
                break;
            case "warning":
                titleElement.className = baseClass + "text-warning";
                break;
            case "default":
            default:
                titleElement.className = baseClass;
        }
    }
    setMessage(message) {
        this._element.querySelector("#message").textContent = message;
    }
    setPrimaryButton(
        name = "Entendido",
        type = "primary",
        callback = () => this.hide()
    ) {
        const pbutton = this._element.querySelector("#primaryButton");
        pbutton.textContent = name;
        pbutton.onclick = callback;
        const baseClass = "btn ";
        switch (type) {
            case "success":
                pbutton.className = baseClass + "btn-success";
                break;
            case "danger":
                pbutton.className = baseClass + "btn-danger";
                break;
            case "warning":
                pbutton.className = baseClass + "btn-warning";
                break;
            case "secondary":
                pbutton.className = baseClass + "btn-secondary";
                break;
            case "primary":
            default:
                pbutton.className = baseClass + "btn-primary";
        }
    }
    setSecondaryButton(
        name = "Fechar",
        type = "secondary",
        callback = () => this.hide()
    ) {
        let sbutton = this._element.querySelector("#secondaryButton");
        if (!sbutton) {
            sbutton = document.createElement("button");
            sbutton.className = "btn";
            const footer = this._element.querySelector(".modal-footer");
            footer.insertBefore(sbutton, footer.children[0]);
        }
        sbutton.textContent = name;
        sbutton.onclick = callback;
        const baseClass = "btn ";
        switch (type) {
            case "success":
                sbutton.className = baseClass + "btn-success";
                break;
            case "danger":
                sbutton.className = baseClass + "btn-danger";
                break;
            case "warning":
                sbutton.className = baseClass + "btn-warning";
                break;
            case "primary":
                sbutton.className = baseClass + "btn-primary";
                break;
            case "secondary":
            default:
                sbutton.className = baseClass + "btn-secondary";
        }
    }
}
export default MyDialog;
