-- 외래키 제약조건 OFF
SET FOREIGN_KEY_CHECKS = 0;

-- 모든 테이블 TRUNCATE
TRUNCATE TABLE stats;
TRUNCATE TABLE match_team;
TRUNCATE TABLE matches;
TRUNCATE TABLE teammate;
TRUNCATE TABLE team;
TRUNCATE TABLE player;

-- 외래키 제약조건 다시 ON
SET FOREIGN_KEY_CHECKS = 1;

-- 확인
SELECT 'player' as table_name, COUNT(*) as count FROM player
UNION ALL
SELECT 'team', COUNT(*) FROM team
UNION ALL
SELECT 'teammate', COUNT(*) FROM teammate
UNION ALL
SELECT 'matches', COUNT(*) FROM matches
UNION ALL
SELECT 'match_team', COUNT(*) FROM match_team
UNION ALL
SELECT 'stats', COUNT(*) FROM stats;