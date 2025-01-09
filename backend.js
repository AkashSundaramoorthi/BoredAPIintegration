const axios = require('axios');
const express = require('express');
const path = require('path'); // Add this line for path module
const PORT = 3000;
const app = express();


const api_url = 'http://localhost:8000/'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public/"));
var categories = ['Creative', 'Wellness', 'Cooking', 'Educational', 'Outdoor', 'Fitness', 'Community', 'Entertainment', 'Productive'];
var participants = ['1-2', '1', '1-4', '1-10', '2-6', '2+', '1-6', '2-10'];

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs'); 

app.get('/', (req, res) => {
    res.render('index.ejs', {
        cat: categories,
        par: participants,
        selectedcategory: null,
        selectedpeople: null,
        page: "home",
    });
});

app.get('/update', async (req, res) => {
    try {
        const response = await axios.get(`${api_url}all`);
        res.render('update.ejs', {
            page: 'update',
            datas: response.data,
        });

    } catch (error) {
        console.error("Failed to make request:", error.message);
        return res.render("update.ejs", {
            error: "Activities can't be fetched.",
        });
    }
});

// Update post handler
app.post('/update', async (req, res) => {
    var key = req.body.id;
    var activity = req.body.activity;
    var participants = req.body.participants;
    var type = req.body.type;
    var difficulty = req.body.difficulty;
    var duration = req.body.duration;
    var datatosend, dataname;

    if (activity) {
        datatosend = activity;
        dataname = 'activity';
    } else if (participants) {
        datatosend = participants;
        dataname = 'participants';
    } else if (type) {
        dataname = 'type';
        datatosend = type;
    } else if (difficulty) {
        datatosend = difficulty;
        dataname = 'difficulty';
    } else if (duration) {
        datatosend = duration;
        dataname = 'duration';
    }

    axios.patch(`${api_url}cures/${key}`, { [dataname]: datatosend })
        .then(response => {
            res.render('update.ejs', {
                datas: response.data.updatedCure,
                page: 'update',
            });
        })
        .catch(error => {
            console.error(`Error sending ${error}`);
        });
});

app.get('/add', (req, res) => {
    res.render('add.ejs', {
        page: 'add',
    });
});

app.post('/add', async (req, res) => {
    var data = req.body;
    axios.post(`${api_url}cures/create`, data)
        .then(response => {
            res.render('add.ejs', {
                page: 'added',
            });
        })
        .catch(error => {
            console.error(`Error adding ${error}`);
            res.render('add.ejs', {
                page: 'notadded',
            });
        });
});

app.post("/", async (req, res) => {
    const Category = req.body.Category;
    const people = req.body.people;
    try {
        if (!Category && !people) {
            const response = await axios.get(`${api_url}random`);
            return res.render('index.ejs', {
                data: response.data,
                cat: categories,
                par: participants,
                selectedpeople: null,
                selectedcategory: null,
                page: "home",
            });
        }
        if (Category && people) {
            console.log(`${api_url}cures/filter?type=${Category}&participants=${people}`);
            const response = await axios.get(`${api_url}cures/filter?type=${Category}&participants=${people}`);
            return res.render('index.ejs', {
                data: response.data,
                cat: categories,
                par: participants,
                selectedcategory: Category,
                selectedpeople: people,
                page: "home",
            });
        }
        if (Category) {
            const response = await axios.get(
                `${api_url}cures/filter?type=${Category}`
            );
            return res.render('index.ejs', {
                data: response.data,
                cat: categories,
                par: participants,
                selectedpeople: null,
                selectedcategory: Category,
                page: "home",
            });
        }
        if (people) {
            const response = await axios.get(
                `${api_url}cures/filter?participants=${people}`
            );
            return res.render('index.ejs', {
                data: response.data,
                cat: categories,
                par: participants,
                selectedcategory: null,
                selectedpeople: people,
                page: "home",
            });
        }
    } catch (error) {
        console.error("Failed to make request:", error.message);
        return res.render("index.ejs", {
            error: "No activities that match your criteria.",
            cat: categories,
            par: participants,
            selectedcategory: null, 
            selectedpeople: null, 
            page: "home",
            message:"There is no cure for this selected category and people",
        });
    }
});


app.post("/delete", async (req, res) => {
    const key = parseInt(req.body.delete);
    axios.delete(`${api_url}cures/${key}`)
        .then(response => {
            res.redirect('/update');
        })
        .catch(error => {
            console.error(`Error adding ${error}`);
        });
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
