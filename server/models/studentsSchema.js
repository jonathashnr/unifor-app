const mongoose = require("mongoose");
const { DEGREES, GENDERS } = require("../../constants.js");

const StudentSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: GENDERS,
        },
        // customGender: {
        //     type: String,
        //     validade: {
        //         validator: (value) => {
        //             if (this.gender !== "Outro" && value) {
        //                 return false;
        //             }
        //             if (this.gender === "Outro" && !value) {
        //                 return false;
        //             }
        //             return true;
        //         },
        //     },
        // },
        degree: {
            type: String,
            required: true,
            enum: DEGREES,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Students", StudentSchema);
