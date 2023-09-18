const http = require('http')
const URL = require('url')
const queryParser = require('querystring')

let students = new Map();
let pattern = /\/students\/[a-zA-Z0-9]+\/*$/ig

const server = http.createServer((req, res) => {
    res.writeHead (200, {
        'Content-Type': 'application/json'
    })

    let url = URL.parse(req.url)

    if(url.pathname === '/students'){
        if(req.method === 'POST'){
            return addStudent(req, res)
        }
        if(req.method === 'GET'){
            return loadStudent(req, res)
        }
        else return res.end(JSON.stringify({code: 101, message: `This ${req.method} method is not supported at /students`}))
    }
    else if(url.pathname.match(pattern)){
        let IdPattern = /[a-zA-Z0-9]+\/*$/ig
        let studentId = url.pathname.match(IdPattern)[0].replace(/\/*$/ig, '')
        return findStudentById(req, res, studentId);
    }
    else res.end(JSON.stringify({code:0,message:'The path is not supported'}))
})

function findStudentById(req, res, studentId) {
    if(!students.has(studentId)){
        return res.end(JSON.stringify({code: 103, message: `Không tìm thấy sinh viên với mã ${studentId}`}))
    }
    let student = students.get(studentId);
    return res.end(JSON.stringify({code: 0, message: 'Đã tìm thấy sinh viên',
                    data: student}))
}

function loadStudent(req, res){
    if(students.size === 0){
        return res.end(JSON.stringify({code: 101, message: 'Data has not students'}))
    }
    let studentList = Array.from(students.values())
    return res.end(JSON.stringify({code: 0, message: 'Successful read student data', data: studentList}))
}

function addStudent(req, res){
    let body = ''
    req.on('data', d => body += d.toString())
    req.on('end', () => {

        let input = queryParser.decode(body)
        if(!input.id){
            return res.end(JSON.stringify({code:1,message:'No student ID yet'}))
        }
        if(!input.name){
            return res.end(JSON.stringify({code:1,message:'No student name yet'}))
        }
        if(!input.age){
            return res.end(JSON.stringify({code:1,message:'No student age yet'}))
        }
        if(isNaN(input.age)){
            return res.end(JSON.stringify({code:1,message:'Student age is not in the correct format'}))
        }
        if(input.age < 15 || input.age > 100){
            return res.end(JSON.stringify({code:1,message:'Age must be between 15 - 100'}))
        }
        if(students.has(input.id)){
            return res.end(JSON.stringify({code:2,message:`This student ID ${input.id} is already exists`}))
        }

        students.set(input.id, input);
        
        return res.end(JSON.stringify({code: 0, message: 'Handle adding a student'}))
    })
}

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})