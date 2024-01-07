CREATE TABLE users (
	id VARCHAR,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,

  PRIMARY KEY(id)
);

CREATE TABLE users_data (
	user_id VARCHAR,
  info TEXT NOT NULL,
  info_hash TEXT NOT NULL,
	created_on TIMESTAMP NOT NULL,

  PRIMARY KEY(user_id),

  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES users(id)
);