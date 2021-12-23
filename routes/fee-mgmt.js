const express = require('express');
const router = express.Router();
const moment = require('moment');
const randomString = require('randomstring');

const {
    Department
} = require('../models/department');

const {
    StudentId,
    Student
} = require('../models/student');

const {
    StudentFee,
    validateFee
} = require('../models/feeManagement');


const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    createAccessControl,
    readAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../helpers/auth');


router.get('/', [ensureAuthenticated, readAccessControl || isAdmin ], async (req, res) => {
    /*const dept = await Department.find();

    if (dept) {
        res.render('fee-management/index', {
            title: 'Fee Management',
            breadcrumbs: true,
            search_box: true,
            dept: dept
        });
    }*/
    res.render('fee-management/index', {
        title: 'Fee Management',
        breadcrumbs: true
    })
});

//detail
router.get('/detail',[ensureAuthenticated,  readAccessControl || isAdmin],async (req, res) => {
    const perPage = 7;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage) + 1;
    const sort = req.query.sort || "asc";
    
    const studentfee = await StudentFee.find()
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({
        Session: sort
    });
    
    if (studentfee.length > 0) {
        const pages = await StudentFee.countDocuments();
        
        res.render('fee-management/detail', {
            title: 'studentfees',
            breadcrumbs: true,
            search_bar: true,
            studentfees: studentfee,
            current: parseInt(page),
            pages: Math.ceil(pages / perPage),
            total: pages,
            perPage: perPage,
            skip: skip,
            to: (studentfee.length + 10)
        });
    } else {
        res.render('fee-management/detail', {
            title: 'Details Receipt',
            breadcrumbs: true,
            search_bar: true
        });
    }
});

//pay 
router.get('/pay', [ensureAuthenticated,  createAccessControl || isAdmin], async (req, res) => {
    const paymentId = randomString.generate({
        length: 16,
        charset: 'numeric'
    });

    res.render('fee-management/pay', {
        title: 'Pay Fee',
        breadcrumbs: true,
        paymentId: paymentId
    });
});
//post add pay
router.post('/pay',[ensureAuthenticated,  createAccessControl || isAdmin], async (req, res) => {
    let errors = [];

    const {
        error
    } = validateFee(req.body);
    
    if (error) {
        errors.push({
            text: error.details[0].message
        });
        res.render('fee-management/pay', {
            title: 'Pay Fee',
            breadcrumbs: true,
            errors: errors,
            body: req.body
        });
    } else {
        const payment = new StudentFee({
            studentRoll: req.body.studentRoll,
            studentName: req.body.studentName,
            Semester: req.body.studentSemester,
            section: req.body.studentSection,
            department: req.body.studentDept,
            course: req.body.studentCourse,
            tuition: req.body.tuition,
            tuitionDiscount: req.body.tuitionDiscount,
            dateOfPayment: req.body.dateOfPayment,
            totalFee: req.body.totalFee ,
            paymentId: req.body.paymentId
        });
        
        try {
            const result = await payment.save();
            
            if (result) {
                req.flash('success_msg', 'Payment Successfull.');
                res.redirect('/fee-management');
            }
        } catch (ex) {
            for (i in ex.errors) {
                errors.push({
                    text: ex.errors[i].message
                });
            }
            
            res.render('fee-management/pay', {
                title: 'Pay Fee',
                breadcrumbs: true,
                errors: errors,
                body: req.body
            });
        }
    }
});
// Receipt Fee
router.get('/receipt-fee', [ensureAuthenticated,  readAccessControl || isAdmin], async (req, res) => {
    const studentfee = await StudentFee.findOne({
        paymentId: req.query.id
    });

    if (studentfee) {
        res.render('fee-management/receiptFee', {
            title: 'Receipt Fee',
            breadcrumbs: true,
            studentfee: studentfee
        });
    } else {
        req.flash('error_msg', 'No records found...');
    }
});
// EDIT
router.get('/edit', [ensureAuthenticated, updateAccessControl || isAdmin], async (req, res) => {
    const studentfee = await StudentFee.findOne({
        paymentId: req.query.id
    });

    if (studentfee) {
        res.render('fee-management/edit', {
            title: 'Edit Payment Receipt',
            breadcrumbs: true,
            studentfee: studentfee
        });
    }
});

//update
router.put('/:id', [ensureAuthenticated,  updateAccessControl || isAdmin], async (req, res) => {

    const {
        error
    } = validate(req.body);

    if (error) {
        req.flash('error_msg', error.details[0].message);
        res.redirect(`/fee-management/edit?id=${req.params.id}`);
    } else {
        const studentfee = await StudentFee.update({
            paymentId: req.params.id
        }, {
            $set: {
                studentRoll: req.body.studentRoll,
                studentName: req.body.studentName,
                Semester: req.body.studentSemester,
                section: req.body.studentSection,
                department: req.body.studentDept,
                course: req.body.studentCourse,
                tuition: req.body.tuition,
                tuitionDiscount: req.body.tuitionDiscount,
                dateOfPayment: req.body.dateOfPayment,
                totalFee: req.body.totalFee ,
                paymentId: req.body.paymentId
            }
        });

        if (studentfee) {
            req.flash('success_msg', 'Payment Details Updated Successfully.');
            res.redirect('/fee-management');
        }
    }
});


//delete
router.delete('/:id', [ensureAuthenticated,  deleteAccessControl || isAdmin], async (req, res) => {
    const result = await StudentFee.remove({
        paymentId: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('/fee-management/detail');
    } else {
        res.status(500).send();
    }
});


module.exports = router;