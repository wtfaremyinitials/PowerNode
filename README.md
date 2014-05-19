PowerNode
=========

A Node.js module to interface with PowerSchool

Why?
====

Firstly, why not? The main reason behind this project was an easy to use API to get raw data from PowerSchool, for graphs and alternative front ends for PowerSchool (**cough** *centerscout* **cough**).

Usage
=====

    var powernode = require('powernode');

    var log = function(data) {
        console.log(data);
    };

    var printCourses = function(student) {
        student.getCourses().then(log);
    };

    var bob = new Student();
    bob.authenticate('psd1337.yourschooldistrict.org', 'yourstudentid', 'yourpassword').then(printCourses);
    