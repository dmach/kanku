-- Convert schema '/home/frank/git/kanku/share/migrations/_source/deploy/16/001-auto.yml' to '/home/frank/git/kanku/share/migrations/_source/deploy/15/001-auto.yml':;

;
BEGIN;

;
CREATE TEMPORARY TABLE image_download_history_temp_alter (
  vm_image_url text NOT NULL,
  vm_image_file text,
  download_time integer,
  etag text,
  PRIMARY KEY (vm_image_url)
);

;
INSERT INTO image_download_history_temp_alter( vm_image_url, vm_image_file, download_time, etag) SELECT vm_image_url, vm_image_file, download_time, etag FROM image_download_history;

;
DROP TABLE image_download_history;

;
CREATE TABLE image_download_history (
  vm_image_url text NOT NULL,
  vm_image_file text,
  download_time integer,
  etag text,
  PRIMARY KEY (vm_image_url)
);

;
INSERT INTO image_download_history SELECT vm_image_url, vm_image_file, download_time, etag FROM image_download_history_temp_alter;

;
DROP TABLE image_download_history_temp_alter;

;

COMMIT;

