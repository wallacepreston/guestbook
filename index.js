const http = require('http');
const qs = require('querystring');
const fs = require('fs');
let names = []

const server = http.createServer(function(req, res) {
  if (req.method === 'GET') {
    fs.readFile('./guests.txt', 'utf8', (err, data) => {
      if(err) console.log(err)
      else {
        console.log('data: ', data)
        names = data.split('|')
        console.log(names)
        res.write(`
     <html>
     <head></head>
     <body>
       <h1><a href='/'>My App</a></h1>
       ${
         names.map( name => `<div>${ name }</div>`).join('')
       }
       <form method='POST'>
         <input name='name' />
         <button>Add Name</button>
       </form>
     </body>
   </html>`)
     }})
  // res.end();

  } else {
    const formData = [];
    req.on('data', (chunk) => {
      console.log(chunk)
      formData.push(chunk);
    });
    req.on('end', ()=> {
      const body = qs.parse(formData.toString());
      fs.appendFile('guests.txt', `${body.name}|`, (err)=>{
        if(err) {
          res.setStatus = 500;
          res.write(err.toString());
          return res.end();
        }
        res.statusCode = 301;
        res.setHeader('location', '/');
        return res.end();      
      })  

    });
  }

});
server.listen(process.env.PORT || 3000);
