import express, { Request, Response } from 'express'
import routes from './api/routes'

const app = express()
const port = 8087

app.use(express.json())

app.use('/api/v1', routes)

// app.get('/myapp/', function(req, res){
//     res.send("Hello from the root application URL");
// });

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`)
}
)