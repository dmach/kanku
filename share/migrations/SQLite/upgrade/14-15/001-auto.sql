-- Convert schema 'share/migrations/_source/deploy/14/001-auto.yml' to 'share/migrations/_source/deploy/15/001-auto.yml':;

;
BEGIN;

;
CREATE UNIQUE INDEX user_username ON user (username);

;

COMMIT;

