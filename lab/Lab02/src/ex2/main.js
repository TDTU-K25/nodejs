const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const port = 8000;

http
  .createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    switch (pathname) {
      case "/":
        fs.readFile(
          `${__dirname}/views/login.html`,
          "utf-8",
          (err, loginForm) => {
            if (err) {
              res.writeHead(500, { "Content-type": "application/json" });
              res.end(
                JSON.stringify({
                  status: 500,
                  message: err.message,
                })
              );
            }
            res.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
            res.end(loginForm);
          }
        );
        break;
      case "/login":
        if (req.method === "GET") {
          res.writeHead(405, { "Content-type": "text/html; charset=utf-8" });
          return res.end("Phương thức GET không được hỗ trợ");
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          body = querystring.decode(body);
          const { email, pwd } = body;
          if (pwd.length === 0) {
            res.writeHead(401, { "Content-type": "text/html; charset=utf-8" });
            return res.end("Mật khẩu không hợp lệ");
          } else if (email !== "admin@gmail.com" || pwd !== "admin") {
            res.writeHead(401, { "Content-type": "text/html; charset=utf-8" });
            return res.end("Sai email hoặc mật khẩu");
          }
          res.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
          res.end("Đăng nhập thành công");
        });
        break;
      default:
        res.writeHead(404, { "Content-type": "text/html; charset=utf-8" });
        res.end("Đường dẫn không hợp lệ");
        break;
    }
  })
  .listen(port, () => {
    console.log(`Server starts at port ${port}`);
  });
