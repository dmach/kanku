-- Convert schema '/home/frank/github/kanku/share/migrations/_source/deploy/16/001-auto.yml' to '/home/frank/github/kanku/share/migrations/_source/deploy/17/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE "job_wait_for" (
  "job_id" integer NOT NULL,
  "wait_for_job_id" integer NOT NULL,
  PRIMARY KEY ("job_id", "wait_for_job_id"),
  FOREIGN KEY ("wait_for_job_id") REFERENCES "job_history"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("job_id") REFERENCES "job_history"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

;
CREATE INDEX "job_wait_for_idx_wait_for_job_id" ON "job_wait_for" ("wait_for_job_id");

;
CREATE INDEX "job_wait_for_idx_job_id" ON "job_wait_for" ("job_id");

;

COMMIT;

