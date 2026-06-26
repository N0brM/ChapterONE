-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: chapterone
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapters` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProjectId` int NOT NULL,
  `Title` varchar(200) NOT NULL,
  `Order` int NOT NULL,
  `Content` longtext,
  `WordCount` int NOT NULL DEFAULT '0',
  `ReadingTime` int NOT NULL DEFAULT '0',
  `PredominantEmotion` varchar(50) DEFAULT NULL,
  `LastAnalysisDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `ProjectId` (`ProjectId`),
  CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES (14,6,'SAMMY VAI COMPRAR PAO',1,NULL,0,0,NULL,NULL),(15,6,'SHAWN MORREU',2,NULL,0,0,NULL,NULL),(19,12,'o inicio ',1,'<p data-path-to-node=\"0\">The Philadelphia air smelled like burnt oil, cheap spray paint, and impending violence.</p><p data-path-to-node=\"1\">I leaned against the brick wall of the alleyway, the cold filtering right through my green tunic. My fingers wrapped naturally around the grip of my Uzi, resting in its holster. I was just trying to clear my head. Ever since I backed out of the hit on my ex—the blue-haired kid with the stupid mic—things had been messy. Daddy Dearest didn\'t take kindly to breached contracts, and in my line of work, burning bridges meant someone was eventually going to try and burn you.</p><p data-path-to-node=\"2\">Speak of the devil.</p><p data-path-to-node=\"3\">A sharp, metallic <i data-path-to-node=\"3\" data-index-in-node=\"18\">clink</i> echoed from the mouth of the alley. I didn\'t even have to look up to know who it was. The shadow stretching across the asphalt was perfectly sharp, holding a butterfly knife that caught the amber glow of the streetlamp.</p><p data-path-to-node=\"4\">\"Going somewhere, Pico?\"</p><p data-path-to-node=\"5\">Nene. Her voice was like broken glass coated in honey. She was twirling that blade with casual, terrifying precision, her eyes locked onto mine with that vacant, psychotic stare she always got right before she painted a room red.</p><p data-path-to-node=\"6\">And she wasn\'t alone. Walking up right behind her, dragging a heavy, spray-painted boombox, was Darnell. His hair was a bright, defiant column of flame, matching the absolute lack of chill in his expression. He dropped the stereo onto the concrete with a heavy thud, crossing his arms.</p><p data-path-to-node=\"7\">\"You messed up, man,\" Darnell said, his voice dropping into that smooth, rumbling register. \"The old man paid us a lot of cash to finish what you started. You shouldn\'t have spared the kid.\"</p><p data-path-to-node=\"8\">My chest tightened, a brief flash of our childhood flashing through my mind—surviving school shootings, lighting up blocks together, being a team. Now? We were on opposite sides of a bounty.</p><p data-path-to-node=\"9\">\"He\'s just a kid, Darnell,\" I spit back, letting my hand drop closer to my belt. \"And the demon guy who hired us is bad news. You really want to be his cleanup crew?\"</p><p data-path-to-node=\"10\">\"Cash is cash, Pico,\" Nene purred, stepping closer, the edge of her blade kissing the air. \"Besides... it\'s been a while since we had a real playground fight.\"</p><p data-path-to-node=\"11\">Darnell reached into his jacket. He didn\'t pull a gun. Instead, he pulled out a pristine, matte-black microphone, pointing it at me like a loaded barrel. He kicked the side of the boombox, and a heavy, subterranean bassline tore through the alleyway, shaking the loose bricks.</p><p data-path-to-node=\"12\">\"Let\'s see if you\'ve still got that rhythm, punk,\" Darnell grinned, a dangerous spark in his eyes. \"Or if you\'ve gone soft.\"</p><p data-path-to-node=\"13\">I let out a breath that was half-laugh, half-growl. Standard Philly rules. Before the lead starts flying, you see who can hold the mic. I pulled my own microphone from my pocket, flipping it into my palm.</p><p data-path-to-node=\"14\">\"Bring it, sparky.\"</p><p data-path-to-node=\"15\">The first track—<b data-path-to-node=\"15\" data-index-in-node=\"16\">Darnell</b>—hit like a physical punch. Darnell’s voice tore through the speaker, crisp, sharp, and dripping with arrogance. He was testing my reflexes, throwing rapid-fire, syncopated barbs at me. I threw them right back, my voice gravelly and raw, matching his flow beat for beat. We were moving in a strange, kinetic dance, barking lyrics into the neon-lit dark.</p><p data-path-to-node=\"16\">Nene stood on top of the boombox, her head bobbing to the rhythm, though her hand never stopped twitching toward her knife. Every time I slipped up a syllable, I could feel her eyes calculating exactly where to slice.</p><p data-path-to-node=\"17\">The beat shifted, bleeding directly into <b data-path-to-node=\"17\" data-index-in-node=\"41\">Lit Up</b>. The tempo skyrocketed. Darnell grinned, his hands moving to his pockets. He pulled out a lighter, flicking it open. The flame caught his reflection as he began to spit fire—literally and lyrically. The air grew hot, suffocatingly so, as he tossed a handful of firecrackers onto the pavement between us.</p><p data-path-to-node=\"18\"><i data-path-to-node=\"18\" data-index-in-node=\"0\">Pop! Pop! Pop!</i></p><p data-path-to-node=\"19\">I had to weave, dodging the sparks while keeping my breath steady enough to hit the high, distorted notes. My heart was hammering against my ribs. This wasn\'t just a rap battle anymore; it was an eviction notice. I pushed back, letting my voice drop into a aggressive, rapid-fire staccato, driving him backward against his own wall of sound.</p><p data-path-to-node=\"20\">\"Not bad!\" Darnell yelled over the noise, his jacket smoking slightly. \"But let\'s see how you handle the heat!\"</p><p data-path-to-node=\"21\">The third round, <b data-path-to-node=\"21\" data-index-in-node=\"17\">2Hot</b>, was pure chaos. The music was a frantic, screaming wall of electronic bass. Darnell didn\'t just throw firecrackers this time; he pulled a whole damn aerosol can, sparking his lighter right in front of the nozzle. A massive torrent of flame erupted, illuminating the entire alley in blinding orange.</p><p data-path-to-node=\"22\">I didn\'t even think. My survival instincts—the ones forged in the blood-stained hallways of my childhood—took over. I drew my Uzi with my left hand while keeping the mic in my right. As the flames roared toward me, I opened fire, letting a burst of warning shots tear into the concrete, kicking up a shield of dust and chips to deflect the blast. I sang through the smoke, my voice turning into a weaponized screech, matching the literal explosions happening around us.</p><p data-path-to-node=\"23\">When the final chord of <i data-path-to-node=\"23\" data-index-in-node=\"24\">2Hot</i> echoed out and died, the alley fell into a heavy, panting silence. The boombox hissed with static.</p><p data-path-to-node=\"24\">Darnell was breathing hard, the aerosol can dropping from his hand. Nene was vibrating with excitement, practically begging for the signal to lunge.</p><p data-path-to-node=\"25\">I wiped a streak of soot from my forehead, my gun still smoking, my microphone clutched so tightly my knuckles were white.</p><p data-path-to-node=\"26\">\"We done yet?\" I asked, lowering the Uzi just an inch.</p><p data-path-to-node=\"27\">Darnell looked at the bullet holes in the pavement, then up at my face. The tense, murderous expression slowly melted off his features, replaced by a wry, familiar smirk. He chucked his microphone back into his pocket.</p><p data-path-to-node=\"28\">\"Yeah. We\'re done,\" Darnell said, shaking his head. \"Man, you haven\'t lost a step. If anything, you\'re crazier than you used to be.\"</p><p data-path-to-node=\"29\">Nene pouted, visibly disappointed, and tucked her butterfly knife away into her skirt with a dramatic sigh. \"Ugh, you guys are no fun. I wanted to see some blood.\"</p><p data-path-to-node=\"30\">\"Go find a stray cat, Nene,\" I muttered, finally holstering my gun. My chest relaxed, the adrenaline slow-burning its way out of my system.</p><p data-path-to-node=\"31\">Darnell walked over, slapping a heavy hand on my shoulder. \"Look, Daddy Dearest is gonna keep sending people. You know that, right? Next time, it might not be friends who are willing to settle it over a beat.\"</p><p data-path-to-node=\"32\">\"I know,\" I said, looking out toward the main street where the city lights blurs together. \"But let \'em come. I\'ve got plenty of ammo.\"</p><p data-path-to-node=\"33\">Darnell chuckled, picking up his boombox. \"Come on. Let\'s go get something to eat. You\'re buying, since you didn\'t let us collect your bounty.\"</p><p data-path-to-node=\"34\">I couldn\'t help but smile, walking out of the alleyway alongside the only two lunatics in this city I actually trusted. \"Yeah, yeah. Whatever. Just don\'t let Nene near the kitchen knives.\"</p>',1168,6,NULL,'2026-06-08 16:21:51'),(25,20,'aiai',1,'<div style=\"text-align: left;\"><span style=\"background-color: transparent; font-size: 1.15rem;\">aasasxacsdssacas</span></div>',7,1,NULL,'2026-06-17 23:50:37'),(26,21,'Shawn vai comprar leite',1,'<div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\"><div style=\"text-align: left;\">ui opah ui</div></div></div></div></div></div></div></div></div></div></div></div></div><div style=\"text-align: left;\">&nbsp;bom dia</div><div style=\"text-align: left;\">apois</div><div style=\"text-align: left;\"><br></div><div style=\"text-align: left;\"><img src=\"/uploads/chapter-images/46539be9-ebca-4293-b699-2fb4e608738f.png\"></div><div style=\"text-align: left;\"><img src=\"/uploads/chapter-images/b14ccc8b-44a0-47fb-a8da-f4b7994016d3.jpg\"></div>',42,1,NULL,'2026-06-26 14:47:51'),(31,30,'a',1,NULL,0,0,NULL,NULL),(32,30,'b',2,NULL,0,0,NULL,NULL),(33,30,'c',3,NULL,0,0,NULL,NULL),(34,30,'d',4,NULL,0,0,NULL,NULL),(35,30,'e',5,NULL,0,0,NULL,NULL),(36,31,'a',1,NULL,0,0,NULL,NULL),(37,31,'b',2,NULL,0,0,NULL,NULL),(38,31,'c',3,NULL,0,0,NULL,NULL),(39,31,'d',4,NULL,0,0,NULL,NULL),(40,31,'e',5,NULL,0,0,NULL,NULL),(41,32,'uno',1,NULL,0,0,NULL,NULL),(42,32,'dos',2,NULL,0,0,NULL,NULL),(43,32,'tres',3,NULL,0,0,NULL,NULL),(44,33,'uno',1,NULL,0,0,NULL,NULL),(45,33,'dos',2,NULL,0,0,NULL,NULL),(46,33,'tres',3,NULL,0,0,NULL,NULL),(47,34,'DONT DO THIS',10,NULL,0,0,NULL,NULL),(48,34,'I wish nikki freeman loved more than anyone in the world',1,NULL,0,0,NULL,NULL),(49,35,'DONT DO THIS',1,NULL,0,0,NULL,NULL),(50,35,'i wish nikki freeman loved me more than anything in the world',2,NULL,0,0,NULL,NULL),(51,37,'RUNAWAY',1,'<!-- obsidian --><p>Há séculos atrás foi documentado um surgimento de um vírus desconhecido por todo o planeta, um fenômeno que afetou globalmente todas as civilizações, mesmo não sendo letal, pelo menos não diretamente.</p><p>Apelidado de “Nuran” este vírus propagava-se através do oxigénio, funcionava como uma espécie de radiação, e ao entrar em contacto com humanos, ele tem uma pequena chance de se desenvolver dentro deles, tudo dependendo se o hóspede cumpre os devidos requisitos ou não. Quando isso acontece, o alvo e o vírus tornam-se 1 só, o Nuran reflete-se dentro da consciência do alvo e desenvolve-se usando a mesma como uma espécie de canalizador. Quando isto acontece, o alvo ganha habilidades fora do alcance humano e ganha poderes que o refletem direta ou indiretamente. Na chance do vírus não se conectar, o que acontece na maioria das vezes, nada acontece, embora haja sempre uma chance do vírus se poder conectar futuramente. </p><p>Teoricamente falando, qualquer pessoa de qualquer idade pode eventualmente \"desbloquear\" o seu Nuran, assim que 3 condições essenciais se alinharem:</p><p>-O Pico de emoção;</p><p>-O Combustível;</p><p>-E a Compatibilidade.</p><p><strong>1 - O Pico de emoção</strong><br>\nA porta de entrada para o Nuran, quando alguém experiencia uma emoção tão forte que o puxa para o seu limite (Medo, fúria, dor, felicidade, prazer, etc.). Qualquer pessoa vinculada ao Nuran teve uma experiência assim. Mas nem todas as pessoas que tiveram uma experiencia assim se vincularam, afinal, ainda faltam 2 requisitos.</p><p><strong>2 - O Combustível</strong><br>\nO vírus responde ao tamanho das ambições, ao quanto é que alguem quer algo, e é aqui que fica complexo, o Nuran nunca erra ao vincular-se com a consciência de alguem, mas ha sempre mais de uma maneira de resolver um problema. Alguem que deseja ser melhor pode receber 1001 habilidades diferentes para lidar com a sua situação. Mas o poder sempre reflete o contexto que o personagem se encontra, a personalidade e o que ele quer, tanto em como ele funciona como visualmente. Mas ainda há mais uma etapa.</p><p><strong>3 - A Compatibilidade</strong><br>\nÉ aqui que alguem fica pronto para o vínculo, uma pessoa com algo não resolvido dentro dela, um problema (Trauma, crise de identidade, medo de ser fraco, culpa, o desejo de controle, etc.). Este é o ultimo estágio de aceitação do Nuran, o que transforma um humano em algo maior. Ninguém vinculado ao Nuran não tem ou teve algo internamente não resolvido. É uma regra.</p><p><strong>O Preço do Nuran</strong></p><p>Isto não seria um vírus sem consequências. Como muitas coisas na vida, o Nuran funciona como uma substância viciante, o quanto mais alguem usa os seus poderes, mais propício fica a querer mais e mais, e se não usados com responsabilidade, pode haver a chance do usuário se perder nos seus limites e acontecer uma <a class=\"internal-link\" href=\"Renovação\" data-href=\"Renovação\">Renovação</a> (o usuário é consumido totalmente pelo vírus e transforma-se num monstro). </p><p>Alguém que cumpra os requisitos para poder manipular esses “poderes” pode escolher 2 caminhos, existem aqueles que os usam para o bem, e aqueles que tentam alcançar <a class=\"internal-link\" href=\"O Caminho da Estrela\" data-href=\"O Caminho da Estrela\">O Caminho da Estrela</a>. Em certos casos existe também uma secreta terceira opção, os poucos que mesmo depois de \"despertarem\" o seu Nuran, escolhem continuar a viver normalmente sem perder o que ja têm.</p><p><strong>Segurança Global</strong></p><p><!-- obsidian -->\n\n\n\n\n\n\n\n\n\n\n\n\n</p><p>Naturalmente, com o surgimento do Nuran ao longo dos tempos e com todos os riscos que o vírus apresenta, foram se criando organizações globais com o intuito de manter a ordem e a paz no mundo. Várias e várias foram criadas e destruídas a medida que os tempos foram mudando, mas apenas uma das antigas organizações sobreviveu até o presente, a <a class=\"internal-link\" href=\"G.O.D\" data-href=\"G.O.D\">G.O.D</a> (a maior organização no presente que trata de parar <a class=\"internal-link\" href=\"O Caminho da Estrela\" data-href=\"O Caminho da Estrela\">O Caminho da Estrela</a>)</p>',628,4,NULL,'2026-06-26 14:50:42'),(52,38,'yteste',1,'<p data-path-to-node=\"0\">O crepúsculo descia sobre a província não como um findar suave de dia, mas como uma cortina de chumbo, pesada e irrevogável. Sentado diante da secretária de mogno gasta pelo tempo, ele observava a poeira dançar na última réstia de luz fulgurante que filtrava pelas frestas das portadas. Havia um silêncio sepulcral na casa, um vazio que não se definia apenas pela ausência de som, mas pela densidade quase palpável da solidão que se instalara em cada canto, como o mofo que corrói os alicerces esquecidos.</p><p data-path-to-node=\"1\">Entre os seus dedos trêmulos, repousava uma carta cuja tinta outrora vibrante se esbatera num tom cinzento-melancólico. As palavras, que outrora carregavam a promessa de primaveras eternas, pareciam agora epitáfios de um tempo imemorial. A efemeridade da felicidade humana revelava-se ali, nua e crua, despida de qualquer artifício consolador. Ele percebia, com uma lucidez dilacerante, que a memória é um cinzel cruel: esculpe o que perdemos com uma nitidez que a realidade nunca possuiu, tornando a privação presente um fardo insustentável.</p><blockquote data-path-to-node=\"2\"><p data-path-to-node=\"2,0\">\"O verdadeiro luto não se chora com estrondo; consome-se na quietude de uma alma que compreendeu a irreversibilidade do tempo.\"</p></blockquote><p data-path-to-node=\"3\">Não havia espaço para o desespero colérico ou para o pranto catártico. O sentimento que o avassalava era uma tristeza outonal, uma resignação profunda diante do inevitável declínio de todas as coisas belas. Cada suspiro ecoava como um eco distante de um naufrágio interior, onde os destroços dos sonhos naufragados boiavam numa indiferença gélida. Olhando a vastidão deserta através do vidro fustigado pela chuva nascente, ele aceitou o seu destino: ser o guardião solitário de um museu de ausências, onde a única certeza era o tédio incurável de quem sobreviveu à sua própria alegria.</p>',283,2,NULL,'2026-06-26 12:40:40'),(53,39,'teste',1,'<p data-path-to-node=\"0\">A fenomenologia do afeto, quando manifesta na iminência do encontro amoroso, transcende a mera contingência biológica para se inscrever no domínio da transcendência subjetiva. Sob a claridade difusa da biblioteca pública — um espaço saturado de historicidade e silêncio —, as trajetórias de duas individualidades até então monádicas convergiram, operando uma reconfiguração radical nos seus respetivos horizontes de expectativa.</p><p data-path-to-node=\"1\">Ela mantinha o olhar fixo na exegese de um texto setecentista, mas a sua atenção não se circunscrevia à hermenêutica das palavras; antes, orientava-se latencialmente para a presença dele, que ocupava a mesa adjacente. Ele, por sua vez, fingia uma leitura absorta, embora toda a sua economia psíquica estivesse direcionada para a decodificação dos mínimos gestos dela: o virar quase impercetível de uma página, a inclinação geométrica da cabeça, o compasso rítmico da respiração que alterava a atmosfera circundante.</p><blockquote data-path-to-node=\"2\"><p data-path-to-node=\"2,0\">\"O amor, em sua génese intelectual, não se define pela posse do Outro, mas pela mútua autorização para que a alteridade ressignifique o Eu.\"</p></blockquote><p data-path-to-node=\"3\">Nesse microcosmo de erudição, o desejo não se manifestava através do impulso dionisíaco ou da urgência carnal, mas sim mediante uma sutil dialética de olhares furtivos e suspensões temporais. O espaço que os separava, mensurável em escassos metros lineares, revelava-se uma distância metafísica que ambos ansiavam por colapsar. Quando, por fim, os seus olhares se cruzaram sem a mediação do artifício, operou-se uma autêntica revolução copernicana nas suas perceções: a manualística académica e o rigor conceptual empalideceram diante da epifania daquela mútua vulnerabilidade partilhada.</p>',248,2,NULL,'2026-06-26 13:09:33');
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_references`
--

DROP TABLE IF EXISTS `project_references`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_references` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProjectId` int NOT NULL,
  `Type` varchar(20) NOT NULL DEFAULT 'character',
  `Name` varchar(100) NOT NULL,
  `Content` longtext,
  `CreatedAt` datetime NOT NULL,
  `ImageUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `ProjectId` (`ProjectId`),
  CONSTRAINT `project_references_ibfk_1` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_references`
--

LOCK TABLES `project_references` WRITE;
/*!40000 ALTER TABLE `project_references` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_references` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectcollaborators`
--

DROP TABLE IF EXISTS `projectcollaborators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectcollaborators` (
  `ProjectId` int NOT NULL,
  `UserId` int NOT NULL,
  `Role` varchar(50) NOT NULL,
  PRIMARY KEY (`ProjectId`,`UserId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `projectcollaborators_ibfk_1` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `projectcollaborators_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `chk_Role` CHECK ((`Role` in (_utf8mb4'admin',_utf8mb4'editor',_utf8mb4'viewer')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectcollaborators`
--

LOCK TABLES `projectcollaborators` WRITE;
/*!40000 ALTER TABLE `projectcollaborators` DISABLE KEYS */;
INSERT INTO `projectcollaborators` VALUES (21,3,'Editor'),(21,10,'Editor');
/*!40000 ALTER TABLE `projectcollaborators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(200) NOT NULL,
  `Description` text,
  `CreationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `OwnerId` int NOT NULL,
  `CoverImage` varchar(255) DEFAULT NULL,
  `CoverColor` varchar(7) DEFAULT '#6366f1',
  `ProjectType` varchar(50) DEFAULT 'Livro',
  `InviteCode` varchar(8) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`),
  KEY `OwnerId` (`OwnerId`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`OwnerId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Funkin\' on a friday night!','Whatever has been happening since ive been chasing that smurf looking guy','2026-04-17 10:30:16',1,NULL,'#6366f1','Livro',''),(2,'adada','adadadad','2026-05-11 18:30:59',1,NULL,'#6366f1','Livro',''),(3,'Go Pico','yea!','2026-05-12 16:59:53',1,NULL,'#6366f1','Livro',''),(4,'adada','adada','2026-05-12 17:00:53',1,NULL,'#6366f1','Livro',''),(5,'safaf','afsafa','2026-05-12 17:01:06',1,NULL,'#6366f1','Livro',''),(6,'Misfits','pixa','2026-05-21 21:59:15',2,NULL,'#ef4444','Livro',''),(7,'misfitelas','aaaa','2026-05-21 22:01:13',2,NULL,'#3b82f6','Livro',''),(12,'os tais dos misfeitos','','2026-06-08 16:17:58',5,NULL,'#ef4444','Serie','A4TZGK74'),(20,'teste','','2026-06-17 23:49:16',8,NULL,'#6366f1','Livro','UJNN9RM6'),(21,'Misfits','Uma história sobre 2 adolescentes superpoderosos que lutam contra as forças do mal.','2026-06-17 23:50:40',9,NULL,'#ef4444','Serie','V575ZLF3'),(30,'Pet Sematary','Dont Read with the lights off','2026-06-25 15:05:13',3,'/uploads/covers/df582dfb-3b56-4059-ad32-0ba973379eeb.jpg','#6366f1','Livro','SMRH27KF'),(31,'Pet Sematary without cover','','2026-06-25 15:05:51',3,NULL,'#10b981','Livro','V35CP7ZM'),(32,'Something very bad is going to happen','test','2026-06-25 15:07:57',3,'/uploads/covers/94cb8e66-31e2-49ec-afa4-ffa6a956405d.jpg','#6366f1','Serie','B42PTXFB'),(33,'Something very bad is going to happen without cover','test','2026-06-25 15:08:23',3,NULL,'#6366f1','Serie','HNW56YNG'),(34,'Obssession','You wished for this','2026-06-25 15:08:45',3,'/uploads/covers/d7d5bc6e-25d2-4616-b87e-bf7ef0f72ae0.webp','#6366f1','Filme','D5K5B238'),(35,'Obssession wihtout cover','teste','2026-06-25 15:10:07',3,NULL,'#ef4444','Filme','LLP538H9'),(36,'a e tal','','2026-06-26 01:35:59',10,'/uploads/covers/1f9e10fc-b746-4593-8869-7fe5373866f4.jpg','#ec4899','Livro','2XT5DHW8'),(37,'Godhunters','','2026-06-26 01:37:42',10,NULL,'#6366f1','Livro','B9ZY6G7K'),(38,'teste IA','','2026-06-26 01:42:49',3,NULL,'#ef4444','Livro','YTNSWB5G'),(39,'TesteIA Romance','','2026-06-26 13:09:20',3,NULL,'#ef4444','Serie','P9KGJEGU'),(40,'fodido','','2026-06-26 14:51:37',10,NULL,'#6366f1','Livro','MEXD64TM'),(41,'a','','2026-06-26 14:51:40',10,NULL,'#6366f1','Livro','6CLZRR8S'),(42,'a','','2026-06-26 14:51:59',10,'/uploads/covers/e2db8ecc-da00-4dc4-915f-13aa5b3a6804.jpg','#6366f1','Livro','WPNJSHER');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(256) NOT NULL,
  `RegistrationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ProfilePicture` varchar(255) DEFAULT 'default-avatar.png',
  `PreferredTheme` varchar(20) DEFAULT 'light',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Pico','PicoFulp@newgrounds.com','$2a$11$wwjahKCE/.lOe99WKyJb8.ImGTugtq68me5JzqFwVMS3veN.dWckK','2026-04-17 10:29:35','default-avatar.png','light'),(2,'HARRIQUE','MAILDOHARRIQUE@mail.com','$2a$11$.ArPW8wAgeyabKDfYNuq6eRxxkxkj7WYWeexp7TL9BuQ.0tXTRwW6','2026-05-21 21:56:17','/uploads/profiles/profile_2.png','modern-light'),(3,'Nobre','nobre@mail.com','$2a$11$9s1mIKvysG7oSIgSOaKfLOKJU44k6XIPezpVNR/p1ZFhahEC2up5i','2026-06-03 16:36:57','/uploads/profiles/f56e1594-28ce-4e55-8a1c-e0bba3bbdb31.jpg','retro-dark'),(4,'snoozy','snooz@mail.com','$2a$11$koSzfhRjPAbSay9mpAm66eLC15Yfk0A0MAIwRhRw.4/2RUs3s8WAq','2026-06-07 16:30:36',NULL,'modern-light'),(5,'MiguelNobre','Nobre@email.com','$2a$11$uPVln2BWDfhqfu/uIjG40OsEFyBvNCfrAf/ECT4gKEwZSVPyHIKZm','2026-06-08 15:26:19',NULL,'modern-light'),(6,'Ola','goombapromax@gmail.com','$2a$11$R9C6mRNbmVw6O4bn/DAzIuxdirlqrzzo7kWhtVQo65dxuuAPNqnke','2026-06-13 21:47:42','/uploads/profiles/99e88d17-75d9-48e2-bf54-976ffe3a2d97.jpg','modern-light'),(7,'a e ta','goomba2@gmail.com','$2a$11$OvChQeGU5fDxdIELSywDKO2mnuR9HSrgRACYa0Yx8PvHg.Tjn5rKC','2026-06-13 21:57:18',NULL,'modern-light'),(8,'aaa','aaa@gmail.com','$2a$11$DQ6ic/QZiHKiWI/JxZQc/eyX7qGdmpkvsXAXNLEZPO3/koB6cEVkK','2026-06-13 21:57:49','/uploads/profiles/62002679-3f55-413c-bf51-7b1221c76b4b.jpg','modern-light'),(9,'Henrique','maildohenriquebastos@gmail.com','$2a$11$0gbGdoYViBDLsHFybV94iO6Yub3lYURciofZXop5F328MqlYnxXYG','2026-06-17 23:49:17',NULL,'modern-light'),(10,'Goldun','galdunpt@gmail.com','$2a$11$DEW5/LY.PYFGJ4dVwglhBengNwosgzlSeRgB.ZmmbkFWoczRk40ym','2026-06-17 23:55:41','/uploads/profiles/25d27a7d-bf07-4e3d-ba51-5609a56d0a00.jpg','dark-theme');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-26 15:35:43
