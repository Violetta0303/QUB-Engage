const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Headers Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Type", "application/json");
    next();
});

// Helper function to check if values are numeric, integers, and within range
function isIntegerAndInRange(value, min, max) {
    const num = Number(value);
    return !isNaN(num) && num === parseInt(value, 10) && num >= min && num <= max;
}

// Main route
app.get('/', async (req, res) => {
    let attendances = {
        attendance_1: req.query.attendance_1,
        attendance_2: req.query.attendance_2,
        attendance_3: req.query.attendance_3,
        attendance_4: req.query.attendance_4,
    };

    let cutoff = req.query.cutoff;

    if (Object.values(attendances).some(value => value === undefined) || cutoff === undefined) {
        return res.status(400).json({ error: true, message: "Missing or incomplete input." });
    }

    const ranges = { attendance_1: 33, attendance_2: 22, attendance_3: 44, attendance_4: 55 };
    for (let [key, value] of Object.entries(attendances)) {
        if (!isIntegerAndInRange(value, 0, ranges[key])) {
            return res.status(400).json({
                error: true,
                message: `${key} is out of range or not an integer. It should be an integer within the range [0, ${ranges[key]}].`
            });
        }
    }
    if (!isIntegerAndInRange(cutoff, 0, 100)) {
        return res.status(400).json({ error: true, message: "Cutoff is out of range or not an integer. It should be an integer within the range [0, 100]." });
    }

    try {
        const scoreResponse = await axios.get('http://qubengage-score.40381868.qpc.hal.davecutting.uk', { params: attendances });

        let engagementScore = parseFloat(scoreResponse.data.data);

        if (isNaN(engagementScore)) {
            return res.status(400).json({ error: true, message: "Invalid engagement score received." });
        }

        let risk = engagementScore < cutoff;

        let output = {
            error: false,
            attendance: attendances,
            cutoff: parseInt(cutoff, 10),
            engagementScore: engagementScore,
            risk: risk
        };

        res.json(output);
    } catch (error) {
        console.error('Error fetching engagementScore:', error);
        res.status(500).json({ error: true, message: 'Error fetching engagementScore' });
    }
});

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
    return server;
}

if (require.main === module) {
    startServer(process.env.PORT || 3000);
}

module.exports = { app, startServer };