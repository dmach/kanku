-- Convert schema 'share/migrations/_source/deploy/12/001-auto.yml' to 'share/migrations/_source/deploy/13/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE ws_token (
  user_id integer NOT NULL,
  auth_token varchar(32) NOT NULL,
  PRIMARY KEY (auth_token),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

;
CREATE INDEX ws_token_idx_user_id ON ws_token (user_id);

INSERT INTO ws_token SELECT * FROM wstoken;

;
DROP TABLE wstoken;

;

COMMIT;

