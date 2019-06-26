-- Convert schema 'share/migrations/_source/deploy/13/001-auto.yml' to 'share/migrations/_source/deploy/12/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE wstoken (
  user_id integer NOT NULL,
  auth_token varchar(32) NOT NULL,
  PRIMARY KEY (auth_token),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

;
CREATE INDEX wstoken_idx_user_id ON wstoken (user_id);

INSERT INTO wstoken SELECT * FROM ws_token;

;
DROP TABLE ws_token;

;

COMMIT;

