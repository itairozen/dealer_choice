const { db, syncAndSeed, models:{Item} } = require('./db');
const express = require('express');
const path = require('path');

const app = express();
app.get('/styles.css', (req,res)=> res.sendFile(path.join(__dirname, 'styles.css')));
app.get('/', (req,res)=> res.redirect('/items'));

app.get('/items', async(req,res,next)=>{
    try {
        const items = await Item.findAll();
        res.send(`
            <html>
              <head>
                <link rel='stylesheet' href='/styles.css' />
              </head>
              <body>
                <h1>Items (${items.length})</h1>
                <ul>
                  ${items.map( item => `
                  <li>
                    <a href='/items/${item.id}'>
                    ${item.name}
                    </a>
                  </li>
                  `).join('')}
                </ul>
              </body>
            </html>
        `);
    }
    catch(ex){
        next(ex);
    }
});

app.get('/items/:id', async(req,res,next)=>{
  try {
      /*here, you're only getting back one item from the database.
      instead of putting that one item in an array and mapping over it
      you could access the propertes of the object directly
      so instead of the html you have below you simply do:
      <h1>${item.name}</h1>
      <h3><a href='/items'>Back To Home</a></h3>
      <p>${item.details} </p>

      you also don't need to have the item.details inside the <ul> </ul> tags.
      The <ul> </ul> is used for bullet points (it stands for unordered list),
      whereas <p> </p> is used for text (it stands for paragraph).
      */
        const items = [await Item.findByPk(req.params.id)];
        res.send(`
            <html>
              <head>
                <link rel='stylesheet' href='/styles.css' />
              </head>
              <body>
                <h1>${items.map( item => item.name)}</h1>
                <h3><a href='/items'>Back To Home</a></h3>
                <ul>
                  ${items.map( item => `
                    ${item.details}
                  `).join('')}
                </ul>
              </body>
            </html>
        `);
    }
    catch(ex){
        next(ex);
    }
});

const init = async()=> {
   try {
    await db.authenticate();
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
   }
   catch(ex) {
    console.log(ex);
   }
};

init()
