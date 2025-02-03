-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Difficulty Levels Table
CREATE TABLE IF NOT EXISTS difficulty_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT NOT NULL CHECK(level IN ('easy', 'medium', 'hard')) UNIQUE
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    difficulty_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (difficulty_id) REFERENCES difficulty_levels(id)
);
