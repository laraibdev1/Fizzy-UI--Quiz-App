from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import random
import os
import logging

app = Flask(__name__)
CORS(app)

# Flask Configurations
app.config['DB_PATH'] = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'quiz.db')
app.config['MAX_QUESTIONS'] = 10  # Max number of questions to return

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    """ Establish a connection to the SQLite database. """
    try:
        conn = sqlite3.connect(app.config['DB_PATH'])
        conn.row_factory = sqlite3.Row  # Convert rows to dictionaries
        return conn
    except sqlite3.Error as e:
        logger.error(f"Database connection error: {str(e)}")
        raise  # Re-raise the error for handling in route

def validate_category_and_difficulty(category, difficulty):
    """ Validate category and difficulty values. """
    valid_categories = ['history', 'geography', 'science', 'mathematics', 'entertainment']  # Example valid categories
    valid_difficulties = ['easy', 'medium', 'hard']  # Valid difficulty levels

    if category not in valid_categories:
        return False, "Invalid category"    
    if difficulty not in valid_difficulties:
        return False, "Invalid difficulty"
    
    return True, None

@app.route('/api/questions', methods=['GET'])
def get_questions():
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    
    logger.info(f"Received request for category: {category}, difficulty: {difficulty}")
    
    if not category or not difficulty:
        return jsonify({"error": "Category and difficulty are required"}), 400

    # Validate category and difficulty
    valid, error_message = validate_category_and_difficulty(category, difficulty)
    if not valid:
        return jsonify({"error": error_message}), 400

    try:
        conn = get_db_connection()
        questions = conn.execute('''SELECT * FROM questions WHERE category = ? AND difficulty = ?''', 
                                 (category, difficulty)).fetchall()
        conn.close()

        if not questions:
            logger.warning(f"No questions found for category: {category}, difficulty: {difficulty}")
            return jsonify({"error": "No questions found for the given category and difficulty"}), 404

        # Randomly select up to 10 questions
        selected_questions = random.sample(questions, min(app.config['MAX_QUESTIONS'], len(questions)))
        question_list = [dict(q) for q in selected_questions]
        for q in question_list:
            del q['id']  # Remove the id field before sending the response

        logger.info(f"Returning {len(question_list)} questions")
        return jsonify(question_list)

    except sqlite3.Error as e:
        logger.error(f"Database error: {str(e)}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        conn = get_db_connection()
        categories = conn.execute('SELECT DISTINCT category FROM questions').fetchall()
        conn.close()
        category_list = [category['category'] for category in categories]
        logger.info(f"Returning {len(category_list)} categories")
        return jsonify(category_list)
    except sqlite3.Error as e:
        logger.error(f"Database error: {str(e)}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/difficulties', methods=['GET'])
def get_difficulties():
    try:
        conn = get_db_connection()
        difficulties = conn.execute('SELECT DISTINCT difficulty FROM questions').fetchall()
        conn.close()
        difficulty_list = [difficulty['difficulty'] for difficulty in difficulties]
        logger.info(f"Returning {len(difficulty_list)} difficulties")
        return jsonify(difficulty_list)
    except sqlite3.Error as e:
        logger.error(f"Database error: {str(e)}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.errorhandler(404)
def not_found_error(error):
    logger.error(f"404 error: {str(error)}")
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 error: {str(error)}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
