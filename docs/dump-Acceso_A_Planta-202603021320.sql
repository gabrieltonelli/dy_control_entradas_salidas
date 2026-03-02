-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: dydb2-instance-1.cz8kik28igwg.us-east-1.rds.amazonaws.com    Database: Acceso_A_Planta
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `articulos`
--

DROP TABLE IF EXISTS `articulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articulos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idMovimiento` int NOT NULL,
  `codigoERP` varchar(30) DEFAULT NULL,
  `codigoQR` varchar(100) DEFAULT NULL,
  `codigoBarras` varchar(100) DEFAULT NULL,
  `codigoOtro` varchar(100) DEFAULT NULL,
  `descripcion` varchar(100) NOT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `idEstado` int NOT NULL,
  `idLugarOrigen` int NOT NULL,
  `remitente` varchar(30) DEFAULT NULL,
  `idLugarDestino` int DEFAULT NULL,
  `destinatario` varchar(30) DEFAULT NULL,
  `sinRetorno` tinyint(1) DEFAULT '0',
  `presentacion` enum('Unidad(es)','Bulto(s)','Kilo(s)') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `observacion` text,
  `usuario_app` varchar(100) DEFAULT NULL,
  `vigilador` varchar(30) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idEstado` (`idEstado`),
  KEY `idLugarOrigen` (`idLugarOrigen`),
  KEY `idLugarDestino` (`idLugarDestino`),
  KEY `idx_art_mov` (`idMovimiento`),
  CONSTRAINT `articulos_ibfk_1` FOREIGN KEY (`idMovimiento`) REFERENCES `movimientos` (`id`),
  CONSTRAINT `articulos_ibfk_2` FOREIGN KEY (`idEstado`) REFERENCES `objetoEstados` (`id`),
  CONSTRAINT `articulos_ibfk_3` FOREIGN KEY (`idLugarOrigen`) REFERENCES `lugares` (`id`),
  CONSTRAINT `articulos_ibfk_4` FOREIGN KEY (`idLugarDestino`) REFERENCES `lugares` (`id`),
  CONSTRAINT `articulos_chk_1` CHECK ((`cantidad` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articulos`
--

LOCK TABLES `articulos` WRITE;
/*!40000 ALTER TABLE `articulos` DISABLE KEYS */;
INSERT INTO `articulos` VALUES (1,43,NULL,NULL,NULL,NULL,'Prueba articulo 1 con retorno',3,1,1,NULL,2,'',0,'Bulto(s)',NULL,'gabrielt@donyeyo.com.ar',''),(2,43,NULL,NULL,NULL,NULL,'Prueba articulo 2 sin retorno',1,1,1,NULL,2,'',1,'Unidad(es)',NULL,'gabrielt@donyeyo.com.ar',''),(3,44,NULL,NULL,NULL,NULL,'prod1 con regreso',1,1,1,NULL,2,'',0,'Unidad(es)',NULL,'gabrielt@donyeyo.com.ar',''),(4,44,NULL,NULL,NULL,NULL,'prod2 sin regreso',4,1,1,NULL,2,'',1,'Bulto(s)',NULL,'gabrielt@donyeyo.com.ar',''),(5,45,NULL,NULL,NULL,NULL,'prod1 con regreso',1,1,1,NULL,2,'',1,'Unidad(es)',NULL,'gabrielt@donyeyo.com.ar',''),(6,48,NULL,NULL,NULL,NULL,'MI articulo con retorno',20,1,1,NULL,2,'',0,'Bulto(s)',NULL,'gabrielt@donyeyo.com.ar',''),(7,48,NULL,NULL,NULL,NULL,'Mi articulo sin retorno',5,1,1,NULL,2,'',1,'Unidad(es)',NULL,'gabrielt@donyeyo.com.ar',''),(8,50,NULL,NULL,NULL,NULL,'MI articulo con retorno',20,1,1,NULL,2,'',1,'Bulto(s)',NULL,'gabrielt@donyeyo.com.ar',''),(9,76,NULL,NULL,NULL,NULL,'un articulo',1,1,1,NULL,2,'',1,'Bulto(s)',NULL,'gabrielt@donyeyo.com.ar',''),(10,76,NULL,NULL,NULL,NULL,'otro articulo',1,1,1,NULL,2,'',1,'Bulto(s)',NULL,'gabrielt@donyeyo.com.ar',''),(11,85,NULL,NULL,NULL,NULL,'Ventilador A4PLUS',2,1,1,'',2,'',1,'Unidad(es)','','gabrielt@donyeyo.com.ar','');
/*!40000 ALTER TABLE `articulos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_art_ins` AFTER INSERT ON `articulos` FOR EACH ROW INSERT INTO `auditoria`

  (`entidad`, `idEntidad`, `usuario`, `vigilador`, `operacion`, `evento`, `modulo`)

VALUES

  ('articulos', NEW.`id`, NEW.`usuario_app`, NEW.`vigilador`, 'create',

   CONCAT('Artículo añadido: ', NEW.`descripcion`),

   'Gestor de Objetos') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_art_upd` AFTER UPDATE ON `articulos` FOR EACH ROW INSERT INTO `auditoria`

  (`entidad`, `idEntidad`, `usuario`, `vigilador`, `operacion`, `evento`, `modulo`)

VALUES

  ('articulos', NEW.`id`, NEW.`usuario_app`, NEW.`vigilador`, 'update',

   'Cambio en estado o ubicación del artículo',

   'Gestor de Objetos') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_art_del` BEFORE DELETE ON `articulos` FOR EACH ROW INSERT INTO `auditoria`

  (`entidad`, `idEntidad`, `usuario`, `vigilador`, `operacion`, `evento`, `modulo`)

VALUES

  ('articulos', OLD.`id`, OLD.`usuario_app`, OLD.`vigilador`, 'delete',

   'Eliminación de artículo del sistema',

   'Gestor de Objetos') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entidad` varchar(30) NOT NULL,
  `idEntidad` int NOT NULL,
  `usuario` varchar(60) NOT NULL,
  `vigilador` varchar(30) DEFAULT '',
  `fechaHora` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `operacion` enum('create','delete','update','access') NOT NULL,
  `evento` varchar(255) NOT NULL,
  `modulo` varchar(50) DEFAULT NULL,
  `query` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=596 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,'movimientos',4,'app_user','','2026-01-20 20:05:35','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(2,'movimientos',4,'app_user','','2026-01-20 20:18:35','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(3,'movimientos',4,'app_user','','2026-01-21 15:52:43','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(4,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-01-22 14:29:23','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(5,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-01-22 16:18:18','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(6,'movimientos',4,'ailins@donyeyo.com.ar','','2026-01-22 16:49:37','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(7,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-01-22 17:02:28','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(8,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-01-22 17:12:13','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(9,'movimientos',10,'ailins@donyeyo.com.ar','','2026-01-22 18:02:24','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(10,'movimientos',4,'ailins@donyeyo.com.ar','ailin','2026-01-22 18:03:55','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(11,'movimientos',4,'ailins@donyeyo.com.ar','ailin','2026-01-22 20:28:18','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(12,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-01-22 20:28:18','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(13,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-01-22 20:28:19','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(14,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-01-22 20:28:19','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(15,'movimientos',10,'ailins@donyeyo.com.ar','','2026-01-22 20:28:19','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(16,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-23 12:10:19','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(17,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:28:32','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(18,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:32:01','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(19,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:33:38','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(20,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:34:50','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(21,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:36:20','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(22,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:37:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(23,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:37:06','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(24,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:45:50','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(25,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:45:53','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(26,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:45:59','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(27,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:46:41','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(28,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-26 03:47:15','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(29,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:19:17','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(30,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:19:32','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(31,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-27 11:21:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(32,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-27 11:23:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(33,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:24:21','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(34,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:25:08','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(35,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:26:33','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(36,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-27 11:35:23','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(37,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-27 11:37:28','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(38,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:37:28','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(39,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-27 11:37:29','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(40,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-01-27 11:37:57','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(41,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-27 11:39:26','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(42,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:39:35','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(43,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-27 11:40:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(44,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:40:26','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(45,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:40:39','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(46,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-27 11:41:07','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(47,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-27 11:41:09','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(48,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 11:41:55','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(49,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-27 11:42:02','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(50,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-27 11:43:28','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(51,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 12:18:42','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(52,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 12:40:48','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(53,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-27 12:42:07','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(54,'movimientos',14,'gabrielt@donyeyo.com.ar','gabriel','2026-01-27 12:42:42','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(55,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-27 12:45:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(56,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-01-27 13:01:40','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(57,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-01-27 13:02:11','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(58,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-01-27 13:05:17','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(59,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-27 13:06:39','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(60,'movimientos',15,'gabrielt@donyeyo.com.ar','juan','2026-01-27 13:06:52','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(61,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-01-27 13:09:38','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(62,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-01-27 13:44:30','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(63,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-01-27 13:48:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(64,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-01-27 19:52:06','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(65,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-01-27 20:00:20','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(66,'movimientos',26,'gabrielt@donyeyo.com.ar','','2026-01-27 20:02:48','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(67,'movimientos',444,'gabrielt@donyeyo.com.ar','','2026-01-27 20:18:27','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(68,'movimientos',14,'gabrielt@donyeyo.com.ar','gabriel','2026-01-28 11:36:43','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(69,'movimientos',15,'gabrielt@donyeyo.com.ar','juan','2026-01-28 11:37:28','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(70,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-01-28 11:37:28','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(71,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-01-28 11:37:29','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(72,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-01-28 11:37:29','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(73,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-01-28 11:37:29','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(74,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-01-28 11:37:30','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(75,'movimientos',26,'gabrielt@donyeyo.com.ar','','2026-01-28 11:37:30','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(76,'movimientos',444,'gabrielt@donyeyo.com.ar','','2026-01-28 11:37:31','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(77,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-01-28 12:19:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(78,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-01-28 12:22:57','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(79,'movimientos',18,'gabrielt@donyeyo.com.ar','juan','2026-01-28 12:24:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(80,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-01-28 12:29:12','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(81,'movimientos',16,'gabrielt@donyeyo.com.ar','juan','2026-01-28 12:29:22','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(82,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-01-28 12:38:39','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(83,'movimientos',677,'gabrielt@donyeyo.com.ar','','2026-01-28 13:26:44','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(84,'movimientos',488,'gabrielt@donyeyo.com.ar','','2026-01-28 13:39:19','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(85,'movimientos',489,'gabrielt@donyeyo.com.ar','','2026-01-28 13:45:28','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(86,'movimientos',658,'gabrielt@donyeyo.com.ar','','2026-01-28 13:47:01','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(87,'movimientos',659,'gabrielt@donyeyo.com.ar','','2026-01-28 13:59:42','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(88,'movimientos',660,'gabrielt@donyeyo.com.ar','','2026-01-28 14:14:24','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(89,'movimientos',661,'gabrielt@donyeyo.com.ar','','2026-01-28 14:15:45','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(90,'movimientos',700,'gabrielt@donyeyo.com.ar','','2026-01-28 14:16:31','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(91,'movimientos',701,'gabrielt@donyeyo.com.ar','','2026-01-28 14:21:57','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(92,'movimientos',702,'gabrielt@donyeyo.com.ar','','2026-01-28 14:23:05','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(93,'movimientos',703,'gabrielt@donyeyo.com.ar','','2026-01-28 14:25:34','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(94,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-01-28 14:53:03','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(95,'movimientos',704,'gabrielt@donyeyo.com.ar','','2026-01-28 15:03:46','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(96,'movimientos',705,'gabrielt@donyeyo.com.ar','','2026-01-28 15:09:19','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(97,'movimientos',706,'gabrielt@donyeyo.com.ar','','2026-01-28 15:11:22','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(98,'movimientos',707,'gabrielt@donyeyo.com.ar','','2026-01-28 15:18:43','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(99,'movimientos',708,'gabrielt@donyeyo.com.ar','','2026-01-28 15:20:39','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(100,'movimientos',709,'gabrielt@donyeyo.com.ar','','2026-01-28 15:22:23','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(101,'movimientos',710,'gabrielt@donyeyo.com.ar','','2026-01-28 15:32:42','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(102,'movimientos',711,'gabrielt@donyeyo.com.ar','','2026-01-28 15:33:43','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(103,'movimientos',712,'gabrielt@donyeyo.com.ar','','2026-01-28 15:35:37','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(104,'movimientos',713,'gabrielt@donyeyo.com.ar','','2026-01-28 15:37:09','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(105,'movimientos',714,'gabrielt@donyeyo.com.ar','','2026-01-28 15:50:09','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(106,'movimientos',715,'gabrielt@donyeyo.com.ar','','2026-01-28 15:52:04','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(107,'movimientos',20483,'gabrielt@donyeyo.com.ar','','2026-01-28 15:57:41','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(108,'movimientos',20484,'gabrielt@donyeyo.com.ar','','2026-01-28 15:58:55','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(109,'movimientos',20485,'gabrielt@donyeyo.com.ar','','2026-01-28 16:05:12','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(110,'movimientos',20486,'gabrielt@donyeyo.com.ar','','2026-01-28 16:08:36','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(111,'movimientos',20487,'gabrielt@donyeyo.com.ar','','2026-01-28 16:14:17','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(112,'movimientos',20488,'gabrielt@donyeyo.com.ar','','2026-01-28 16:14:53','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(113,'movimientos',20489,'gabrielt@donyeyo.com.ar','','2026-01-28 16:29:15','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(114,'movimientos',20490,'gabrielt@donyeyo.com.ar','','2026-01-28 16:31:07','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(115,'movimientos',20491,'gabrielt@donyeyo.com.ar','','2026-01-28 16:33:35','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(116,'movimientos',20492,'gabrielt@donyeyo.com.ar','','2026-01-28 16:39:39','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(117,'movimientos',20493,'gabrielt@donyeyo.com.ar','','2026-01-28 16:50:50','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(118,'movimientos',20494,'gabrielt@donyeyo.com.ar','','2026-01-28 16:53:27','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(119,'movimientos',20495,'gabrielt@donyeyo.com.ar','','2026-01-28 17:16:15','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(120,'movimientos',20496,'gabrielt@donyeyo.com.ar','','2026-01-28 17:17:00','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(121,'movimientos',20497,'gabrielt@donyeyo.com.ar','','2026-01-28 17:29:22','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(122,'movimientos',20498,'gabrielt@donyeyo.com.ar','','2026-01-28 17:30:57','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(123,'movimientos',20499,'gabrielt@donyeyo.com.ar','','2026-01-28 18:02:39','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(124,'movimientos',12644619,'gabrielt@donyeyo.com.ar','','2026-01-28 18:05:47','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(125,'movimientos',12672313,'gabrielt@donyeyo.com.ar','','2026-01-28 18:06:13','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(126,'movimientos',12672314,'gabrielt@donyeyo.com.ar','','2026-01-28 18:15:02','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(127,'movimientos',12672315,'gabrielt@donyeyo.com.ar','','2026-01-28 19:19:07','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(128,'movimientos',12672316,'gabrielt@donyeyo.com.ar','','2026-01-28 19:22:42','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(129,'movimientos',12672317,'gabrielt@donyeyo.com.ar','','2026-01-28 19:23:43','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(130,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(131,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(132,'movimientos',14,'gabrielt@donyeyo.com.ar','gabriel','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(133,'movimientos',15,'gabrielt@donyeyo.com.ar','juan','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(134,'movimientos',16,'gabrielt@donyeyo.com.ar','juan','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(135,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(136,'movimientos',18,'gabrielt@donyeyo.com.ar','juan','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(137,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(138,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(139,'movimientos',26,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(140,'movimientos',444,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(141,'movimientos',488,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(142,'movimientos',489,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(143,'movimientos',658,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(144,'movimientos',659,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(145,'movimientos',660,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(146,'movimientos',661,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(147,'movimientos',677,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(148,'movimientos',700,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(149,'movimientos',701,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(150,'movimientos',702,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(151,'movimientos',703,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(152,'movimientos',704,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(153,'movimientos',705,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(154,'movimientos',706,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(155,'movimientos',707,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(156,'movimientos',708,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(157,'movimientos',709,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(158,'movimientos',710,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(159,'movimientos',711,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(160,'movimientos',712,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(161,'movimientos',713,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(162,'movimientos',714,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(163,'movimientos',715,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(164,'movimientos',20483,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(165,'movimientos',20484,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(166,'movimientos',20485,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(167,'movimientos',20486,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(168,'movimientos',20487,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(169,'movimientos',20488,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(170,'movimientos',20489,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(171,'movimientos',20490,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(172,'movimientos',20491,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(173,'movimientos',20492,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(174,'movimientos',20493,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(175,'movimientos',20494,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(176,'movimientos',20495,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(177,'movimientos',20496,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(178,'movimientos',20497,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(179,'movimientos',20498,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(180,'movimientos',20499,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(181,'movimientos',12644619,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(182,'movimientos',12672313,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(183,'movimientos',12672314,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(184,'movimientos',12672315,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(185,'movimientos',12672316,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(186,'movimientos',12672317,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:33','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(187,'movimientos',12672318,'gabrielt@donyeyo.com.ar','','2026-01-28 19:24:48','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(188,'movimientos',12672319,'gabrielt@donyeyo.com.ar','','2026-01-28 19:30:20','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(189,'movimientos',12672320,'gabrielt@donyeyo.com.ar','','2026-01-28 19:33:37','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(190,'movimientos',12672318,'gabrielt@donyeyo.com.ar','','2026-01-28 19:38:21','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(191,'movimientos',12672319,'gabrielt@donyeyo.com.ar','','2026-01-28 19:38:21','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(192,'movimientos',12672320,'gabrielt@donyeyo.com.ar','','2026-01-28 19:38:21','delete','Eliminación de registro de movimiento','Gestor de Recepción',NULL),(193,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-01-28 19:39:21','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(194,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-01-28 19:41:21','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(195,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-01-28 19:41:49','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(196,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-01-28 20:31:43','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(197,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-01-28 20:33:19','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(198,'movimientos',6,'gabrielt@donyeyo.com.ar','','2026-01-28 20:34:56','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(199,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-01-28 20:36:51','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(200,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-01-28 20:44:08','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(201,'movimientos',9,'gabrielt@donyeyo.com.ar','','2026-01-28 20:49:00','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(202,'movimientos',10,'gabrielt@donyeyo.com.ar','','2026-01-28 20:49:35','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(203,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-28 20:54:52','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(204,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-01-28 20:55:16','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(205,'movimientos',13,'gabrielt@donyeyo.com.ar','','2026-01-28 20:56:16','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(206,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(207,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(208,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(209,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(210,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(211,'movimientos',6,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(212,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(213,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(214,'movimientos',9,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(215,'movimientos',10,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(216,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(217,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(218,'movimientos',13,'gabrielt@donyeyo.com.ar','','2026-01-29 11:26:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(219,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-01-29 15:22:08','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(220,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-01-29 16:02:22','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(221,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-01-29 16:34:30','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(222,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-01-29 16:35:12','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(223,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 18:07:43','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(224,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-02 18:07:43','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(225,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-02 18:09:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(226,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-02-02 18:09:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(227,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 18:12:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(228,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 18:23:28','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(229,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 18:24:17','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(230,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 18:36:23','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(231,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 18:57:08','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(232,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 18:57:37','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(233,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 18:59:49','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(234,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 19:02:55','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(235,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 19:03:05','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(236,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 19:03:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(237,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-02 19:04:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(238,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-03 11:48:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(239,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-03 11:48:20','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(240,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-02-03 11:48:20','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(241,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-03 11:48:20','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(242,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-03 11:54:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(243,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-03 11:54:59','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(244,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-03 11:55:20','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(245,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-03 11:55:33','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(246,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-03 11:55:44','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(247,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-04 18:12:18','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(248,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(249,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(250,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(251,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(252,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(253,'movimientos',6,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(254,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(255,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(256,'movimientos',9,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(257,'movimientos',10,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(258,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(259,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(260,'movimientos',13,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(261,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(262,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(263,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(264,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(265,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-05 13:28:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(266,'movimientos',19,'gabrielt@donyeyo.com.ar','','2026-02-05 19:42:20','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(267,'movimientos',20,'gabrielt@donyeyo.com.ar','','2026-02-05 19:44:30','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(268,'movimientos',21,'gabrielt@donyeyo.com.ar','','2026-02-05 19:46:42','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(269,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(270,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(271,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(272,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(273,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(274,'movimientos',6,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(275,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(276,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(277,'movimientos',9,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(278,'movimientos',10,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(279,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(280,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(281,'movimientos',13,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(282,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(283,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(284,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(285,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(286,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(287,'movimientos',19,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(288,'movimientos',20,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(289,'movimientos',21,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(290,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(291,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(292,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(293,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(294,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(295,'movimientos',6,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(296,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(297,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(298,'movimientos',9,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(299,'movimientos',10,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(300,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(301,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(302,'movimientos',13,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(303,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(304,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(305,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(306,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(307,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(308,'movimientos',19,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(309,'movimientos',20,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(310,'movimientos',21,'gabrielt@donyeyo.com.ar','','2026-02-06 11:18:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(311,'movimientos',22,'gabrielt@donyeyo.com.ar','','2026-02-06 11:41:27','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(312,'movimientos',23,'gabrielt@donyeyo.com.ar','','2026-02-06 11:42:19','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(313,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-02-06 11:50:53','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(314,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-02-06 12:01:06','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(315,'movimientos',26,'gabrielt@donyeyo.com.ar','','2026-02-06 12:19:22','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(316,'movimientos',27,'gabrielt@donyeyo.com.ar','','2026-02-06 13:22:40','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(317,'articulos',73252156,'gabrielt@donyeyo.com.ar','','2026-02-06 13:22:48','create','Artículo añadido: fddfgdfgdfg','Gestor de Objetos',NULL),(318,'articulos',1,'gabrielt@donyeyo.com.ar','','2026-02-06 13:50:57','update','Cambio en estado o ubicación del artículo','Gestor de Objetos',NULL),(319,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-06 14:00:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(320,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-06 14:00:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(321,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-06 14:00:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(322,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-06 14:02:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(323,'movimientos',27,'gabrielt@donyeyo.com.ar','','2026-02-06 14:35:15','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(324,'movimientos',1,'gabrielt@donyeyo.com.ar','','2026-02-06 15:24:50','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(325,'movimientos',1,'gabrielt@donyeyo.com.ar','ailu','2026-02-06 15:24:57','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(326,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:18','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(327,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:18','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(328,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(329,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(330,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(331,'movimientos',22,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(332,'movimientos',21,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(333,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:44','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(334,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:44','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(335,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(336,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(337,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(338,'movimientos',22,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(339,'movimientos',21,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(340,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(341,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:57','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(342,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(343,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(344,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(345,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(346,'movimientos',22,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(347,'movimientos',21,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(348,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:59','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(349,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-06 15:35:59','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(350,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:13','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(351,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:13','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(352,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:13','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(353,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:13','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(354,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(355,'movimientos',22,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(356,'movimientos',21,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(357,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(358,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(359,'movimientos',1,'gabrielt@donyeyo.com.ar','ailu','2026-02-06 15:36:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(360,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:51','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(361,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:36:57','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(362,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:37:02','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(363,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:37:09','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(364,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:37:20','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(365,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:37:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(366,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:37:30','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(367,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-06 15:37:31','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(368,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 15:37:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(369,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-06 15:37:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(370,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-06 15:37:45','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(371,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-02-06 15:39:09','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(372,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-02-06 15:39:09','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(373,'movimientos',6,'gabrielt@donyeyo.com.ar','','2026-02-06 15:39:09','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(374,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-02-06 15:42:56','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(375,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-06 15:44:09','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(376,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-06 15:45:54','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(377,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-02-06 15:45:54','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(378,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-06 15:45:54','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(379,'movimientos',6,'gabrielt@donyeyo.com.ar','','2026-02-06 15:45:55','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(380,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-02-06 15:45:55','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(381,'movimientos',10,'gabrielt@donyeyo.com.ar','','2026-02-06 15:45:55','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(382,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-02-06 15:45:55','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(383,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-02-06 15:45:55','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(384,'movimientos',19,'gabrielt@donyeyo.com.ar','','2026-02-06 15:45:55','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(385,'movimientos',28,'gabrielt@donyeyo.com.ar','','2026-02-06 16:12:18','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(386,'movimientos',28,'gabrielt@donyeyo.com.ar','','2026-02-06 16:12:18','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(387,'movimientos',29,'gabrielt@donyeyo.com.ar','','2026-02-06 16:12:19','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(388,'movimientos',30,'gabrielt@donyeyo.com.ar','','2026-02-06 16:12:19','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(389,'movimientos',31,'gabrielt@donyeyo.com.ar','','2026-02-06 16:12:19','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(390,'movimientos',1,'gabrielt@donyeyo.com.ar','ailu','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(391,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(392,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(393,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(394,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(395,'movimientos',6,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(396,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(397,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(398,'movimientos',9,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(399,'movimientos',10,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(400,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(401,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(402,'movimientos',13,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(403,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(404,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(405,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(406,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(407,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(408,'movimientos',19,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(409,'movimientos',20,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(410,'movimientos',21,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(411,'movimientos',22,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(412,'movimientos',23,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(413,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(414,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(415,'movimientos',26,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(416,'movimientos',27,'gabrielt@donyeyo.com.ar','','2026-02-06 16:17:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(417,'movimientos',28,'gabrielt@donyeyo.com.ar','','2026-02-06 16:19:57','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(418,'movimientos',28,'gabrielt@donyeyo.com.ar','gabi','2026-02-06 16:20:02','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(419,'movimientos',29,'gabrielt@donyeyo.com.ar','','2026-02-06 16:20:40','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(420,'movimientos',29,'gabrielt@donyeyo.com.ar','gabi','2026-02-06 16:20:49','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(421,'movimientos',30,'gabrielt@donyeyo.com.ar','','2026-02-06 16:25:39','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(422,'movimientos',15,'gabrielt@donyeyo.com.ar','','2026-02-06 16:29:41','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(423,'movimientos',15,'gabrielt@donyeyo.com.ar','gabi','2026-02-06 16:32:15','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(424,'movimientos',30,'gabrielt@donyeyo.com.ar','gabi','2026-02-06 16:32:23','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(425,'movimientos',30,'gabrielt@donyeyo.com.ar',NULL,'2026-02-06 16:44:34','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(426,'movimientos',30,'gabrielt@donyeyo.com.ar','gabi','2026-02-06 16:44:42','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(427,'movimientos',30,'gabrielt@donyeyo.com.ar','gabi','2026-02-06 16:44:44','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(428,'movimientos',28,'gabrielt@donyeyo.com.ar','gabi','2026-02-06 16:45:39','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(429,'movimientos',29,'gabrielt@donyeyo.com.ar','gabi','2026-02-06 16:45:39','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(430,'movimientos',30,'gabrielt@donyeyo.com.ar','gabi','2026-02-06 16:45:39','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(431,'movimientos',31,'gabrielt@donyeyo.com.ar','','2026-02-06 16:45:40','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(432,'movimientos',32,'gabrielt@donyeyo.com.ar','','2026-02-06 18:08:13','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(433,'articulos',73252157,'gabrielt@donyeyo.com.ar','','2026-02-06 18:08:20','create','Artículo añadido: fddfgdfgdfg','Gestor de Objetos',NULL),(434,'movimientos',33,'gabrielt@donyeyo.com.ar','','2026-02-06 18:20:49','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(435,'movimientos',34,'gabrielt@donyeyo.com.ar','','2026-02-06 18:21:06','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(436,'movimientos',35,'gabrielt@donyeyo.com.ar','','2026-02-06 18:27:37','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(437,'movimientos',36,'gabrielt@donyeyo.com.ar','','2026-02-06 18:35:37','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(438,'movimientos',37,'gabrielt@donyeyo.com.ar','','2026-02-06 18:38:28','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(439,'movimientos',38,'gabrielt@donyeyo.com.ar','','2026-02-06 18:45:20','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(440,'movimientos',1,'gabrielt@donyeyo.com.ar','ailu','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(441,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(442,'movimientos',3,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(443,'movimientos',4,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(444,'movimientos',5,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(445,'movimientos',6,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(446,'movimientos',7,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(447,'movimientos',8,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(448,'movimientos',9,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(449,'movimientos',10,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(450,'movimientos',11,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(451,'movimientos',12,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(452,'movimientos',13,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(453,'movimientos',14,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(454,'movimientos',15,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(455,'movimientos',16,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(456,'movimientos',17,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(457,'movimientos',18,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(458,'movimientos',19,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(459,'movimientos',20,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(460,'movimientos',21,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(461,'movimientos',22,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(462,'movimientos',23,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(463,'movimientos',24,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(464,'movimientos',25,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(465,'movimientos',26,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(466,'movimientos',27,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(467,'movimientos',32,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(468,'movimientos',33,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(469,'movimientos',34,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(470,'movimientos',35,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(471,'movimientos',36,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(472,'movimientos',37,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(473,'movimientos',38,'gabrielt@donyeyo.com.ar','','2026-02-09 15:36:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(474,'movimientos',2,'gabrielt@donyeyo.com.ar','','2026-02-09 15:42:12','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(475,'movimientos',2,'gabrielt@donyeyo.com.ar','ailu,,,,,,,,,,,,,gabi,,,,,,,,,','2026-02-09 15:44:04','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(476,'movimientos',2,'gabrielt@donyeyo.com.ar',NULL,'2026-02-09 15:45:12','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(477,'movimientos',2,'gabrielt@donyeyo.com.ar','ailu','2026-02-09 15:45:46','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(478,'movimientos',3,'gabrielt@donyeyo.com.ar','ailu','2026-02-09 15:45:50','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(479,'movimientos',39,'gabrielt@donyeyo.com.ar','','2026-02-09 16:25:41','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(480,'articulos',73252158,'gabrielt@donyeyo.com.ar','','2026-02-09 16:25:49','create','Artículo añadido: Maquina 23434','Gestor de Objetos',NULL),(481,'articulos',73252159,'gabrielt@donyeyo.com.ar','','2026-02-09 16:25:52','create','Artículo añadido: Rulemanes V40','Gestor de Objetos',NULL),(482,'articulos',73252160,'gabrielt@donyeyo.com.ar','','2026-02-09 16:25:56','create','Artículo añadido: Resma','Gestor de Objetos',NULL),(483,'movimientos',39,'gabrielt@donyeyo.com.ar','','2026-02-09 16:28:23','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(484,'movimientos',39,'gabrielt@donyeyo.com.ar','','2026-02-09 16:28:28','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(485,'movimientos',40,'gabrielt@donyeyo.com.ar','','2026-02-09 16:28:28','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(486,'movimientos',41,'gabrielt@donyeyo.com.ar','','2026-02-09 16:28:28','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(487,'movimientos',42,'gabrielt@donyeyo.com.ar','','2026-02-09 16:28:28','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(488,'articulos',73252161,'gabrielt@donyeyo.com.ar','','2026-02-09 16:28:28','create','Artículo añadido: Maquina 23434','Gestor de Objetos',NULL),(489,'articulos',73252162,'gabrielt@donyeyo.com.ar','','2026-02-09 16:28:28','create','Artículo añadido: Rulemanes V40','Gestor de Objetos',NULL),(490,'movimientos',43,'gabrielt@donyeyo.com.ar','','2026-02-09 18:51:07','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(491,'articulos',1,'gabrielt@donyeyo.com.ar','','2026-02-09 18:51:14','create','Artículo añadido: Prueba articulo 1 con retorno','Gestor de Objetos',NULL),(492,'articulos',2,'gabrielt@donyeyo.com.ar','','2026-02-09 18:51:18','create','Artículo añadido: Prueba articulo 2 sin retorno','Gestor de Objetos',NULL),(493,'movimientos',44,'gabrielt@donyeyo.com.ar','','2026-02-09 19:01:34','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(494,'articulos',3,'gabrielt@donyeyo.com.ar','','2026-02-09 19:01:42','create','Artículo añadido: prod1 con regreso','Gestor de Objetos',NULL),(495,'articulos',4,'gabrielt@donyeyo.com.ar','','2026-02-09 19:01:45','create','Artículo añadido: prod2 sin regreso','Gestor de Objetos',NULL),(496,'movimientos',44,'gabrielt@donyeyo.com.ar','','2026-02-09 19:01:49','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(497,'movimientos',45,'gabrielt@donyeyo.com.ar','','2026-02-09 19:01:49','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(498,'movimientos',46,'gabrielt@donyeyo.com.ar','','2026-02-09 19:01:49','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(499,'movimientos',47,'gabrielt@donyeyo.com.ar','','2026-02-09 19:01:49','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(500,'articulos',5,'gabrielt@donyeyo.com.ar','','2026-02-09 19:01:49','create','Artículo añadido: prod1 con regreso','Gestor de Objetos',NULL),(501,'movimientos',44,'gabrielt@donyeyo.com.ar','ailu','2026-02-09 19:30:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(502,'movimientos',44,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:30:24','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(503,'movimientos',45,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:31:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(504,'movimientos',45,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:31:25','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(505,'movimientos',46,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:32:05','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(506,'movimientos',46,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:32:07','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(507,'movimientos',45,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:34:05','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(508,'movimientos',46,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:34:06','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(509,'movimientos',45,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:34:59','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(510,'movimientos',45,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:35:05','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(511,'movimientos',48,'gabrielt@donyeyo.com.ar','','2026-02-09 19:55:07','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(512,'articulos',6,'gabrielt@donyeyo.com.ar','','2026-02-09 19:55:14','create','Artículo añadido: MI articulo con retorno','Gestor de Objetos',NULL),(513,'articulos',7,'gabrielt@donyeyo.com.ar','','2026-02-09 19:55:17','create','Artículo añadido: Mi articulo sin retorno','Gestor de Objetos',NULL),(514,'movimientos',48,'gabrielt@donyeyo.com.ar','','2026-02-09 19:55:22','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(515,'movimientos',49,'gabrielt@donyeyo.com.ar','','2026-02-09 19:55:22','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(516,'movimientos',50,'gabrielt@donyeyo.com.ar','','2026-02-09 19:55:22','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(517,'movimientos',51,'gabrielt@donyeyo.com.ar','','2026-02-09 19:55:22','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(518,'articulos',8,'gabrielt@donyeyo.com.ar','','2026-02-09 19:55:22','create','Artículo añadido: MI articulo con retorno','Gestor de Objetos',NULL),(519,'movimientos',48,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 19:59:09','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(520,'movimientos',48,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 20:01:19','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(521,'movimientos',49,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 20:01:32','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(522,'movimientos',49,'gabrielt@donyeyo.com.ar','gabi','2026-02-09 20:01:35','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(523,'movimientos',52,'gabrielt@donyeyo.com.ar','','2026-02-10 11:44:53','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(524,'movimientos',52,'gabrielt@donyeyo.com.ar','','2026-02-10 11:45:00','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(525,'movimientos',53,'gabrielt@donyeyo.com.ar','','2026-02-10 11:45:00','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(526,'movimientos',54,'gabrielt@donyeyo.com.ar','','2026-02-10 11:45:00','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(527,'movimientos',55,'gabrielt@donyeyo.com.ar','','2026-02-10 11:45:00','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(528,'movimientos',56,'gabrielt@donyeyo.com.ar','','2026-02-10 16:11:56','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(529,'movimientos',56,'gabrielt@donyeyo.com.ar','','2026-02-10 16:12:05','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(530,'movimientos',57,'gabrielt@donyeyo.com.ar','','2026-02-10 16:12:05','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(531,'movimientos',58,'gabrielt@donyeyo.com.ar','','2026-02-10 16:12:05','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(532,'movimientos',59,'gabrielt@donyeyo.com.ar','','2026-02-10 16:12:05','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(533,'movimientos',60,'gabrielt@donyeyo.com.ar','','2026-02-10 16:29:33','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(534,'movimientos',60,'gabrielt@donyeyo.com.ar','','2026-02-10 16:29:39','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(535,'movimientos',61,'gabrielt@donyeyo.com.ar','','2026-02-10 16:29:39','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(536,'movimientos',62,'gabrielt@donyeyo.com.ar','','2026-02-10 16:29:39','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(537,'movimientos',63,'gabrielt@donyeyo.com.ar','','2026-02-10 16:29:39','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(538,'movimientos',60,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:31:54','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(539,'movimientos',60,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:31:57','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(540,'movimientos',61,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:32:21','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(541,'movimientos',61,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:32:22','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(542,'movimientos',52,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:33:53','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(543,'movimientos',52,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:33:54','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(544,'movimientos',53,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:33:57','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(545,'movimientos',53,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:33:58','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(546,'movimientos',54,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:03','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(547,'movimientos',54,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:04','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(548,'movimientos',55,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:10','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(549,'movimientos',55,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:11','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(550,'movimientos',56,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:13','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(551,'movimientos',56,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:14','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(552,'movimientos',57,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:16','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(553,'movimientos',57,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:17','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(554,'movimientos',58,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:22','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(555,'movimientos',58,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:23','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(556,'movimientos',59,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:27','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(557,'movimientos',59,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:28','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(558,'movimientos',62,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:32','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(559,'movimientos',62,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:33','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(560,'movimientos',63,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:35','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(561,'movimientos',63,'gabrielt@donyeyo.com.ar','gabi','2026-02-10 16:34:36','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(562,'movimientos',64,'gabrielt@donyeyo.com.ar','','2026-02-10 19:46:29','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(563,'movimientos',64,'gabrielt@donyeyo.com.ar','','2026-02-10 19:46:36','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(564,'movimientos',65,'gabrielt@donyeyo.com.ar','','2026-02-10 19:46:36','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(565,'movimientos',66,'gabrielt@donyeyo.com.ar','','2026-02-10 19:46:36','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(566,'movimientos',67,'gabrielt@donyeyo.com.ar','','2026-02-10 19:46:36','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(567,'movimientos',68,'gabrielt@donyeyo.com.ar','','2026-02-10 19:48:11','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(568,'movimientos',68,'gabrielt@donyeyo.com.ar','','2026-02-10 19:48:16','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(569,'movimientos',69,'gabrielt@donyeyo.com.ar','','2026-02-10 19:48:16','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(570,'movimientos',70,'gabrielt@donyeyo.com.ar','','2026-02-10 19:48:16','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(571,'movimientos',71,'gabrielt@donyeyo.com.ar','','2026-02-10 19:48:16','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(572,'movimientos',72,'gabrielt@donyeyo.com.ar','','2026-02-10 19:57:43','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(573,'movimientos',72,'gabrielt@donyeyo.com.ar','','2026-02-10 19:57:49','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(574,'movimientos',73,'gabrielt@donyeyo.com.ar','','2026-02-10 19:57:49','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(575,'movimientos',74,'gabrielt@donyeyo.com.ar','','2026-02-10 19:57:49','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(576,'movimientos',75,'gabrielt@donyeyo.com.ar','','2026-02-10 19:57:49','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(577,'movimientos',76,'gabrielt@donyeyo.com.ar','','2026-02-10 20:01:05','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(578,'articulos',9,'gabrielt@donyeyo.com.ar','','2026-02-10 20:01:12','create','Artículo añadido: un articulo','Gestor de Objetos',NULL),(579,'articulos',10,'gabrielt@donyeyo.com.ar','','2026-02-10 20:01:15','create','Artículo añadido: otro articulo','Gestor de Objetos',NULL),(580,'documentos',1,'gabrielt@donyeyo.com.ar','','2026-02-10 20:01:19','create','Documento registrado tipo: Remito(s)','Gestor de Documentación',NULL),(581,'documentos',2,'gabrielt@donyeyo.com.ar','','2026-02-10 20:01:23','create','Documento registrado tipo: Otros','Gestor de Documentación',NULL),(582,'movimientos',77,'gabrielt@donyeyo.com.ar','','2026-02-27 16:36:25','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(583,'movimientos',78,'gabrielt@donyeyo.com.ar','','2026-02-27 17:09:51','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(584,'movimientos',79,'gabrielt@donyeyo.com.ar','','2026-02-27 17:17:39','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(585,'movimientos',77,'gabrielt@donyeyo.com.ar','','2026-02-27 18:08:02','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(586,'movimientos',80,'gabrielt@donyeyo.com.ar','','2026-02-27 18:08:02','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(587,'movimientos',81,'gabrielt@donyeyo.com.ar','','2026-02-27 18:08:02','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(588,'movimientos',82,'gabrielt@donyeyo.com.ar','','2026-02-27 18:08:02','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(589,'movimientos',77,'gabrielt@donyeyo.com.ar','','2026-02-27 18:08:08','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(590,'movimientos',77,'gabrielt@donyeyo.com.ar','','2026-02-27 18:08:10','update','Actualización de datos/estado del movimiento','Gestor de Recepción',NULL),(591,'movimientos',83,'gabrielt@donyeyo.com.ar','','2026-03-02 15:14:44','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(592,'movimientos',84,'gabrielt@donyeyo.com.ar','','2026-03-02 16:10:14','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(593,'movimientos',85,'gabrielt@donyeyo.com.ar','','2026-03-02 16:13:28','create','Nuevo movimiento registrado','Gestor de Recepción',NULL),(594,'articulos',11,'gabrielt@donyeyo.com.ar','','2026-03-02 16:13:28','create','Artículo añadido: Ventilador A4PLUS','Gestor de Objetos',NULL),(595,'documentos',3,'gabrielt@donyeyo.com.ar','','2026-03-02 16:13:29','create','Documento registrado tipo: ','Gestor de Documentación',NULL);
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idMovimiento` int NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `cantidad` int NOT NULL,
  `idEstado` int NOT NULL,
  `tipo` enum('Remito(s)','Factura(s)','Presupuesto(s)','Orden(es) de compra','Otros') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `codigo` varchar(30) DEFAULT NULL,
  `idLugarOrigen` int NOT NULL,
  `remitente` varchar(30) DEFAULT NULL,
  `idLugarDestino` int DEFAULT NULL,
  `destinatario` varchar(30) DEFAULT NULL,
  `sinRetorno` tinyint(1) DEFAULT '0',
  `observacion` text,
  `usuario_app` varchar(100) DEFAULT NULL,
  `vigilador` varchar(30) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idEstado` (`idEstado`),
  KEY `idLugarOrigen` (`idLugarOrigen`),
  KEY `idLugarDestino` (`idLugarDestino`),
  KEY `idx_doc_mov` (`idMovimiento`),
  CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`idMovimiento`) REFERENCES `movimientos` (`id`),
  CONSTRAINT `documentos_ibfk_2` FOREIGN KEY (`idEstado`) REFERENCES `objetoEstados` (`id`),
  CONSTRAINT `documentos_ibfk_3` FOREIGN KEY (`idLugarOrigen`) REFERENCES `lugares` (`id`),
  CONSTRAINT `documentos_ibfk_4` FOREIGN KEY (`idLugarDestino`) REFERENCES `lugares` (`id`),
  CONSTRAINT `documentos_chk_1` CHECK ((`cantidad` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos`
--

LOCK TABLES `documentos` WRITE;
/*!40000 ALTER TABLE `documentos` DISABLE KEYS */;
INSERT INTO `documentos` VALUES (1,76,'un documento',4,1,'Remito(s)',NULL,1,NULL,2,'edddd',1,NULL,'gabrielt@donyeyo.com.ar',''),(2,76,'otro documento',10,1,'Otros',NULL,1,NULL,2,'',0,NULL,'gabrielt@donyeyo.com.ar',''),(3,85,'A-0006-655465',1,1,'',NULL,1,'',2,'',1,'','gabrielt@donyeyo.com.ar','');
/*!40000 ALTER TABLE `documentos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_doc_ins` AFTER INSERT ON `documentos` FOR EACH ROW INSERT INTO `auditoria`

  (`entidad`, `idEntidad`, `usuario`, `vigilador`, `operacion`, `evento`, `modulo`)

VALUES

  ('documentos', NEW.`id`, NEW.`usuario_app`, NEW.`vigilador`, 'create',

   CONCAT('Documento registrado tipo: ', NEW.`tipo`),

   'Gestor de Documentación') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_doc_upd` AFTER UPDATE ON `documentos` FOR EACH ROW INSERT INTO `auditoria`

  (`entidad`, `idEntidad`, `usuario`, `vigilador`, `operacion`, `evento`, `modulo`)

VALUES

  ('documentos', NEW.`id`, NEW.`usuario_app`, NEW.`vigilador`, 'update',

   'Actualización de metadatos del documento',

   'Gestor de Documentación') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_doc_del` BEFORE DELETE ON `documentos` FOR EACH ROW INSERT INTO `auditoria`

  (`entidad`, `idEntidad`, `usuario`, `vigilador`, `operacion`, `evento`, `modulo`)

VALUES

  ('documentos', OLD.`id`, OLD.`usuario_app`, OLD.`vigilador`, 'delete',

   'Eliminación de documento',

   'Gestor de Documentación') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `legajos`
--

DROP TABLE IF EXISTS `legajos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legajos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `legajo` varchar(30) NOT NULL,
  `email` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `apellido` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cargo` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `apellido_nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `legajo` (`legajo`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1241 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legajos`
--

LOCK TABLES `legajos` WRITE;
/*!40000 ALTER TABLE `legajos` DISABLE KEYS */;
INSERT INTO `legajos` VALUES (622,'0001',NULL,NULL,NULL,NULL,'MINGUEZ VICTOR'),(623,'0003',NULL,NULL,NULL,NULL,'Milla Jose'),(624,'0005',NULL,NULL,NULL,NULL,'BENEGAS ADRIAN DAVID'),(625,'0006',NULL,NULL,NULL,NULL,'CIANCIO JAVIER'),(626,'0009',NULL,NULL,NULL,NULL,'Cassasa Horacio'),(627,'0010',NULL,NULL,NULL,NULL,'GIACOVINO FERNANDO L'),(628,'0013',NULL,NULL,NULL,NULL,'BOSQUI HUGO SERGIO'),(629,'0023',NULL,NULL,NULL,NULL,'MARQUEZ HUGO FERMIN'),(630,'0035',NULL,NULL,NULL,NULL,'HERRERA CLAUDIO A'),(631,'0041',NULL,NULL,NULL,NULL,'VILLAR DANIEL ALBERTO'),(632,'0042',NULL,NULL,NULL,NULL,'CATTANEO MARIO RUBEN'),(633,'0047',NULL,NULL,NULL,NULL,'Rozza Ismael'),(634,'0048',NULL,NULL,NULL,NULL,'TOLOSA ALFREDO DANIEL'),(635,'0052',NULL,NULL,NULL,NULL,'ZABAGLIO LUCIANO'),(636,'0057',NULL,NULL,NULL,NULL,'HERRERA FABIAN DAVID'),(637,'0073',NULL,NULL,NULL,NULL,'Rozza Matias'),(638,'0083',NULL,NULL,NULL,NULL,'ROZZA PEDRO ALBERTO'),(639,'0087',NULL,NULL,NULL,NULL,'FIORE MARIANO JAVIER'),(640,'0091',NULL,NULL,NULL,NULL,'BOSCH MARCELO'),(641,'0094',NULL,NULL,NULL,NULL,'HEREDIA VICTOR HUGO'),(642,'0111',NULL,NULL,NULL,NULL,'BISCOTTI JUDIT ELIANA'),(643,'0115',NULL,NULL,NULL,NULL,'GONZALEZ RAFAEL'),(644,'0128',NULL,NULL,NULL,NULL,'BUSSO FABIAN O.'),(645,'0136',NULL,NULL,NULL,NULL,'MASCI MARTA RAQUEL'),(646,'0138',NULL,NULL,NULL,NULL,'PEREYRA FABIO DOMINGO'),(647,'0142',NULL,NULL,NULL,NULL,'RIVA RAUL ALBERTO'),(648,'0147',NULL,NULL,NULL,NULL,'ROMERO ARIEL EDGARDO'),(649,'0150',NULL,NULL,NULL,NULL,'ANTENUCCI HECTOR ABEL'),(650,'0163',NULL,NULL,NULL,NULL,'ANDRIOLI NANCY MABEL'),(651,'0171',NULL,NULL,NULL,NULL,'Aguilar Gastón'),(652,'0176',NULL,NULL,NULL,NULL,'ALZAMENDI DIEGO RENE'),(653,'0181',NULL,NULL,NULL,NULL,'LEANZA PABLO HERNAN'),(654,'0184',NULL,NULL,NULL,NULL,'CELAY CARLOS SEBASTIAN'),(655,'0188',NULL,NULL,NULL,NULL,'MINERVINO MARIA CECILIA'),(656,'0206',NULL,NULL,NULL,NULL,'RIOS ALBA ROSA'),(657,'0213',NULL,NULL,NULL,NULL,'GOROSITO SERGIO EDUARDO'),(658,'0217',NULL,NULL,NULL,NULL,'JACQUET PABLO'),(659,'0219',NULL,NULL,NULL,NULL,'AREVALO SERGIO NORBERTO'),(660,'0222',NULL,NULL,NULL,NULL,'LABORET LEONARDO MAURICIO'),(661,'0223',NULL,NULL,NULL,NULL,'BONOPERA LEANDRO EZEQUIEL'),(662,'0239',NULL,NULL,NULL,NULL,'BONOPERA GASTON'),(663,'0243',NULL,NULL,NULL,NULL,'GAGLIANO RENZO'),(664,'0247',NULL,NULL,NULL,NULL,'ALVAREZ VICTOR HUGO'),(665,'0251',NULL,NULL,NULL,NULL,'AMADIO DIEGO GASTON'),(666,'0259',NULL,NULL,NULL,NULL,'CUELLO ESTEBAN EZEQUIEL'),(667,'0269',NULL,NULL,NULL,NULL,'FRONTERA CLAUDIO VICTOR'),(668,'0271',NULL,NULL,NULL,NULL,'MUGNOLO GABRIEL ESTEBAN'),(669,'0278',NULL,NULL,NULL,NULL,'CAVALERI OBDULIO ORLANDO'),(670,'0283',NULL,NULL,NULL,NULL,'BORGOGNO HECTOR MARCELO'),(671,'0285',NULL,NULL,NULL,NULL,'PERRONE JOSE ANTONIO'),(672,'0295',NULL,NULL,NULL,NULL,'Flores Mejia Rodrigo'),(673,'0297',NULL,NULL,NULL,NULL,'SCHIANCHI LUCAS EMILIO'),(674,'0298',NULL,NULL,NULL,NULL,'TORRES JUSTINIANO'),(675,'0303',NULL,NULL,NULL,NULL,'Digiacomo David'),(676,'0310',NULL,NULL,NULL,NULL,'ROSSI JUAN EZEQUIEL'),(677,'0314',NULL,NULL,NULL,NULL,'ARTUSSO GUSTAVO EZEQUIEL'),(678,'0318',NULL,NULL,NULL,NULL,'Saravi Alexis'),(679,'0321',NULL,NULL,NULL,NULL,'MARISI EDUARDO ALBERTO'),(680,'0328',NULL,NULL,NULL,NULL,'MONTELEONE EDUARDO GERMAN'),(681,'0334',NULL,NULL,NULL,NULL,'Tolosa Marcos'),(682,'0338',NULL,NULL,NULL,NULL,'FERA JORGE ALEJANDRO'),(683,'0339',NULL,NULL,NULL,NULL,'Scanella Gonzalo'),(684,'0356',NULL,NULL,NULL,NULL,'GORRESE GUSTAVO MARCELO'),(685,'0357',NULL,NULL,NULL,NULL,'CASANOVA GABRIELA CRISTINA'),(686,'0358',NULL,NULL,NULL,NULL,'Salas Ariel'),(687,'0366',NULL,NULL,NULL,NULL,'GALAN RAMIRO LUIS'),(688,'0376',NULL,NULL,NULL,NULL,'CICIVE JULIAN'),(689,'0381',NULL,NULL,NULL,NULL,'BARRERA FEDERICO JAVIER'),(690,'0382',NULL,NULL,NULL,NULL,'SCANELLA ENZO FEDERICO'),(691,'0394',NULL,NULL,NULL,NULL,'CHIOSSO SEBASTIAN'),(692,'0398',NULL,NULL,NULL,NULL,'GONZALEZ FACUNDO'),(693,'0403',NULL,NULL,NULL,NULL,'MARTINEZ LUCIANO'),(694,'0404',NULL,NULL,NULL,NULL,'RAMOS HUGO EDUARDO'),(695,'0411',NULL,NULL,NULL,NULL,'TORRETA CRISTIAN'),(696,'0415',NULL,NULL,NULL,NULL,'VACCA AGUSTINA'),(697,'0422',NULL,NULL,NULL,NULL,'ZAPATA CLAUDIO MARTIN'),(698,'0424',NULL,NULL,NULL,NULL,'LEVIPE JUAN PABLO'),(699,'0438',NULL,NULL,NULL,NULL,'CHIOLA EZEQUIEL FERNANDO'),(700,'0439',NULL,NULL,NULL,NULL,'ORTIZ SANDRA'),(701,'0442',NULL,NULL,NULL,NULL,'LOUREYRO MARIANO ANDRES'),(702,'0446',NULL,NULL,NULL,NULL,'Botta Daniela'),(703,'0452',NULL,NULL,NULL,NULL,'ROMERO IVAN MANUEL'),(704,'0453',NULL,NULL,NULL,NULL,'BASILE HUGO ORLANDO'),(705,'0456',NULL,NULL,NULL,NULL,'CIERI LEONEL'),(706,'0460',NULL,NULL,NULL,NULL,'GONZALEZ MARTIN DANIEL'),(707,'0462',NULL,NULL,NULL,NULL,'Puppio Ramiro'),(708,'0466',NULL,NULL,NULL,NULL,'CHIOLA SERGIO MARIO'),(709,'0471',NULL,NULL,NULL,NULL,'LUCERO ERNESTO'),(710,'0473',NULL,NULL,NULL,NULL,'TESORO GASTON JESUS'),(711,'0474',NULL,NULL,NULL,NULL,'TAMBORINI FRANCO ANDRES'),(712,'0477',NULL,NULL,NULL,NULL,'SUAREZ VICTOR EMANUEL'),(713,'0489',NULL,NULL,NULL,NULL,'Olloco Manuel'),(714,'0490',NULL,NULL,NULL,NULL,'SIMONE SEBASTIAN'),(715,'0495',NULL,NULL,NULL,NULL,'CIBIRIAIN JUAN IGNACIO'),(716,'0499',NULL,NULL,NULL,NULL,'Bosion Sergio'),(717,'0501',NULL,NULL,NULL,NULL,'Centurion Ezequiel'),(718,'0505',NULL,NULL,NULL,NULL,'Dakkache Jorge'),(719,'0510',NULL,NULL,NULL,NULL,'Marino Fernando'),(720,'0513',NULL,NULL,NULL,NULL,'VELA BALCERAS LUCAS BRIAN'),(721,'0514',NULL,NULL,NULL,NULL,'GAGLIANO RENATO'),(722,'0515',NULL,NULL,NULL,NULL,'POLLECE ALFIO'),(723,'0533',NULL,NULL,NULL,NULL,'PONCE LUCAS FEDERICO'),(724,'0539',NULL,NULL,NULL,NULL,'SALVARANI ALBERTO'),(725,'0557',NULL,NULL,NULL,NULL,'GAUNA ALEJANDRA BEATRIZ'),(726,'0560',NULL,NULL,NULL,NULL,'Lescano Andres'),(727,'0561',NULL,NULL,NULL,NULL,'Acosta Silvano'),(728,'0562',NULL,NULL,NULL,NULL,'ROMANO FEDERICO'),(729,'0563',NULL,NULL,NULL,NULL,'OTEIZA MARCELO JAVIER'),(730,'0565',NULL,NULL,NULL,NULL,'Meza Andres'),(731,'0575',NULL,NULL,NULL,NULL,'VELARDE KARINA'),(732,'0585',NULL,NULL,NULL,NULL,'VICICONDE MARIA AGUSTINA'),(733,'0590',NULL,NULL,NULL,NULL,'Prieto Facundo'),(734,'0592',NULL,NULL,NULL,NULL,'Molina Neri'),(735,'0605',NULL,NULL,NULL,NULL,'BISCOTTI GABRIEL'),(736,'0612',NULL,NULL,NULL,NULL,'MUGNOLO EDUARDO FERNANDO'),(737,'0616',NULL,NULL,NULL,NULL,'Mansilla Maria Sol'),(738,'0620',NULL,NULL,NULL,NULL,'ESQUIVEL RAMON ALEJANDRO'),(739,'0622',NULL,NULL,NULL,NULL,'CASCIO Y DI PALMA ERIK DAMIAN'),(740,'0625',NULL,NULL,NULL,NULL,'MARTINEZ CLEVER FEDERICO'),(741,'0632',NULL,NULL,NULL,NULL,'MILIONE MICAELA'),(742,'0635',NULL,NULL,NULL,NULL,'CHARI NICOLAS'),(743,'0636',NULL,NULL,NULL,NULL,'CRESCIMONE SEBASTIAN'),(744,'0637',NULL,NULL,NULL,NULL,'DECIMA SIMON'),(745,'0640',NULL,NULL,NULL,NULL,'FERNANDEZ ALEJO DAMIAN'),(746,'0643',NULL,NULL,NULL,NULL,'Niz Brian'),(747,'0647',NULL,NULL,NULL,NULL,'ROJAS MARIO DAVID'),(748,'0653',NULL,NULL,NULL,NULL,'DICUNTO MATIAS'),(749,'0655',NULL,NULL,NULL,NULL,'MELONI CRISTIAN'),(750,'0658',NULL,NULL,NULL,NULL,'Castañares Mariana'),(751,'0659',NULL,NULL,NULL,NULL,'Dicunto, Martin'),(752,'0666',NULL,NULL,NULL,NULL,'SOSA JUAN OSVALDO'),(753,'0667',NULL,NULL,NULL,NULL,'MESURO MANUEL'),(754,'0669',NULL,NULL,NULL,NULL,'MARQUEZ JOSE LUIS'),(755,'0670',NULL,NULL,NULL,NULL,'Di Toro Carlos Nahuel'),(756,'0676',NULL,NULL,NULL,NULL,'VIOLANTE LUIS'),(757,'0677',NULL,NULL,NULL,NULL,'Salinas Acosta Lucas'),(758,'0678',NULL,NULL,NULL,NULL,'Alejandro Agustin'),(759,'0679',NULL,NULL,NULL,NULL,'VACCARINI NADIA'),(760,'0687',NULL,NULL,NULL,NULL,'Sayago Juan Ignacio'),(761,'0693',NULL,NULL,NULL,NULL,'Valdebenito Agustin'),(762,'0708',NULL,NULL,NULL,NULL,'Lanzoni Axel'),(763,'0711',NULL,NULL,NULL,NULL,'Blaiotta Ferraro Franco'),(764,'0718',NULL,NULL,NULL,NULL,'MALDONADO AGUSTIN'),(765,'0731',NULL,NULL,NULL,NULL,'Ventre Pablo'),(766,'0735',NULL,NULL,NULL,NULL,'Terreri Valentina'),(767,'0742',NULL,NULL,NULL,NULL,'MINCHILLI MELINA LUZ'),(768,'0746',NULL,NULL,NULL,NULL,'ECHEVERRIA ALDO NICOLAS'),(769,'0756',NULL,NULL,NULL,NULL,'Ventre Facundo'),(770,'0764',NULL,NULL,NULL,NULL,'ROJAS NICOLAS'),(771,'0769',NULL,NULL,NULL,NULL,'OJEDA GUSTAVO HERNAN'),(772,'0770',NULL,NULL,NULL,NULL,'Chuliver Ruben Andres'),(773,'0773',NULL,NULL,NULL,NULL,'Bais Brian Nahuel'),(774,'0776',NULL,NULL,NULL,NULL,'Cayo Coronado Victor Hugo'),(775,'0778',NULL,NULL,NULL,NULL,'Meloni Pablo'),(776,'0779',NULL,NULL,NULL,NULL,'Espindola Gustavo'),(777,'0785',NULL,NULL,NULL,NULL,'Diaz Alejo'),(778,'0793',NULL,NULL,NULL,NULL,'DURAN ALEXIS JAVIER'),(779,'0794',NULL,NULL,NULL,NULL,'Mengoni Daniela'),(780,'0800',NULL,NULL,NULL,NULL,'JARA IVAN MAURO'),(781,'0802',NULL,NULL,NULL,NULL,'Savalio Franco'),(782,'0804',NULL,NULL,NULL,NULL,'FANUCCE TOMAS'),(783,'0807',NULL,NULL,NULL,NULL,'MARE LORENZO'),(784,'0810',NULL,NULL,NULL,NULL,'GALLO JUAN PABLO'),(785,'0813',NULL,NULL,NULL,NULL,'GIZZI GABRIEL'),(786,'0818',NULL,NULL,NULL,NULL,'FARIAS KEVIN LAUTARO NICOLAS'),(787,'0821',NULL,NULL,NULL,NULL,'BISCOTTI NICOLAS DANIEL'),(788,'0823',NULL,NULL,NULL,NULL,'Bertero Federico Pablo'),(789,'0824',NULL,NULL,NULL,NULL,'Cuello Adrian'),(790,'0840',NULL,NULL,NULL,NULL,'AROSTEGUI TOMAS EZEQUIEL'),(791,'0842',NULL,NULL,NULL,NULL,'HUBNER MARIA PAULA'),(792,'0845',NULL,NULL,NULL,NULL,'SALINAS NICOLAS GABRIEL'),(793,'0847',NULL,NULL,NULL,NULL,'GOROSITO AGUSTIN'),(794,'0849',NULL,NULL,NULL,NULL,'DOMENECH GERMAN CAMILO'),(795,'0851',NULL,NULL,NULL,NULL,'Albornoz Sebastian'),(796,'0864',NULL,NULL,NULL,NULL,'BRUNO KEVIN ANDRES'),(797,'0866',NULL,NULL,NULL,NULL,'SALVARANI FRANCO JAVIER'),(798,'0872',NULL,NULL,NULL,NULL,'ORMAECHEA MARIANELA'),(799,'0881',NULL,NULL,NULL,NULL,'PANTONI ANDRES OSCAR'),(800,'0885',NULL,NULL,NULL,NULL,'GIOIA WALTER AGUSTIN'),(801,'0896',NULL,NULL,NULL,NULL,'DI MARCO MARIANELA'),(802,'0898',NULL,NULL,NULL,NULL,'SANCHEZ NICOLAS'),(803,'0899',NULL,NULL,NULL,NULL,'FONTI CAROLINA MAILEN'),(804,'0901',NULL,NULL,NULL,NULL,'GAGLIANO GEORGINA'),(805,'0902',NULL,NULL,NULL,NULL,'FALCIONI FACUNDO ROBERTO'),(806,'0911',NULL,NULL,NULL,NULL,'VOISIN MARCOS'),(807,'0914',NULL,NULL,NULL,NULL,'DICUNDO AGUSTIN'),(808,'0920',NULL,NULL,NULL,NULL,'Giary Angel'),(809,'0923',NULL,NULL,NULL,NULL,'Herrera Ivan'),(810,'0926',NULL,NULL,NULL,NULL,'Maigua Richard'),(811,'0929',NULL,NULL,NULL,NULL,'PUGÑE CARLOS AGUSTIN'),(812,'0931',NULL,NULL,NULL,NULL,'BUSTOS IVAN RAMIRO'),(813,'0932',NULL,NULL,NULL,NULL,'RODRIGUEZ ENRIQUEZ ALEX MAICO'),(814,'0933',NULL,NULL,NULL,NULL,'Giannone Emiliano'),(815,'0934',NULL,NULL,NULL,NULL,'Sanchez Valentin'),(816,'0935',NULL,NULL,NULL,NULL,'ALIENDRO JONATAN MATIAS'),(817,'0950',NULL,NULL,NULL,NULL,'CORTES BRIAN'),(818,'0953',NULL,NULL,NULL,NULL,'GARCIA SANTIAGO ELIECER'),(819,'0954',NULL,NULL,NULL,NULL,'LOPEZ ENRIQUE'),(820,'0963',NULL,NULL,NULL,NULL,'BARBERIS EDGAR DARIO'),(821,'0981',NULL,NULL,NULL,NULL,'CAVAGNARO CHRISTIAN DANIEL'),(822,'0988',NULL,NULL,NULL,NULL,'LUCEROS BRUNO NAHUEL'),(823,'0989',NULL,NULL,NULL,NULL,'IBAÑEZ EDUARDO SEBASTIAN'),(824,'0995',NULL,NULL,NULL,NULL,'DONADÍO NICOLÁS'),(825,'0999',NULL,NULL,NULL,NULL,'LEMME MAURICIO DANIEL'),(826,'1003',NULL,NULL,NULL,NULL,'BORGHETTI NICOLÁS'),(827,'1006',NULL,NULL,NULL,NULL,'CASASOLA LAUTARO MANUEL'),(828,'1011',NULL,NULL,NULL,NULL,'GENOVESE LAUTARO'),(829,'1020',NULL,NULL,NULL,NULL,'ROMERA CRISTOPHER DAMIAN'),(830,'1023',NULL,NULL,NULL,NULL,'MEZA FEDERICO'),(831,'1024',NULL,NULL,NULL,NULL,'BORGHETTI ALBERTO JOSE'),(832,'1026',NULL,NULL,NULL,NULL,'RICCA BRYSON ROBERTO ALAN'),(833,'1030',NULL,NULL,NULL,NULL,'VENTRE MIGUEL LEANDRO'),(834,'1031',NULL,NULL,NULL,NULL,'Bascaran Julian'),(835,'1032',NULL,NULL,NULL,NULL,'Monsalvo Aldo'),(836,'1045',NULL,NULL,NULL,NULL,'BARRAZA FELIPE LIONEL'),(837,'1052',NULL,NULL,NULL,NULL,'Diaz Noelia'),(838,'1056',NULL,NULL,NULL,NULL,'Martinez Alexis'),(839,'1058',NULL,NULL,NULL,NULL,'Toledo Dario'),(840,'1060',NULL,NULL,NULL,NULL,'Adami Francisco'),(841,'1062',NULL,NULL,NULL,NULL,'Arostegui Brian'),(842,'1063',NULL,NULL,NULL,NULL,'Caporale Jhonatan'),(843,'1072',NULL,NULL,NULL,NULL,'Rodríguez Facundo'),(844,'1075',NULL,NULL,NULL,NULL,'Lucero Julian'),(845,'1077',NULL,NULL,NULL,NULL,'Borghetti Juan Pablo'),(846,'1078',NULL,NULL,NULL,NULL,'Espindola Nahuel'),(847,'1085',NULL,NULL,NULL,NULL,'GONZALEZ JUAN PABLO'),(848,'1090',NULL,NULL,NULL,NULL,'ARTIEDA BRIAN OSCAR'),(849,'1091',NULL,NULL,NULL,NULL,'ENRIQUEZ GARCIA CIRO MAURICIO'),(850,'1092',NULL,NULL,NULL,NULL,'SANTANA YANINA DEL CARMEN'),(851,'1101',NULL,NULL,NULL,NULL,'SARLO TADEO SAMUEL'),(852,'1102',NULL,NULL,NULL,NULL,'SASSONE TOMAS'),(853,'1107',NULL,NULL,NULL,NULL,'Palacios Lautaro'),(854,'1111',NULL,NULL,NULL,NULL,'Morra Guillermo'),(855,'1115',NULL,NULL,NULL,NULL,'LACIAR CRISTIAN GUILLERMO'),(856,'1126',NULL,NULL,NULL,NULL,'Emateguy Lucia'),(857,'1127',NULL,NULL,NULL,NULL,'VESPASIANO NAIM AARON'),(858,'1128',NULL,NULL,NULL,NULL,'BELLO MATIAS JOSE'),(859,'1135',NULL,NULL,NULL,NULL,'Roggensack Brian'),(860,'1137',NULL,NULL,NULL,NULL,'FARIAS NAHUEL'),(861,'1140',NULL,NULL,NULL,NULL,'GARCIA BRIAN NICOLAS'),(862,'1145',NULL,NULL,NULL,NULL,'CONTIERI ANDRES NICOLAS'),(863,'1147',NULL,NULL,NULL,NULL,'PAGANO ARIEL NICOLAS'),(864,'1150',NULL,NULL,NULL,NULL,'Borghetti Ezequiel'),(865,'1151',NULL,NULL,NULL,NULL,'GASTALDI HORACIO JAVIER'),(866,'1166',NULL,NULL,NULL,NULL,'SILVA AYRTON'),(867,'1167',NULL,NULL,NULL,NULL,'Molina Nicolas'),(868,'1168',NULL,NULL,NULL,NULL,'LORENZO THOMAS AGUSTIN'),(869,'1169',NULL,NULL,NULL,NULL,'BERTARINI JONATHAN NAHUEL'),(870,'1171',NULL,NULL,NULL,NULL,'AGUIRRE BRIAN ALEXIS'),(871,'1178',NULL,NULL,NULL,NULL,'Diaz Hernan'),(872,'1181',NULL,NULL,NULL,NULL,'AROSTEGUI LUCAS ENZO'),(873,'1182',NULL,NULL,NULL,NULL,'GASTALDI LUCAS ROMEO'),(874,'1183',NULL,NULL,NULL,NULL,'MARTINO MICAELA'),(875,'1188',NULL,NULL,NULL,NULL,'DI BELLO JESUS BERNARDO MARTIN'),(876,'1189',NULL,NULL,NULL,NULL,'ESPOSITO SIMON'),(877,'1191',NULL,NULL,NULL,NULL,'ARCE GONZALO DANIEL'),(878,'1201',NULL,NULL,NULL,NULL,'Dinapoli Nestor'),(879,'1203',NULL,NULL,NULL,NULL,'RAMIREZ BRUNO NAHUEL'),(880,'1204',NULL,NULL,NULL,NULL,'LOUREYRO EDGARDO EZEQUIEL'),(881,'1207',NULL,NULL,NULL,NULL,'Flores Quispe , Vladimir Alexis'),(882,'1208',NULL,NULL,NULL,NULL,'Peralta Luis Daniel'),(883,'1211',NULL,NULL,NULL,NULL,'DIAZ MIGUEL ORLANDO'),(884,'1214',NULL,NULL,NULL,NULL,'FLORES BILARPANDO ORLANDO DAMIAN'),(885,'1216',NULL,NULL,NULL,NULL,'MARTINO CAROLINA VALERIA'),(886,'1218',NULL,NULL,NULL,NULL,'Paz Fernando Aurelio'),(887,'1222',NULL,NULL,NULL,NULL,'ARRIETA BRIAN JONATAN'),(888,'1224',NULL,NULL,NULL,NULL,'DIRULLE STEFANO MIGUEL'),(889,'1226',NULL,NULL,NULL,NULL,'ARCELUZ EZEQUIEL'),(890,'1227',NULL,NULL,NULL,NULL,'GUTIERREZ MARTIN EZEQUIEL'),(891,'1230',NULL,NULL,NULL,NULL,'AREVALO JUAN IGNACIO'),(892,'1231',NULL,NULL,NULL,NULL,'Seibane Ailin'),(893,'1232',NULL,NULL,NULL,NULL,'ZUNINO IVAN AGUSTIN'),(894,'1233',NULL,NULL,NULL,NULL,'MONTOYA AUGUSTO'),(895,'1234',NULL,NULL,NULL,NULL,'MARINELLI MARIANO JAVIER'),(896,'1235',NULL,NULL,NULL,NULL,'MUÑOZ KEVIN AYRTON'),(897,'1239',NULL,NULL,NULL,NULL,'ACOSTA SEBASTIAN ARIEL'),(898,'1242',NULL,NULL,NULL,NULL,'SARDI WITTING LUCAS MATIAS'),(899,'1247',NULL,NULL,NULL,NULL,'Sperani Luciano'),(900,'1250',NULL,NULL,NULL,NULL,'PIEDEGROSSO ARTURO'),(901,'1253',NULL,NULL,NULL,NULL,'RIVADENEIRA IAN RENE'),(902,'1254',NULL,NULL,NULL,NULL,'REBUXIONE JULIAN'),(903,'1260',NULL,NULL,NULL,NULL,'Lescano Enzo'),(904,'1264',NULL,NULL,NULL,NULL,'ZALAZAR FACUNDO MARTIN'),(905,'1267',NULL,NULL,NULL,NULL,'DI PIERRO LEANDRO JAVIER'),(906,'1274',NULL,NULL,NULL,NULL,'Uballes Agustin'),(907,'1277',NULL,NULL,NULL,NULL,'Cisneros Celso'),(908,'1281',NULL,NULL,NULL,NULL,'FANUCCE BERNABE NESTOR'),(909,'1284',NULL,NULL,NULL,NULL,'GUTIERREZ KEVIN JUAN ADRES'),(910,'1285',NULL,NULL,NULL,NULL,'DE PAOLO VALENTIN'),(911,'1286',NULL,NULL,NULL,NULL,'GONZALEZ MOREL HUGO MICHEL'),(912,'1287',NULL,NULL,NULL,NULL,'CEBALLOS CRISTIAN OMAR'),(913,'1294',NULL,NULL,NULL,NULL,'CRIS TIZIANO CESAR'),(914,'1295',NULL,NULL,NULL,NULL,'DIPENDA SERENA'),(915,'1299',NULL,NULL,NULL,NULL,'Zapata Martin Edgardo'),(916,'1302',NULL,NULL,NULL,NULL,'FLORES BUSTAMANTE ENZO ARIEL'),(917,'1304',NULL,NULL,NULL,NULL,'GARCIA SOL MADELAINE'),(918,'1305',NULL,NULL,NULL,NULL,'BOSQUI BRIAN JESUS JOSE'),(919,'1306',NULL,NULL,NULL,NULL,'PALACIOS NICOLAS GABRIEL'),(920,'1308',NULL,NULL,NULL,NULL,'CASERI MATIAS NICOLAS'),(921,'1317',NULL,NULL,NULL,NULL,'Vendres Marcelo'),(922,'1322',NULL,NULL,NULL,NULL,'UBALLES GONZALO NAHUEL'),(923,'1323',NULL,NULL,NULL,NULL,'CANELA VALERIA'),(924,'1325',NULL,NULL,NULL,NULL,'ORTEGA NICOLAS'),(925,'1328',NULL,NULL,NULL,NULL,'DIAZ EMANUEL ORLANDO'),(926,'1329',NULL,NULL,NULL,NULL,'ORELLANOS SIXTO URIEL'),(927,'1331',NULL,NULL,NULL,NULL,'PAGELLA MOLINA DIEGO'),(928,'1335',NULL,NULL,NULL,NULL,'DIAZ ALEJANDRO JAVIER'),(929,'1336',NULL,NULL,NULL,NULL,'RUSCONI FERNANDO'),(930,'1339',NULL,NULL,NULL,NULL,'FANUCCE ELIAS'),(931,'1340',NULL,NULL,NULL,NULL,'LEDESMA ISAIAS VALENTIN'),(932,'1342',NULL,NULL,NULL,NULL,'DICUNDO NICOLAS'),(933,'1346',NULL,NULL,NULL,NULL,'BANEGAS THOMAS DANIEL'),(934,'1348',NULL,NULL,NULL,NULL,'BAZAN JESUS'),(935,'1350',NULL,NULL,NULL,NULL,'ARTIEDA ALAN'),(936,'1363',NULL,NULL,NULL,NULL,'MONSALVO ELIAS EZEQUIEL'),(937,'1364',NULL,NULL,NULL,NULL,'Tejido Nazareno'),(938,'1375',NULL,NULL,NULL,NULL,'GAJATE MANUEL'),(939,'1376',NULL,NULL,NULL,NULL,'Van Den Eng Alejo'),(940,'1377',NULL,NULL,NULL,NULL,'ALTAMIRANO RICARDO DANTE'),(941,'1383',NULL,NULL,NULL,NULL,'Rosales Marcelo'),(942,'1384',NULL,NULL,NULL,NULL,'POCIUS VALENTIN'),(943,'1386',NULL,NULL,NULL,NULL,'SOSA MATIAS EDELMAR'),(944,'1387',NULL,NULL,NULL,NULL,'Leguizamon, Saul'),(945,'1388',NULL,NULL,NULL,NULL,'BAUTISTA JUAN MANUEL'),(946,'1389',NULL,NULL,NULL,NULL,'MATTIEVICH NICOLAS'),(947,'1390',NULL,NULL,NULL,NULL,'BROGGI GUIDO NICOLAS'),(948,'1391',NULL,NULL,NULL,NULL,'Perez, Benjamin'),(949,'1392',NULL,NULL,NULL,NULL,'Basile Facundo'),(950,'1393',NULL,NULL,NULL,NULL,'GUINEA FEDERICO EZEQUIEL'),(951,'1394',NULL,NULL,NULL,NULL,'Villalba Julio'),(952,'1396',NULL,NULL,NULL,NULL,'REYES JONATHAN NAHUEL'),(953,'1397',NULL,NULL,NULL,NULL,'NUÑEZ IVAN'),(954,'1398',NULL,NULL,NULL,NULL,'LLANOS JUAN MANUEL'),(955,'1404',NULL,NULL,NULL,NULL,'HERNANDEZ MAXIMILIANO'),(956,'1405',NULL,NULL,NULL,NULL,'PONCE RAMON NICOLAS'),(957,'1406',NULL,NULL,NULL,NULL,'WASINGER SEBASTIAN'),(958,'1407',NULL,NULL,NULL,NULL,'CARDASCIA PABLO SEBASTIAN'),(959,'1408',NULL,NULL,NULL,NULL,'Witting Alan'),(960,'1409',NULL,NULL,NULL,NULL,'Pestarino Francisco'),(961,'1410',NULL,NULL,NULL,NULL,'Lescano Franco'),(962,'1414',NULL,NULL,NULL,NULL,'Mastantuono Juan Manuel'),(963,'1416',NULL,NULL,NULL,NULL,'Degue Gaspar'),(964,'1419',NULL,NULL,NULL,NULL,'MORALES MIGUEL ANGEL'),(965,'1420',NULL,NULL,NULL,NULL,'HERRERA PABLO'),(966,'1422',NULL,NULL,NULL,NULL,'SUAREZ ROLANDO'),(967,'1426',NULL,NULL,NULL,NULL,'CANDEDO ENZO HERNAN'),(968,'1427',NULL,NULL,NULL,NULL,'MORALES FACUNDO'),(969,'1428',NULL,NULL,NULL,NULL,'MAIDANA RAMON AXEL'),(970,'1429',NULL,NULL,NULL,NULL,'RODRIGUEZ CARLOS MANUEL'),(971,'1432',NULL,NULL,NULL,NULL,'CANTONI VALENTIN'),(972,'1434',NULL,NULL,NULL,NULL,'GOMEZ VICTOR HERNAN'),(973,'1436',NULL,NULL,NULL,NULL,'PERAFAN JUAN MANUEL'),(974,'1440',NULL,NULL,NULL,NULL,'SEGOVIA LUCAS'),(975,'1443',NULL,NULL,NULL,NULL,'AREVALO JOHARIAM ELIUD'),(976,'1445',NULL,NULL,NULL,NULL,'QUENAIPE CRISTIAN'),(977,'1448',NULL,NULL,NULL,NULL,'LAZARTE JUAN RAMON'),(978,'1449',NULL,NULL,NULL,NULL,'ITURREZ RUBEN EDUARDO'),(979,'1456',NULL,NULL,NULL,NULL,'PALAZZO ALEJO'),(980,'1458',NULL,NULL,NULL,NULL,'MIRABAL HERNANDEZ, YALBER JESUS FERNANDO'),(981,'1459',NULL,NULL,NULL,NULL,'ECHEVERRIA TOBIAS'),(982,'1462',NULL,NULL,NULL,NULL,'GUTIERREZ NESTOR DANIEL'),(983,'1463',NULL,NULL,NULL,NULL,'CAISIN URIEL'),(984,'1464',NULL,NULL,NULL,NULL,'ARCE RODRIGO'),(985,'1465',NULL,NULL,NULL,NULL,'LACIAR FACUNDO'),(986,'1468',NULL,NULL,NULL,NULL,'RODRIGUEZ CRISTIAN EDUARDO'),(987,'1472',NULL,NULL,NULL,NULL,'SALAS EMILIANO AGUSTIN'),(988,'1473',NULL,NULL,NULL,NULL,'ESPINOSA ALEX'),(989,'1474',NULL,NULL,NULL,NULL,'MILLIONE EMANUEL'),(990,'1476',NULL,NULL,NULL,NULL,'BURGER FERRERO ALEJANDRO'),(991,'1479',NULL,NULL,NULL,NULL,'GARCIA BRANDT JULIO'),(992,'1480',NULL,NULL,NULL,NULL,'Acosta Martín Félix'),(993,'1481',NULL,NULL,NULL,NULL,'CAPORALE AGUSTIN'),(994,'1482',NULL,NULL,NULL,NULL,'ILLANES PABLO CESAR'),(995,'1485',NULL,NULL,NULL,NULL,'SORIA MARIANO EXEQUIEL'),(996,'1492',NULL,NULL,NULL,NULL,'MARTINEZ HENRY'),(997,'1493',NULL,NULL,NULL,NULL,'CLAROS HINOJOSA MARCO'),(998,'1494',NULL,NULL,NULL,NULL,'SEQUEIRA SILVIO'),(999,'1495',NULL,NULL,NULL,NULL,'CATALDI ENZO ARIEL'),(1000,'1496',NULL,NULL,NULL,NULL,'VERA HUGO SEBASTIAN'),(1001,'1497',NULL,NULL,NULL,NULL,'ZIRR IVO LUIS'),(1002,'1498',NULL,NULL,NULL,NULL,'BARRETO ESTEFANIA'),(1003,'1499',NULL,NULL,NULL,NULL,'PELLEGRINI GINO BAUTISTA'),(1004,'1500',NULL,NULL,NULL,NULL,'IRIART FACUNDO ARIEL'),(1005,'1501',NULL,NULL,NULL,NULL,'ALVAREZ NICOLAS'),(1006,'1502',NULL,NULL,NULL,NULL,'VERA MAXIMILIANO'),(1007,'1503',NULL,NULL,NULL,NULL,'GONZALEZ AGUSTIN'),(1008,'1504',NULL,NULL,NULL,NULL,'TABELLA JONATAN'),(1009,'1506',NULL,NULL,NULL,NULL,'EMKE JORGE OSCAR'),(1010,'1507',NULL,NULL,NULL,NULL,'AISCAR JAVIER NICOLAS'),(1011,'1508',NULL,NULL,NULL,NULL,'MERAN ZABALA LUIS'),(1012,'1509',NULL,NULL,NULL,NULL,'QUIROZ BAUTISTA MISAEL'),(1013,'1510',NULL,NULL,NULL,NULL,'DINAPOLI GUIDO'),(1014,'1511',NULL,NULL,NULL,NULL,'LOPEZ EDUARDO'),(1015,'1512',NULL,NULL,NULL,NULL,'VERA AXEL JESUS'),(1016,'1513',NULL,NULL,NULL,NULL,'DANIELLE GUILLERMO ALEJO'),(1017,'1514',NULL,NULL,NULL,NULL,'DE BELLO VALENTIN'),(1018,'1515',NULL,NULL,NULL,NULL,'ARIZABALO EDGARDO'),(1019,'1516',NULL,NULL,NULL,NULL,'Ortiz Alexis'),(1020,'1517',NULL,NULL,NULL,NULL,'Ramirez Mariano'),(1021,'1518',NULL,NULL,NULL,NULL,'FERNANDEZ NICOLAS'),(1022,'1519',NULL,NULL,NULL,NULL,'Ventre Emiliano'),(1023,'1520',NULL,NULL,NULL,NULL,'Labarere Paula'),(1024,'1521',NULL,NULL,NULL,NULL,'ALONSO VILLAFAÑE RAMIRO'),(1025,'1522',NULL,NULL,NULL,NULL,'Azcué María Guadalupe'),(1026,'1523',NULL,NULL,NULL,NULL,'Maldonado Alexis'),(1027,'1524',NULL,NULL,NULL,NULL,'Amadio Nahuel'),(1028,'1525',NULL,NULL,NULL,NULL,'Cagliani Luca'),(1029,'1526',NULL,NULL,NULL,NULL,'Cardenas Juan Genaro'),(1030,'1527',NULL,NULL,NULL,NULL,'Arrietta Matias'),(1031,'1528',NULL,NULL,NULL,NULL,'BOISSERENE AXEL'),(1032,'1529',NULL,NULL,NULL,NULL,'MIRANDA NICOLAS'),(1033,'1530',NULL,NULL,NULL,NULL,'BUSSO BERNARDO'),(1034,'1531',NULL,NULL,NULL,NULL,'Jurado Valentín Jesús'),(1035,'1532',NULL,NULL,NULL,NULL,'Vespasiano Pilar'),(1036,'1533',NULL,NULL,NULL,NULL,'TARAMASCO, LUCAS'),(1037,'1534',NULL,NULL,NULL,NULL,'ALARCON FERNANDO'),(1038,'1535',NULL,NULL,NULL,NULL,'RODRIGUEZ LUCAS'),(1039,'1537',NULL,NULL,NULL,NULL,'Escalera Andres'),(1040,'1538',NULL,NULL,NULL,NULL,'Montenegro Cristian'),(1041,'1539',NULL,NULL,NULL,NULL,'Bravo Carlos'),(1042,'1540',NULL,NULL,NULL,NULL,'Garcia Manuel'),(1043,'1541',NULL,NULL,NULL,NULL,'Dos Santos Roberto'),(1044,'1542',NULL,NULL,NULL,NULL,'TABELLA AXEL'),(1045,'1543',NULL,NULL,NULL,NULL,'Varela Juan Ignacio'),(1046,'1544',NULL,NULL,NULL,NULL,'Navarro Angel'),(1047,'1545',NULL,NULL,NULL,NULL,'Quintana Marcos'),(1048,'1546',NULL,NULL,NULL,NULL,'Paez Roberto'),(1049,'1547',NULL,NULL,NULL,NULL,'Almiron Ivan'),(1050,'1548',NULL,NULL,NULL,NULL,'Lenain Thiago'),(1051,'1549',NULL,NULL,NULL,NULL,'Rodriguez Elias'),(1052,'1550',NULL,NULL,NULL,NULL,'Amante Pedro'),(1053,'1551',NULL,NULL,NULL,NULL,'Vespaciano Mirko'),(1054,'1552',NULL,NULL,NULL,NULL,'Medrano Guido'),(1055,'1553',NULL,NULL,NULL,NULL,'Hernan Villafañe'),(1056,'1554',NULL,NULL,NULL,NULL,'Zafatle Alejo'),(1057,'1555',NULL,NULL,NULL,NULL,'Gioia Agustin'),(1058,'1556',NULL,NULL,NULL,NULL,'Uballes Agustin'),(1059,'1557',NULL,NULL,NULL,NULL,'IRALA Osvaldo'),(1060,'1558',NULL,NULL,NULL,NULL,'Ortiz Axel'),(1061,'1559',NULL,NULL,NULL,NULL,'Villalba Fernando'),(1062,'1560',NULL,NULL,NULL,NULL,'Sasiain Juan Ignacio'),(1063,'1561',NULL,NULL,NULL,NULL,'SCELATTO DAVID'),(1064,'1562',NULL,NULL,NULL,NULL,'Castillo Gustavo'),(1065,'1563',NULL,NULL,NULL,NULL,'Pedro Huarachi Ochoa'),(1066,'1564',NULL,NULL,NULL,NULL,'Mateo Carballo'),(1067,'1565',NULL,NULL,NULL,NULL,'González Alexis'),(1068,'1566',NULL,NULL,NULL,NULL,'Corbalán María del Rosario'),(1069,'1567',NULL,NULL,NULL,NULL,'Esquivel Miguel'),(1070,'1568',NULL,NULL,NULL,NULL,'CARDOZO ALDO'),(1071,'1569',NULL,NULL,NULL,NULL,'Sánchez Cleber'),(1072,'1570',NULL,NULL,NULL,NULL,'LORONI MATEO'),(1073,'1571',NULL,NULL,NULL,NULL,'Iturain Joaquin'),(1074,'1572',NULL,NULL,NULL,NULL,'Cieri Thiago'),(1075,'1573',NULL,NULL,NULL,NULL,'Licata Ramiro'),(1076,'1574',NULL,NULL,NULL,NULL,'Acosta Nivardo'),(1077,'1575',NULL,NULL,NULL,NULL,'Rojas Agustin'),(1078,'1576',NULL,NULL,NULL,NULL,'Dasso Jeremias'),(1079,'1577',NULL,NULL,NULL,NULL,'Chara Oyola Remberto'),(1080,'1578',NULL,NULL,NULL,NULL,'DACCIAVO SABRINA'),(1081,'1579',NULL,NULL,NULL,NULL,'Duhalde Felipe'),(1082,'1580',NULL,NULL,NULL,NULL,'CARDENAS JIMMY'),(1083,'1581',NULL,NULL,NULL,NULL,'Malanchino Facundo'),(1084,'1582',NULL,NULL,NULL,NULL,'Rosales Emanuel'),(1085,'1583',NULL,NULL,NULL,NULL,'ARIAS EZEQUIEL'),(1086,'1584',NULL,NULL,NULL,NULL,'Sperani Nicolas'),(1087,'1585',NULL,NULL,NULL,NULL,'SALINAS GABRIEL'),(1088,'1586',NULL,NULL,NULL,NULL,'Teixido Santiago Andrés'),(1089,'1587',NULL,NULL,NULL,NULL,'Saini Marcos'),(1090,'1588',NULL,NULL,NULL,NULL,'Stefanini Joaquin'),(1091,'1589',NULL,NULL,NULL,NULL,'Sanchez Maximiliano'),(1092,'1590',NULL,NULL,NULL,NULL,'Morais Ever'),(1093,'1591',NULL,NULL,NULL,NULL,'Galante Tobias'),(1094,'1592',NULL,NULL,NULL,NULL,'Daluisio Romano Joel'),(1095,'1593',NULL,NULL,NULL,NULL,'Buffa Brian'),(1096,'1594',NULL,NULL,NULL,NULL,'Meza Ramon'),(1097,'1595',NULL,NULL,NULL,NULL,'AGUSTIN SUAREZ CLAVERIA'),(1098,'1596',NULL,NULL,NULL,NULL,'Romero Emanuel'),(1099,'1597',NULL,NULL,NULL,NULL,'Caldera Juan Pablo'),(1100,'1598',NULL,NULL,NULL,NULL,'Maldonado Nicolas'),(1101,'1599',NULL,NULL,NULL,NULL,'BAIGORRIA GUSTAVO'),(1102,'1600',NULL,NULL,NULL,NULL,'Ventre Juan Sebastian'),(1103,'1601',NULL,NULL,NULL,NULL,'Galván Facundo Nicolás'),(1104,'1602',NULL,NULL,NULL,NULL,'Fernandez Huanca Cristian'),(1105,'1603',NULL,NULL,NULL,NULL,'NARMONTAS STEVEN'),(1106,'1604',NULL,NULL,NULL,NULL,'MASTANTUONO LUCIA'),(1107,'1605',NULL,NULL,NULL,NULL,'RULLO FRANCO'),(1108,'1606',NULL,NULL,NULL,NULL,'Biscotti Paula'),(1109,'1607',NULL,NULL,NULL,NULL,'ANGELINI ELIAS'),(1110,'1608',NULL,NULL,NULL,NULL,'Rocha Solis Edgar'),(1111,'1609',NULL,NULL,NULL,NULL,'Bonzo Dalmiro'),(1112,'1610',NULL,NULL,NULL,NULL,'Milione Santiago'),(1113,'1611',NULL,NULL,NULL,NULL,'MICHELI LEANDRO'),(1114,'1612',NULL,NULL,NULL,NULL,'Mijail Lopez'),(1115,'1613',NULL,NULL,NULL,NULL,'MARTINEZ TOBIAS NICOLAS'),(1116,'1614',NULL,NULL,NULL,NULL,'CATALDO MATIAS'),(1117,'1615',NULL,NULL,NULL,NULL,'CORDOBA DIEGO'),(1118,'1616',NULL,NULL,NULL,NULL,'RAMIREZ JOEL DAVID'),(1119,'1617',NULL,NULL,NULL,NULL,'Silva Jonathan'),(1120,'1620',NULL,NULL,NULL,NULL,'Mansilla Alejo Damián'),(1121,'1621',NULL,NULL,NULL,NULL,'Nobillo Segundo Axel'),(1122,'1622',NULL,NULL,NULL,NULL,'Trevellini Tomas'),(1123,'1623',NULL,NULL,NULL,NULL,'MUÑOZ HUGO'),(1124,'1624',NULL,NULL,NULL,NULL,'Abrigo Garcia Isidoro'),(1125,'1625',NULL,NULL,NULL,NULL,'RENZO COLANTONIO'),(1126,'1626',NULL,NULL,NULL,NULL,'Carmody Patricio Facundo'),(1127,'1627',NULL,NULL,NULL,NULL,'MASTROPIERRO BENJAMIN'),(1128,'1628',NULL,NULL,NULL,NULL,'SANCHEZ JOEL'),(1129,'1629',NULL,NULL,NULL,NULL,'URBIETA FACUNDO NAHUEL'),(1130,'1631',NULL,NULL,NULL,NULL,'Fernández Rengifo Juan'),(1131,'1632',NULL,NULL,NULL,NULL,'BAUTISTA COCCO'),(1132,'1633',NULL,NULL,NULL,NULL,'FRONTERA ESTEBAN'),(1133,'1635',NULL,NULL,NULL,NULL,'PITTA PABLO DANIEL'),(1134,'1636',NULL,NULL,NULL,NULL,'Bottazzi Analía Verónica'),(1135,'1638',NULL,NULL,NULL,NULL,'TEJIDO JOAQUIN'),(1136,'1639',NULL,NULL,NULL,NULL,'Decima Lautaro'),(1137,'1640',NULL,NULL,NULL,NULL,'GONZALEZ JUAN BAUTISTA'),(1138,'1641',NULL,NULL,NULL,NULL,'FARIAS LUCAS'),(1139,'1642',NULL,NULL,NULL,NULL,'MARAZ ROGELIO'),(1140,'1643',NULL,NULL,NULL,NULL,'Lopez Santiago'),(1141,'1644',NULL,NULL,NULL,NULL,'MARTINEZ EMANUEL'),(1142,'1645',NULL,NULL,NULL,NULL,'Fernandez Jesus'),(1143,'1646',NULL,NULL,NULL,NULL,'Henriquez Campos Yorman'),(1144,'1647',NULL,NULL,NULL,NULL,'Corbalan Alonso'),(1145,'1648',NULL,NULL,NULL,NULL,'BARBOZA DANIEL'),(1146,'1650',NULL,NULL,NULL,NULL,'Alfonzo Gustavo'),(1147,'1652',NULL,NULL,NULL,NULL,'LOBATO DENIS'),(1148,'1654',NULL,NULL,NULL,NULL,'Zarza Sandro'),(1149,'1655',NULL,NULL,NULL,NULL,'BRUNO GIÚDICHE CARLA'),(1150,'1656',NULL,NULL,NULL,NULL,'Quiroga Benjamin'),(1151,'1657',NULL,NULL,NULL,NULL,'Poy Roman'),(1152,'1658',NULL,NULL,NULL,NULL,'CATTANEO MARIO EZEQUIEL'),(1153,'1660',NULL,NULL,NULL,NULL,'RAMIREZ JOEL'),(1154,'1661',NULL,NULL,NULL,NULL,'Cambareri José Patricio'),(1155,'1663',NULL,NULL,NULL,NULL,'Chilano Tomás Agustín'),(1156,'1665',NULL,NULL,NULL,NULL,'Nuñez Lucas'),(1157,'1666',NULL,NULL,NULL,NULL,'MARTINEZ FRANCO'),(1158,'1667',NULL,NULL,NULL,NULL,'CONDORI ORLANDO'),(1159,'1668',NULL,NULL,NULL,NULL,'LUGO MATIAS'),(1160,'1669',NULL,NULL,NULL,NULL,'Zurita Rocha Ángel Gabriel'),(1161,'1670',NULL,NULL,NULL,NULL,'Sañudo Benjamín'),(1162,'1671',NULL,NULL,NULL,NULL,'Farías Héctor Nazareno'),(1163,'1673',NULL,NULL,NULL,NULL,'MAIGUA JOSE'),(1164,'1674',NULL,NULL,NULL,NULL,'ROMANO KEVIN'),(1165,'1675',NULL,NULL,NULL,NULL,'AGUIRRE GIRA LEODAN'),(1166,'1676',NULL,NULL,NULL,NULL,'MASTROPIERRO LEONEL'),(1167,'1677',NULL,NULL,NULL,NULL,'RODRIGUEZ DANTE'),(1168,'1678',NULL,NULL,NULL,NULL,'CASCIO JUAN IGNACIO'),(1169,'1679',NULL,NULL,NULL,NULL,'Pineda Edgar Lionel'),(1170,'1680',NULL,NULL,NULL,NULL,'Juanes Benjamin'),(1171,'1681',NULL,NULL,NULL,NULL,'Diaz Juan Pablo'),(1172,'1682',NULL,NULL,NULL,NULL,'Barbieri Nicolás Carlos'),(1173,'1683',NULL,NULL,NULL,NULL,'Astudillo Benjamín Ezequiel'),(1174,'1684',NULL,NULL,NULL,NULL,'CIRIGLIANO PEDROZO KEVIN'),(1175,'1685',NULL,NULL,NULL,NULL,'Curaratti Lucas Gabriel'),(1176,'1686',NULL,NULL,NULL,NULL,'CABRERA BRIAN'),(1177,'1687',NULL,NULL,NULL,NULL,'DAMICO BRIAN'),(1178,'1688',NULL,NULL,NULL,NULL,'Farias Fernando'),(1179,'1689',NULL,NULL,NULL,NULL,'Zabala María Celeste'),(1180,'1690',NULL,NULL,NULL,NULL,'LUIS CRESCIMONE'),(1181,'1691',NULL,NULL,NULL,NULL,'FRANCISCO ALVAREZ'),(1182,'1692',NULL,NULL,NULL,NULL,'VALENTINO RUIZ'),(1183,'1693',NULL,NULL,NULL,NULL,'LEONARDO MANUEL VERA'),(1184,'1694',NULL,NULL,NULL,NULL,'LUCIANO FIGUEROA'),(1185,'1695',NULL,NULL,NULL,NULL,'ISAIAS GALEANO'),(1186,'1696',NULL,NULL,NULL,NULL,'NAHUEL LUCERO'),(1187,'1697',NULL,NULL,NULL,NULL,'AXEL FORNERIS'),(1188,'1698',NULL,NULL,NULL,NULL,'ALBORNOZ JESUS'),(1189,'1700',NULL,NULL,NULL,NULL,'CANCIO ALEXIS'),(1190,'1701',NULL,NULL,NULL,NULL,'AROSTEGUI TEHUEL'),(1191,'1702',NULL,NULL,NULL,NULL,'ESPERANZA TOMAS'),(1192,'1704',NULL,NULL,NULL,NULL,'VIDAL KEVIN DARIO'),(1193,'1705',NULL,NULL,NULL,NULL,'Felice Diego Fernando'),(1194,'1706',NULL,NULL,NULL,NULL,'ORTIZ NICOLAS GABRIEL'),(1195,'1707',NULL,NULL,NULL,NULL,'GIARY MARCOS MAURICIO'),(1196,'1708',NULL,NULL,NULL,NULL,'CIERI FERNANDO'),(1197,'1709',NULL,NULL,NULL,NULL,'BENAVIDES FACUNDO'),(1198,'1710',NULL,NULL,NULL,NULL,'CALVO THIAGO'),(1199,'1711',NULL,NULL,NULL,NULL,'CABRERA OBERTI JON URIEL'),(1200,'1712',NULL,NULL,NULL,NULL,'Bairac Tiziano'),(1201,'1713',NULL,NULL,NULL,NULL,'Loureiro Leandro'),(1202,'1715',NULL,NULL,NULL,NULL,'Rivas Ricardo'),(1203,'1716',NULL,NULL,NULL,NULL,'GODOY JEREMIAS AGUSTIN'),(1204,'1717',NULL,NULL,NULL,NULL,'MARQUEZ VALENTIN'),(1205,'1718',NULL,NULL,NULL,NULL,'Vaccarino Romina Mariel'),(1206,'1719',NULL,NULL,NULL,NULL,'STEURER BRIAN ELOY'),(1207,'1721',NULL,NULL,NULL,NULL,'Duffau Ana Paula'),(1208,'1722',NULL,NULL,NULL,NULL,'GONZALEZ LEANDRO ESTEBAN'),(1209,'1723',NULL,NULL,NULL,NULL,'SAÑUDO BENJAMIN EZEQUIEL'),(1210,'1724',NULL,NULL,NULL,NULL,'Fanucce Ayelen'),(1211,'1725',NULL,NULL,NULL,NULL,'GARCIA MANUEL'),(1212,'1726',NULL,NULL,NULL,NULL,'ALARCON DANTE GABRIEL'),(1213,'1727',NULL,NULL,NULL,NULL,'Reyes Axel'),(1214,'1731',NULL,NULL,NULL,NULL,'Gorosito Mirko'),(1215,'1732',NULL,NULL,NULL,NULL,'Diaz Patricio'),(1216,'1733',NULL,NULL,NULL,NULL,'Vespasiano Santino'),(1217,'1734',NULL,NULL,NULL,NULL,'Casanova Lucas'),(1218,'1735',NULL,NULL,NULL,NULL,'Maldonado Gonzalo'),(1219,'1736',NULL,NULL,NULL,NULL,'Martinez Viademonte Julian'),(1220,'1737',NULL,NULL,NULL,NULL,'Fernandez Fontela Cristopher'),(1221,'1738',NULL,NULL,NULL,NULL,'Mastantuono Cassino Diego'),(1222,'1739',NULL,NULL,NULL,NULL,'Ramos Miguel Adrian'),(1223,'1740',NULL,NULL,NULL,NULL,'Jimenez Fernandez Luis Guillermo'),(1224,'1742',NULL,NULL,NULL,NULL,'Alejandro Thiago'),(1225,'1743',NULL,NULL,NULL,NULL,'Suarez Diego Martin'),(1226,'1744',NULL,NULL,NULL,NULL,'Torrez Alex'),(1227,'1745',NULL,NULL,NULL,NULL,'Diaz Mateo'),(1228,'1746',NULL,NULL,NULL,NULL,'Medina Geronimo'),(1229,'1747',NULL,NULL,NULL,NULL,'Alfonso Alexis'),(1230,'1748',NULL,NULL,NULL,NULL,'Boffa Valentin'),(1231,'1749',NULL,NULL,NULL,NULL,'Simone Ferreyra, Nahuel'),(1232,'1750',NULL,NULL,NULL,NULL,'Violante Agustin'),(1233,'1751',NULL,NULL,NULL,NULL,'Belarde Bernabe'),(1234,'1752',NULL,NULL,NULL,NULL,'Peliche Matias'),(1235,'1753',NULL,NULL,NULL,NULL,'Chilano Juan Manuel'),(1236,'1756',NULL,NULL,NULL,NULL,'Cristofaro Benjamin'),(1237,'1757',NULL,NULL,NULL,NULL,'Martini Axel'),(1238,'1759',NULL,NULL,NULL,NULL,'Arrieta Román Javier'),(1239,'1767',NULL,NULL,NULL,NULL,'PERAFAN JUAN'),(1240,'1768','gabrielt@donyeyo.com.ar',NULL,NULL,NULL,'Tonelli Gabriel David');
/*!40000 ALTER TABLE `legajos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `legajosDependencias`
--

DROP TABLE IF EXISTS `legajosDependencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legajosDependencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `legajoPadre` varchar(30) NOT NULL,
  `legajoHijo` varchar(30) NOT NULL,
  `idLegajoPadre` int DEFAULT NULL,
  `idLegajoHijo` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `legajoPadre` (`legajoPadre`),
  KEY `legajoHijo` (`legajoHijo`),
  KEY `idLegajoPadre` (`idLegajoPadre`),
  KEY `idLegajoHijo` (`idLegajoHijo`),
  CONSTRAINT `legajosDependencias_ibfk_2` FOREIGN KEY (`legajoHijo`) REFERENCES `legajos` (`legajo`),
  CONSTRAINT `legajosDependencias_ibfk_3` FOREIGN KEY (`idLegajoPadre`) REFERENCES `legajos` (`id`),
  CONSTRAINT `legajosDependencias_ibfk_4` FOREIGN KEY (`idLegajoHijo`) REFERENCES `legajos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legajosDependencias`
--

LOCK TABLES `legajosDependencias` WRITE;
/*!40000 ALTER TABLE `legajosDependencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `legajosDependencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lugares`
--

DROP TABLE IF EXISTS `lugares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lugares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `detalle` varchar(200) DEFAULT NULL,
  `esDependencia` tinyint(1) DEFAULT '0',
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lugares`
--

LOCK TABLES `lugares` WRITE;
/*!40000 ALTER TABLE `lugares` DISABLE KEYS */;
INSERT INTO `lugares` VALUES (1,'Planta Elguea Román',NULL,1,NULL,NULL),(2,'Planta Hipólito Yrigoyen',NULL,1,NULL,NULL),(3,'Exteriores',NULL,0,NULL,NULL),(4,'Planta Pellegrini',NULL,1,NULL,NULL);
/*!40000 ALTER TABLE `lugares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientoEstados`
--

DROP TABLE IF EXISTS `movimientoEstados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientoEstados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientoEstados`
--

LOCK TABLES `movimientoEstados` WRITE;
/*!40000 ALTER TABLE `movimientoEstados` DISABLE KEYS */;
INSERT INTO `movimientoEstados` VALUES (1,'Pendiente'),(2,'Completado'),(3,'Vencido');
/*!40000 ALTER TABLE `movimientoEstados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientoTipos`
--

DROP TABLE IF EXISTS `movimientoTipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientoTipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  `aplicabilidad` enum('internos','externos','objetos') NOT NULL,
  `direccion` enum('saliente','entrante') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientoTipos`
--

LOCK TABLES `movimientoTipos` WRITE;
/*!40000 ALTER TABLE `movimientoTipos` DISABLE KEYS */;
INSERT INTO `movimientoTipos` VALUES (1,'Egreso de personal','internos','saliente'),(2,'Ingreso de personal','internos','entrante'),(3,'Envío','objetos','saliente'),(4,'Recepción','objetos','entrante');
/*!40000 ALTER TABLE `movimientoTipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idGrupo` int NOT NULL DEFAULT '0',
  `ordenGrupo` int DEFAULT '1',
  `idTipo` int NOT NULL,
  `personaInterna` varchar(30) DEFAULT NULL,
  `idPersonaExterna` int DEFAULT NULL,
  `fechaHoraRegistro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `conRegreso` tinyint(1) DEFAULT '0',
  `motivo` enum('Motivos personales','Requerimiento laboral','Accidente o razones médicas','Otros') NOT NULL,
  `personaAutorizante` varchar(30) DEFAULT NULL,
  `observacion` varchar(500) DEFAULT NULL,
  `idEstado` int NOT NULL DEFAULT '1',
  `idLugarOrigen` int NOT NULL,
  `idLugarDestino` int NOT NULL,
  `destinoDetalle` varchar(50) DEFAULT NULL,
  `personaReceptora` varchar(50) DEFAULT NULL,
  `esRecurrente` tinyint(1) DEFAULT '0',
  `vencimientoRecurrencias` date DEFAULT NULL,
  `usuario_app` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `vigilador` varchar(30) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idTipo` (`idTipo`),
  KEY `idx_mov_grupo` (`idGrupo`),
  KEY `idx_mov_fecha` (`fechaHoraRegistro`),
  KEY `fk_movimientos_personaAutorizante` (`personaAutorizante`),
  KEY `idx_mov_estado` (`idEstado`),
  KEY `idx_mov_origen` (`idLugarOrigen`),
  KEY `idx_mov_destino` (`idLugarDestino`),
  KEY `idx_mov_interno` (`personaInterna`),
  KEY `idx_mov_externo` (`idPersonaExterna`),
  CONSTRAINT `fk_movimientos_personaAutorizante` FOREIGN KEY (`personaAutorizante`) REFERENCES `legajos` (`legajo`),
  CONSTRAINT `fk_movimientos_personaInterna` FOREIGN KEY (`personaInterna`) REFERENCES `legajos` (`legajo`),
  CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`idTipo`) REFERENCES `movimientoTipos` (`id`),
  CONSTRAINT `movimientos_ibfk_4` FOREIGN KEY (`idEstado`) REFERENCES `movimientoEstados` (`id`),
  CONSTRAINT `movimientos_ibfk_5` FOREIGN KEY (`idLugarOrigen`) REFERENCES `lugares` (`id`),
  CONSTRAINT `movimientos_ibfk_6` FOREIGN KEY (`idLugarDestino`) REFERENCES `lugares` (`id`),
  CONSTRAINT `movimientos_ibfk_7` FOREIGN KEY (`idPersonaExterna`) REFERENCES `personasExternas` (`id`),
  CONSTRAINT `chk_persona` CHECK (((`personaInterna` is not null) xor (`idPersonaExterna` is not null)))
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
INSERT INTO `movimientos` VALUES (1,0,1,1,'0003',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768','sfjhsryjyj',2,1,1,'dxfdxfdf',NULL,0,NULL,'gabrielt@donyeyo.com.ar','ailu'),(2,0,1,2,'0735',NULL,'2026-02-09 12:45:11',0,'Accidente o razones médicas','1768','',2,2,2,'fghfgh',NULL,0,NULL,'gabrielt@donyeyo.com.ar','ailu'),(3,0,1,1,'0023',NULL,'2026-02-09 12:45:50',0,'Requerimiento laboral','1768','',1,4,3,'jhhhh',NULL,0,NULL,'gabrielt@donyeyo.com.ar','ailu'),(4,0,1,1,'0735',NULL,'2026-02-09 00:00:00',0,'Accidente o razones médicas','1768','',1,4,4,'va al medico a sacarse una muela, despues va al ba',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(5,0,1,1,'0005',NULL,'2026-02-09 00:00:00',0,'Accidente o razones médicas','1768',NULL,1,1,3,'dfgdfg',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(6,0,1,1,'0735',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768',NULL,1,2,3,'asdasd',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(7,0,1,1,'0735',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','sds',1,1,3,'sadsad',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(8,0,1,1,'0735',NULL,'2026-02-09 00:00:00',1,'Requerimiento laboral','1768',NULL,1,2,3,'wdswqadsqwas',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(9,0,1,1,'0006',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','',1,1,3,'zxczdfdsfdgaaaa',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(10,0,1,1,'0009',NULL,'2026-02-09 00:00:00',0,'Accidente o razones médicas','1768','9',1,2,3,'sdfsdfsd',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(11,0,1,1,'0005',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','10',1,1,3,'sadsad',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(12,0,1,1,'0150',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','11',1,1,3,'asdsad',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(13,0,1,1,'0005',NULL,'2026-02-09 00:00:00',0,'Accidente o razones médicas','1768','12',1,1,3,'ertert',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(14,0,1,1,'0048',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768','',1,1,3,'dssadasd',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(15,0,1,1,'1543',NULL,'2026-02-09 00:00:00',1,'Motivos personales','1768','14',1,1,3,'sdsd',NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(16,0,1,1,'1767',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','15',1,1,3,'sadsd',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(17,0,1,1,'1752',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','16',1,4,3,'adsdasd',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(18,0,1,1,'1747',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768','',1,1,3,'e brterret ert ert',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(19,0,1,1,'1533',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768','algo algo',1,4,2,'gggg',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(20,0,1,1,'1058',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(21,0,1,1,'1545',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(22,0,1,1,'1544',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','',1,1,3,'gfgfg',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(23,0,1,1,'1586',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'gfg',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(24,0,1,1,'1543',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'dsfsdf',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(25,0,1,1,'1541',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'hgjghj',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(26,0,1,1,'0474',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768','',1,1,3,'ffff',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(27,0,1,1,'1504',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','',1,1,2,'gfdfgdfg',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(28,28,1,1,'0006',NULL,'2026-02-06 13:18:15',0,'Requerimiento laboral','1768','Grupo de prueba - mov 1',1,1,3,'Destino externo',NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(29,28,2,2,'0006',NULL,'2026-02-06 13:18:58',0,'Requerimiento laboral','1768','Grupo de prueba - mov 2',1,1,3,'Destino externo',NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(30,28,3,1,'0006',NULL,'2026-02-06 13:44:42',0,'Requerimiento laboral','1768','Grupo de prueba - mov 3',1,1,3,'Destino externo',NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(31,28,4,2,'0006',NULL,'2026-02-06 16:12:19',0,'Requerimiento laboral','1768','Grupo de prueba - mov 4',1,1,3,'Destino externo',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(32,0,1,1,'0334',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'kjhkjhkn',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(33,0,1,1,'0334',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'kjhkjhkn',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(34,0,1,1,'0334',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'kjhkjhkn',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(35,0,1,1,'0334',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'kjhkjhkn',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(36,0,1,1,'0334',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'kjhkjhkn',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(37,0,1,1,'0334',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'kjhkjhkn',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(38,0,1,1,'0334',NULL,'2026-02-09 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'kjhkjhkn',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(39,39,1,1,'1752',NULL,'2026-02-09 00:00:00',1,'Requerimiento laboral','1768','Una observacion',1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(40,39,2,2,'1752',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','Una observacion',1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(41,39,3,1,'1752',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','Una observacion',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(42,39,4,2,'1752',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','Una observacion',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(43,0,1,1,'0094',NULL,'2026-02-09 00:00:00',1,'Requerimiento laboral','1768','',1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(44,44,1,1,'0514',NULL,'2026-02-09 16:28:35',1,'Requerimiento laboral','1768','jhghgj',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(45,44,2,2,'0514',NULL,'2026-02-09 16:33:20',0,'Requerimiento laboral','1768','',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(46,44,3,1,'0514',NULL,'2026-02-09 16:30:27',0,'Requerimiento laboral','1768','',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(47,44,4,2,'0514',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(48,48,1,1,'1724',NULL,'2026-02-09 16:57:31',1,'Requerimiento laboral','1768','Una observacion',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(49,48,2,2,'1724',NULL,'2026-02-09 16:59:54',0,'Requerimiento laboral','1768','Una observacion',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(50,48,3,1,'1724',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','Una observacion',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(51,48,4,2,'1724',NULL,'2026-02-09 00:00:00',0,'Requerimiento laboral','1768','Una observacion',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(52,52,1,1,'1767',NULL,'2026-02-10 13:32:07',1,'Motivos personales','1768','',2,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(53,52,2,2,'1767',NULL,'2026-02-10 13:32:12',0,'Motivos personales','1768','',2,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(54,52,3,1,'1767',NULL,'2026-02-10 13:32:17',0,'Motivos personales','1768','',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(55,52,4,2,'1767',NULL,'2026-02-10 13:32:24',0,'Motivos personales','1768','',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(56,56,1,1,'1767',NULL,'2026-02-10 13:32:28',1,'Motivos personales','1768','',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(57,56,2,2,'1767',NULL,'2026-02-10 13:32:30',0,'Motivos personales','1768','',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(58,56,3,1,'1767',NULL,'2026-02-10 13:32:37',0,'Motivos personales','1768','',2,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(59,56,4,2,'1767',NULL,'2026-02-10 13:32:41',0,'Motivos personales','1768','',2,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(60,60,1,1,'1274',NULL,'2026-02-10 13:30:09',1,'Motivos personales','1768','',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(61,60,2,2,'1274',NULL,'2026-02-10 13:30:36',0,'Motivos personales','1768','',2,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(62,60,3,1,'1274',NULL,'2026-02-10 13:32:47',0,'Motivos personales','1768','',2,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(63,60,4,2,'1274',NULL,'2026-02-10 13:32:50',0,'Motivos personales','1768','',2,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar','gabi'),(64,64,1,1,'1274',NULL,'2026-02-10 00:00:00',1,'Motivos personales','1768','',1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(65,64,2,2,'1274',NULL,'2026-02-10 00:00:00',0,'Motivos personales','1768','',1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(66,64,3,1,'1274',NULL,'2026-02-10 00:00:00',0,'Motivos personales','1768','',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(67,64,4,2,'1274',NULL,'2026-02-10 00:00:00',0,'Motivos personales','1768','',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(68,68,1,1,'1274',NULL,'2026-02-10 00:00:00',1,'Motivos personales','1768','',1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(69,68,2,2,'1274',NULL,'2026-02-10 00:00:00',0,'Motivos personales','1768','',1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(70,68,3,1,'1274',NULL,'2026-02-10 00:00:00',0,'Motivos personales','1768','',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(71,68,4,2,'1274',NULL,'2026-02-10 00:00:00',0,'Motivos personales','1768','',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(72,72,1,1,'1274',NULL,'2026-02-10 00:00:00',1,'Motivos personales','1768','',1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(73,72,2,2,'1274',NULL,'2026-02-10 00:00:00',0,'Motivos personales','1768','',1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(74,72,3,1,'1274',NULL,'2026-02-10 00:00:00',0,'Motivos personales','1768','',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(75,72,4,2,'1274',NULL,'2026-02-10 00:00:00',0,'Motivos personales','1768','',1,2,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(76,0,1,1,'1654',NULL,'2026-02-10 00:00:00',0,'Requerimiento laboral','1768',NULL,1,1,3,'fsdfsdfsdf',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(77,77,1,1,'0094',NULL,'2026-02-27 00:00:00',1,'Requerimiento laboral','1768','prueba prod 1',1,1,4,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(78,0,1,1,'0804',NULL,'2026-02-27 00:00:00',0,'Motivos personales','1768',NULL,1,1,2,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(79,0,1,1,'0048',NULL,'2026-02-27 00:00:00',0,'Motivos personales','1768',NULL,1,1,3,'jkjhk',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(80,77,2,2,'0094',NULL,'2026-02-27 00:00:00',0,'Requerimiento laboral','1768','prueba prod 1',1,1,4,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(81,77,3,1,'0094',NULL,'2026-02-27 00:00:00',0,'Requerimiento laboral','1768','prueba prod 1',1,4,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(82,77,4,2,'0094',NULL,'2026-02-27 00:00:00',0,'Requerimiento laboral','1768','prueba prod 1',1,4,1,NULL,NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(83,0,1,1,'1768',NULL,'2026-03-02 00:00:00',0,'Motivos personales','1768','',1,1,2,'',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(84,0,1,1,'1768',NULL,'2026-03-02 00:00:00',0,'Otros','1768','desde yeyo',1,1,2,'',NULL,0,NULL,'gabrielt@donyeyo.com.ar',''),(85,0,1,1,'0456',NULL,'2026-03-02 00:00:00',1,'Otros','1768','Va y vuelve',1,1,2,'laboratorio',NULL,0,NULL,'gabrielt@donyeyo.com.ar','');
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_mov_ins` AFTER INSERT ON `movimientos` FOR EACH ROW INSERT INTO `auditoria`

  (`entidad`, `idEntidad`, `usuario`, `vigilador`, `operacion`, `evento`, `modulo`)

VALUES

  ('movimientos', NEW.`id`, NEW.`usuario_app`, NEW.`vigilador`, 'create',

   'Nuevo movimiento registrado',

   'Gestor de Recepción') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_mov_upd` AFTER UPDATE ON `movimientos` FOR EACH ROW INSERT INTO `auditoria`

  (`entidad`, `idEntidad`, `usuario`, `vigilador`, `operacion`, `evento`, `modulo`)

VALUES

  ('movimientos', NEW.`id`, NEW.`usuario_app`, NEW.`vigilador`, 'update',

   'Actualización de datos/estado del movimiento',

   'Gestor de Recepción') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_mov_del` BEFORE DELETE ON `movimientos` FOR EACH ROW INSERT INTO `auditoria`

  (`entidad`, `idEntidad`, `usuario`, `vigilador`, `operacion`, `evento`, `modulo`)

VALUES

  ('movimientos', OLD.`id`, OLD.`usuario_app`, OLD.`vigilador`, 'delete',

   'Eliminación de registro de movimiento',

   'Gestor de Recepción') */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `movimientos_audit`
--

DROP TABLE IF EXISTS `movimientos_audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos_audit` (
  `audit_id` bigint NOT NULL AUTO_INCREMENT,
  `audit_moment` enum('before','after') NOT NULL,
  `audit_ts` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `audit_user` varchar(100) NOT NULL,
  `audit_conn_id` bigint NOT NULL,
  `mov_id` int DEFAULT NULL,
  `payload_json` json NOT NULL,
  `insert_text` text,
  PRIMARY KEY (`audit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_audit`
--

LOCK TABLES `movimientos_audit` WRITE;
/*!40000 ALTER TABLE `movimientos_audit` DISABLE KEYS */;
INSERT INTO `movimientos_audit` VALUES (1,'before','2026-01-29 16:05:12','DBAdmin_Acceso_A_Planta@%',1998455,NULL,'{\"id\": 20485, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": \"asdsadsa\", \"idLugarDestino\": 3, \"personaInterna\": \"0006\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20485,0,1,1,\'0006\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',NULL,1,1,3,\'asdsadsa\',NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(2,'before','2026-01-28 16:08:36','DBAdmin_Acceso_A_Planta@%',1998476,NULL,'{\"id\": 20486, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": null, \"idLugarDestino\": 2, \"personaInterna\": \"0006\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20486,0,1,1,\'0006\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',NULL,1,1,2,NULL,NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(3,'before','2026-01-28 16:14:17','DBAdmin_Acceso_A_Planta@%',1998476,NULL,'{\"id\": 20487, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": null, \"idLugarDestino\": 2, \"personaInterna\": \"0006\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20487,0,1,1,\'0006\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',NULL,1,1,2,NULL,NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(4,'before','2026-01-28 16:14:53','DBAdmin_Acceso_A_Planta@%',1998476,NULL,'{\"id\": 20488, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": null, \"idLugarDestino\": 2, \"personaInterna\": \"0006\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20488,0,1,1,\'0006\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',NULL,1,1,2,NULL,NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(5,'before','2026-01-28 16:29:15','DBAdmin_Acceso_A_Planta@%',1998541,NULL,'{\"id\": 20489, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": null, \"idLugarDestino\": 2, \"personaInterna\": \"0006\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20489,0,1,1,\'0006\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',NULL,1,1,2,NULL,NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(6,'before','2026-01-28 16:31:07','DBAdmin_Acceso_A_Planta@%',1998600,NULL,'{\"id\": 20490, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": null, \"idLugarDestino\": 2, \"personaInterna\": \"0006\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20490,0,1,1,\'0006\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',NULL,1,1,2,NULL,NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(7,'before','2026-01-28 16:33:35','DBAdmin_Acceso_A_Planta@%',1998613,NULL,'{\"id\": 20491, \"idTipo\": 1, \"motivo\": \"Otros\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 2, \"destinoDetalle\": \"prueba\", \"idLugarDestino\": 3, \"personaInterna\": \"0010\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20491,0,1,1,\'0010\',NULL,\'2026-01-28 00:00:00\',0,\'Otros\',\'1768\',NULL,1,2,3,\'prueba\',NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(8,'before','2026-01-28 16:39:39','DBAdmin_Acceso_A_Planta@%',1998613,NULL,'{\"id\": 20492, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": null, \"idLugarDestino\": 2, \"personaInterna\": \"0013\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20492,0,1,1,\'0013\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',NULL,1,1,2,NULL,NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(9,'before','2026-01-28 16:50:50','DBAdmin_Acceso_A_Planta@%',1998695,NULL,'{\"id\": 20493, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": null, \"idLugarDestino\": 4, \"personaInterna\": \"0006\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20493,0,1,1,\'0006\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',NULL,1,1,4,NULL,NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(10,'before','2026-01-28 16:53:27','DBAdmin_Acceso_A_Planta@%',1998695,NULL,'{\"id\": 20494, \"idTipo\": 1, \"motivo\": \"Accidente o razones médicas\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": \"hth\", \"idLugarDestino\": 3, \"personaInterna\": \"0009\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20494,0,1,1,\'0009\',NULL,\'2026-01-28 00:00:00\',0,\'Accidente o razones médicas\',\'1768\',NULL,1,1,3,\'hth\',NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(11,'before','2026-01-28 17:16:15','DBAdmin_Acceso_A_Planta@%',1998861,NULL,'{\"id\": 20495, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": \"sdasdsad\", \"idLugarDestino\": 3, \"personaInterna\": \"0009\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20495,0,1,1,\'0009\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',NULL,1,1,3,\'sdasdsad\',NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(12,'before','2026-01-28 17:17:00','DBAdmin_Acceso_A_Planta@%',1998866,NULL,'{\"id\": 20496, \"idTipo\": 1, \"motivo\": \"Accidente o razones médicas\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 4, \"destinoDetalle\": \"sas\", \"idLugarDestino\": 3, \"personaInterna\": \"0005\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20496,0,1,1,\'0005\',NULL,\'2026-01-28 00:00:00\',0,\'Accidente o razones médicas\',\'1768\',NULL,1,4,3,\'sas\',NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(13,'before','2026-01-28 17:29:22','DBAdmin_Acceso_A_Planta@%',1998897,NULL,'{\"id\": 20497, \"idTipo\": 1, \"motivo\": \"Accidente o razones médicas\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": \"ssss\", \"idLugarDestino\": 3, \"personaInterna\": \"0005\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20497,0,1,1,\'0005\',NULL,\'2026-01-28 00:00:00\',0,\'Accidente o razones médicas\',\'1768\',NULL,1,1,3,\'ssss\',NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(14,'before','2026-01-28 17:30:57','DBAdmin_Acceso_A_Planta@%',1998935,NULL,'{\"id\": 20498, \"idTipo\": 1, \"motivo\": \"Requerimiento laboral\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": \"null\", \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": \"asdasd\", \"idLugarDestino\": 3, \"personaInterna\": \"0006\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20498,0,1,1,\'0006\',NULL,\'2026-01-28 00:00:00\',0,\'Requerimiento laboral\',\'1768\',\'null\',1,1,3,\'asdasd\',NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');'),(15,'before','2026-01-28 18:02:39','DBAdmin_Acceso_A_Planta@%',1999109,NULL,'{\"id\": 20499, \"idTipo\": 1, \"motivo\": \"Accidente o razones médicas\", \"idGrupo\": 0, \"idEstado\": 1, \"vigilador\": \"\", \"conRegreso\": 0, \"ordenGrupo\": 1, \"observacion\": null, \"usuario_app\": \"gabrielt@donyeyo.com.ar\", \"esRecurrente\": 0, \"idLugarOrigen\": 1, \"destinoDetalle\": \"dfgdfg\", \"idLugarDestino\": 2, \"personaInterna\": \"0005\", \"idPersonaExterna\": null, \"personaReceptora\": null, \"fechaHoraRegistro\": \"2026-01-28 00:00:00\", \"personaAutorizante\": \"1768\", \"vencimientoRecurrencias\": null}','INSERT INTO movimientos (id,idGrupo,ordenGrupo,idTipo,personaInterna,idPersonaExterna,fechaHoraRegistro,conRegreso,motivo,personaAutorizante,observacion,idEstado,idLugarOrigen,idLugarDestino,destinoDetalle,personaReceptora,esRecurrente,vencimientoRecurrencias,usuario_app,vigilador) VALUES (20499,0,1,1,\'0005\',NULL,\'2026-01-28 00:00:00\',0,\'Accidente o razones médicas\',\'1768\',NULL,1,1,2,\'dfgdfg\',NULL,0,NULL,\'gabrielt@donyeyo.com.ar\',\'\');');
/*!40000 ALTER TABLE `movimientos_audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objetoEstados`
--

DROP TABLE IF EXISTS `objetoEstados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objetoEstados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objetoEstados`
--

LOCK TABLES `objetoEstados` WRITE;
/*!40000 ALTER TABLE `objetoEstados` DISABLE KEYS */;
INSERT INTO `objetoEstados` VALUES (1,'Recibido con normalidad'),(2,'Recibido con disconformidad'),(3,'Rechazado/Devuelto a remitente'),(4,'Entregado con normalidad'),(5,'Entregado con disconformidad');
/*!40000 ALTER TABLE `objetoEstados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personasExternas`
--

DROP TABLE IF EXISTS `personasExternas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personasExternas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigoExterno` varchar(30) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `documentoTipo` varchar(10) DEFAULT NULL,
  `documentoNumero` varchar(20) DEFAULT NULL,
  `razonSocialNombre` varchar(100) DEFAULT NULL,
  `razonSocialCuit` varchar(20) DEFAULT NULL,
  `observaciones` text,
  `noAdmitido` tinyint(1) DEFAULT '0',
  `noAdmitidoDetalle` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigoExterno` (`codigoExterno`),
  KEY `idx_ext_documento` (`documentoNumero`),
  KEY `idx_ext_razonsocial` (`razonSocialCuit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personasExternas`
--

LOCK TABLES `personasExternas` WRITE;
/*!40000 ALTER TABLE `personasExternas` DISABLE KEYS */;
/*!40000 ALTER TABLE `personasExternas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'Acceso_A_Planta'
--
/*!50003 DROP FUNCTION IF EXISTS `ProperCase` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
CREATE  FUNCTION `ProperCase`(p_str TEXT) RETURNS text CHARSET utf8mb4
    DETERMINISTIC
BEGIN

  RETURN p_str;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_GenerarMovimientosDerivados` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_GenerarMovimientosDerivados`(

    IN p_idMovimientoOrigen INT

)
BEGIN

    DECLARE v_idTipo INT;

    DECLARE v_personaInterna VARCHAR(30);

    DECLARE v_conRegreso TINYINT;



    DECLARE v_idLugarOrigen INT;

    DECLARE v_idLugarDestino INT;



    DECLARE v_origen_dep TINYINT DEFAULT 0;

    DECLARE v_destino_dep TINYINT DEFAULT 0;



    DECLARE v_fecha DATETIME;

    DECLARE v_motivo VARCHAR(60);

    DECLARE v_autorizante VARCHAR(30);

    DECLARE v_observacion VARCHAR(500);

    DECLARE v_usuario_app VARCHAR(100);

    DECLARE v_vigilador VARCHAR(30);



    DECLARE v_id_ingreso_destino INT DEFAULT NULL;

    DECLARE v_id_egreso_destino  INT DEFAULT NULL;

    DECLARE v_id_ingreso_origen  INT DEFAULT NULL;



    DECLARE v_exists INT DEFAULT 0;

    DECLARE v_has_to_clone INT DEFAULT 0;

    DECLARE v_cnt_target_art INT DEFAULT 0;

    DECLARE v_cnt_target_doc INT DEFAULT 0;



    -- Rollback automático ante error

    DECLARE EXIT HANDLER FOR SQLEXCEPTION

    BEGIN

        ROLLBACK;

        RESIGNAL;

    END;



    START TRANSACTION;



    -- 1) Traer el movimiento originante y bloquearlo

    SELECT

        idTipo, personaInterna, conRegreso,

        idLugarOrigen, idLugarDestino,

        fechaHoraRegistro, motivo, personaAutorizante, observacion,

        usuario_app, vigilador

    INTO

        v_idTipo, v_personaInterna, v_conRegreso,

        v_idLugarOrigen, v_idLugarDestino,

        v_fecha, v_motivo, v_autorizante, v_observacion,

        v_usuario_app, v_vigilador

    FROM movimientos

    WHERE id = p_idMovimientoOrigen

    FOR UPDATE;



    IF v_idTipo IS NULL THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Movimiento origen inexistente';

    END IF;



    -- 2) Validaciones: solo internos y conRegreso

    IF COALESCE(v_conRegreso,0) <> 1 OR v_personaInterna IS NULL THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El movimiento no califica (conRegreso=1 y personaInterna no NULL)';

    END IF;



    -- 3) Caso 2 asume egreso como originante (según tu definición)

    IF v_idTipo <> 1 THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Se esperaba idTipo=1 (Egreso) en movimiento originante';

    END IF;



    -- 4) Determinar dependencias (lugares.esDependencia)

    SELECT esDependencia INTO v_origen_dep

      FROM lugares WHERE id = v_idLugarOrigen;



    SELECT esDependencia INTO v_destino_dep

      FROM lugares WHERE id = v_idLugarDestino;



    -- 5) Marcar grupo y orden del originante

    UPDATE movimientos

       SET idGrupo = p_idMovimientoOrigen,

           ordenGrupo = 1

     WHERE id = p_idMovimientoOrigen;



    -- =========================================================

    -- CASO 1: dependencia -> NO dependencia (incluye Exteriores)

    -- =========================================================

    IF v_origen_dep = 1 AND v_destino_dep = 0 THEN



        -- Blindaje: si ya existe orden 2, no crear de nuevo

        SELECT COUNT(*) INTO v_exists

        FROM movimientos

        WHERE idGrupo = p_idMovimientoOrigen AND ordenGrupo = 2;



        IF v_exists = 0 THEN

            INSERT INTO movimientos (

                idGrupo, ordenGrupo, idTipo,

                personaInterna, idPersonaExterna,

                fechaHoraRegistro, conRegreso,

                motivo, personaAutorizante, observacion,

                idEstado, idLugarOrigen, idLugarDestino,

                destinoDetalle, personaReceptora,

                esRecurrente, vencimientoRecurrencias,

                usuario_app, vigilador

            )

            VALUES (

                p_idMovimientoOrigen, 2, 2,           -- Ingreso

                v_personaInterna, NULL,

                v_fecha,

                0,                                    -- evitar cascadas

                v_motivo, v_autorizante, v_observacion,

                1,                                    -- Pendiente

                v_idLugarDestino, v_idLugarOrigen,     -- invertidos

                NULL, NULL,                            -- limpiar

                0, NULL,                               -- limpiar recurrencia

                v_usuario_app, COALESCE(v_vigilador,'')

            );

            SET v_id_ingreso_origen = LAST_INSERT_ID();

        ELSE

            SELECT id INTO v_id_ingreso_origen

            FROM movimientos

            WHERE idGrupo = p_idMovimientoOrigen AND ordenGrupo = 2

            LIMIT 1;

        END IF;



        -- Regla: en caso 1 NO se clonan items (evita duplicados para Exteriores/no dependencia)



    -- =========================================================

    -- CASO 2: dependencia -> dependencia (4 movimientos total)

    -- =========================================================

    ELSEIF v_origen_dep = 1 AND v_destino_dep = 1 THEN



        -- (2) Ingreso a dependencia destino

        SELECT id INTO v_id_ingreso_destino

        FROM movimientos

        WHERE idGrupo = p_idMovimientoOrigen AND ordenGrupo = 2

        LIMIT 1;



        IF v_id_ingreso_destino IS NULL THEN

            INSERT INTO movimientos (

                idGrupo, ordenGrupo, idTipo,

                personaInterna, idPersonaExterna,

                fechaHoraRegistro, conRegreso,

                motivo, personaAutorizante, observacion,

                idEstado, idLugarOrigen, idLugarDestino,

                destinoDetalle, personaReceptora,

                esRecurrente, vencimientoRecurrencias,

                usuario_app, vigilador

            )

            VALUES (

                p_idMovimientoOrigen, 2, 2,           -- Ingreso

                v_personaInterna, NULL,

                v_fecha,

                0,

                v_motivo, v_autorizante, v_observacion,

                1,                                    -- Pendiente

                v_idLugarOrigen, v_idLugarDestino,     -- mismo trayecto

                NULL, NULL,

                0, NULL,

                v_usuario_app, COALESCE(v_vigilador,'')

            );

            SET v_id_ingreso_destino = LAST_INSERT_ID();

        END IF;



        -- (3) Egreso desde dependencia destino hacia origen  ✅ (aquí van los clones)

        SELECT id INTO v_id_egreso_destino

        FROM movimientos

        WHERE idGrupo = p_idMovimientoOrigen AND ordenGrupo = 3

        LIMIT 1;



        IF v_id_egreso_destino IS NULL THEN

            INSERT INTO movimientos (

                idGrupo, ordenGrupo, idTipo,

                personaInterna, idPersonaExterna,

                fechaHoraRegistro, conRegreso,

                motivo, personaAutorizante, observacion,

                idEstado, idLugarOrigen, idLugarDestino,

                destinoDetalle, personaReceptora,

                esRecurrente, vencimientoRecurrencias,

                usuario_app, vigilador

            )

            VALUES (

                p_idMovimientoOrigen, 3, 1,           -- Egreso

                v_personaInterna, NULL,

                v_fecha,

                0,

                v_motivo, v_autorizante, v_observacion,

                1,                                    -- Pendiente

                v_idLugarDestino, v_idLugarOrigen,     -- invertidos

                NULL, NULL,

                0, NULL,

                v_usuario_app, COALESCE(v_vigilador,'')

            );

            SET v_id_egreso_destino = LAST_INSERT_ID();

        END IF;



        -- (4) Ingreso final a dependencia origen

        SELECT id INTO v_id_ingreso_origen

        FROM movimientos

        WHERE idGrupo = p_idMovimientoOrigen AND ordenGrupo = 4

        LIMIT 1;



        IF v_id_ingreso_origen IS NULL THEN

            INSERT INTO movimientos (

                idGrupo, ordenGrupo, idTipo,

                personaInterna, idPersonaExterna,

                fechaHoraRegistro, conRegreso,

                motivo, personaAutorizante, observacion,

                idEstado, idLugarOrigen, idLugarDestino,

                destinoDetalle, personaReceptora,

                esRecurrente, vencimientoRecurrencias,

                usuario_app, vigilador

            )

            VALUES (

                p_idMovimientoOrigen, 4, 2,           -- Ingreso

                v_personaInterna, NULL,

                v_fecha,

                0,

                v_motivo, v_autorizante, v_observacion,

                1,                                    -- Pendiente

                v_idLugarDestino, v_idLugarOrigen,     -- invertidos

                NULL, NULL,

                0, NULL,

                v_usuario_app, COALESCE(v_vigilador,'')

            );

            SET v_id_ingreso_origen = LAST_INSERT_ID();

        END IF;



        -- =========================================================

        -- Blindaje de CLONADO:

        -- - Solo clonar si en el origen hay items con sinRetorno=0

        -- - Y si el movimiento target (orden 3) todavía NO tiene items (evita duplicados por re-ejecución)

        -- - Clonar SOLO a v_id_egreso_destino (orden 3) ✅

        -- =========================================================



        SELECT COUNT(*) INTO v_has_to_clone

        FROM articulos

        WHERE idMovimiento = p_idMovimientoOrigen AND sinRetorno = 0;



        SELECT COUNT(*) INTO v_cnt_target_art

        FROM articulos

        WHERE idMovimiento = v_id_egreso_destino;



        IF v_has_to_clone > 0 AND v_cnt_target_art = 0 THEN

            INSERT INTO articulos (

                idMovimiento,

                codigoERP, codigoQR, codigoBarras, codigoOtro,

                descripcion, cantidad,

                idEstado,

                idLugarOrigen, remitente,

                idLugarDestino, destinatario,

                sinRetorno,

                presentacion, observacion,

                usuario_app, vigilador

            )

            SELECT

                v_id_egreso_destino,                  -- ✅ CLONA AL EGRESO (orden 3)

                a.codigoERP, a.codigoQR, a.codigoBarras, a.codigoOtro,

                a.descripcion, a.cantidad,

                a.idEstado,

                a.idLugarOrigen, a.remitente,

                a.idLugarDestino, a.destinatario,

                1,                                    -- forzado: el clon queda sinRetorno=1

                a.presentacion, a.observacion,

                a.usuario_app, a.vigilador

            FROM articulos a

            WHERE a.idMovimiento = p_idMovimientoOrigen

              AND a.sinRetorno = 0;

        END IF;



        SELECT COUNT(*) INTO v_has_to_clone

        FROM documentos

        WHERE idMovimiento = p_idMovimientoOrigen AND sinRetorno = 0;



        SELECT COUNT(*) INTO v_cnt_target_doc

        FROM documentos

        WHERE idMovimiento = v_id_egreso_destino;



        IF v_has_to_clone > 0 AND v_cnt_target_doc = 0 THEN

            INSERT INTO documentos (

                idMovimiento,

                descripcion, cantidad,

                idEstado,

                tipo, codigo,

                idLugarOrigen, remitente,

                idLugarDestino, destinatario,

                sinRetorno,

                observacion,

                usuario_app, vigilador

            )

            SELECT

                v_id_egreso_destino,                  -- ✅ CLONA AL EGRESO (orden 3)

                d.descripcion, d.cantidad,

                d.idEstado,

                d.tipo, d.codigo,

                d.idLugarOrigen, d.remitente,

                d.idLugarDestino, d.destinatario,

                1,                                    -- forzado

                d.observacion,

                d.usuario_app, d.vigilador

            FROM documentos d

            WHERE d.idMovimiento = p_idMovimientoOrigen

              AND d.sinRetorno = 0;

        END IF;



    END IF;



    COMMIT;



    -- Devolvemos IDs útiles para la app / test

    SELECT

        p_idMovimientoOrigen AS idOrigen,

        v_id_ingreso_destino AS idOrden2_IngresoDestino,

        v_id_egreso_destino  AS idOrden3_EgresoDestino,

        v_id_ingreso_origen  AS idOrden4_IngresoOrigen;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_ObtenerObjetosPendientes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES' */ ;
DELIMITER ;;
CREATE  PROCEDURE `sp_ObtenerObjetosPendientes`()
BEGIN

    -- Lista objetos que salieron con retorno y aún no vuelven [16]

    SELECT 'Artículo' AS Clase, descripcion, idLugarOrigen, remitente 

    FROM articulos WHERE sinRetorno = FALSE 

    UNION

    SELECT 'Documento' AS Clase, descripcion, idLugarOrigen, remitente 

    FROM documentos WHERE sinRetorno = FALSE;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-02 13:21:21
