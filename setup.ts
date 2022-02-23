import Database from "better-sqlite3";

const db = new Database("./data.db", {
    verbose: console.log,
});

const applicants = [
    {
        name: "Denis",
        phone: "1234",
    },
    {
        name: "Ed",
        phone: "4321",
    },
    {
        name: "Nico",
        phone: "5678",
    },
    {
        name: "Den",
        phone: "34567",
    },
    {
        name: "Edgar",
        phone: "76543",
    },
    {
        name: "Nicolas",
        phone: "1357",
    }
];

const interviewers = [
    {
        name: "Elon",
        phone: "1234",
    },
    {
        name: "Steve",
        phone: "4321",
    },
    {
        name: "Jef",
        phone: "5678",
    },
    {
        name: "Tim",
        phone: "34567",
    },
    {
        name: "Bill",
        phone: "76543",
    },
    {
        name: "Warren",
        phone: "1357",
    }
];

const interviews = [
    {
        applicantId: 1,
        interviewerId: 1,
        date: "22/02/2022"
    },
    {
        applicantId: 2,
        interviewerId: 2,
        date: "22/02/2022"
    },
    {
        applicantId: 3,
        interviewerId: 3,
        date: "22/02/2022"
    },
    {
        applicantId: 4,
        interviewerId: 4,
        date: "22/02/2022"
    },
    {
        applicantId: 5,
        interviewerId: 5,
        date: "22/02/2022"
    },
    {
        applicantId: 6,
        interviewerId: 6,
        date: "22/02/2022"
    },
    {
        applicantId: 1,
        interviewerId: 3,
        date: "22/02/2022"
    },
    {
        applicantId: 3,
        interviewerId: 5,
        date: "22/02/2022"
    },
    {
        applicantId: 6,
        interviewerId: 3,
        date: "22/02/2022"
    }
];

db.exec(`
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS applicants;
DROP TABLE IF EXISTS interviewers;
CREATE TABLE IF NOT EXISTS applicants ( 
id INTEGER PRIMARY KEY,
name TEXT NOT NULL,
phone TEXT NOT NULL );
CREATE TABLE IF NOT EXISTS interviewers ( 
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL );
CREATE TABLE IF NOT EXISTS interviews ( 
id INTEGER PRIMARY KEY,
date TEXT NOT NULL,
applicantId INTEGER FOREIN KEY references applicants(id),
interviewerId INTEGER FOREIN KEY references interviewers(id));
`);

const createApplicant = db.prepare(`
INSERT INTO applicants (name, phone) VALUES (?, ?);
`);

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, phone) VALUES (?, ?);
`);

const createInterview = db.prepare(`
INSERT INTO interviews (applicantId, interviewerId, date) VALUES (?,?,?);
`);

for (const applicant of applicants) {
    createApplicant.run(applicant.name, applicant.phone);
}

for (const interviewer of interviewers) {
    createInterviewer.run(interviewer.name, interviewer.phone);
}

for (const interview of interviews) {
    createInterview.run(interview.applicantId, interview.interviewerId, interview.date);
}