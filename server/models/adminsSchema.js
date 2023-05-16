const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail, isStrongPassword } = require("validator");

const AdminsSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: [true, "Email já cadastrado"],
            required: [true, "Falta o campo email"],
            validate: {
                validator: isEmail,
                message: "Email inválido",
            },
        },
        password: {
            type: String,
            required: [true, "Falta o campo senha"],
            validate: {
                validator: isStrongPassword,
                message: "Senha fraca",
            },
        },
    },
    { timestamps: true }
);

AdminsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

AdminsSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        try {
            const hash = await bcrypt.hash(this.password, 10);
            this.password = hash;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model("Admins", AdminsSchema);
