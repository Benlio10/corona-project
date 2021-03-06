const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const updateResults = require("./updateResults");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const countriesRouter = require("./routes/countries");
const globalRouter = require("./routes/global");

app.use("/countries", countriesRouter);
app.use("/global", globalRouter);

const uri = process.env.MONGO_URI;
mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then((res) => {
		console.log("Connected to MongoDB database");
	})
	.catch((err) => {
		console.log(err);
	});

const job = schedule.scheduleJob("0 */12 * * *", (fireDate) => {
	if (
		updateResults.updateGlobalResults() &&
		updateResults.updateCountryResults()
	) {
		console.log(`Results updated @ ${fireDate}`);
	}
});

updateResults.updateCountryResults();

app.listen(5000, () => {
	console.log("Server started");
});
