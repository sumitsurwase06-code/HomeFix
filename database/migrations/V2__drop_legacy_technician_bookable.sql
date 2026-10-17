USE homefix_db;

SET @drop_legacy_bookable = IF(
    EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'technician_profiles'
          AND COLUMN_NAME = 'publicly_bookable'
    ),
    'ALTER TABLE technician_profiles DROP COLUMN publicly_bookable',
    'SELECT 1'
);

PREPARE drop_legacy_bookable_statement FROM @drop_legacy_bookable;
EXECUTE drop_legacy_bookable_statement;
DEALLOCATE PREPARE drop_legacy_bookable_statement;