const express = require("express");
const ExpressError = require("./expressError");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function myParse(arr, next) {
	return arr.map((a) => {
		try {
			let out = parseInt(a);
			if (isNaN(out)) throw new ExpressError(`${a} is not a number`, 400);
			return out;
		} catch (err) {
			return next(err);
		}
	});
}

app.get("/mean", function (req, res, next) {
	let numQuery = req.query.nums;
	try {
		if (!numQuery || numQuery.length == 0)
			throw new ExpressError("Must provide some input", 400);
	} catch (err) {
		return next(err);
	}
	let input = numQuery.split(",");
	let parsed = myParse(input, next);
	let nums = parsed.reduce((a, b) => {
		return parseInt(a) + parseInt(b);
	});

	return res.json({ operation: "mean", value: nums / input.length });
});

app.get("/median", function (req, res, next) {
	let input = req.query.nums.split(",");
	let nums = myParse(input, next);
	nums = nums.sort((a, b) => a - b);

	return res.json({
		operation: "median",
		value: nums[Math.floor((nums.length - 1) / 2)],
	});
});

app.get("/mode", function (req, res, next) {
	let input = req.query.nums.split(",");
	let nums = myParse(input, next);
	let holder = {};
	nums.forEach((a) => {
		holder[a] = !holder[a] ? 1 : holder[a] + 1;
	});
	let output = nums[0];
	for (let value of nums) {
		output = holder[value] > holder[output] ? value : output;
	}

	return res.json({
		operation: "mode",
		value: output,
	});
});

app.use(function (req, res, next) {
	const notFoundError = new ExpressError("Not Found", 404);
	return next(notFoundError);
});

app.use(function (err, req, res, next) {
	// the default status is 500 Internal Server Error
	let status = err.status || 500;
	let message = err.message;

	// set the status and alert the user
	return res.status(status).json({
		error: { message, status },
	});
});

let server = app.listen(3000, function () {
	console.log("App hosted at localhost:3000");
});

module.exports = { app, server };
