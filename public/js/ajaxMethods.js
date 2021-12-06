function getDepartment() {
    const URL = 'http://localhost:5000/api/get-department';

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(xhttp.responseText);
            let result = '';

            for (let i = 0; i < res.length; i++) {
                result += `<option value="${res[i].dname}">${res[i].dname}</option>`;
            }

            document.getElementById('chooseDept').innerHTML = result;
        }
    };

    xhttp.open('GET', URL, true);
    xhttp.send();
}

function getCourses(dept) {

    const URL = `http://localhost:5000/api/get-courses?deptName=${dept}`;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            console.log(response);
            let output = '';

            for (let i = 0; i < response.length; i++) {
                output += `<option value="${response[i].courseName}">${response[i].courseName}</option>`;
            }
            document.getElementById('course').innerHTML = output;
        }
    };

    xhttp.open("GET", URL, true);
    xhttp.send();
}
//Get Fee
function getCourse(getCourseFee) {
    var URL = `http://localhost:5000/api/get-course?courseName=${getCourseFee}`;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            console.log(response);
            document.getElementById('tuition').value = response.courseFee;
        }
    };

    xhttp.open("GET", URL, true);
    xhttp.send();
}
//get total fee
// function getTotalFee() {
//     var tuitionFee = document.getElementById("tuition").value;
//     var tuitionDiscount = document.getElementById("discount").value;
//     var totalFee = tuitionFee - (tuitionFee * tuitionDiscount/100)
//     document.getElementById("totalFee").value = totalFee ;
// }

function getStudentInfo(studentRollNo) {
    const URL = `http://localhost:5000/api/getStudentInfo?studentRollNo=${studentRollNo}`;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(xhttp.responseText);
            let student = {
                studentName: res.StudentName.FirstName + " " + res.StudentName.LastName,
                Semester: res.Semester,
                section: res.Section,
                department: res.CourseName,
                course: res.BranchName
            }
            document.getElementById('studentName').value = student.studentName;
            document.getElementById('studentSemester').value = student.Semester;
            document.getElementById('studentSection').value = student.section;
            document.getElementById('studentDept').value = student.department;
            document.getElementById('studentCourse').value = student.course;
        }
    };

    xhttp.open("GET", URL, true);
    xhttp.send();
}

// function getStudentInfo(studentRollNo) {
//     const URL = `http://localhost:5000/api/getStudentInfo?studentRollNo=${studentRollNo}`;

//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             let res = JSON.parse(xhttp.responseText);
//             let student = {
//                 studentName: res.StudentName.FirstName + " " + res.StudentName.LastName,
//                 Semester: res.Semester,
//                 section: res.Section,
//                 department: res.CourseName,
//                 course: res.BranchName
//             }
//             // fetch(`http://localhost:5000/api/get-course?courseName=${CourseName}`)
//             // let course = JSON.parse(await Course.findOne({
//             //         courseName: res.courseName
//             //     }).select({
//             //         courseFee: 1,
//             //         _id: 0
//             // }))
//             // let courseFee = course.courseFee

//             document.getElementById('studentName').value = student.studentName;
//             document.getElementById('studentSemester').value = student.Semester;
//             document.getElementById('studentSection').value = student.section;
//             document.getElementById('studentDept').value = student.department;
//             document.getElementById('studentCourse').value = student.course;
//             document.getElementById('tuition').value = courseFee;
//         }
//     };

//     xhttp.open("GET", URL, true);
//     xhttp.send();
// }