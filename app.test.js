const axios = require("axios");
const app = require("./app");

test("Mean route", (done) => {
	axios
		.get("http://localhost:3000/mean?nums=1,2,3,4")
		.then((res) => {
			expect(res.data).toStrictEqual({ operation: "mean", value: 2.5 });
			done();
		})
		.catch((err) => {
			done(err);
		});
});

test("Mode route", (done) => {
	axios
		.get("http://localhost:3000/mode?nums=1,2,3,4,4,2,4,1,5,6")
		.then((res) => {
			expect(res.data).toStrictEqual({ operation: "mode", value: 4 });
			done();
		})
		.catch((err) => {
			done(err);
		});
});

test("Median route", (done) => {
	axios
		.get("http://localhost:3000/median?nums=1,2,3,4,4,2,4,1,5,6")
		.then((res) => {
			expect(res.data).toStrictEqual({ operation: "median", value: 3 });
			done();
		})
		.catch((err) => {
			done(err);
		});
});

afterAll(() => {
	app.server.close();
});
