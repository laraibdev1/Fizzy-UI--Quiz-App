import sqlite3
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the absolute path to the directory containing this script
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'quiz.db')

def create_connection():
    """ Establish a connection to the SQLite database. """
    try:
        connection = sqlite3.connect(DB_PATH)
        logger.info(f"Successfully connected to the database at {DB_PATH}")
        return connection
    except sqlite3.Error as e:
        logger.error(f"Error connecting to database: {e}")
        return None

def initialize_database():
    """ Initialize the database schema and insert sample data. """
    connection = create_connection()
    if connection is None:
        logger.error("Database connection failed. Exiting...")
        return

    try:
        # Read and execute the schema.sql file to create tables
        with open('schema.sql') as f:
            connection.executescript(f.read())
        logger.info("Database schema created successfully.")
        
        # Insert sample questions into the database
        insert_sample_questions(connection)
    except sqlite3.Error as e:
        logger.error(f"Database error during initialization: {e}")
    finally:
        connection.commit()
        connection.close()
        logger.info(f"Database initialization completed at {DB_PATH}")

def insert_sample_questions(connection):
    """ Insert sample questions into the questions table. """
    questions = [
        ('What is the capital of France?', 'Paris', 'London,Berlin,Madrid', 'geography', 'easy'),
        ('Who painted the Mona Lisa?', 'Leonardo da Vinci', 'Pablo Picasso,Vincent van Gogh,Michelangelo', 'history', 'medium'),
        ('What is the chemical symbol for gold?', 'Au', 'Ag,Fe,Cu', 'science', 'easy'),
        ('Which planet is known as the Red Planet?', 'Mars', 'Venus,Jupiter,Saturn', 'science', 'easy'),
        ('What is the largest ocean on Earth?', 'Pacific Ocean', 'Atlantic Ocean,Indian Ocean,Arctic Ocean', 'geography', 'medium'),
        ('Who wrote "Romeo and Juliet"?', 'William Shakespeare', 'Charles Dickens,Jane Austen,Mark Twain', 'entertainment', 'medium'),
        ('What is the capital of Japan?', 'Tokyo', 'Kyoto,Osaka,Seoul', 'geography', 'easy'),
        ('Which element has the atomic number 1?', 'Hydrogen', 'Helium,Carbon,Oxygen', 'science', 'medium'),
        ('Who was the first President of the United States?', 'George Washington', 'Thomas Jefferson,Abraham Lincoln,John Adams', 'history', 'easy'),
        ('What is the largest planet in our solar system?', 'Jupiter', 'Saturn,Neptune,Uranus', 'science', 'easy'),
        ('What is the smallest prime number?', '2', '1,3,5', 'mathematics', 'easy'),
        ('Who developed the theory of relativity?', 'Albert Einstein', 'Isaac Newton,Stephen Hawking,Niels Bohr', 'science', 'medium'),
        ('What is the capital of Australia?', 'Canberra', 'Sydney,Melbourne,Perth', 'geography', 'medium'),
        ('Who wrote "To Kill a Mockingbird"?', 'Harper Lee', 'Ernest Hemingway,F. Scott Fitzgerald,John Steinbeck', 'entertainment', 'medium'),
        ('What is the largest mammal in the world?', 'Blue Whale', 'African Elephant,Giraffe,Hippopotamus', 'science', 'easy'),
        ('What is the square root of 256?', '16', '14,18,20', 'mathematics', 'hard'),  # Hard question
        ('What is the derivative of x^2?', '2x', 'x,x^3,2x^2', 'mathematics', 'hard'),  # Hard question
        ('Who is known as the father of quantum mechanics?', 'Max Planck', 'Albert Einstein,Niels Bohr,Werner Heisenberg', 'science', 'hard')  # Hard question
    ]

    try:
        cur = connection.cursor()
        cur.executemany('''
            INSERT INTO questions (question, correct_answer, options, category, difficulty)
            VALUES (?, ?, ?, ?, ?)
        ''', questions)
        logger.info(f"{len(questions)} sample questions inserted successfully.")
    except sqlite3.Error as e:
        logger.error(f"Error inserting sample questions: {e}")

if __name__ == '__main__':
    initialize_database()
