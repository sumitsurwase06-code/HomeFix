USE homefix_db;

SET @drop_legacy_active = IF(
	EXISTS (
		SELECT 1
		FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = DATABASE()
		  AND TABLE_NAME = 'users'
		  AND COLUMN_NAME = 'active'
	),
	'ALTER TABLE users DROP COLUMN active',
	'SELECT 1'
);

PREPARE drop_legacy_active_statement FROM @drop_legacy_active;
EXECUTE drop_legacy_active_statement;
DEALLOCATE PREPARE drop_legacy_active_statement;