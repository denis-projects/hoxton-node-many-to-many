import Database from "better-sqlite3";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 1234;

const db = new Database("./data.db", {
    verbose: console.log,
});


//Joining tables many to many

const getInterviewersForApplicant = db.prepare(`
SELECT interviewers.* FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.applicantId = ?;
`);

const getApplicantsForInterviewer = db.prepare(`
SELECT applicants.* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId = ?;
`);


// Get applicant from db
const getAllApplicants = db.prepare(`
SELECT * from applicants;
`);
const getApplicantById = db.prepare(`
SELECT * from applicants WHERE id = ?;
`);


//Create a applicant
const createApplicant = db.prepare(`
INSERT INTO applicants (name, phone) VALUES (?,?);
`);



//Get interviewers from db
const getAllInterviewers = db.prepare(`
SELECT * from interviewers;
`);
const getInterviewerById = db.prepare(`
SELECT * from interviewers WHERE id = ?;
`);

//Create interviewers
const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, phone) VALUES (?,?);
`);


//Get interviews
const getAllInterviews = db.prepare(`
SELECT * from interviews;
`);
const getInterviewById = db.prepare(`
SELECT * from interviews WHERE id = ?;
`);

//Create interview
const createInterview = db.prepare(`
INSERT INTO interviews (date, applicantId, interviewerId) VALUES (?,?,?);
`);



// Getting details for applicants
app.get("/applicants", (req, res) => {
    const applicants = getAllApplicants.all();

    for (const applicant of applicants) {
        const interviewers = getInterviewersForApplicant.all(applicant.id);
        applicant.interviewers = interviewers;
    }
    res.send(applicants);
});


app.get("/applicants/:id", (req, res) => {
    const id = req.params.id;
    const applicant = getApplicantById.get(id);
    if (applicant) {
        const interviewers = getInterviewersForApplicant.all(applicant.id);
        applicant.interviewers = interviewers;
        res.send(applicant);
    } else {
        res.status(404).send("Error: Can not find Applicant");
    }
});


// Create Applicant
app.post("/applicants", (req, res) => {
    const { name, phone } = req.body;

    const errors = [];
    if (typeof name !== "string") errors.push(`name is missing or not a string`);
    if (typeof phone !== "string")
        errors.push(`phone is missing or not a string`);

    if (errors.length === 0) {
        const info = createApplicant.run(name, phone);
        const newApplicant = getApplicantById.get(info.lastInsertRowid);
        res.send(newApplicant);
    } else {
        res.status(400).send({ errors: errors });
    }
});




// Getting Details for Interviewers
app.get("/interviewers", (req, res) => {
    const interviewers = getAllInterviewers.all();

    for (const interviewer of interviewers) {
        const applicants = getApplicantsForInterviewer.all(interviewer.id);
        interviewer.applicants = applicants;
    }
    res.send(interviewers);
});

app.get("/interviewers/:id", (req, res) => {
    const id = req.params.id;
    const interviewer = getInterviewerById.get(id);

    if (interviewer) {
        const applicants = getApplicantsForInterviewer.all(interviewer.id);
        interviewer.applicants = applicants;
        res.send(interviewer);
    } else {
        res.status(404).send("Error: Interviewer not found");
    }
});

// Create interviewer
app.post("/interviewers", (req, res) => {
    const { name, phone } = req.body;

    const errors = [];
    if (typeof name !== "string") errors.push(`phone is missing or not a string`);
    if (typeof phone !== "string")
        errors.push(`email is missing or not a string`);

    if (errors.length === 0) {
        const info = createInterviewer.run(name, phone);
        const newInterviewer = getInterviewerById.get(info.lastInsertRowid);
        res.send(newInterviewer);
    } else {
        res.status(400).send({ errors: errors });
    }
});

//Create Interviews
app.post("/interviews", (req, res) => {
    const { date, applicantId, interviewerId } = req.body;

    const errors = [];
    if (typeof date !== "string") errors.push(`date is missing or not a string`);
    if (typeof applicantId !== "number") errors.push(`applicantId is missing or not a number`);
    if (typeof interviewerId !== "number") errors.push(`interviewerId is missing or not a number`);

    if (errors.length === 0) {
        const applicant = getApplicantById.get(applicantId);
        const interviewer = getInterviewerById.get(interviewerId);

        if (applicant && interviewer) {
            const info = createInterview.run(date, applicantId, interviewerId);
            const interview = getInterviewById.get(info.lastInsertRowid);
            res.send(interview);
        } else {
            res.status(400).send({ error: "Applicant or interviewer not found." });
        }
    } else {
        res.status(400).send({ errors: errors });
    }
});


// Listen the app
app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});