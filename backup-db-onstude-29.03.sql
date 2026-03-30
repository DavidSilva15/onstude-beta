CREATE DATABASE  IF NOT EXISTS `onstude` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `onstude`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: onstude
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `admin_logs`
--

DROP TABLE IF EXISTS `admin_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admin_id` bigint NOT NULL,
  `acao` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidade` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidade_id` bigint DEFAULT NULL,
  `detalhes_json` json DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_criado_em` (`admin_id`,`criado_em`),
  KEY `idx_acao` (`acao`),
  CONSTRAINT `fk_admin_logs_admin` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_logs`
--

LOCK TABLES `admin_logs` WRITE;
/*!40000 ALTER TABLE `admin_logs` DISABLE KEYS */;
INSERT INTO `admin_logs` VALUES (1,1,'CRIAR_CURSO','cursos',2,'{\"status\": \"PUBLICADO\", \"titulo\": \"Excel intermediário na prática\", \"codigo_unico\": \"ONST-667DB3\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 10:55:01'),(2,1,'EDITAR_CURSO','cursos',2,'{\"campos_alterados\": {\"status\": \"PUBLICADO\", \"titulo\": \"Word intermediário na prática\"}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 11:07:58'),(3,1,'EDITAR_CURSO','cursos',2,'{\"campos_alterados\": {\"status\": \"PUBLICADO\", \"titulo\": \"Excel intermediário na prática\"}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 11:08:03'),(4,1,'EDITAR_CURSO','cursos',2,'{\"campos_alterados\": {\"status\": \"PUBLICADO\", \"titulo\": \"Excel intermediário na prática\", \"imagem_alterada\": false}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 11:15:26'),(5,1,'CRIAR_CURSO','cursos',3,'{\"status\": \"RASCUNHO\", \"titulo\": \"Word\", \"codigo_unico\": \"ONST-6269A6\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 11:16:27'),(6,1,'EDITAR_CURSO','cursos',3,'{\"campos_alterados\": {\"status\": \"RASCUNHO\", \"titulo\": \"Word\", \"imagem_alterada\": false}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 11:16:46'),(7,1,'EDITAR_CURSO','cursos',3,'{\"campos_alterados\": {\"status\": \"RASCUNHO\", \"titulo\": \"Word\", \"imagem_alterada\": true}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 11:19:22'),(8,1,'EDITAR_CURSO','cursos',2,'{\"campos_alterados\": {\"status\": \"PUBLICADO\", \"titulo\": \"Excel intermediário na prática\", \"imagem_alterada\": true}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 11:19:41'),(9,1,'CRIAR_MODULO','modulos',2,'{\"ordem\": \"1\", \"titulo\": \"Introdução\", \"curso_id\": \"3\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 11:22:12'),(10,1,'CRIAR_AULA','aulas',3,NULL,'::1',NULL,'2026-03-08 11:36:37'),(11,1,'EXCLUIR_CURSO','cursos',1,NULL,'::1',NULL,'2026-03-08 11:51:50'),(12,1,'EXCLUIR_CURSO','cursos',2,NULL,'::1',NULL,'2026-03-08 11:51:57'),(13,1,'EDITAR_CURSO','cursos',3,'{\"campos_alterados\": {\"status\": \"PUBLICADO\", \"titulo\": \"Excel intermediário na prática\", \"imagem_alterada\": true}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 11:53:07'),(14,1,'CRIAR_USUARIO','usuarios',3,NULL,'::1',NULL,'2026-03-08 13:12:44'),(15,1,'CRIAR_MODULO','modulos',3,'{\"ordem\": \"2\", \"titulo\": \"Fórmulas\", \"curso_id\": \"3\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 13:50:55'),(16,1,'CRIAR_AULA','aulas',4,NULL,'::1',NULL,'2026-03-08 13:53:04'),(17,1,'CRIAR_AULA','aulas',5,NULL,'::1',NULL,'2026-03-08 13:54:12'),(18,1,'EDITAR_CURSO','cursos',3,'{\"campos_alterados\": {\"status\": \"PUBLICADO\", \"titulo\": \"Excel intermediário na prática\"}}','::1',NULL,'2026-03-08 14:32:07'),(19,1,'CRIAR_CURSO','cursos',4,'{\"status\": \"PUBLICADO\", \"titulo\": \"Word\", \"codigo_unico\": \"ONST-408975\"}','::1',NULL,'2026-03-08 14:40:15'),(20,1,'CRIAR_MODULO','modulos',4,'{\"ordem\": \"1\", \"titulo\": \"Introdução\", \"curso_id\": \"4\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 15:02:24'),(21,1,'CRIAR_AULA','aulas',6,NULL,'::1',NULL,'2026-03-08 15:03:33'),(22,1,'CRIAR_AULA','aulas',7,NULL,'::1',NULL,'2026-03-08 15:04:44'),(23,1,'CRIAR_CURSO','cursos',5,'{\"status\": \"PUBLICADO\", \"titulo\": \"Powerpoint\", \"codigo_unico\": \"ONST-D007EE\"}','::1',NULL,'2026-03-08 15:50:05'),(24,1,'CRIAR_MODULO','modulos',5,'{\"ordem\": \"1\", \"titulo\": \"Introdução\", \"curso_id\": \"5\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36','2026-03-08 15:50:15'),(25,1,'CRIAR_AULA','aulas',8,NULL,'::1',NULL,'2026-03-08 15:50:52'),(26,1,'CRIAR_AULA','aulas',9,NULL,'::1',NULL,'2026-03-08 15:55:47'),(27,1,'CRIAR_USUARIO','usuarios',5,NULL,'::1',NULL,'2026-03-08 17:37:38'),(28,1,'CRIAR_USUARIO','usuarios',7,NULL,'::1',NULL,'2026-03-08 18:15:56'),(29,1,'CRIAR_USUARIO','usuarios',8,NULL,'::1',NULL,'2026-03-08 18:16:24'),(30,1,'CRIAR_USUARIO','usuarios',9,NULL,'::1',NULL,'2026-03-08 18:16:48'),(31,1,'CRIAR_USUARIO','usuarios',10,NULL,'::1',NULL,'2026-03-08 18:17:13'),(32,1,'CRIAR_USUARIO','usuarios',11,NULL,'::1',NULL,'2026-03-08 18:17:39'),(33,1,'CRIAR_USUARIO','usuarios',12,NULL,'::1',NULL,'2026-03-08 18:18:02'),(34,1,'CRIAR_USUARIO','usuarios',13,NULL,'::1',NULL,'2026-03-08 18:18:27'),(35,1,'CRIAR_USUARIO','usuarios',14,NULL,'::1',NULL,'2026-03-08 18:19:44'),(36,1,'CRIAR_AULA','aulas',10,NULL,'::1',NULL,'2026-03-08 22:47:47'),(37,1,'EDITAR_AULA','aulas',8,NULL,'::1',NULL,'2026-03-08 22:52:54'),(38,1,'EDITAR_AULA','aulas',6,NULL,'::1',NULL,'2026-03-09 19:57:54'),(39,1,'EDITAR_AULA','aulas',7,NULL,'::1',NULL,'2026-03-09 19:58:08'),(40,1,'EDITAR_AULA','aulas',6,NULL,'::1',NULL,'2026-03-09 20:27:40'),(41,1,'EDITAR_AULA','aulas',7,NULL,'::1',NULL,'2026-03-09 20:27:49'),(42,1,'EDITAR_AULA','aulas',8,NULL,'::1',NULL,'2026-03-09 20:36:11'),(43,1,'EDITAR_CURSO','cursos',5,'{\"campos_alterados\": {\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Powerpoint\", \"desconto\": 0}}','::1',NULL,'2026-03-22 10:07:14'),(44,1,'CRIAR_CURSO','cursos',6,'{\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Desenvolvimento Web com Java Script\", \"mercado\": \"javascript, desenvolvimento web, programação, front-end, html css javascript, curso de javascript\", \"codigo_unico\": \"ONST-E0735A\"}','::1',NULL,'2026-03-22 17:45:25'),(45,1,'CRIAR_MODULO','modulos',6,'{\"ordem\": \"1\", \"titulo\": \"Fundamentos do JavaScript e Lógica de Programação\", \"curso_id\": \"6\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 17:46:26'),(46,1,'CRIAR_AULA','aulas',11,NULL,'::1',NULL,'2026-03-22 17:47:31'),(47,1,'CRIAR_AULA','aulas',12,NULL,'::1',NULL,'2026-03-22 17:48:14'),(48,1,'CRIAR_AULA','aulas',13,NULL,'::1',NULL,'2026-03-22 17:48:50'),(49,1,'CRIAR_CURSO','cursos',7,'{\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Bootstrap 5\", \"mercado\": \"bootstrap, desenvolvimento web, front-end, design responsivo, criação de sites\", \"codigo_unico\": \"ONST-EF7443\"}','::1',NULL,'2026-03-22 18:51:53'),(50,1,'EDITAR_CURSO','cursos',6,'{\"campos_alterados\": {\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Desenvolvimento Web com Java Script\", \"desconto\": 0}}','::1',NULL,'2026-03-22 18:52:19'),(51,1,'CRIAR_MODULO','modulos',7,'{\"ordem\": \"1\", \"titulo\": \"Fundamentos do Bootstrap e Layout Responsivo\", \"curso_id\": \"7\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 18:52:36'),(52,1,'CRIAR_AULA','aulas',14,NULL,'::1',NULL,'2026-03-22 18:53:16'),(53,1,'CRIAR_AULA','aulas',15,NULL,'::1',NULL,'2026-03-22 18:53:47'),(54,1,'EDITAR_CURSO','cursos',5,'{\"campos_alterados\": {\"preco\": 20, \"status\": \"PUBLICADO\", \"titulo\": \"Powerpoint 365\", \"desconto\": 0}}','::1',NULL,'2026-03-22 18:57:05'),(55,1,'EDITAR_AULA','aulas',6,NULL,'::1',NULL,'2026-03-22 18:58:14'),(56,1,'EXCLUIR_AULA','aulas',10,NULL,'::1',NULL,'2026-03-22 18:58:28'),(57,1,'EDITAR_MODULO','modulos',5,'{\"curso_id\": 5, \"alteracoes\": {\"ordem\": \"1\", \"titulo\": \"Fundamentos do PowerPoint e Estrutura de Apresentações\"}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 18:59:28'),(58,1,'EDITAR_AULA','aulas',8,NULL,'::1',NULL,'2026-03-22 18:59:46'),(59,1,'EDITAR_AULA','aulas',9,NULL,'::1',NULL,'2026-03-22 19:00:06'),(60,1,'EDITAR_CURSO','cursos',4,'{\"campos_alterados\": {\"preco\": 15, \"status\": \"PUBLICADO\", \"titulo\": \"Word 365\", \"desconto\": 0}}','::1',NULL,'2026-03-22 19:00:33'),(61,1,'EDITAR_MODULO','modulos',4,'{\"curso_id\": 4, \"alteracoes\": {\"ordem\": \"1\", \"titulo\": \"Fundamentos do Word e Formatação de Documentos\"}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 19:00:48'),(62,1,'EDITAR_AULA','aulas',6,NULL,'::1',NULL,'2026-03-22 19:01:08'),(63,1,'EDITAR_AULA','aulas',7,NULL,'::1',NULL,'2026-03-22 19:01:27'),(64,1,'EDITAR_CURSO','cursos',4,'{\"campos_alterados\": {\"preco\": 15, \"status\": \"PUBLICADO\", \"titulo\": \"Word 365\", \"desconto\": 0}}','::1',NULL,'2026-03-22 19:01:43'),(65,1,'EDITAR_CURSO','cursos',3,'{\"campos_alterados\": {\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Excel 365\", \"desconto\": 0}}','::1',NULL,'2026-03-22 19:02:24'),(66,1,'EDITAR_MODULO','modulos',2,'{\"curso_id\": 3, \"alteracoes\": {\"ordem\": \"1\", \"titulo\": \"Fundamentos do Excel e Manipulação de Dados\"}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 19:02:40'),(67,1,'EDITAR_AULA','aulas',3,NULL,'::1',NULL,'2026-03-22 19:03:03'),(68,1,'EDITAR_AULA','aulas',4,NULL,'::1',NULL,'2026-03-22 19:03:22'),(69,1,'EDITAR_CURSO','cursos',3,'{\"campos_alterados\": {\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Excel 365\", \"desconto\": 0}}','::1',NULL,'2026-03-22 19:03:35'),(70,1,'EDITAR_MODULO','modulos',7,'{\"curso_id\": 7, \"alteracoes\": {\"ordem\": \"1\", \"titulo\": \"Fundamentos do Bootstrap e Layout Responsivo\"}}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-28 11:35:35'),(71,1,'EXCLUIR_CURSO','cursos',3,NULL,'::1',NULL,'2026-03-28 16:25:07'),(72,1,'CRIAR_CURSO','cursos',8,'{\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Node Js Completo\", \"mercado\": \"javascript, desenvolvimento web, programação, front-end, html css javascript, curso de javascript\", \"codigo_unico\": \"ONST-C64447\"}','::1',NULL,'2026-03-28 16:27:23'),(73,1,'CRIAR_MODULO','modulos',8,'{\"ordem\": \"1\", \"titulo\": \"Introdução ao Node JS\", \"curso_id\": \"8\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-28 16:27:51'),(74,1,'CRIAR_AULA','aulas',16,NULL,'::1',NULL,'2026-03-28 16:28:30'),(75,1,'EXCLUIR_CURSO','cursos',8,NULL,'::1',NULL,'2026-03-28 17:06:21'),(76,1,'EXCLUIR_CURSO','cursos',8,NULL,'::1',NULL,'2026-03-28 17:10:20'),(77,1,'EXCLUIR_CURSO','cursos',8,NULL,'::1',NULL,'2026-03-28 17:13:51'),(78,1,'EXCLUIR_CURSO','cursos',8,NULL,'::1',NULL,'2026-03-28 17:15:06'),(79,1,'CRIAR_CURSO','cursos',9,'{\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Node Js Completo\", \"mercado\": \"javascript, desenvolvimento web, programação, front-end, html css javascript, curso de javascript\", \"codigo_unico\": \"ONST-7E785F\"}','::1',NULL,'2026-03-28 21:29:11'),(80,1,'CRIAR_MODULO','modulos',9,'{\"ordem\": \"1\", \"titulo\": \"Introdução ao Node JS\", \"curso_id\": \"9\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-28 21:29:41'),(81,1,'EDITAR_CURSO','cursos',9,'{\"campos_alterados\": {\"preco\": 0, \"status\": \"RASCUNHO\", \"titulo\": \"Node Js Completo\", \"desconto\": 0}}','::1',NULL,'2026-03-28 23:56:23'),(82,1,'EDITAR_CURSO','cursos',9,'{\"campos_alterados\": {\"preco\": 0, \"status\": \"ARQUIVADO\", \"titulo\": \"Node Js Completo\", \"desconto\": 0}}','::1',NULL,'2026-03-28 23:56:56'),(83,1,'EDITAR_CURSO','cursos',9,'{\"campos_alterados\": {\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Node Js Completo\", \"desconto\": 0}}','::1',NULL,'2026-03-28 23:57:19'),(84,1,'EDITAR_CURSO','cursos',4,'{\"campos_alterados\": {\"preco\": 15, \"status\": \"PUBLICADO\", \"titulo\": \"Word 365\", \"desconto\": 0}}','::1',NULL,'2026-03-29 23:01:04'),(85,1,'EDITAR_CURSO','cursos',3,'{\"campos_alterados\": {\"preco\": 0, \"status\": \"PUBLICADO\", \"titulo\": \"Excel 365\", \"desconto\": 0}}','::1',NULL,'2026-03-29 23:01:56');
/*!40000 ALTER TABLE `admin_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_metricas_concluintes`
--

DROP TABLE IF EXISTS `admin_metricas_concluintes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_metricas_concluintes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `periodo_tipo` enum('DIA','SEMANA','MES') COLLATE utf8mb4_unicode_ci NOT NULL,
  `periodo_inicio` date NOT NULL,
  `periodo_fim` date NOT NULL,
  `curso_id` bigint DEFAULT NULL,
  `qtd_concluintes` int NOT NULL DEFAULT '0',
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_periodo_curso` (`periodo_tipo`,`periodo_inicio`,`periodo_fim`,`curso_id`),
  KEY `fk_metricas_curso` (`curso_id`),
  CONSTRAINT `fk_metricas_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_metricas_concluintes`
--

LOCK TABLES `admin_metricas_concluintes` WRITE;
/*!40000 ALTER TABLE `admin_metricas_concluintes` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_metricas_concluintes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aluno_conquistas`
--

DROP TABLE IF EXISTS `aluno_conquistas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aluno_conquistas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` bigint NOT NULL,
  `conquista_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_desbloqueio` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_conquista` (`aluno_id`,`conquista_id`),
  CONSTRAINT `aluno_conquistas_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aluno_conquistas`
--

LOCK TABLES `aluno_conquistas` WRITE;
/*!40000 ALTER TABLE `aluno_conquistas` DISABLE KEYS */;
INSERT INTO `aluno_conquistas` VALUES (1,9,'aulas_1','2026-03-29 23:10:42'),(2,9,'cat_design','2026-03-29 23:10:42'),(3,9,'cat_tech','2026-03-29 23:10:42'),(4,9,'cat_escritorio','2026-03-29 23:10:42'),(5,8,'aulas_1','2026-03-29 23:15:23'),(6,8,'cat_tech','2026-03-29 23:15:23'),(7,8,'cat_escritorio','2026-03-29 23:15:23'),(8,8,'desafio_mentor','2026-03-29 23:16:37'),(9,3,'aulas_1','2026-03-29 23:57:48'),(10,3,'cat_design','2026-03-29 23:57:48'),(11,3,'cat_tech','2026-03-29 23:57:48'),(12,3,'cat_escritorio','2026-03-29 23:57:48');
/*!40000 ALTER TABLE `aluno_conquistas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apostila_imagens`
--

DROP TABLE IF EXISTS `apostila_imagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apostila_imagens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aula_id` bigint NOT NULL,
  `imagem_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ordem` int NOT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_aula_ordem` (`aula_id`,`ordem`),
  CONSTRAINT `fk_apostila_aula` FOREIGN KEY (`aula_id`) REFERENCES `aulas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apostila_imagens`
--

LOCK TABLES `apostila_imagens` WRITE;
/*!40000 ALTER TABLE `apostila_imagens` DISABLE KEYS */;
INSERT INTO `apostila_imagens` VALUES (1,3,'/uploads/apostila-1772980597732-354900836.png',1,'2026-03-08 11:36:37'),(2,3,'/uploads/apostila-1772980597742-411563477.png',2,'2026-03-08 11:36:37'),(3,3,'/uploads/apostila-1772980597746-769613738.png',3,'2026-03-08 11:36:37'),(4,4,'/uploads/apostila-1772988784177-672001886.png',1,'2026-03-08 13:53:04'),(5,4,'/uploads/apostila-1772988784188-355613015.png',2,'2026-03-08 13:53:04'),(6,4,'/uploads/apostila-1772988784198-965181232.png',3,'2026-03-08 13:53:04'),(7,5,'/uploads/apostila-1772988852157-567224179.png',1,'2026-03-08 13:54:12'),(8,5,'/uploads/apostila-1772988852170-260663589.png',2,'2026-03-08 13:54:12'),(9,5,'/uploads/apostila-1772988852182-619604504.png',3,'2026-03-08 13:54:12'),(10,6,'/uploads/apostila-1772993013347-252241331.png',1,'2026-03-08 15:03:33'),(11,6,'/uploads/apostila-1772993013363-243225148.png',2,'2026-03-08 15:03:33'),(12,6,'/uploads/apostila-1772993013376-155243438.png',3,'2026-03-08 15:03:33'),(13,7,'/uploads/apostila-1772993084310-579046766.png',1,'2026-03-08 15:04:44'),(14,7,'/uploads/apostila-1772993084324-227551262.png',2,'2026-03-08 15:04:44'),(15,7,'/uploads/apostila-1772993084335-67044824.png',3,'2026-03-08 15:04:44'),(16,8,'/uploads/apostila-1772995852374-222149593.png',1,'2026-03-08 15:50:52'),(17,8,'/uploads/apostila-1772995852379-990116455.png',2,'2026-03-08 15:50:52'),(18,8,'/uploads/apostila-1772995852382-693663055.png',3,'2026-03-08 15:50:52'),(19,9,'/uploads/apostila-1772996147161-70621425.png',1,'2026-03-08 15:55:47'),(20,9,'/uploads/apostila-1772996147170-692444850.png',2,'2026-03-08 15:55:47'),(21,9,'/uploads/apostila-1772996147176-864103734.png',3,'2026-03-08 15:55:47'),(22,10,'/uploads/apostila-1773020867804-821300222.png',1,'2026-03-08 22:47:47'),(23,10,'/uploads/apostila-1773020867825-994871334.png',2,'2026-03-08 22:47:47'),(24,10,'/uploads/apostila-1773020867836-23941298.png',3,'2026-03-08 22:47:47'),(25,11,'/uploads/apostila-1774212451834-343854522.png',1,'2026-03-22 17:47:31'),(26,11,'/uploads/apostila-1774212451851-168065688.png',2,'2026-03-22 17:47:31'),(27,11,'/uploads/apostila-1774212451865-69385098.png',3,'2026-03-22 17:47:31'),(28,12,'/uploads/apostila-1774212494917-835341711.png',1,'2026-03-22 17:48:14'),(29,12,'/uploads/apostila-1774212494926-935868267.png',2,'2026-03-22 17:48:14'),(30,12,'/uploads/apostila-1774212494941-267641365.png',3,'2026-03-22 17:48:14'),(31,13,'/uploads/apostila-1774212530257-156417839.png',1,'2026-03-22 17:48:50'),(32,13,'/uploads/apostila-1774212530263-30932044.png',2,'2026-03-22 17:48:50'),(33,13,'/uploads/apostila-1774212530272-919140430.png',3,'2026-03-22 17:48:50'),(34,14,'/uploads/apostila-1774216396521-741946222.png',1,'2026-03-22 18:53:16'),(35,14,'/uploads/apostila-1774216396568-912648283.png',2,'2026-03-22 18:53:16'),(36,14,'/uploads/apostila-1774216396580-727120153.png',3,'2026-03-22 18:53:16'),(37,15,'/uploads/apostila-1774216427823-225023391.png',1,'2026-03-22 18:53:47'),(38,15,'/uploads/apostila-1774216427831-755809357.png',2,'2026-03-22 18:53:47'),(39,15,'/uploads/apostila-1774216427836-956506258.png',3,'2026-03-22 18:53:47'),(49,19,'/uploads/apostila-1774744220849-298451396.png',1,'2026-03-28 21:30:23'),(50,19,'/uploads/apostila-1774744220855-461040321.png',2,'2026-03-28 21:30:23'),(51,19,'/uploads/apostila-1774744220863-381063385.png',3,'2026-03-28 21:30:23');
/*!40000 ALTER TABLE `apostila_imagens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aula_conteudos`
--

DROP TABLE IF EXISTS `aula_conteudos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aula_conteudos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aula_id` bigint NOT NULL,
  `video_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avaliacao_json_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avaliacao_json` json DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `video_thumb_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `aula_id` (`aula_id`),
  CONSTRAINT `fk_conteudos_aula` FOREIGN KEY (`aula_id`) REFERENCES `aulas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aula_conteudos`
--

LOCK TABLES `aula_conteudos` WRITE;
/*!40000 ALTER TABLE `aula_conteudos` DISABLE KEYS */;
INSERT INTO `aula_conteudos` VALUES (1,3,'/uploads/video-1772980597578-621433506.mp4','/uploads/avaliacao-1774216983267-560223957.json',NULL,'2026-03-08 11:36:37','2026-03-22 19:03:03',NULL),(2,4,'/uploads/video-1772988783904-844865016.mp4','/uploads/avaliacao-1774217002212-207398041.json',NULL,'2026-03-08 13:53:04','2026-03-22 19:03:22',NULL),(3,5,'/uploads/video-1772988851842-474709922.mp4','/uploads/avaliacao-1772988852193-862618328.json',NULL,'2026-03-08 13:54:12','2026-03-08 13:54:12',NULL),(4,6,'/uploads/video-1772993012740-73161989.mp4','/uploads/avaliacao-1774216868384-761938429.json',NULL,'2026-03-08 15:03:33','2026-03-22 19:01:08',NULL),(5,7,'/uploads/video-1772993083830-972323517.mp4','/uploads/avaliacao-1774216887669-403013252.json',NULL,'2026-03-08 15:04:44','2026-03-22 19:01:27',NULL),(6,8,'/uploads/video-1772995851934-83003716.mp4','/uploads/avaliacao-1773099371047-615661027.json',NULL,'2026-03-08 15:50:52','2026-03-09 20:36:11',NULL),(7,9,'/uploads/video-1772996146712-767702434.mp4','/uploads/avaliacao-1774216806849-580497013.json',NULL,'2026-03-08 15:55:47','2026-03-22 19:00:06',NULL),(8,10,'/uploads/video-1773020867475-552127920.mp4','/uploads/avaliacao-1773020867844-431027602.json',NULL,'2026-03-08 22:47:47','2026-03-08 22:47:47',NULL),(9,11,'/uploads/video-1774212451136-347550455.mp4','/uploads/avaliacao-1774212451880-805487985.json',NULL,'2026-03-22 17:47:31','2026-03-22 17:47:31',NULL),(10,12,'/uploads/video-1774212494571-198945871.mp4','/uploads/avaliacao-1774212494946-236464452.json',NULL,'2026-03-22 17:48:14','2026-03-22 17:48:14',NULL),(11,13,'/uploads/video-1774212529906-894318535.mp4','/uploads/avaliacao-1774212530276-95068330.json',NULL,'2026-03-22 17:48:50','2026-03-22 17:48:50',NULL),(12,14,'/uploads/video-1774216396188-982197209.mp4','/uploads/avaliacao-1774216396589-680072664.json',NULL,'2026-03-22 18:53:16','2026-03-22 18:53:16',NULL),(13,15,'/uploads/video-1774216427362-576989237.mp4','/uploads/avaliacao-1774216427843-922655207.json',NULL,'2026-03-22 18:53:47','2026-03-22 18:53:47',NULL),(17,19,'/uploads/video-1774744220214-748701950.mp4','/uploads/avaliacao-1774744220872-919182776.json',NULL,'2026-03-28 21:30:23','2026-03-28 21:30:23',NULL);
/*!40000 ALTER TABLE `aula_conteudos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aula_notas`
--

DROP TABLE IF EXISTS `aula_notas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aula_notas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `matricula_id` bigint NOT NULL,
  `aula_id` bigint NOT NULL,
  `tempo_segundos` int NOT NULL,
  `texto` text NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `matricula_id` (`matricula_id`),
  KEY `aula_id` (`aula_id`),
  CONSTRAINT `aula_notas_ibfk_1` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `aula_notas_ibfk_2` FOREIGN KEY (`aula_id`) REFERENCES `aulas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aula_notas`
--

LOCK TABLES `aula_notas` WRITE;
/*!40000 ALTER TABLE `aula_notas` DISABLE KEYS */;
INSERT INTO `aula_notas` VALUES (6,17,19,38,'Download do node','2026-03-29 22:24:53');
/*!40000 ALTER TABLE `aula_notas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aulas`
--

DROP TABLE IF EXISTS `aulas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aulas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `modulo_id` bigint NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ordem` int NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `duracao_segundos` int DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `arquivo_adicional_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_thumb_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_modulo_ordem` (`modulo_id`,`ordem`),
  CONSTRAINT `fk_aulas_modulo` FOREIGN KEY (`modulo_id`) REFERENCES `modulos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aulas`
--

LOCK TABLES `aulas` WRITE;
/*!40000 ALTER TABLE `aulas` DISABLE KEYS */;
INSERT INTO `aulas` VALUES (3,2,'Introdução ao Excel e Interface',1,'Nesta aula você conhecerá a interface do Excel, suas principais ferramentas e como criar suas primeiras planilhas. Também verá como organizar dados em linhas e colunas.',1200,'2026-03-08 11:36:37','2026-03-22 19:03:03',NULL,NULL),(4,2,'Fórmulas Básicas e Operações',2,'Aprenda a utilizar fórmulas para realizar cálculos automáticos, como soma, média e outras operações essenciais que facilitam o dia a dia com planilhas.',1200,'2026-03-08 13:53:04','2026-03-22 19:03:22',NULL,NULL),(5,2,'Ferramentas básicas da guia Página inicial',3,NULL,1200,'2026-03-08 13:54:12','2026-03-08 13:54:12',NULL,NULL),(6,4,'Introdução ao Word e Interface',1,'Nesta aula você conhecerá a interface do Word, suas principais ferramentas e como criar e salvar documentos. Também verá como navegar e utilizar os recursos básicos do programa.',1200,'2026-03-08 15:03:33','2026-03-22 19:01:08','/uploads/arquivo_adicional-1773097074323-78389573.zip',NULL),(7,4,'Formatação de Texto e Estrutura de Documento',2,'Aprenda a formatar textos de forma profissional, utilizando fontes, tamanhos, espaçamentos e alinhamentos. Você também verá como organizar títulos, parágrafos e criar documentos mais bem estruturados.',1200,'2026-03-08 15:04:44','2026-03-22 19:01:27','/uploads/arquivo_adicional-1773097088198-208846790.zip',NULL),(8,5,'Introdução ao PowerPoint e Interface',1,'Nesta aula você conhecerá a interface do PowerPoint, suas principais ferramentas e como criar sua primeira apresentação. Também verá como organizar slides de forma prática e eficiente.',1200,'2026-03-08 15:50:52','2026-03-22 18:59:46','/uploads/arquivo_adicional-1773021174618-254465915.zip',NULL),(9,5,'Criação de Slides e Boas Práticas de Design',2,'Aprenda a montar slides visualmente agradáveis, utilizando cores, fontes e espaçamento de forma estratégica. Você também verá como evitar erros comuns que deixam apresentações poluídas ou confusas.',1200,'2026-03-08 15:55:47','2026-03-22 19:00:06',NULL,NULL),(10,5,'Animações',3,'sada',1200,'2026-03-08 22:47:47','2026-03-08 22:47:47','/uploads/arquivo_adicional-1773020867845-888947314.zip',NULL),(11,6,'Introdução ao JavaScript e seu funcionamento',1,'Nesta aula você entenderá o que é o JavaScript, como ele funciona nos navegadores e qual o seu papel no desenvolvimento web. Também será apresentado o ambiente de execução e como começar a escrever seus primeiros códigos.',1200,'2026-03-22 17:47:31','2026-03-22 17:47:31',NULL,NULL),(12,6,'Variáveis, Tipos de Dados e Operadores',2,'Aprenda a armazenar e manipular informações utilizando variáveis, conheça os principais tipos de dados do JavaScript e como utilizar operadores para realizar cálculos e comparações.',1200,'2026-03-22 17:48:14','2026-03-22 17:48:14',NULL,NULL),(13,6,'Estruturas Condicionais e Tomada de Decisão',3,'Nesta aula você aprenderá a criar lógicas que permitem ao sistema tomar decisões, utilizando estruturas como if, else e switch, fundamentais para qualquer aplicação.',1200,'2026-03-22 17:48:50','2026-03-22 17:48:50',NULL,NULL),(14,7,'Introdução ao Bootstrap e Configuração do Projeto',1,'Nesta aula você entenderá o que é o Bootstrap, como ele funciona e como integrá-lo ao seu projeto. Também verá como utilizar o CDN e estruturar um HTML base para começar a desenvolver com o framework.',1200,'2026-03-22 18:53:16','2026-03-22 18:53:16',NULL,NULL),(15,7,'Grid System e Criação de Layouts Responsivos',2,'Aprenda a utilizar o sistema de grid do Bootstrap para organizar elementos na tela de forma responsiva. Você irá construir layouts que se adaptam automaticamente a diferentes dispositivos, como celulares, tablets e desktops.',1200,'2026-03-22 18:53:47','2026-03-22 18:53:47',NULL,NULL),(19,9,'Introdução ao Node JS',1,'teste',600,'2026-03-28 21:30:23','2026-03-28 21:30:23',NULL,'/uploads/thumb-1774744220877.jpg');
/*!40000 ALTER TABLE `aulas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacao_tentativas`
--

DROP TABLE IF EXISTS `avaliacao_tentativas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao_tentativas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `matricula_id` bigint NOT NULL,
  `aula_id` bigint NOT NULL,
  `nota` decimal(5,2) DEFAULT NULL,
  `aprovado` tinyint(1) NOT NULL DEFAULT '0',
  `respostas_json` json DEFAULT NULL,
  `enviado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_av_tentativas_matricula` (`matricula_id`),
  KEY `fk_av_tentativas_aula` (`aula_id`),
  KEY `idx_enviado_em` (`enviado_em`),
  CONSTRAINT `fk_av_tentativas_aula` FOREIGN KEY (`aula_id`) REFERENCES `aulas` (`id`),
  CONSTRAINT `fk_av_tentativas_matricula` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao_tentativas`
--

LOCK TABLES `avaliacao_tentativas` WRITE;
/*!40000 ALTER TABLE `avaliacao_tentativas` DISABLE KEYS */;
INSERT INTO `avaliacao_tentativas` VALUES (1,1,3,10.00,1,NULL,'2026-03-08 13:59:59'),(2,1,4,10.00,1,NULL,'2026-03-08 14:05:54'),(3,1,5,10.00,1,NULL,'2026-03-08 14:25:40'),(4,2,6,6.00,0,NULL,'2026-03-08 15:06:45'),(5,2,6,7.00,1,NULL,'2026-03-08 15:07:20'),(6,2,7,7.00,1,NULL,'2026-03-08 15:08:28'),(7,3,8,7.00,1,NULL,'2026-03-08 15:57:29'),(8,3,9,7.00,1,NULL,'2026-03-08 15:58:06'),(9,5,6,7.00,1,NULL,'2026-03-08 22:04:51'),(10,5,7,7.00,1,NULL,'2026-03-08 22:05:28'),(11,7,3,7.00,1,NULL,'2026-03-08 22:08:43'),(12,7,4,7.00,1,NULL,'2026-03-08 22:09:09'),(13,7,5,7.00,1,NULL,'2026-03-08 22:09:39'),(14,6,3,7.00,1,NULL,'2026-03-08 22:27:29'),(15,6,4,7.00,1,NULL,'2026-03-08 22:27:57'),(16,6,5,7.00,1,NULL,'2026-03-08 22:28:24'),(17,4,6,8.00,1,NULL,'2026-03-09 20:08:24'),(18,4,7,0.00,0,NULL,'2026-03-09 20:28:10'),(19,4,7,5.00,0,NULL,'2026-03-09 20:28:25'),(20,4,7,5.00,0,NULL,'2026-03-09 20:28:33'),(24,8,8,10.00,1,NULL,'2026-03-09 20:50:50'),(25,10,6,5.00,0,NULL,'2026-03-22 18:08:57'),(26,10,6,10.00,1,NULL,'2026-03-22 18:09:05'),(27,10,7,10.00,1,NULL,'2026-03-22 18:09:26'),(28,8,9,7.00,1,NULL,'2026-03-22 18:24:04'),(29,8,10,8.00,1,NULL,'2026-03-22 18:24:53'),(30,12,11,10.00,1,NULL,'2026-03-22 18:32:15'),(31,12,12,10.00,1,NULL,'2026-03-22 18:32:39'),(32,12,13,10.00,1,NULL,'2026-03-22 18:32:56'),(33,13,3,9.00,1,NULL,'2026-03-22 18:42:20'),(34,13,4,7.00,1,NULL,'2026-03-22 18:43:03'),(35,13,5,8.00,1,NULL,'2026-03-22 18:43:33'),(36,14,11,10.00,1,NULL,'2026-03-22 18:45:46'),(37,14,12,10.00,1,NULL,'2026-03-22 18:46:11'),(38,14,13,10.00,1,NULL,'2026-03-22 18:46:27'),(39,9,11,10.00,1,NULL,'2026-03-28 15:17:34'),(40,9,12,10.00,1,NULL,'2026-03-28 15:18:06'),(41,9,13,10.00,1,NULL,'2026-03-28 15:18:25'),(45,16,14,10.00,1,NULL,'2026-03-28 21:14:37'),(46,17,19,10.00,1,NULL,'2026-03-29 19:25:58'),(56,16,15,10.00,1,NULL,'2026-03-29 22:38:38'),(57,18,6,10.00,1,NULL,'2026-03-29 22:59:39'),(58,18,7,10.00,1,NULL,'2026-03-29 23:00:13'),(59,19,3,5.00,0,NULL,'2026-03-29 23:03:17'),(60,19,3,10.00,1,NULL,'2026-03-29 23:03:29'),(61,19,4,10.00,1,NULL,'2026-03-29 23:03:55'),(62,19,5,7.00,1,NULL,'2026-03-29 23:04:46');
/*!40000 ALTER TABLE `avaliacao_tentativas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificados`
--

DROP TABLE IF EXISTS `certificados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificados` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `matricula_id` bigint NOT NULL,
  `token` char(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emitido_em` datetime DEFAULT NULL,
  `url_certificado` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula_id` (`matricula_id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_emitido_em` (`emitido_em`),
  CONSTRAINT `fk_certificados_matricula` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificados`
--

LOCK TABLES `certificados` WRITE;
/*!40000 ALTER TABLE `certificados` DISABLE KEYS */;
INSERT INTO `certificados` VALUES (1,1,'AD008471','2026-03-08 14:25:40',NULL,'2026-03-08 13:12:44'),(2,2,'38665E66','2026-03-08 15:08:28',NULL,'2026-03-08 14:40:27'),(3,3,'1B468156','2026-03-08 15:58:06',NULL,'2026-03-08 15:56:26'),(4,4,'490F5676',NULL,NULL,'2026-03-08 16:56:09'),(5,5,'10AFEE4F','2026-03-08 22:05:28',NULL,'2026-03-08 18:03:35'),(6,6,'69488EC4','2026-03-08 22:28:24',NULL,'2026-03-08 21:17:07'),(7,7,'7965F6F8','2026-03-08 22:09:39',NULL,'2026-03-08 22:06:53'),(8,8,'1384D328',NULL,NULL,'2026-03-09 20:09:01'),(9,12,'0F967F02',NULL,NULL,'2026-03-22 18:29:55'),(10,13,'9E9D6457','2026-03-22 18:43:34',NULL,'2026-03-22 18:41:41'),(11,14,'EB78FAF2','2026-03-22 18:46:27',NULL,'2026-03-22 18:44:17'),(12,9,'99E38049','2026-03-28 15:18:25',NULL,'2026-03-28 15:18:25'),(14,16,'4D0D1FB0','2026-03-29 22:38:38',NULL,'2026-03-28 17:45:32'),(15,17,'B69479B4','2026-03-29 19:25:58',NULL,'2026-03-28 21:30:36'),(16,18,'3A0DF323','2026-03-29 23:00:13',NULL,'2026-03-29 22:58:17'),(17,19,'21DD53C5','2026-03-29 23:04:46',NULL,'2026-03-29 23:02:25');
/*!40000 ALTER TABLE `certificados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curriculo_modelos`
--

DROP TABLE IF EXISTS `curriculo_modelos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curriculo_modelos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capa_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `arquivo_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curriculo_modelos`
--

LOCK TABLES `curriculo_modelos` WRITE;
/*!40000 ALTER TABLE `curriculo_modelos` DISABLE KEYS */;
INSERT INTO `curriculo_modelos` VALUES (3,'Currículo padrão','/uploads/capa-1774228390862-265764715.png','/uploads/arquivo_docx-1774228390930-462435535.docx','2026-03-23 01:13:10');
/*!40000 ALTER TABLE `curriculo_modelos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codigo_unico` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `capa_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificado_template_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('RASCUNHO','PUBLICADO','ARQUIVADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RASCUNHO',
  `criado_por_admin_id` bigint NOT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `mercado` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duracao_horas` int DEFAULT NULL,
  `conclusao_dias` int DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT '0.00',
  `desconto_percentual` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_unico` (`codigo_unico`),
  KEY `fk_cursos_admin` (`criado_por_admin_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_cursos_admin` FOREIGN KEY (`criado_por_admin_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (3,'ONST-6269A6','Excel 365','O curso Excel Profissional foi desenvolvido para quem deseja dominar planilhas e transformar dados em informações organizadas e úteis para tomada de decisão. Você aprenderá a criar, editar e automatizar planilhas de forma prática e eficiente.\r\n\r\nCom foco no uso real do dia a dia, o curso aborda desde operações básicas até funções essenciais, organização de dados e criação de relatórios. Ideal para iniciantes e também para quem deseja aumentar a produtividade no trabalho.','/img/capa-1772981587738-432150242.jpg','/img/capa-1772991127861-237816616.png','PUBLICADO',1,'2026-03-08 11:16:27','2026-03-29 23:01:56','excel, planilhas, produtividade, análise de dados, microsoft excel, escritorio',2,2,0.00,0),(4,'ONST-408975','Word 365','O curso Word Profissional foi desenvolvido para quem deseja dominar a criação e formatação de documentos com qualidade e organização. Você aprenderá a produzir textos profissionais, relatórios, contratos e materiais diversos com um visual limpo e bem estruturado.\r\n\r\nCom uma abordagem prática, o curso ensina desde os recursos básicos até ferramentas que aumentam a produtividade, como estilos, formatação automática e padronização de documentos. Ideal para iniciantes e também para quem deseja melhorar a apresentação dos seus arquivos no dia a dia.','/img/capa-1772991615780-109701713.jpg','/img/capa-1772991615787-914055128.png','PUBLICADO',1,'2026-03-08 14:40:15','2026-03-29 23:01:04','word, documentos profissionais, formatação de texto, produtividade, microsoft word. escritorio',2,2,15.00,0),(5,'ONST-D007EE','Powerpoint 365','O curso PowerPoint Profissional foi desenvolvido para quem deseja criar apresentações impactantes, organizadas e visualmente atrativas. Você aprenderá a transformar ideias em slides claros, dinâmicos e persuasivos, ideais para apresentações corporativas, comerciais e educacionais.\r\n\r\nCom foco prático, o curso aborda desde a criação de slides até o uso de animações, transições e elementos visuais que elevam o nível das suas apresentações. Ideal para iniciantes e também para quem deseja aprimorar sua comunicação visual.','/img/capa-1772995805277-253484250.jpg','/img/capa-1772995805283-965215614.png','PUBLICADO',1,'2026-03-08 15:50:05','2026-03-22 18:57:05','powerpoint, apresentações profissionais, design de slides, comunicação visual, produtividade',2,2,20.00,0),(6,'ONST-E0735A','Desenvolvimento Web com Java Script','O curso Desenvolvimento Web com JavaScript foi criado para quem deseja construir aplicações web modernas, dinâmicas e eficientes. Ao longo do curso, você aprenderá desde os fundamentos da linguagem até a criação de funcionalidades interativas utilizadas no dia a dia de sistemas reais.\r\n\r\nCom uma abordagem prática, você desenvolverá habilidades para manipular o DOM, criar interações com o usuário, consumir APIs e estruturar projetos de forma profissional. Ideal tanto para iniciantes quanto para quem deseja evoluir no desenvolvimento front-end.','/img/capa-1774212325730-72800287.png','/img/capa-1774212325751-799606843.png','PUBLICADO',1,'2026-03-22 17:45:25','2026-03-22 18:52:19','javascript, desenvolvimento web, programação, front-end, html css javascript, curso de javascript',2,2,0.00,0),(7,'ONST-EF7443','Bootstrap 5','O curso Desenvolvimento Web com Bootstrap foi criado para quem deseja criar interfaces modernas, responsivas e visualmente profissionais de forma rápida e eficiente. Utilizando um dos frameworks mais populares do mercado, você aprenderá a estruturar layouts, aplicar estilos e construir páginas adaptáveis para diferentes dispositivos.\r\n\r\nCom uma abordagem prática, o curso ensina desde a utilização do grid system até a criação de componentes prontos como botões, cards, menus e modais. Ideal para iniciantes e também para quem deseja acelerar o desenvolvimento front-end.','/img/capa-1774216313611-889183645.png','/img/capa-1774216313616-267403910.png','PUBLICADO',1,'2026-03-22 18:51:53','2026-03-22 18:51:53','bootstrap, desenvolvimento web, front-end, design responsivo, criação de sites',2,1,0.00,0),(9,'ONST-7E785F','Node Js Completo','Teste','/img/capa-1774744150927-641094677.jpg','/img/capa-1774744150942-188801642.png','PUBLICADO',1,'2026-03-28 21:29:10','2026-03-28 23:57:19','javascript, desenvolvimento web, programação, front-end, html css javascript, curso de javascript',NULL,NULL,0.00,0);
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `aluno_id` bigint NOT NULL,
  `curso_id` bigint NOT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aluno_id`,`curso_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_respostas`
--

DROP TABLE IF EXISTS `forum_respostas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_respostas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topico_id` int NOT NULL,
  `usuario_id` bigint NOT NULL,
  `conteudo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagem_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_solucao` tinyint(1) DEFAULT '0',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `topico_id` (`topico_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `forum_respostas_ibfk_1` FOREIGN KEY (`topico_id`) REFERENCES `forum_topicos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_respostas_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_respostas`
--

LOCK TABLES `forum_respostas` WRITE;
/*!40000 ALTER TABLE `forum_respostas` DISABLE KEYS */;
INSERT INTO `forum_respostas` VALUES (1,1,1,'Resposta de reste',NULL,0,'2026-03-22 14:17:09'),(2,1,4,'Sou aluno e to respondendo essa pergunta',NULL,0,'2026-03-22 14:19:26');
/*!40000 ALTER TABLE `forum_respostas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_topicos`
--

DROP TABLE IF EXISTS `forum_topicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_topicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `conteudo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagem_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Geral',
  `status` enum('ABERTO','RESOLVIDO','FECHADO') COLLATE utf8mb4_unicode_ci DEFAULT 'ABERTO',
  `visualizacoes` int DEFAULT '0',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `forum_topicos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_topicos`
--

LOCK TABLES `forum_topicos` WRITE;
/*!40000 ALTER TABLE `forum_topicos` DISABLE KEYS */;
INSERT INTO `forum_topicos` VALUES (1,3,'Pergunta de teste','Teste de pergunta',NULL,'Geral','ABERTO',27,'2026-03-22 13:37:53','2026-03-29 21:22:33');
/*!40000 ALTER TABLE `forum_topicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matriculas`
--

DROP TABLE IF EXISTS `matriculas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matriculas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aluno_id` bigint NOT NULL,
  `curso_id` bigint NOT NULL,
  `status` enum('ATIVA','CONCLUIDA','CANCELADA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ATIVA',
  `origem` enum('CADASTRO','COMPRA','LIBERACAO_ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CADASTRO',
  `iniciada_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `concluida_em` datetime DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `xp` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_aluno_curso` (`aluno_id`,`curso_id`),
  KEY `idx_aluno` (`aluno_id`),
  KEY `idx_curso` (`curso_id`),
  CONSTRAINT `fk_matriculas_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_matriculas_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matriculas`
--

LOCK TABLES `matriculas` WRITE;
/*!40000 ALTER TABLE `matriculas` DISABLE KEYS */;
INSERT INTO `matriculas` VALUES (1,3,3,'ATIVA','LIBERACAO_ADMIN','2026-03-08 13:12:44','2026-03-08 14:25:40','2026-03-08 13:12:44','2026-03-08 14:28:19',0),(2,3,4,'ATIVA','LIBERACAO_ADMIN','2026-03-08 14:40:27','2026-03-08 15:08:28','2026-03-08 14:40:27','2026-03-08 15:56:26',0),(3,3,5,'CANCELADA','LIBERACAO_ADMIN','2026-03-08 15:56:26','2026-03-08 15:58:06','2026-03-08 15:56:26','2026-03-28 10:47:44',0),(4,4,4,'ATIVA','LIBERACAO_ADMIN','2026-03-08 16:56:09',NULL,'2026-03-08 16:56:09','2026-03-08 16:56:09',0),(5,6,4,'CONCLUIDA','LIBERACAO_ADMIN','2026-03-08 18:03:35','2026-03-08 22:05:28','2026-03-08 18:03:35','2026-03-08 22:05:28',0),(6,14,3,'CONCLUIDA','LIBERACAO_ADMIN','2026-03-08 21:17:07','2026-03-08 22:28:24','2026-03-08 21:17:07','2026-03-08 22:28:24',0),(7,6,3,'CONCLUIDA','LIBERACAO_ADMIN','2026-03-08 22:06:53','2026-03-08 22:09:39','2026-03-08 22:06:53','2026-03-08 22:09:39',0),(8,4,5,'CONCLUIDA','LIBERACAO_ADMIN','2026-03-09 20:09:01','2026-03-22 18:24:53','2026-03-09 20:09:01','2026-03-22 18:24:53',0),(9,3,6,'CONCLUIDA','CADASTRO','2026-03-22 17:54:00','2026-03-28 15:18:25','2026-03-22 17:54:00','2026-03-28 15:18:25',0),(10,7,4,'CONCLUIDA','CADASTRO','2026-03-22 18:07:50','2026-03-22 18:09:26','2026-03-22 18:07:50','2026-03-22 18:09:26',0),(11,4,6,'ATIVA','CADASTRO','2026-03-22 18:26:51',NULL,'2026-03-22 18:26:51','2026-03-22 18:26:51',0),(12,8,6,'CONCLUIDA','LIBERACAO_ADMIN','2026-03-22 18:29:55','2026-03-22 18:32:56','2026-03-22 18:29:55','2026-03-22 18:32:56',0),(13,4,3,'CONCLUIDA','CADASTRO','2026-03-22 18:41:41','2026-03-22 18:43:34','2026-03-22 18:41:41','2026-03-22 18:43:34',0),(14,9,6,'CONCLUIDA','CADASTRO','2026-03-22 18:44:17','2026-03-22 18:46:27','2026-03-22 18:44:17','2026-03-22 18:46:27',0),(16,9,7,'CONCLUIDA','LIBERACAO_ADMIN','2026-03-28 17:45:32','2026-03-29 22:38:38','2026-03-28 17:45:32','2026-03-29 22:38:38',100),(17,9,9,'CONCLUIDA','LIBERACAO_ADMIN','2026-03-28 21:30:36','2026-03-29 19:25:58','2026-03-28 21:30:36','2026-03-29 19:25:58',100),(18,9,4,'CONCLUIDA','LIBERACAO_ADMIN','2026-03-29 22:58:17','2026-03-29 23:00:13','2026-03-29 22:58:17','2026-03-29 23:00:13',200),(19,8,3,'CONCLUIDA','LIBERACAO_ADMIN','2026-03-29 23:02:25','2026-03-29 23:04:46','2026-03-29 23:02:25','2026-03-29 23:04:46',285);
/*!40000 ALTER TABLE `matriculas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulos`
--

DROP TABLE IF EXISTS `modulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `curso_id` bigint NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ordem` int NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_curso_ordem` (`curso_id`,`ordem`),
  CONSTRAINT `fk_modulos_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulos`
--

LOCK TABLES `modulos` WRITE;
/*!40000 ALTER TABLE `modulos` DISABLE KEYS */;
INSERT INTO `modulos` VALUES (2,3,'Fundamentos do Excel e Manipulação de Dados',1,'Neste módulo, você aprenderá os conceitos fundamentais do Excel, incluindo navegação na interface, criação de planilhas e manipulação de dados. Serão apresentados os principais recursos para organização e controle de informações.\r\n\r\nO objetivo é desenvolver sua capacidade de trabalhar com dados de forma estruturada, criando planilhas úteis para diferentes situações profissionais.','2026-03-08 11:22:12','2026-03-22 19:02:40'),(3,3,'Fórmulas',2,NULL,'2026-03-08 13:50:55','2026-03-08 13:50:55'),(4,4,'Fundamentos do Word e Formatação de Documentos',1,'Neste módulo, você aprenderá os conceitos essenciais para criar documentos organizados e profissionais no Word. Serão abordadas as principais ferramentas de edição, formatação de texto e estruturação de conteúdo.\r\n\r\nO objetivo é capacitar você a produzir documentos claros, padronizados e visualmente agradáveis, fundamentais para ambientes acadêmicos e corporativos.','2026-03-08 15:02:24','2026-03-22 19:00:48'),(5,5,'Fundamentos do PowerPoint e Estrutura de Apresentações',1,'Neste módulo, você aprenderá os conceitos essenciais para criar apresentações bem estruturadas e profissionais. Será apresentado o funcionamento da ferramenta, organização de slides e boas práticas de design.\r\n\r\nO objetivo é desenvolver sua capacidade de comunicar ideias com clareza, utilizando recursos visuais que valorizam o conteúdo e prendem a atenção do público.','2026-03-08 15:50:15','2026-03-22 18:59:28'),(6,6,'Fundamentos do JavaScript e Lógica de Programação',1,'Neste módulo, você irá construir a base essencial para o desenvolvimento com JavaScript. Serão apresentados os principais conceitos da linguagem, como variáveis, tipos de dados, operadores e estruturas de decisão.\r\n\r\nO objetivo é desenvolver o raciocínio lógico e a capacidade de resolver problemas, preparando você para criar aplicações web mais complexas nos próximos módulos. Aqui é onde você deixa de apenas assistir e começa realmente a pensar como um programador.','2026-03-22 17:46:26','2026-03-22 17:46:26'),(7,7,'Fundamentos do Bootstrap e Layout Responsivo',1,'Neste módulo, você aprenderá os conceitos fundamentais do Bootstrap e como utilizá-lo para criar layouts responsivos com agilidade. Será apresentado o funcionamento do sistema de grid, organização de páginas e aplicação de estilos prontos.\r\n\r\nO objetivo é capacitar você a construir estruturas visuais profissionais, adaptáveis a diferentes tamanhos de tela, sem a necessidade de escrever grandes quantidades de CSS do zero.','2026-03-22 18:52:36','2026-03-22 18:52:36'),(9,9,'Introdução ao Node JS',1,'teste','2026-03-28 21:29:41','2026-03-28 21:29:41');
/*!40000 ALTER TABLE `modulos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacao_cursos`
--

DROP TABLE IF EXISTS `notificacao_cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacao_cursos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notificacao_id` bigint NOT NULL,
  `curso_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_notificacao_curso` (`notificacao_id`,`curso_id`),
  KEY `fk_not_cursos_curso` (`curso_id`),
  CONSTRAINT `fk_not_cursos_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_not_cursos_notificacao` FOREIGN KEY (`notificacao_id`) REFERENCES `notificacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacao_cursos`
--

LOCK TABLES `notificacao_cursos` WRITE;
/*!40000 ALTER TABLE `notificacao_cursos` DISABLE KEYS */;
INSERT INTO `notificacao_cursos` VALUES (1,4,4);
/*!40000 ALTER TABLE `notificacao_cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacao_entregas`
--

DROP TABLE IF EXISTS `notificacao_entregas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacao_entregas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notificacao_id` bigint NOT NULL,
  `aluno_id` bigint NOT NULL,
  `status` enum('PENDENTE','ENVIADA','LIDA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDENTE',
  `enviada_em` datetime DEFAULT NULL,
  `lida_em` datetime DEFAULT NULL,
  `oculta` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_notificacao_aluno` (`notificacao_id`,`aluno_id`),
  KEY `fk_not_entregas_aluno` (`aluno_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_not_entregas_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_not_entregas_notificacao` FOREIGN KEY (`notificacao_id`) REFERENCES `notificacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacao_entregas`
--

LOCK TABLES `notificacao_entregas` WRITE;
/*!40000 ALTER TABLE `notificacao_entregas` DISABLE KEYS */;
INSERT INTO `notificacao_entregas` VALUES (1,1,3,'LIDA','2026-03-08 18:47:46','2026-03-08 18:47:58',1),(2,1,4,'LIDA','2026-03-08 18:48:10','2026-03-08 18:48:21',1),(3,1,5,'PENDENTE',NULL,NULL,0),(4,1,6,'LIDA','2026-03-08 21:17:42','2026-03-08 21:17:46',0),(5,1,7,'LIDA','2026-03-08 18:51:26','2026-03-08 18:51:28',1),(6,1,8,'LIDA','2026-03-08 18:51:49','2026-03-08 18:51:51',0),(7,1,9,'LIDA','2026-03-22 18:44:17','2026-03-22 18:44:21',1),(8,1,10,'PENDENTE',NULL,NULL,0),(9,1,11,'PENDENTE',NULL,NULL,0),(10,1,12,'PENDENTE',NULL,NULL,0),(11,1,13,'PENDENTE',NULL,NULL,0),(12,1,14,'LIDA','2026-03-08 21:17:16','2026-03-08 21:17:19',0),(16,2,3,'LIDA','2026-03-08 18:50:59','2026-03-08 18:51:15',1),(17,2,4,'LIDA','2026-03-08 21:18:21','2026-03-08 21:18:23',1),(18,2,5,'PENDENTE',NULL,NULL,0),(19,2,6,'LIDA','2026-03-08 21:17:47','2026-03-08 21:17:48',0),(20,2,7,'ENVIADA','2026-03-08 18:51:29',NULL,1),(21,2,8,'LIDA','2026-03-08 18:51:52','2026-03-08 18:51:54',0),(22,2,9,'LIDA','2026-03-22 18:44:28','2026-03-22 18:44:33',1),(23,2,10,'PENDENTE',NULL,NULL,0),(24,2,11,'PENDENTE',NULL,NULL,0),(25,2,12,'PENDENTE',NULL,NULL,0),(26,2,13,'PENDENTE',NULL,NULL,0),(27,2,14,'LIDA','2026-03-08 21:17:20','2026-03-08 21:17:22',0),(31,3,3,'LIDA','2026-03-08 21:07:43','2026-03-08 21:08:20',1),(32,3,4,'LIDA','2026-03-08 21:18:24','2026-03-08 21:18:26',1),(33,3,5,'PENDENTE',NULL,NULL,0),(34,3,6,'LIDA','2026-03-08 21:17:49','2026-03-08 21:17:50',0),(35,3,7,'ENVIADA','2026-03-22 18:07:25',NULL,1),(36,3,8,'ENVIADA','2026-03-22 13:13:04',NULL,0),(37,3,9,'LIDA',NULL,'2026-03-22 18:45:09',1),(38,3,10,'PENDENTE',NULL,NULL,0),(39,3,11,'PENDENTE',NULL,NULL,0),(40,3,12,'PENDENTE',NULL,NULL,0),(41,3,13,'PENDENTE',NULL,NULL,0),(42,3,14,'LIDA','2026-03-08 21:17:23','2026-03-08 21:17:25',0),(46,4,3,'LIDA','2026-03-08 21:16:48','2026-03-08 21:16:51',1),(47,4,4,'LIDA',NULL,'2026-03-22 13:12:51',1),(48,4,6,'LIDA','2026-03-08 21:17:51','2026-03-08 21:17:53',0),(49,5,3,'LIDA','2026-03-22 13:07:58','2026-03-22 13:08:00',1),(50,5,4,'LIDA','2026-03-22 13:12:26','2026-03-22 13:12:27',1),(51,5,5,'PENDENTE',NULL,NULL,0),(52,5,6,'PENDENTE',NULL,NULL,0),(53,5,7,'ENVIADA','2026-03-22 18:07:50',NULL,1),(54,5,8,'LIDA','2026-03-22 18:30:11','2026-03-22 18:30:12',0),(55,5,9,'LIDA',NULL,'2026-03-22 18:45:12',1),(56,5,10,'PENDENTE',NULL,NULL,0),(57,5,11,'PENDENTE',NULL,NULL,0),(58,5,12,'PENDENTE',NULL,NULL,0),(59,5,13,'PENDENTE',NULL,NULL,0),(60,5,14,'PENDENTE',NULL,NULL,0);
/*!40000 ALTER TABLE `notificacao_entregas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacao_respostas`
--

DROP TABLE IF EXISTS `notificacao_respostas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacao_respostas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notificacao_id` bigint NOT NULL,
  `aluno_id` bigint NOT NULL,
  `resposta_texto` text COLLATE utf8mb4_unicode_ci,
  `avaliacao_estrelas` int DEFAULT NULL,
  `respondido_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_resposta_aluno` (`notificacao_id`,`aluno_id`),
  KEY `fk_not_resp_aluno` (`aluno_id`),
  CONSTRAINT `fk_not_resp_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_not_resp_notificacao` FOREIGN KEY (`notificacao_id`) REFERENCES `notificacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacao_respostas`
--

LOCK TABLES `notificacao_respostas` WRITE;
/*!40000 ALTER TABLE `notificacao_respostas` DISABLE KEYS */;
INSERT INTO `notificacao_respostas` VALUES (1,1,3,NULL,5,'2026-03-08 18:47:58'),(2,1,4,NULL,5,'2026-03-08 18:48:21'),(3,2,3,NULL,5,'2026-03-08 18:51:15'),(4,1,7,NULL,5,'2026-03-08 18:51:28'),(5,1,8,NULL,5,'2026-03-08 18:51:51'),(6,2,8,NULL,5,'2026-03-08 18:51:54'),(7,3,3,'Maravilhosa, a plataforma entrega tudo o que precisamos para aprender',0,'2026-03-08 21:08:20'),(8,4,3,NULL,0,'2026-03-08 21:16:51'),(9,1,14,NULL,5,'2026-03-08 21:17:19'),(10,2,14,NULL,5,'2026-03-08 21:17:22'),(11,3,14,'dasda',0,'2026-03-08 21:17:25'),(12,1,6,NULL,5,'2026-03-08 21:17:46'),(13,2,6,NULL,5,'2026-03-08 21:17:48'),(14,3,6,'dsa',0,'2026-03-08 21:17:50'),(15,4,6,NULL,0,'2026-03-08 21:17:53'),(16,2,4,NULL,5,'2026-03-08 21:18:23'),(17,3,4,'dsa',0,'2026-03-08 21:18:26'),(18,5,3,NULL,0,'2026-03-22 13:08:00'),(19,5,4,NULL,0,'2026-03-22 13:12:27'),(20,4,4,NULL,0,'2026-03-22 13:12:51'),(26,5,8,NULL,0,'2026-03-22 18:30:12'),(30,1,9,NULL,5,'2026-03-22 18:44:21'),(31,2,9,NULL,5,'2026-03-22 18:44:33'),(32,3,9,'Maravilhosa. Estou cursando Java script com desenvolvimento web',0,'2026-03-22 18:45:09'),(33,5,9,NULL,0,'2026-03-22 18:45:12');
/*!40000 ALTER TABLE `notificacao_respostas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacoes`
--

DROP TABLE IF EXISTS `notificacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacoes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensagem` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagem_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_alvo` enum('TODOS','CURSO_ESPECIFICO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `criada_por_admin_id` bigint DEFAULT NULL,
  `data_inicio` datetime DEFAULT NULL,
  `data_fim` datetime DEFAULT NULL,
  `agendar_para` datetime DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_interacao` enum('NENHUM','PESQUISA_TEXTO','AVALIACAO_ESTRELAS') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notificacoes_admin` (`criada_por_admin_id`),
  CONSTRAINT `fk_notificacoes_admin` FOREIGN KEY (`criada_por_admin_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacoes`
--

LOCK TABLES `notificacoes` WRITE;
/*!40000 ALTER TABLE `notificacoes` DISABLE KEYS */;
INSERT INTO `notificacoes` VALUES (1,'Pesquisa de satisfação','Responda a pesquisa de satisfação em relação a plataforma',NULL,'TODOS',1,NULL,NULL,NULL,'2026-03-08 18:47:37','AVALIACAO_ESTRELAS',NULL),(2,'Pesquisa de satisfação','Responda a pesquisa para prosseguir para a aula','/img/notificacoes/4d14ef06366fb6bc4cbffbc1cb838352','TODOS',1,NULL,NULL,NULL,'2026-03-08 18:50:50','AVALIACAO_ESTRELAS',NULL),(3,'Pesquisa de satisfação','Descreva sua experiência com o Onstude até aqui','/img/notificacoes/2c24789389487ba916e40998772793de','TODOS',1,NULL,NULL,NULL,'2026-03-08 21:07:12','PESQUISA_TEXTO',NULL),(4,'Teste de notificação para alunos de Word','dsada',NULL,'CURSO_ESPECIFICO',1,'2026-03-08 21:15:00','2026-03-08 21:18:00',NULL,'2026-03-08 21:15:46','NENHUM',NULL),(5,'Teste de disparo de notificação','Teste',NULL,'TODOS',1,'2026-03-22 13:07:00','2026-03-28 13:07:00',NULL,'2026-03-22 13:07:51','NENHUM',NULL);
/*!40000 ALTER TABLE `notificacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progresso_aula`
--

DROP TABLE IF EXISTS `progresso_aula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progresso_aula` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `matricula_id` bigint NOT NULL,
  `aula_id` bigint NOT NULL,
  `status` enum('NAO_INICIADA','EM_ANDAMENTO','CONCLUIDA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NAO_INICIADA',
  `progresso_percentual` decimal(5,2) DEFAULT '0.00',
  `ultima_interacao_em` datetime DEFAULT NULL,
  `concluida_em` datetime DEFAULT NULL,
  `tempo_assistido` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_matricula_aula` (`matricula_id`,`aula_id`),
  KEY `fk_prog_aula_aula` (`aula_id`),
  CONSTRAINT `fk_prog_aula_aula` FOREIGN KEY (`aula_id`) REFERENCES `aulas` (`id`),
  CONSTRAINT `fk_prog_aula_matricula` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progresso_aula`
--

LOCK TABLES `progresso_aula` WRITE;
/*!40000 ALTER TABLE `progresso_aula` DISABLE KEYS */;
INSERT INTO `progresso_aula` VALUES (1,1,3,'CONCLUIDA',100.00,'2026-03-08 13:59:40','2026-03-08 13:59:59',0),(2,1,4,'CONCLUIDA',100.00,'2026-03-08 14:05:43','2026-03-08 14:05:54',0),(3,1,5,'CONCLUIDA',100.00,'2026-03-08 14:24:07','2026-03-08 14:25:40',0),(4,2,6,'CONCLUIDA',100.00,'2026-03-08 15:06:06','2026-03-08 15:07:20',0),(5,2,7,'CONCLUIDA',100.00,'2026-03-08 15:08:05','2026-03-08 15:08:28',0),(6,3,8,'CONCLUIDA',100.00,'2026-03-08 15:57:10','2026-03-08 15:57:29',0),(7,3,9,'CONCLUIDA',100.00,'2026-03-08 15:57:49','2026-03-08 15:58:06',0),(8,5,6,'CONCLUIDA',100.00,'2026-03-08 22:04:31','2026-03-08 22:04:51',0),(9,5,7,'CONCLUIDA',100.00,'2026-03-08 22:05:13','2026-03-08 22:05:28',0),(10,7,3,'CONCLUIDA',100.00,'2026-03-08 22:08:27','2026-03-08 22:08:43',0),(11,7,4,'CONCLUIDA',100.00,'2026-03-08 22:08:55','2026-03-08 22:09:09',0),(12,7,5,'CONCLUIDA',100.00,'2026-03-08 22:09:20','2026-03-08 22:09:39',0),(13,6,3,'CONCLUIDA',100.00,'2026-03-08 22:27:16','2026-03-08 22:27:29',0),(14,6,4,'CONCLUIDA',100.00,'2026-03-08 22:27:42','2026-03-08 22:27:57',0),(15,6,5,'CONCLUIDA',100.00,'2026-03-08 22:28:08','2026-03-08 22:28:24',0),(16,4,6,'CONCLUIDA',100.00,'2026-03-09 20:08:03','2026-03-09 20:08:24',0),(17,4,7,'EM_ANDAMENTO',66.66,'2026-03-09 20:27:57',NULL,0),(18,8,8,'CONCLUIDA',100.00,'2026-03-09 20:50:42','2026-03-09 20:50:50',0),(19,9,11,'CONCLUIDA',100.00,'2026-03-28 15:17:28','2026-03-28 15:17:34',0),(20,10,6,'CONCLUIDA',100.00,'2026-03-22 18:08:48','2026-03-22 18:09:05',0),(21,10,7,'CONCLUIDA',100.00,'2026-03-22 18:09:19','2026-03-22 18:09:26',0),(22,8,9,'CONCLUIDA',100.00,'2026-03-22 18:23:41','2026-03-22 18:24:04',0),(23,8,10,'CONCLUIDA',100.00,'2026-03-22 18:24:36','2026-03-22 18:24:53',0),(24,12,11,'CONCLUIDA',100.00,'2026-03-22 18:32:09','2026-03-22 18:32:15',0),(25,12,12,'CONCLUIDA',100.00,'2026-03-22 18:32:33','2026-03-22 18:32:39',0),(26,12,13,'CONCLUIDA',100.00,'2026-03-22 18:32:50','2026-03-22 18:32:56',0),(27,13,3,'CONCLUIDA',100.00,'2026-03-22 18:42:03','2026-03-22 18:42:20',0),(28,13,4,'CONCLUIDA',100.00,'2026-03-22 18:42:46','2026-03-22 18:43:03',0),(29,13,5,'CONCLUIDA',100.00,'2026-03-22 18:43:17','2026-03-22 18:43:33',0),(30,14,11,'CONCLUIDA',100.00,'2026-03-22 18:45:34','2026-03-22 18:45:46',0),(31,14,12,'CONCLUIDA',100.00,'2026-03-22 18:46:07','2026-03-22 18:46:11',0),(32,14,13,'CONCLUIDA',100.00,'2026-03-22 18:46:22','2026-03-22 18:46:27',0),(33,9,12,'CONCLUIDA',100.00,'2026-03-28 15:18:00','2026-03-28 15:18:06',0),(34,9,13,'CONCLUIDA',100.00,'2026-03-28 15:18:19','2026-03-28 15:18:25',0),(37,16,14,'CONCLUIDA',100.00,'2026-03-28 21:07:02','2026-03-28 21:14:37',492),(38,17,19,'CONCLUIDA',100.00,'2026-03-29 19:25:45','2026-03-29 19:25:58',600),(39,16,15,'CONCLUIDA',100.00,'2026-03-29 22:38:27','2026-03-29 22:38:38',492),(40,18,6,'CONCLUIDA',100.00,'2026-03-29 22:59:27','2026-03-29 22:59:39',824),(41,18,7,'CONCLUIDA',100.00,'2026-03-29 23:00:02','2026-03-29 23:00:13',824),(42,19,3,'CONCLUIDA',100.00,'2026-03-29 23:03:11','2026-03-29 23:03:29',492),(43,19,4,'CONCLUIDA',100.00,'2026-03-29 23:03:46','2026-03-29 23:03:55',492),(44,19,5,'CONCLUIDA',100.00,'2026-03-29 23:04:13','2026-03-29 23:04:46',492);
/*!40000 ALTER TABLE `progresso_aula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progresso_curso`
--

DROP TABLE IF EXISTS `progresso_curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progresso_curso` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `matricula_id` bigint NOT NULL,
  `percentual` decimal(5,2) DEFAULT '0.00',
  `aulas_concluidas` int DEFAULT '0',
  `total_aulas` int DEFAULT '0',
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula_id` (`matricula_id`),
  CONSTRAINT `fk_prog_curso_matricula` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progresso_curso`
--

LOCK TABLES `progresso_curso` WRITE;
/*!40000 ALTER TABLE `progresso_curso` DISABLE KEYS */;
INSERT INTO `progresso_curso` VALUES (1,1,100.00,3,3,'2026-03-08 14:25:40'),(2,2,100.00,2,2,'2026-03-08 15:08:28'),(3,3,100.00,2,2,'2026-03-08 15:58:06'),(4,4,50.00,1,2,'2026-03-09 20:08:24'),(5,5,100.00,2,2,'2026-03-08 22:05:28'),(6,6,100.00,3,3,'2026-03-08 22:28:24'),(7,7,100.00,3,3,'2026-03-08 22:09:39'),(8,8,100.00,3,3,'2026-03-22 18:24:53'),(9,12,100.00,3,3,'2026-03-22 18:32:56'),(10,13,100.00,3,3,'2026-03-22 18:43:34'),(11,14,100.00,3,3,'2026-03-22 18:46:27'),(12,9,100.00,3,3,'2026-03-28 15:18:25'),(14,16,100.00,2,2,'2026-03-29 22:38:38'),(15,17,100.00,1,1,'2026-03-29 19:25:58'),(16,18,100.00,2,2,'2026-03-29 23:00:13'),(17,19,100.00,3,3,'2026-03-29 23:04:46');
/*!40000 ALTER TABLE `progresso_curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progresso_modulo`
--

DROP TABLE IF EXISTS `progresso_modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progresso_modulo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `matricula_id` bigint NOT NULL,
  `modulo_id` bigint NOT NULL,
  `percentual` decimal(5,2) DEFAULT '0.00',
  `aulas_concluidas` int DEFAULT '0',
  `total_aulas` int DEFAULT '0',
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_matricula_modulo` (`matricula_id`,`modulo_id`),
  KEY `fk_prog_mod_modulo` (`modulo_id`),
  CONSTRAINT `fk_prog_mod_matricula` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`),
  CONSTRAINT `fk_prog_mod_modulo` FOREIGN KEY (`modulo_id`) REFERENCES `modulos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progresso_modulo`
--

LOCK TABLES `progresso_modulo` WRITE;
/*!40000 ALTER TABLE `progresso_modulo` DISABLE KEYS */;
/*!40000 ALTER TABLE `progresso_modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tipo` enum('ADMIN','ALUNO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `senha_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cidade` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_perfil_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ATIVO','BLOQUEADO','INATIVO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ATIVO',
  `ultimo_acesso_em` datetime DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ultimo_acesso` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_tipo` (`tipo`),
  KEY `idx_status` (`status`),
  KEY `idx_ultimo_acesso` (`ultimo_acesso_em`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'ADMIN','David Silva','admin@onstude.com','1997-04-23','$2b$10$ZsWg6j/Y5V5XJsVh8cFrz.3gWXyTOkGjrBdby.U.XhO9PCQaJrtQO','11999999999','Camaçari','BA','/img/perfil/perfil-1772982303626-493047785.png','ATIVO','2026-03-08 18:54:43','2026-03-08 10:27:14','2026-03-29 23:57:27','2026-03-29 23:57:27'),(3,'ALUNO','David Silva','teste@onstude.com','1997-04-23','$2b$10$QJveXggSnNfz1tcF4U91COc.KiWXYP374b/nbFtJI6/DOTkuEoBvO','71983995289','Camaçari','BA','/img/perfil/perfil-1772986364368-505474369.png','ATIVO','2026-03-08 18:55:03','2026-03-08 13:12:44','2026-03-29 23:57:41','2026-03-29 23:57:41'),(4,'ALUNO','João da Silva de Souza','joao@email.com','1999-03-08','$2b$10$qrALyGkDQXiQWBrEKZvva.9sjtHL5KIN/PsWfPhuNZ61pn8DS12Pq','71983995289','Camaçari','BA',NULL,'ATIVO','2026-03-08 16:54:32','2026-03-08 16:54:27','2026-03-22 18:41:08','2026-03-22 18:41:08'),(5,'ALUNO','Naiara Silva','naiara@onstude.com','2001-02-20','$2b$10$QkFKx2Qs.AC3g6fGES9Kke0VLeIegljDfi1AmlfbFTp122DsqgYZu','71983995289','Camaçari','BA',NULL,'ATIVO',NULL,'2026-03-08 17:37:38','2026-03-08 17:37:38',NULL),(6,'ALUNO','Pedro Santos','pedro@onstude.com','2006-03-09','$2b$10$Fyxm/.HfYYVbq29dyxsn5uVZnE57JCb3AR0HOHW3zrbMh8TtAuN0i','11999999999','Camaçari','BA',NULL,'ATIVO','2026-03-08 18:03:45','2026-03-08 17:38:34','2026-03-08 22:08:10','2026-03-08 22:08:10'),(7,'ALUNO','Aluno A','alunoa@onstude.com','2001-01-01','$2b$10$N.dVbgQa7ijAXTMooYNd3OXklrJnm/UqE5NEv2Eb1aOOhHvAfWRva','11999999999','Camaçari','BA',NULL,'ATIVO',NULL,'2026-03-08 18:15:56','2026-03-28 17:44:32','2026-03-28 17:44:32'),(8,'ALUNO','Aluno B','alunob@onstude.com','2001-01-01','$2b$10$ZnufhxCXJggwtl2IgW74zeOwP.F1vqXnhdMcXMuG3w7R2N8PKq/Ri','71983995289','Camaçari','BA',NULL,'ATIVO',NULL,'2026-03-08 18:16:24','2026-03-29 23:28:39','2026-03-29 23:28:39'),(9,'ALUNO','Aluno C','alunoc@onstude.com','2001-02-02','$2b$10$ad0eCOueUg8AN9A6nFP.kO7LttFJvMs4LojMHR4kD09WTg5GPx/1a','71983995289','Camaçari','BA',NULL,'ATIVO',NULL,'2026-03-08 18:16:48','2026-03-29 23:10:41','2026-03-29 23:10:41'),(10,'ALUNO','Aluno D','alunod@onstude.com','2001-02-23','$2b$10$V9RuV40K/TWN/.lax80yWuEv/2ghYymlb5bxED8JcoIUJJXN3TSv2','71983995289','Camaçari','BA',NULL,'ATIVO',NULL,'2026-03-08 18:17:13','2026-03-08 18:17:13',NULL),(11,'ALUNO','Aluno E','alunoe@onstude.com','2001-02-02','$2b$10$PTQUyuskpzB2IJ3nCGPy5.uVaqjBirI3RtsX8.I1Ngr4P2oH4MowC','71983995289','Camaçari','BA',NULL,'ATIVO',NULL,'2026-03-08 18:17:39','2026-03-08 18:17:39',NULL),(12,'ALUNO','Aluno F','alunof@onstude.com','2001-02-02','$2b$10$09.Gqe.djIjkjSlmb3JfuupbWjlSdLJSnRyWoRCT9yDOSczeZZJIO','71983995289','Camaçari','BA',NULL,'ATIVO',NULL,'2026-03-08 18:18:02','2026-03-08 18:18:02',NULL),(13,'ALUNO','Aluno G','alunog@onstude.com','2001-02-20','$2b$10$.gunZsqXyJswxmThQOIi6erAsx/5k1v2FZuD0ihiZpSgIgVjWnPRa','71983995289','Camaçari','BA',NULL,'ATIVO',NULL,'2026-03-08 18:18:27','2026-03-08 18:18:27',NULL),(14,'ALUNO','Aluno H','alunoh@onstude.com','2001-02-20','$2b$10$A2EIslTuwFHz7AWmpkoiH.xPX.GE7/ebTk/mANRdnAq6fxRuLQgWa','71983995289','Camaçari','BA',NULL,'ATIVO',NULL,'2026-03-08 18:19:44','2026-03-28 17:44:49','2026-03-28 17:44:49');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-30  6:31:25
