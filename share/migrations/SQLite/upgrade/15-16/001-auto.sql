-- Convert schema '/home/frank/git/kanku/share/migrations/_source/deploy/15/001-auto.yml' to '/home/frank/git/kanku/share/migrations/_source/deploy/16/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE image_download_history ADD COLUMN project text;

;
ALTER TABLE image_download_history ADD COLUMN package text;

;
ALTER TABLE image_download_history ADD COLUMN repository text;

;
ALTER TABLE image_download_history ADD COLUMN arch text;

;

COMMIT;

