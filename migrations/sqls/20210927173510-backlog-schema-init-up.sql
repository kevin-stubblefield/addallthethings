CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(60) NOT NULL DEFAULT '',
	password_hash TEXT NOT NULL DEFAULT '',
	email VARCHAR(120) NOT NULL DEFAULT '',
	discord_username VARCHAR(40) NOT NULL,
	discord_discriminator VARCHAR(6) NOT NULL,
	discord_tag VARCHAR(46) NOT NULL,
	discord_user_id VARCHAR(25) NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE backlogs (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL DEFAULT 'New Backlog',
	description TEXT NOT NULL DEFAULT '',
	user_id INTEGER NOT NULL,
	category INTEGER NOT NULL DEFAULT 0,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_user
		FOREIGN KEY (user_id)
			REFERENCES users(id)
			ON DELETE CASCADE
);

CREATE TABLE media_types (
	id SERIAL PRIMARY KEY,
	type_label VARCHAR(50) NOT NULL UNIQUE,
	is_global BOOLEAN NOT NULL DEFAULT FALSE,
	created_by INTEGER NOT NULL,
	CONSTRAINT fk_user
		FOREIGN KEY (created_by)
			REFERENCES users(id)
			ON DELETE CASCADE
);

CREATE TABLE media (
	id SERIAL PRIMARY KEY,
	source_name VARCHAR(50) NOT NULL,
	source_api_title VARCHAR(100) NOT NULL,
	source_api_url TEXT NOT NULL DEFAULT '',
	source_api_id TEXT NOT NULL,
	source_webpage_url TEXT NOT NULL DEFAULT '',
	type_id INTEGER NOT NULL,
	UNIQUE (source_name, source_api_id),
	CONSTRAINT fk_media_type
		FOREIGN KEY (type_id)
			REFERENCES media_types(id)
			ON DELETE SET NULL
);

CREATE TABLE backlog_entries (
	id SERIAL PRIMARY KEY,
	backlog_id INTEGER NOT NULL,
	media_id INTEGER NOT NULL,
	status INTEGER NOT NULL DEFAULT 0,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_backlog
		FOREIGN KEY (backlog_id)
			REFERENCES backlogs(id)
			ON DELETE CASCADE,
	CONSTRAINT fk_media
		FOREIGN KEY (media_id)
			REFERENCES media(id)
			ON DELETE CASCADE
);

-- CREATE DEFAULT ENTRIES
INSERT INTO users(username, discord_username, discord_discriminator, discord_tag, discord_user_id) VALUES ('Winterfresh', 'Winterfresh92', '0961', 'Winterfresh92#0961', '313060065181433867');
INSERT INTO media_types(type_label, is_global, created_by) VALUES ('Game', TRUE, 1), ('TV Show', TRUE, 1), ('Movie', TRUE, 1), ('Anime', TRUE, 1);