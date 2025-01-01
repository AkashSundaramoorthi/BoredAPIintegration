const axios = require('axios');
const express = require('express');
const PORT = 3000;
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
var categories = ['Creative','Wellness','Cooking','Educational','Outdoor','Fitness','Community','Entertainment','Productive']
var participants = ['1-2', '1','1-4', '1-10','2-6', '2+','1-6', '2-10'];

app.get('/',(req,res) => {
    res.render('index.ejs',{
        cat: categories,
        par:participants,
        selectedcategory:null,
        selectedpeople:null,
        page:"home",
    });
});

app.get('/update', async(req,res) => {
    try {
        const response = await axios.get(`http://localhost:8000/all`);
        res.render('update.ejs',{
            page:'update',
            datas:response.data,
        });

    } catch (error) {
        console.error("Failed to make request:", error.message);
        return res.render("update.ejs", {
            error: "Activities can't be fetched.",
        });
    }
});

app.post('/update', async (req,res)=>{
    var key = req.body.id;
    var activity = req.body.activity;
    var participants = req.body.participants;
    var type = req.body.type;
    var difficulty = req.body.difficulty;
    var duration = req.body.duration;
    var datatosend,dataname;
    if(activity) {
        datatosend=activity;
        dataname='activity';
    }
    else if(participants){ 
        datatosend=participants;
        dataname='participants';
    }
    else if(type){ 
        dataname='type';
        datatosend=type;
    }
    else if(difficulty){ 
        datatosend=difficulty;
        dataname='difficulty';
    }
    else if(duration){ 
        datatosend=duration;
        dataname='duration';
    }
    axios.patch(`http://localhost:8000/cures/${key}`,{[dataname]:datatosend})
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

app.get('/add',(req,res)=> {
    res.render('add.ejs',{
        page:'add',
    });
});

app.post('/add', async(req,res) => {
    var data = req.body;
    axios.post(`http://localhost:8000/cures/create`,data)
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
    var Category = req.body.Category;
    var people = req.body.people;
    try {
        if (!Category && !people) {
            const response = await axios.get(`http://localhost:8000/random`);
            return res.render('index.ejs', {
                data: response.data,
                cat: categories,
                par: participants,
                selectedpeople:null,
                page:"home",
                selectedcategory: null,
            });
        }
        if (people && Category) {
            const response = await axios.get(
                `http://localhost:8000/cures/filter?type=${Category}&participants=${people}`
            );
            return res.render('index.ejs', {
                data: response.data,
                cat: categories,
                par: participants,
                page:"home",
                selectedcategory:Category,
                selectedpeople:people,
            });
        }
        if (Category) {
            const response = await axios.get(
                `http://localhost:8000/cures/filter?type=${Category}`
            );
            return res.render('index.ejs', {
                data: response.data,
                cat: categories,
                page:"home",
                par: participants,
                selectedpeople:null,
                selectedcategory:Category,
            });
        }
        if (people) {
            const response = await axios.get(
                `http://localhost:8000/cures/filter?participants=${people}`
            );
            return res.render('index.ejs', {
                data: response.data,
                cat: categories,
                page:"home",
                par: participants,
                selectedcategory:null,
                selectedpeople:people,
            });
        }
    } catch (error) {
        console.error("Failed to make request:", error.message);
        return res.render("index.ejs", {
            error: "No activities that match your criteria.",
            cat: categories,
            par: participants,
        });
    }
});

app.post("/delete", async(req,res)=>{
    const key = parseInt(req.body.delete);
    axios.delete(`http://localhost:8000/cures/${key}`)
        .then(response => {
            res.redirect('/update');
        })
        .catch(error => {
            console.error(`Error adding ${error}`);
        });
})

app.listen(PORT,()=>{
    console.log(`Listening on http://localhost:${PORT}`);
});