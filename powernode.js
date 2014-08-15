var subprocess = require('child_process');
var xml2js = require('xml2js');
var Q = require('q');

var binPath    = __dirname + '/node_modules/casperjs/bin/casperjs'
var scriptPath = __dirname + '/getdata.js';

var packagejson = JSON.parse(require('fs').readFileSync('package.json'));
var userAgent = 'powernode/' + packagejson.version + ' (' + packagejson.repository + ')';

var getStudentData = function(hostname, username, password, cb) {
    var deferred = Q.defer();
    subprocess.execFile(binPath, [scriptPath, hostname, username, password], function(err, stdout, stderr) {
        if(stdout == 'BADPASS')
            deferred.reject('BADPASS');
        if((stdout+'').indexOf('CasperError') != -1)
            deferred.reject('INTERNAL');
        if(stdout == '')
            deferred.reject('UNKNOWN');

        xml2js.parseString(stdout, function(err, result) {
            deferred.resolve(clean(result));
        });
    });
    return deferred.promise.nodeify(cb);
};

// holy f**k, XML to JSON is messy
var clean = function(xmlObj) {
    xmlObj = xmlObj['HSTrn:HighSchoolTranscript']['Student'][0];

    var student = {};

    student.name = {};
    student.name.first  = xmlObj.Person[0].Name[0].FirstName;
    student.name.middle = xmlObj.Person[0].Name[0].MiddleName;
    student.name.last   = xmlObj.Person[0].Name[0].LastName;

    student.gpa = {};
    student.gpa.current = xmlObj.AcademicRecord[0].GPA[0].GradePointAverage[0];
    student.gpa.minimun = xmlObj.AcademicRecord[0].GPA[0].GPARangeMinimum[0];
    student.gpa.maximum = xmlObj.AcademicRecord[0].GPA[0].GPARangeMaximum[0];

    student.level = xmlObj.AcademicRecord[0].StudentLevel[0].StudentLevelCode[0];

    student.courses = xmlObj.AcademicRecord[0].Course.map(function(course) {
        return {
            title: course.CourseTitle[0],
            teacher: course.UserDefinedExtensions[0]['ao:CourseExtensions'][0]['ao:CourseTeacher'][0],
            term: course.UserDefinedExtensions[0]['ao:CourseExtensions'][0]['ao:CourseTerm'][0],
            grade: {
                letter: course.UserDefinedExtensions[0]['ao:CourseExtensions'][0]['ao:CourseGrade'][0]['ao:CurrentGradeLetter'][0],
                percent: course.UserDefinedExtensions[0]['ao:CourseExtensions'][0]['ao:CourseGrade'][0]['ao:CurrentGradeNumeric'][0]
            },
            assignments: course.UserDefinedExtensions[0]['ao:CourseExtensions'][0]['ao:Assignments'][0]['ao:Assignment'].map(function(assignment) {
                return {
                    title: assignment['ao:Name'][0],
                    short: assignment['ao:Abbr'][0],
                    category: assignment['ao:Category'][0],
                    due: assignment['ao:DueDate'][0],
                    grade: assignment['ao:Grade'][0]
                };
            })
        };
    });

    return student;
};

var setUserAgent = function(newAgent) {
    userAgent = 'powernode/' + packagejson.version + ' (' + packagejson.repository + ') on application ' + newAgent;
};

module.exports.getStudentData = getStudentData;
module.exports.setUserAgent   = setUserAgent;
