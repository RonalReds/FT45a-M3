const { json } = require("body-parser");
const express = require("express");

let publications = [];
let id = 1;

const server = express();

server.use(express.json());

server.post('/posts', (req, res) => {
    const { author, title, contents } = req.body;
    if (author && title && contents) {
        const publication = {
            author,
            title,
            contents,
            id: id++,
        }
        publications.push(publication) 
        res.status(200).json(publication)
    } else {
        
        res.status(404).json({error: "No se recibieron los parámetros necesarios para crear la publicación"})
    }
})


server.get('/posts', (req, res) => {
    const { author, title } = req.query;
    if (author && title) {
        const publicationsFiltered = publications.filter((publication) => {
            publication.author === author && publication.title === title
        })
        if (publicationsFiltered.length) {
            res.status(200).json(publicationsFiltered);
        } else {
            res.status(404).json({error: "No existe ninguna publicación con dicho título y autor indicado"})
        }
    }
})
server.get('/posts/:author', (req, res) => {
    const { author } = req.params;
    const publicationFiltered = publications.filter((publication) =>
        publication.author === author
    );
    if (publicationFiltered.length) {
      return res.status(200).json(publicationFiltered);
    }
    res.status(404).json({error: "No existe ninguna publicación del autor indicado"})
})

server.put('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    if (id && title && contents) {
        const publicationFiltered = publications.find((publication) => publication.id === Number(id));
        if (!publicationFiltered) {
            res.status(404).json({error: "No se recibió el id correcto necesario para modificar la publicación"})
        } else {
            publicationFiltered = {...publicationFiltered, title, contents}
        }
    } else {
        res.status(404).json({error: "No se recibieron los parámetros necesarios para modificar la publicación"})
    }
})

server.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "No se recibió el id de la publicación a eliminar" });
    } else {
        let publicationFiltered = publications.filter((publication) => publication.id !== Number(id))
        if (publications.length === publicationFiltered.length) {
            res.status(400).json({error: "No se recibió el id correcto necesario para eliminar la publicación"})
        } else {
            publications = publicationFiltered;
            res.status(200).json({ success: true })
        }
    }
})


//NO MODIFICAR EL CODIGO DE ABAJO. SE USA PARA EXPORTAR EL SERVIDOR Y CORRER LOS TESTS
module.exports = { publications, server };
