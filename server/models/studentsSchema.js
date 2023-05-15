const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail, isStrongPassword } = require("validator");
const { DEGREES, GENDERS } = require("../../constants.js");

const StudentSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, "Falta o campo nome completo"],
        },
        email: {
            type: String,
            required: [true, "Falta o campo email"],
            unique: true,
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
        dateOfBirth: {
            type: Date,
            required: [true, "Falta o campo data de nascimento"],
        },
        gender: {
            type: String,
            required: [true, "Falta o campo gênero"],
            enum: {
                values: GENDERS,
                message: "Gênero inválido",
            },
        },
        degree: {
            type: String,
            required: [true, "Falta o campo curso"],
            enum: {
                values: DEGREES,
                message: "Curso inválido",
            },
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

StudentSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("Students", StudentSchema);
