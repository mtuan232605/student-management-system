const express = require('express');
const router = express.Router();

const {
    StudentId,
    Student,
    validate
} = require('../models/student');

const {
    Department
} = require('../models/department');

const {
    Course,
    validateCourse
} = require('../models/course');


const {
    ensureAuthenticated,
    isAdmin,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../helpers/auth');

router.get('/', [ensureAuthenticated, readAccessControl], async (req, res) => {

    const perPage = 7;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage) + 1;
    const sort = req.query.sort || "asc";

    const student = await Student.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({
            Session: sort
        });

    if (student.length > 0) {
        const pages = await Student.countDocuments();

        res.render('attendance/index', {
            title: 'attendance',
            breadcrumbs: true,
            search_bar: true,
            //student --> attendance
            students: student,
            current: parseInt(page),
            pages: Math.ceil(pages / perPage),
            total: pages,
            perPage: perPage,
            skip: skip,
            to: (student.length + 10)
        });
    } else {
        res.render('attendance/index', {
            title: 'attendance',
            breadcrumbs: true,
            search_bar: true
        });
    }
});



module.exports = router;
