const Joi = require('joi');
const mongoose = require('mongoose');

const {
    Course
} = require('../models/course');

// let msg = '';
// let isValid = true;

const feeSchema = new mongoose.Schema({
    studentRoll: {//stuID
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    // class: {
    Semester:{
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    //
    tuition: {
        type: Number,
        required: true,
        // validate: {
        //     isAsync: true,
        //     validator: async function (val) {
        //             const course = await Course.findOne({
        //                 courseName: this.course
        //             }).select({
        //                 courseFee: 1,
        //                 _id: 0
        //             });

        //             return (val && val <= course.courseFee);
        //         },
        //         message: 'Paid amount cannot be greater than the course fee'
        // }
    },
    //
    tuitionDiscount: {
        type: Number,
        required: true
        
    },
    dateOfPayment: {
        type: String,
        required: true
    },
    totalFee: {
        type: Number,
        required: true
    },
    paymentId: {
        type: Number,
        required: true
    }
});

const StudentFee = mongoose.model('StudentFee', feeSchema);

function validateFee(fee) {
    const schema = {
        studentRoll: Joi.string().required().label(' Roll Number '),
        studentName: Joi.string().required().label(' Student Name '),
        studentSemester: Joi.string().required().label(' Semester '),
        studentSection: Joi.string().required().label(' Section '),
        studentDept: Joi.string().required().label(' Course '),
        studentCourse: Joi.string().required().label(' Course '),
        tuition: Joi.number().empty('').label(' Tuition Fee '),
        tuitionDiscount: Joi.number().empty('').label(' Tuition Discount '),
        dateOfPayment: Joi.string().empty('').label(' Date of payment '),
        totalFee: Joi.number().empty('').label(' Total Fee '),
        paymentId: Joi.number().required().label(' Payment Id ')
    }

    return Joi.validate(fee, schema);
}

exports.StudentFee = StudentFee;
exports.validateFee = validateFee;