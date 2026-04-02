CREATE DATABASE IF NOT EXISTS `onstude` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `onstude`;

-- ==============================================================================
-- 1. TABELAS INDEPENDENTES (Sem Foreign Keys)
-- ==============================================================================

CREATE TABLE `curriculo_modelos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capa_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `arquivo_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- ==============================================================================
-- 2. TABELAS DEPENDENTES - NÍVEL 1 (Dependem apenas das tabelas independentes)
-- ==============================================================================

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

CREATE TABLE `aluno_conquistas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` bigint NOT NULL,
  `conquista_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_desbloqueio` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_conquista` (`aluno_id`,`conquista_id`),
  CONSTRAINT `aluno_conquistas_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` bigint NOT NULL,
  `mp_preference_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mp_payment_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('PENDENTE','APROVADO','RECUSADO','CANCELADO') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDENTE',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `aluno_id` (`aluno_id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- 3. TABELAS DEPENDENTES - NÍVEL 2
-- ==============================================================================

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

CREATE TABLE `carrinho_itens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` bigint NOT NULL,
  `curso_id` bigint NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_aluno_curso` (`aluno_id`,`curso_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `carrinho_itens_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carrinho_itens_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `favoritos` (
  `aluno_id` bigint NOT NULL,
  `curso_id` bigint NOT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aluno_id`,`curso_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE `pedido_itens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `curso_id` bigint NOT NULL,
  `preco_pago` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `pedido_itens_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedido_itens_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 4. TABELAS DEPENDENTES - NÍVEL 3
-- ==============================================================================

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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


-- ==============================================================================
-- 5. TABELAS DEPENDENTES - NÍVEL 4
-- ==============================================================================

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 6. INSERTS (Somente Admin)
-- ==============================================================================

INSERT INTO `usuarios` (`id`, `tipo`, `nome`, `email`, `data_nascimento`, `senha_hash`, `telefone`, `cidade`, `estado`, `foto_perfil_url`, `status`, `ultimo_acesso_em`, `criado_em`, `atualizado_em`, `ultimo_acesso`) VALUES 
(1, 'ADMIN', 'David Silva', 'admin@onstude.com', '1997-04-23', '$2b$10$ZsWg6j/Y5V5XJsVh8cFrz.3gWXyTOkGjrBdby.U.XhO9PCQaJrtQO', '11999999999', 'Camaçari', 'BA', '/img/perfil/perfil-1772982303626-493047785.png', 'ATIVO', '2026-03-08 18:54:43', '2026-03-08 10:27:14', '2026-03-30 22:33:39', '2026-03-30 22:33:39');