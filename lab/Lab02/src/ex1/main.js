const http = require("http");
const url = require("url");

const port = 8000;

http
  .createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    switch (pathname) {
      case "/":
        res.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
        res.end(`<form action="/result" method="get">
					<table>
						<tr>
							<td>Số hạng 1</td>
							<td>
								<input type="number" name="a">
							</td>
						</tr>
						<tr>
							<td>Số hạng 2</td>
							<td>
								<input type="number" name="b">
							</td>
						</tr>
						<tr>
							<td>Phép tính</td>
							<td>
								<select name="op" id="">
									<option selected value="">Chọn phép tính</option>
									<option value="+">+</option>
									<option value="-">-</option>
									<option value="*">*</option>
									<option value="/">/</option>
								</select>
							</td>
						</tr>
						<tr>
							<td></td>
							<td>
								<button>Tính</button>
							</td>
						</tr>
					</table>
				</form>`);
        break;
      case "/result":
        const params = url.parse(req.url, true).query;
        const { a, b, op } = params;
        res.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
        if (op === undefined || op === null || op === "") {
          return res.end("Bạn chưa chọn phép toán");
        }
        let result = 0;
        switch (op) {
          case "+":
            result = parseInt(a) + parseInt(b);
            break;
          case "-":
            result = parseInt(a) - parseInt(b);
            break;
          case "*":
            result = parseInt(a) * parseInt(b);
            break;
          case "/":
            result = parseInt(a) / parseInt(b);
            break;

          default:
            break;
        }
        res.end(`${a} ${op} ${b} = <b>${result}</b>`);
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
