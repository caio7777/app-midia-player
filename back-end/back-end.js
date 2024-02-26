const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')
const fs = require('fs')

app.use(express.static(path.join(__dirname,'public')));

app.use(express.static(path.join(__dirname, 'public/musicas')));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'public','index.html'))
})

const upload = multer({ storage: multer.memoryStorage() }); // define o diretório onde os arquivos serão salvos


app.post('/addMusic', upload.single('file'), function (req, res, next) {


  const savePath = path.join(__dirname, 'public/musicas', req.file.originalname);

  // Verifica se o arquivo já existe
  fs.access(savePath, fs.constants.F_OK, (err) => {
      if (!err) {
          // O arquivo já existe
          res.status(200).send(`
              <p>Arquivo já existe</p>
              <p>REDIRECTORING...</p>
              <script>
                  setTimeout(function(){
                      window.location.href = 'http://localhost:8080';
                  }, 2000);
              </script>
          `);
      } else {
          // Escreve o arquivo na pasta 'musicas'
          fs.writeFile(savePath, req.file.buffer, function(err) {
              if (err) {
                  console.log(err);
                  res.status(500).send('Ocorreu um erro ao salvar o arquivo.');
              } else {
                  res.send(`
                  <p>arquivo salvo</p>
                      <p>REDIRECTORING...</p>
                      <script>
                          setTimeout(function(){
                              window.location.href = 'http://localhost:8080';
                          }, 5000);
                      </script> 
                  `);
              }
          });
      }
  });
});


  

  app.get('/read', (req, res) => {
    // Define o caminho para a pasta 'musicas'
    const musicDir = path.join(__dirname, 'public/musicas');
    
    // Lê o diretório
    fs.readdir(musicDir, function(err, files) {
      if (err) {
        // Envia um código de status 500 e a mensagem de erro
        res.status(500).send(err.message);
      } else {
        // Cria um array com os caminhos completos dos arquivos
        const filePaths = files.map(file => path.join(musicDir, file));
        
        // Envia os caminhos dos arquivos de volta ao cliente
        res.json(filePaths);
        let cleanedArray = filePaths.map(path => {
             return path.replace(/C:\\Users\\caiob\\OneDrive\\Área de Trabalho\\intensivao_javascript\\back-end\\public/g, '');
          });
          
      }
    });
  });
  

app.listen(8080,()=>{
    console.log('server-up')
})
