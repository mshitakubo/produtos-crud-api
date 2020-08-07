const express =require('express')
const bodyParse =require('body-parser')
const mysql =require('mysql')
const handlebars=require('express-handlebars')
const app=express()
const urlencodeParser=bodyParse.urlencoded({extended:false})

app.engine("handlebars", handlebars({defaultLayout:'main'}))
app.set('view engine','handlebars')
app.use('/css', express.static('css'))
app.use('/img', express.static('img'))

const sql=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Entrada.1234',
    port: 3306
})

//seleciona o database
sql.query('use produtos')


app.get('/', function(req,res){
    res.render('index')
})

//Rota do Form utilizado para cadastro
app.get('/cadastrar', function(req, res){
    res.render('cadastrar.handlebars')
})
//Rota do post que envia as informações para o banco de dados.
app.post('/controllerForm',urlencodeParser,function(req, res){
    sql.query("insert into produtos (nome, descricao, marca, modelo, preco) values (?,?,?,?,?)",
    [req.body.nome, req.body.descricao, req.body.marca, req.body.modelo, req.body.preco])
    res.render('controllerForm', {nome:req.body.nome})
})

app.get('/visualizar/:id?',function(req, res){
    if(!req.params.id){
        sql.query("select * from produtos order by id asc", function(err, results,fields){
            res.render('visualizar',{data:results})
        })
    } else {
        sql.query("select * from produtos where id=? order by id asc",[req.params.id], function(err, results,fields){
            res.render('visualizar',{data:results})
    })
    }
})

app.get('/deletar/:id', function(req, res){
    sql.query("delete from produtos where id=?",[req.params.id])
    res.render('deletar')
})

app.get('/atualizar/:id',function(req,res){
    sql.query("select * from produtos where id=?", [req.params.id], function(err, results, fields){
        res.render('update',{id:req.params.id, nome:results[0].nome, descricao:results[0].descricao, marca:results[0].marca, 
            modelo: results[0].modelo, preco:results[0].preco})
    })
})

app.post('/controllerUpdate', urlencodeParser, function(req,res){
    sql.query("update produtos set nome=?, descricao=?, marca=?, modelo=?, preco=? where id=?",
    [req.body.nome, req.body.descricao, req.body.marca, req.body.modelo, req.body.preco, req.body.id])
    res.render('controllerUpdate')
})



app.listen(3031,function(req,res){
    console.log('Servidor está rodando no endereço: localhost:3031')
})