const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
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
    },
    { timestamps: true }
);

StudentSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model("Students", StudentSchema);
