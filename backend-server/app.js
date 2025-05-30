//REQUIRES
var express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

//INICIALIZAR VARIABLES
var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.use(cors());

//ESCUCHAR PETICIONES
app.listen(3000, ()=>{
    console.log('Express Server - puerto 3000 online');
});

// BBDD
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd_angular'
})

mc.connect();

//RUTAS

//AGREGAR 
app.post('/productos', function (req, res) {
  let datosProducto = {
  //productId: 0, /* campo autoincremental */
  productName: req.body.name,
  productCode: req.body.code,
  releaseDate: req.body.date,
  price: parseInt(req.body.price),
  description: req.body.description,
  starRating: parseInt(req.body.rating),
  imageUrl: req.body.image
  };
  if (mc) {
    mc.query("INSERT INTO productos SET?", datosProducto, function (error, result) {
    if (error) {
    res.status(500).json({ "Mensaje": "Error" });
    }
    else {
    res.status(201).json({ "Mensaje": "Insertado" });
    }
    });
  }
});

// BORRAR

app.delete('/productos/:id', function (req, res){
  let id = req.params.id;
  if(mc){
    console.log(id);
    mc.query("DELETE FROM productos WHERE productId = ?", id, function(error, result){
      if(error){
        return res.status(500).json({"Mensaje":"Error"});
      }
      else{
        return res.status(200).json({"Mensaje":"Registro con id="+ id + " borrado"});
      }
    });
  }
});

//ACTUALIZAR PRODUCTO
app.put('/productos/:id', (req, res) => {
    let id = req.params.id;
    let producto = req.body;
    console.log(id);
    console.log(producto);
    if (!id || !producto) {
        return res.status(400).send({ error: producto, message: 'Debe proveer un id y los datos de un producto' });
    }
    mc.query("UPDATE productos SET ? WHERE productId = ?", [producto, id], function (error, results, fields) {
        if (error) throw error;
        return res.status(200).json({ "Mensaje": "Registro con id=" + id + " ha sido actualizado"});
    });
});

//ACTUALIZAR IMAGEN PRODUCTO
app.put('/upload/productos/:id', (req, res) => {
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No se ha seleccionado archivo',
      errors: { message: 'No se ha seleccionado una imagen' }
    });
  }

  // Obtener nombre del archivo
  let archivo = req.files.imagen;
  let nombreCortado = archivo.name.split('.');
  let extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Solo estas extensiones aceptamos
  let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Extensión no válida',
      errors: {
        message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ')
      }
    });
  }

  //Nombre del archivo personalizado
  let nombreArchivo = `${id}.${new Date().getMilliseconds()}.${extensionArchivo}`;

  //Mover el archivo temporal a un path
  let path = `./uploads/productos/${nombreArchivo}`;

  console.log(path);

  archivo.mv(path, err => {
    if (err){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al mover archivo',
        errors: err
      });
    }

    return res.status(200).json({
      ok:true,
      mensaje: 'Archivo subido correctamente',
    });
  });
  //falta insertar en la base de datos el nombre de la imagen
});

//PROBAR PETICION
app.get('/', function (req, res, next) {
  res.status(200).json ({
    ok: true,
    message: 'Peticion realizada correctamente',
  });
});

//Recuperar todos los productos
app.get('/productos', function (req, res) {
    mc.query('SELECT * FROM productos', function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'Lista de productos.'
        });
    });
});