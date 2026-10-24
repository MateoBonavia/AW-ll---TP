-- Conectar a la base de datos 'tienda'
\c tienda;

-- Ligas 
CREATE TABLE ligas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
);

-- Productos 
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL DEFAULT '',
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    etiqueta VARCHAR(50) NULL,
    anio VARCHAR(10) NULL,
    liga_id INTEGER REFERENCES ligas(id),
    imagenes TEXT[] NOT NULL DEFAULT '{}',
    talles TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}'
);

INSERT INTO ligas (nombre) VALUES
    ('Selecciones'),
    ('Premier League'),
    ('Liga Argentina'),
    ('Serie A');

INSERT INTO productos (nombre, descripcion, precio, etiqueta, anio, liga_id, imagenes, talles, tags) VALUES
    ('Argentina Titular 2024 (Copa América)', 'Camiseta oficial titular de la Selección Argentina para la Copa América 2024. Presenta los tradicionales bastones celestes y blancos con detalles dorados, las tres estrellas y el parche oficial de Campeón del Mundo FIFA en el centro.', 90, 'BESTSELLER', '2024', 1,
     ARRAY['./recursos/Camisetas/Argentina/titular/titular_frente.jpg', './recursos/Camisetas/Argentina/titular/titular_dorso.jpg', './recursos/Camisetas/Argentina/titular/titular_detalle.jpg'],
     ARRAY['S', 'M', 'L'],
     ARRAY['SELECCIÓN', 'COPA AMÉRICA', 'CAMPEÓN DEL MUNDO']),
    ('Chelsea Titular 2025', 'Camiseta oficial titular del Chelsea FC para la temporada 2025. Destaca por su tono azul vibrante con trama gráfica simulando fuego líquido, cuello estilo polo y detalles dorados en el Swoosh y el escudo.', 80, 'NUEVO', '2025', 2,
     ARRAY['./recursos/Camisetas/Chelsea/titular/titular_frente.jpg', './recursos/Camisetas/Chelsea/titular/titular_dorso.jpg'],
     ARRAY['M', 'L', 'XL'],
     ARRAY['PREMIER LEAGUE', 'INGLATERRA', 'CHELSEA']),
    ('Racing Club Titular 2024', 'Camiseta oficial titular de Racing Club para la temporada 2024. Presenta los tradicionales franjas verticales celestes y blancas con detalles en azul marino en cuello y mangas, e incluye el lema ''El Primer Grande'' en el interior.', 75, 'HISTÓRICA', '2024', 3,
     ARRAY['./recursos/Camisetas/Racing Club/titular/titular_frente.jpg', './recursos/Camisetas/Racing Club/titular/titular_dorso.jpg', './recursos/Camisetas/Racing Club/titular/titular_cuello.jpg'],
     ARRAY['S', 'M'],
     ARRAY['ARGENTINA', 'LIGA PROFESIONAL', 'RACING CLUB']),
    ('River Plate Titular 2024-25', 'Camiseta oficial titular de River Plate para la temporada 2024-25. Destaca por su clásica banda roja cruzada, cuello en V con vivos en rojo y negro, y las tres tiras de Adidas ubicadas horizontalmente en los puños de las mangas.', 85, 'TOP SELLER', '2024', 3,
     ARRAY['./recursos/Camisetas/River Plate/titular/titular_frente.jpg', './recursos/Camisetas/River Plate/titular/titular_dorso.jpg', './recursos/Camisetas/River Plate/titular/titular_escudo.jpg'],
     ARRAY['M', 'L', 'XL'],
     ARRAY['ARGENTINA', 'LIGA PROFESIONAL', 'RIVER PLATE']),
    ('Inter de Milán Alternativa 2023-24', 'Camiseta oficial tercera/alternativa del Inter de Milán para la temporada 2023-24. Diseñada en tono azul oscuro con intensos detalles naranjas en cuello, mangas y costuras, destacando el escudo del club centrado en el pecho.', 85, 'NUEVO', '2023', 4,
     ARRAY['./recursos/Camisetas/Inter Milan/Alternativa/alternativa_frente.jpg', './recursos/Camisetas/Inter Milan/Alternativa/alternativa_espalda.jpg', './recursos/Camisetas/Inter Milan/Alternativa/alternativa_escudo.jpg'],
     ARRAY['S', 'M', 'L', 'XL'],
     ARRAY['ITALIA', 'SERIE A', 'INTER DE MILÁN']),
    ('Platense Titular 2024', 'Camiseta oficial titular del Club Atlético Platense para la temporada 2024. Diseñada por Puma, presenta su clásico color marrón de base con la icónica franja horizontal blanca en el pecho y detalles a contraste en cuello y mangas.', 70, 'NUEVO', '2024', 3,
     ARRAY['./recursos/Camisetas/Platense/Alternativa/alternativa_frente.jpg', './recursos/Camisetas/Platense/Alternativa/alternativa_espalda.jpg', './recursos/Camisetas/Platense/Alternativa/alternativa_escudo.jpg'],
     ARRAY['S', 'M', 'L', 'XL'],
     ARRAY['ARGENTINA', 'LIGA PROFESIONAL', 'PLATENSE']),
    ('Platense Tercera 2024 (Edición Especial Black & Copper)', 'Camiseta oficial tercera/edición especial del Club Atlético Platense para la temporada 2024. Presenta una elegancia de base negra con estampado del monograma histórico CAP en marca de agua, complementado con detalles, escudo y sponsors en un exclusivo tono cobre metalizado.', 70, 'EDICIÓN ESPECIAL', '2024', 3,
     ARRAY['./recursos/Camisetas/Platense/Secundaria/secundaria_frente.jpg', './recursos/Camisetas/Platense/Secundaria/secundaria_espalda.jpg', './recursos/Camisetas/Platense/Secundaria/secundaria_escudo.jpg'],
     ARRAY['S', 'M', 'L', 'XL'],
     ARRAY['ARGENTINA', 'LIGA PROFESIONAL', 'PLATENSE']),
    ('Racing Club Camiseta Entrenamiento / Pre-Match 2024', 'Camiseta oficial de entrenamiento y pre-partido de Racing Club para la temporada 2024. Diseñada por Kappa, cuenta con un llamativo estampado gráfico abstracto en tonalidades azul marino, celeste y blanco con el escudo aplicado en el pecho.', 65, 'NUEVO', '2024', 3,
     ARRAY['./recursos/Camisetas/Racing Club/Entrenamiento/entrenamiento_frente.jpg', './recursos/Camisetas/Racing Club/Entrenamiento/entrenamiento_espalda.jpg', './recursos/Camisetas/Racing Club/Entrenamiento/entrenamiento_escudo.jpg'],
     ARRAY['S', 'M', 'L', 'XL'],
     ARRAY['ARGENTINA', 'LIGA PROFESIONAL', 'RACING CLUB']),
    ('Racing Club Suplente 2024', 'Camiseta oficial alternativa/suplente de Racing Club para la temporada 2024. Diseñada por Kappa, presenta una elegante base en azul marino con cuello redondo y vivos en los puños en tonos celeste y blanco, sumado al sello distintivo ''El Primer Grande'' en la parte interna del cuello.', 75, 'NUEVO', '2024', 3,
     ARRAY['./recursos/Camisetas/Racing Club/Visitante/visitante_frente.jpg', './recursos/Camisetas/Racing Club/Visitante/visitante_espalda.jpg', './recursos/Camisetas/Racing Club/Visitante/visitante_escudo.jpg'],
     ARRAY['S', 'M', 'L', 'XL'],
     ARRAY['ARGENTINA', 'LIGA PROFESIONAL', 'RACING CLUB']);