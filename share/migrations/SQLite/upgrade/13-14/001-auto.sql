-- Convert schema 'share/migrations/_source/deploy/13/001-auto.yml' to 'share/migrations/_source/deploy/14/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE state_worker (
  hostname varchar(256) NOT NULL,
  last_seen integer NOT NULL,
  last_update integer NOT NULL,
  info text NOT NULL,
  PRIMARY KEY (hostname)
);

;

COMMIT;

