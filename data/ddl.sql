-- 외래키 제약조건 OFF
SET FOREIGN_KEY_CHECKS = 0;

-- player
DROP TABLE IF EXISTS player;
CREATE TABLE player (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birthdate DATE,
    car_regi_no VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- team
DROP TABLE IF EXISTS team;
CREATE TABLE team (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- teammate
DROP TABLE IF EXISTS teammate;
CREATE TABLE teammate (
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, player_id),
    FOREIGN KEY (team_id) REFERENCES team(team_id),
    FOREIGN KEY (player_id) REFERENCES player(player_id)
);

-- matches
DROP TABLE IF EXISTS matches;
CREATE TABLE matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    match_datetime DATETIME NOT NULL,
    match_type ENUM('internal', 'friendly') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- match_team
DROP TABLE IF EXISTS match_team;
CREATE TABLE match_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    is_home BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (team_id) REFERENCES team(team_id),
    UNIQUE KEY unique_match_team (match_id, team_id)
);

-- stats
DROP TABLE IF EXISTS stats;
CREATE TABLE stats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    quarter INT CHECK (quarter BETWEEN 1 AND 4),
    type ENUM('goal', 'assist', 'semi assist', 'no show', 'GK', 'referee', 'assistance referee', 'og') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (team_id) REFERENCES team(team_id),
    FOREIGN KEY (player_id) REFERENCES player(player_id)
);

-- 외래키 제약조건 다시 ON
SET FOREIGN_KEY_CHECKS = 1;
