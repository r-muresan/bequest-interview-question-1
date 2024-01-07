CREATE TABLE users_data_history (
	id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  info TEXT NOT NULL,
  info_hash TEXT NOT NULL,
	created_on TIMESTAMP NOT NULL
);