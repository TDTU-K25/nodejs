const http = require("http");
const url = require("url");
const querystring = require("querystring");

const port = 8000;

const students = [
  { id: 1, name: "Leo", gpa: 9.5 },
  { id: 2, name: "Mary Jane", gpa: 5 },
  { id: 3, name: "John Smith", gpa: 8.25 },
  { id: 4, name: "Oliver", gpa: 5.5 },
  { id: 5, name: "Eric", gpa: 7 },
];

const isIdExist = (id) => {
  return students.find((student) => student.id == id) !== undefined;
};

http
  .createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    const method = req.method;
    const pathSegments = pathname.split("/");
    const path = "/" + pathSegments[1];
    const id = pathSegments[2];
    switch (path) {
      default:
        res.writeHead(404, { "Content-type": "application/json" });
        res.end(
          JSON.stringify({
            status: 404,
            message: "404 Not Found",
          })
        );
        break;

      case "/students":
        if (id === undefined || id === null) {
          switch (method) {
            case "GET":
              res.writeHead(200, { "Content-type": "application/json" });
              res.end(
                JSON.stringify({
                  status: 200,
                  data: students,
                })
              );
              break;
            case "POST":
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", () => {
                body = querystring.decode(body);
                const id = students.length + 1;
                const { name, gpa } = body;
                const student = {
                  id,
                  name,
                  gpa: parseFloat(gpa),
                };
                students.push(student);
                res.writeHead(200, { "Content-type": "application/json" });
                res.end(
                  JSON.stringify({
                    status: 200,
                    message: "Add student successfully",
                    student,
                  })
                );
              });
              break;
          }
        } else {
          switch (method) {
            case "GET":
              if (!isIdExist(id)) {
                res.writeHead(404, { "Content-type": "application/json" });
                return res.end(
                  JSON.stringify({
                    status: 404,
                    message: "ID does not exist",
                  })
                );
              }
              const student = students.find((student) => student.id == id);
              res.writeHead(200, { "Content-type": "application/json" });
              res.end(
                JSON.stringify({
                  status: 200,
                  message: "Get student successfully",
                  data: student,
                })
              );
              break;
            case "PUT":
              if (!isIdExist(id)) {
                res.writeHead(404, { "Content-type": "application/json" });
                return res.end(
                  JSON.stringify({
                    status: 404,
                    message: "ID does not exist",
                  })
                );
              }
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", () => {
                body = querystring.decode(body);
                const { name, gpa } = body;
                const student = {
                  id: parseInt(id),
                  name,
                  gpa: parseFloat(gpa),
                };
                students.splice(id - 1, 1, student);
                res.writeHead(200, { "Content-type": "application/json" });
                res.end(
                  JSON.stringify({
                    status: 200,
                    message: "Update student successfully",
                    student,
                  })
                );
              });
              break;
            case "DELETE":
              if (!isIdExist(id)) {
                res.writeHead(404, { "Content-type": "application/json" });
                return res.end(
                  JSON.stringify({
                    status: 404,
                    message: "ID does not exist",
                  })
                );
              }
              students.splice(id - 1, 1);
              res.writeHead(200, { "Content-type": "application/json" });
              res.end(
                JSON.stringify({
                  status: 200,
                  message: "Delete student successfully",
                })
              );
              break;
          }
        }
    }
  })
  .listen(port, () => {
    console.log(`Server starts at port ${port}`);
  });
