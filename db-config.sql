CREATE DATABASE IF NOT EXISTS `onstude` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `onstude`;

-- 1. Tabelas Base (Sem chaves estrangeiras)
DROP TABLE IF EXISTS `usuarios`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `usuarios` (`id`, `tipo`, `nome`, `email`, `data_nascimento`, `senha_hash`, `telefone`, `cidade`, `estado`, `foto_perfil_url`, `status`, `ultimo_acesso_em`, `criado_em`, `atualizado_em`, `ultimo_acesso`) 
VALUES (1,'ADMIN','David Silva','admin@onstude.com','1997-04-23','$2b$10$ZsWg6j/Y5V5XJsVh8cFrz.3gWXyTOkGjrBdby.U.XhO9PCQaJrtQO','11999999999','Camaçari','BA','/img/perfil/perfil-1772982303626-493047785.png','ATIVO','2026-03-08 18:54:43','2026-03-08 10:27:14','2026-03-09 21:01:53','2026-03-09 21:01:53');

-- 2. Tabelas Nível 1 (Dependem de usuários)
DROP TABLE IF EXISTS `admin_logs`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cursos`;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_unico` (`codigo_unico`),
  KEY `fk_cursos_admin` (`criado_por_admin_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_cursos_admin` FOREIGN KEY (`criado_por_admin_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `notificacoes`;
CREATE TABLE `notificacoes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensagem` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagem_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_alvo` enum('TODOS','CURSO_ESPECIFICO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `criada_por_admin_id` bigint NOT NULL,
  `data_inicio` datetime DEFAULT NULL,
  `data_fim` datetime DEFAULT NULL,
  `agendar_para` datetime DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_interacao` enum('NENHUM','PESQUISA_TEXTO','AVALIACAO_ESTRELAS') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notificacoes_admin` (`criada_por_admin_id`),
  CONSTRAINT `fk_notificacoes_admin` FOREIGN KEY (`criada_por_admin_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabelas Nível 2 (Dependem de cursos e/ou notificações)
DROP TABLE IF EXISTS `admin_metricas_concluintes`;
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

DROP TABLE IF EXISTS `matriculas`;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_aluno_curso` (`aluno_id`,`curso_id`),
  KEY `idx_aluno` (`aluno_id`),
  KEY `idx_curso` (`curso_id`),
  CONSTRAINT `fk_matriculas_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_matriculas_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `modulos`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `notificacao_cursos`;
CREATE TABLE `notificacao_cursos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notificacao_id` bigint NOT NULL,
  `curso_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_notificacao_curso` (`notificacao_id`,`curso_id`),
  KEY `fk_not_cursos_curso` (`curso_id`),
  CONSTRAINT `fk_not_cursos_curso` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_not_cursos_notificacao` FOREIGN KEY (`notificacao_id`) REFERENCES `notificacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `notificacao_entregas`;
CREATE TABLE `notificacao_entregas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notificacao_id` bigint NOT NULL,
  `aluno_id` bigint NOT NULL,
  `status` enum('PENDENTE','ENVIADA','LIDA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDENTE',
  `enviada_em` datetime DEFAULT NULL,
  `lida_em` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_notificacao_aluno` (`notificacao_id`,`aluno_id`),
  KEY `fk_not_entregas_aluno` (`aluno_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_not_entregas_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_not_entregas_notificacao` FOREIGN KEY (`notificacao_id`) REFERENCES `notificacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `notificacao_respostas`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabelas Nível 3 (Dependem de módulos ou matrículas)
DROP TABLE IF EXISTS `aulas`;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_modulo_ordem` (`modulo_id`,`ordem`),
  CONSTRAINT `fk_aulas_modulo` FOREIGN KEY (`modulo_id`) REFERENCES `modulos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `certificados`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `progresso_curso`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `progresso_modulo`;
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

-- 5. Tabelas Nível 4 (Dependem de aulas)
DROP TABLE IF EXISTS `apostila_imagens`;
CREATE TABLE `apostila_imagens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aula_id` bigint NOT NULL,
  `imagem_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ordem` int NOT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_aula_ordem` (`aula_id`,`ordem`),
  CONSTRAINT `fk_apostila_aula` FOREIGN KEY (`aula_id`) REFERENCES `aulas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `aula_conteudos`;
CREATE TABLE `aula_conteudos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aula_id` bigint NOT NULL,
  `video_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avaliacao_json_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avaliacao_json` json DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `aula_id` (`aula_id`),
  CONSTRAINT `fk_conteudos_aula` FOREIGN KEY (`aula_id`) REFERENCES `aulas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `avaliacao_tentativas`;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `progresso_aula`;
CREATE TABLE `progresso_aula` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `matricula_id` bigint NOT NULL,
  `aula_id` bigint NOT NULL,
  `status` enum('NAO_INICIADA','EM_ANDAMENTO','CONCLUIDA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NAO_INICIADA',
  `progresso_percentual` decimal(5,2) DEFAULT '0.00',
  `ultima_interacao_em` datetime DEFAULT NULL,
  `concluida_em` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_matricula_aula` (`matricula_id`,`aula_id`),
  KEY `fk_prog_aula_aula` (`aula_id`),
  CONSTRAINT `fk_prog_aula_aula` FOREIGN KEY (`aula_id`) REFERENCES `aulas` (`id`),
  CONSTRAINT `fk_prog_aula_matricula` FOREIGN KEY (`matricula_id`) REFERENCES `matriculas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;