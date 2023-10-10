const express = require("express");
const expressHandlebars = require("express-handlebars");
const dotenv = require("dotenv");
const multer = require("multer");
const mime = require("mime-types");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${mime.extension(file.mimetype)}`);
  },
});

const upload = multer({ storage: storage });

const app = express();

dotenv.config({ path: `${__dirname}/.env` });

// configure Handlebars view engine
app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "main",
    helpers: {
      getCurrency: function (price) {
        return `$${price}`;
      },
    },
  })
);
app.set("view engine", "handlebars");

// middleware
app.use(
  require("express-session")({
    secret: "grxYxmQp8S",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(__dirname + "/public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// flash message
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

const products = [
  {
    id: 1,
    name: "iPhone XS",
    price: 1199,
    img: "uploads/1696044721639.jpeg",
    description:
      "Đến hẹn lại lên, năm nay Apple giới thiệu tới người dùng thế hệ tiếp theo với 3 phiên bản, trong đó có cái tên iPhone XS với những nâng cấp mạnh mẽ về phần cứng đến hiệu năng, màn hình cùng hàng loạt các trang bị cao cấp khác.",
  },
  {
    id: 2,
    name: "iPhone 12 Pro",
    price: 1399,
    img: "uploads/1696048000990.jpeg",
    description:
      "Ra mắt vào cuối năm 2020, iPhone 12 series mang đến một luồng gió với trong phân khúc smartphone cao cấp. Với thiết kế đổi mới đột phá so với thế hệ trước cùng nhiều nâng cấp về hiệu năng đáng kể trên iPhone 12 Pro. Đây sẽ là một trong những chiếc điện thoại đáng được bạn lựa chọn nhất so với các chiếc điện thoại khác cùng phân khúc giá.",
  },
  {
    id: 3,
    name: 'Macbook Pro 13" M1',
    price: 1299,
    img: "uploads/1696045568400.jpeg",
    description:
      "Macbook Pro M1 2020 được nâng cấp với bộ vi xử lý mới cực kỳ mạnh mẽ, chiếc laptop này sẽ phục vụ tốt cho công việc của bạn, đặc biệt cho lĩnh vực đồ họa, kỹ thuật.",
  },
  {
    id: 4,
    name: "Airpod Pro",
    price: 499,
    img: "uploads/1696045640403.jpeg",
    description:
      "Tai nghe Bluetooth AirPods Pro Wireless Charge Apple MWP22 nổi bật với kiểu dáng gọn gàng, sang trọng và được thiết kế theo dạng In-ear thay vì Earbuds như AirPods 2. Tính năng này cho phép tai nghe chống ồn tốt hơn, khó rớt khi đeo và đặc biệt là êm tai hơn.",
  },
];

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, pwd } = req.body;
  const { EMAIL, PASSWORD } = process.env;
  if (email === EMAIL && pwd === PASSWORD) {
    req.session.userName = EMAIL;
    res.redirect("/");
  } else {
    req.session.flash = {
      type: "danger",
      message: "Sai email hoặc mật khẩu",
    };
    res.redirect("/login");
  }
});

// check if user has already login or not
app.use((req, res, next) => {
  if (req.session.userName == null) {
    return res.redirect("/login");
  }
  next();
});

app.get("/", (req, res) => {
  res.render("index", { products });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", upload.single("img"), (req, res) => {
  const id = products.length + 1;
  const productInfo = Object.values(req.body);
  const { name, price, description } = req.body;

  if (productInfo.every((info) => info == "") || req.file == undefined) {
    req.session.flash = {
      type: "danger",
      message: "Vui lòng nhập đầy đủ thông tin",
    };
    return res.redirect("/add");
  }

  const product = {
    id,
    name,
    price,
    description,
    img: `uploads/${req.file.filename}`,
  };

  products.push(product);

  req.session.flash = {
    type: "success",
    message: "Thêm sản phẩm thành công",
  };

  res.redirect("/");
});

const isIdExist = (id) => {
  return products.find((product) => product.id == id) !== undefined;
};

app.get("/edit/:id", (req, res) => {
  const id = req.params["id"];
  if (!isIdExist(id)) {
    req.session.flash = {
      type: "danger",
      message: "ID not exists",
    };
    return res.redirect("/");
  }
  const product = products.find((product) => product.id == id);
  res.render("edit", { product });
});

app.post("/edit/:id", upload.single("img"), (req, res) => {
  const id = req.params["id"];
  if (!isIdExist(id)) {
    req.session.flash = {
      type: "danger",
      message: "ID not exists",
    };
    return res.redirect("/");
  }

  const { name, price, description } = req.body;
  const product = products.find((product) => product.id == id);
  product.name = name;
  product.price = price;
  product.description = description;
  // save the new image
  if (req.file) {
    product.img = `uploads/${req.file.filename}`;
  }

  req.session.flash = {
    type: "success",
    message: "Sửa sản phẩm thành công",
  };
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  if (!isIdExist(id)) {
    req.session.flash = {
      type: "danger",
      message: "ID not exists",
    };
    return res.redirect("/");
  }

  products.splice(id - 1, 1);

  req.session.flash = {
    type: "success",
    message: "Xóa sản phẩm thành công",
  };
  res.status(200).json({
    status: "success",
    message: "Xóa sản phẩm thành công",
  });
});

app.get("/:id", (req, res) => {
  const id = req.params["id"];
  if (!isIdExist(id)) {
    req.session.flash = {
      type: "danger",
      message: "ID not exists",
    };
    return res.redirect("/");
  }
  const product = products.find((product) => product.id == id);
  res.render("detail", { product });
});

app.use((req, res) => {
  res.type("text/html").status(404).render("errors/404");
});

// start server
const port = 8000;
app.listen(port, () => {
  console.log(`Server starts at port ${port}`);
});
