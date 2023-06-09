const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')


// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Naman Sethi'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Naman Sethi'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Naman Sethi'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){ 
        return res.send({
          error: 'You must proivde an address'
 
       })
 }
      geocode(req.query.address , (error,{latitude,longitude,location}= {}) =>{
        if (error){
            return res.send({error})
        }
        forecast(latitude,longitude, (error,forecastData)=>{
            if (error){
            return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
        
      })


    // res.send({
    //     forecast: 'Its so hot ',
    //     location: 'Delhi',
    //     address: req.query.address
    // })
})

app.get('/product', (req,res) =>{
    if(!req.query.search){ 
           return res.send({
             error: 'You must proivde a search term'
    
          })
    }
    console.log(req.query.search)
    res.send({
        proudcut: []
    })
})



app.get('*', (req,res) =>{
    res.render('404'),{
        title:'404',
        name:'Naman Sethi',
        errorMessage: 'Page not found'
    }
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})