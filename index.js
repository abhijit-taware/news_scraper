const express = require('express');
const axios= require('axios');
const cheerio = require('cheerio');
const PORT= process.env.PORT || 5000;

const app=express();

const newspapers=[{
    name:'telegraph',
    address:'https://www.telegraph.co.uk/climate-change',
    base:'https://www.telegraph.co.uk'
},{
    name:'guardian',
    address:'https://www.theguardian.com/environment/climate-crisis',
    base:''
}];

const articles=[];

app.get('/',(req,res)=>{
    res.json('Welcome to NEWS Scrapper Api');
});


newspapers.forEach(newspaper=>{
    axios.get(newspaper.address).then(response=>{
        const html=response.data;
        const cheerioParse=cheerio.load(html);
        
        cheerioParse('a:contains("climate")',html).each(function(){
            const title=cheerioParse(this).text();
            const url=cheerioParse(this).attr('href');
            articles.push({
                title:title,
                url:newspaper.base+url,
                source: newspaper.name
            });
        })
    })
});

//predefined urls in newspaper array to get news articles
app.get('/news/all',(req,res)=>{
  res.json(articles);
});

//specific to a newspaper passed as parameter
app.get('/news/:newspaperId',async(req,res)=>{
    const newspaperId=req.params.newspaperId;
    const newspaperAddress=newspapers.filter(newspaper=>newspaper.name===newspaperId)[0].address;
    const newspaperBase=newspapers.filter(newspaper=>newspaper.name===newspaperId)[0].base;
    axios.get(newspaperAddress).then(response=>{
        const html=response.data;
        const cheerioParse=cheerio.load(html);
        const specificArticles=[];

        cheerioParse('a:contains("climate")',html).each(function(){
            const title=cheerioParse(this).text();
            const url=cheerioParse(this).attr('href');
            specificArticles.push({
                title:title,
                url:newspaperBase+url,
                source:newspaperId
        })
    })
        res.json(specificArticles);
    }).catch((error)=>console.log(error));
});

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
