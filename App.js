const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.urlencoded({ extended: true }));
const FILE = "data.json";
function readData() {
return JSON.parse(fs.readFileSync(FILE, "utf8"));
}
function writeData(data) {
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}
/* HOME */
app.get("/", (req, res) => {
const data = readData();
let rows = "";
data.students.forEach(s => {
rows += `
<tr>
<td>${s.name}</td>
<td>${s.course}</td>
<td>
<form style="display:inline" action="/delete/${s.id}" method="post">
<button class="btn delete">Delete</button>
</form>
<form style="display:inline" action="/update/${s.id}" method="post">
<input name="course" placeholder="New Course" required>
<button class="btn">Update</button>
</form>
</td>
</tr>
`;
});
let html = fs.readFileSync("index.html", "utf8");
html = html.replace("{{rows}}", rows);
res.send(html);
});
/* CREATE */
app.post("/students", (req, res) => {
const data = readData();
data.students.push({
id: Date.now(),
name: req.body.name,
course: req.body.course
});
writeData(data);
res.redirect("/");
});
/* UPDATE */
app.post("/update/:id", (req, res) => {
const data = readData();
const student = data.students.find(s => s.id == req.params.id);
if (student) {
student.course = req.body.course;
writeData(data);
}
res.redirect("/");
});
/* DELETE */
app.post("/delete/:id", (req, res) => {
const data = readData();
data.students = data.students.filter(s => s.id != req.params.id);
writeData(data);
res.redirect("/");
});
app.listen(3000, () => {
console.log("Running → http://localhost:3000");
});
