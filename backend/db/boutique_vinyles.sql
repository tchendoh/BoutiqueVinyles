-- ============================================================
-- Boutique Vinyles - Script SQL
-- Création de la base de données et insertion des données
-- ============================================================

CREATE DATABASE IF NOT EXISTS boutique_vinyles
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE boutique_vinyles;

SELECT VERSION();

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE users (
    id            INT           AUTO_INCREMENT PRIMARY KEY,
    first_name    VARCHAR(100)  NOT NULL,
    last_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE products (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    title          VARCHAR(200)  NOT NULL,
    artist         VARCHAR(200)  NOT NULL,
    genre          VARCHAR(100)  NOT NULL,
    release_date   DATE NOT NULL,
    original_release_date DATE NULL,
    price          DECIMAL(10,2) NOT NULL,
    stock_quantity INT           NOT NULL DEFAULT 0,
    description    TEXT,
    image_url      VARCHAR(500),
    label          VARCHAR(200),
    format         VARCHAR(10)   NOT NULL DEFAULT '33rpm'
) ENGINE=InnoDB;

CREATE TABLE orders (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT           NOT NULL,
    status       VARCHAR(20)   NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE order_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT           NOT NULL,
    product_id INT           NOT NULL,
    quantity   INT           NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;


CREATE TABLE payments (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    order_id              INT           NOT NULL,
    paypal_transaction_id VARCHAR(100),
    amount                DECIMAL(10,2) NOT NULL,
    currency              VARCHAR(3)    NOT NULL DEFAULT 'CAD',
    status                VARCHAR(20)   NOT NULL DEFAULT 'pending',
    paid_at               TIMESTAMP     NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

-- Pour vider la table des produits et remettre l'incrément à 1
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE products;
SET FOREIGN_KEY_CHECKS = 1; -- important de réactiver

-- Produits (16 vinyles)
INSERT INTO products (title, artist, genre, release_date, original_release_date, price, stock_quantity, description, image_url, label, format) VALUES
('Snocaps',
 'Snocaps',
 'Alternative/Indie Rock, Indie Pop',
 '2025-10-31', NULL,
 34.99, 8,
 'Album indie rock des soeurs jumelles Allison et Katie Crutchfield, accompagnées de Brad Cook et MJ Lenderman. Enregistré comme un retour à leurs débuts musicaux communs.',
 '/images/snocaps_snocaps.webp',
 'ANTI- Records', '33rpm'),
('Double Infinity',
 'Big Thief',
 'Folk Rock, Indie Folk',
 '2025-09-05', NULL,
 34.99, 11,
 'Sixième album studio de Big Thief, enregistré en groupe en direct sur trois semaines au Power Station de New York. Produit et mixé par Dom Monks.',
 '/images/big_thief_double_infinity.webp',
 '4AD', '33rpm'),
('Bright Future',
 'Adrianne Lenker',
 'Folk, Indie Folk',
 '2024-03-22', NULL,
 34.99, 7,
 'Premier album solo de Lenker depuis 2020, enregistré en analogique pur dans un studio caché en forêt avec Nick Hakim, Mat Davidson et Josefin Runsteen.',
 '/images/adrianne_lenker_bright_future.webp',
 '4AD', '33rpm'),
('Triste Animal',
 'Lou-Adriane Cassidy',
 'Pop, Francophone',
 '2025-09-12', NULL,
 34.99, 5,
 'Troisième album studio de la chanteuse québécoise Lou-Adriane Cassidy, détentrice du Prix Félix-Leclerc 2024.',
 '/images/lou_adriane_cassidy_triste_animal.webp',
 'Bravo Musique', '33rpm'),
('Trouble Will Find Me',
 'The National',
 'Indie Rock',
 '2013-05-21', NULL,
 49.99, 6,
 'Sixième album du groupe de Cincinnati, considéré comme l''un de leurs meilleurs. Comprend les titres Demons, I Need My Girl et Pink Rabbits.',
 '/images/the_national_trouble_will_find_me.webp',
 '4AD', '33rpm 2LP'),
('Ogum Xangô',
 'Gil E Jorge',
 'Latin',
 '1975-01-01', NULL,
 54.99, 4,
 'Collaboration légendaire entre Gilberto Gil et Jorge Ben, enregistrée en direct en deux soirées. L''une des expériences sonores les plus radicales de la musique brésilienne.',
 '/images/gil_e_jorge_ogum_xango.webp',
 'Philips', '33rpm 2LP'),
('Le Dôme',
 'Jean Leloup',
 'Pop, Rock, Francophone',
 '2016-12-09', NULL,
 54.99, 9,
 'Album live mythique de Jean Leloup enregistré au Métropolis de Montréal en 2016. Quatre faces, quarante ans de carrière.',
 '/images/jean_leloup_le_dome.webp',
 'Audiogram', '33rpm 2LP'),
('Born to Die',
 'Lana Del Rey',
 'Pop, Indie Pop',
 '2012-01-31', NULL,
 36.99, 13,
 'Album de percée de Lana Del Rey avec les singles Video Games, Summertime Sadness et Blue Jeans. Une palette sonore d''americana gothique mêlée de hip-hop et de pop.',
 '/images/lana_del_rey_born_to_die.webp',
 'Interscope Records', '33rpm'),
('New Fragility',
 'Clap Your Hands Say Yeah',
 'Indie Rock, Alternative Rock',
 '2021-02-12', NULL,
 29.99, 6,
 'Cinquième album de Clap Your Hands Say Yeah, autoproduit et distribué de façon indépendante. Un retour introspectif et mature au son qui a fait leur réputation.',
 '/images/clap_your_hands_say_yeah_new_fragility.webp',
 'CYHSY', '33rpm'),
('3',
 'Violent Femmes',
 'Alternative Rock, Country Rock, Indie Rock',
 '1988-01-01', NULL,
 32.99, 5,
 'Troisième album du groupe de Milwaukee, qui explore des territoires plus country et folk tout en gardant l''énergie crue de leurs débuts.',
 '/images/violent_femmes_3.webp',
 'Slash Records', '33rpm'),
('Master of Puppets',
 'Metallica',
 'Thrash Metal, Speed Metal',
 '1986-03-03', NULL,
 36.99, 10,
 'Troisième album de Metallica, unanimement considéré comme l''un des plus grands albums de métal de tous les temps. Enregistré avec le bassiste Cliff Burton.',
 '/images/metallica_master_of_puppets.webp',
 'Elektra Records', '33rpm'),
('Ugly But Honest: 1996-1999',
 'Carissa''s Wierd',
 'Folk Rock, Indie Rock',
 '2010-10-12', NULL,
 54.99, 3,
 'Compilation de raretés et d''enregistrements early du groupe de Seattle, réunie et rééditée par Hardly Art sur vinyle bleu marble. Fondateurs discrets du mouvement sadcore.',
 '/images/carissas_wierd_ugly_but_honest.webp',
 'Hardly Art', '33rpm 2LP'),
('This Is America',
 'Childish Gambino',
 'Hip-Hop, Funk/Soul',
 '2018-05-05', NULL,
 16.99, 15,
 'Single 45 tours percutant de Donald Glover alias Childish Gambino. Gagnant du Grammy de la chanson de l''année 2019, avec Young Thug, 21 Savage et Quavo.',
 '/images/childish_gambino_this_is_america.webp',
 'RCA Records', '45rpm'),
('Le Grand Secret',
 'Indochine ft. Melissa Auf Der Maur',
 'Pop Rock, New Wave, Francophone',
 '2003-01-01', NULL,
 21.99, 4,
 'Maxi 12" du groupe emblématique français Indochine en collaboration avec Melissa Auf Der Maur. Inclut des remixes de Tricky, Trisomie 21 et Oli De Sat.',
 '/images/indochine_le_grand_secret.webp',
 'Polydor', '33rpm 12"'),
('L''Heptade XL',
 'Harmonium',
 'Prog Rock, Folk, Neo-Classical',
 '2016-11-18', '1976-11-15',
 59.99, 7,
 'Édition 40e anniversaire du chef-d''oeuvre d''Harmonium, remasterisée à partir des bandes originales par Serge Fiori et Louis Valois. Pressée sur vinyle 180g.',
 '/images/harmonium_lheptade_xl.webp',
 'Sony Music', '33rpm 2LP'),
('Les Fourmis',
 'Jean Leloup',
 'Alternative Rock, Pop Rock, Francophone',
 '2025-04-12', '1992-01-01',
 54.99, 6,
 'Réédition Record Store Day 2025 du classique de Jean Leloup sur vinyle vert 180g. Édition limitée remasterisée, pressée en 45rpm pour une qualité sonore optimale.',
 '/images/jean_leloup_les_fourmis.webp',
 'Audiogram', '45rp m 2LP');
