-- English column name (was German 'land'); kept as a separate migration
-- because 0001 may already be applied to existing databases.
ALTER TABLE leads RENAME COLUMN land TO country;
