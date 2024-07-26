CREATE TABLE PostLikes (
  post_id INT,
  user_id INT,
  PRIMARY KEY (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES Posts(id),
  FOREIGN KEY (user_id) REFERENCES AccountUser(id)
);



ALTER TABLE PostLikes
ADD CONSTRAINT FK_PostLikes_Posts
FOREIGN KEY (post_id) REFERENCES Posts(id)
ON DELETE CASCADE;

CREATE TABLE Comments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    postId INT,
    userId INT,
    username NVARCHAR(255),
    comment NVARCHAR(MAX),
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (postId) REFERENCES Posts(id),
    FOREIGN KEY (userId) REFERENCES AccountUser(id)
);



CREATE TABLE posts (
    id int PRIMARY KEY,
    title varchar(255),
    category varchar(50),
    message text,
	username NVARCHAR(255),
	likes INT DEFAULT 0

);

INSERT INTO posts (title, category, content, message)
VALUES ('Played Basketball', 'General', NULL, 'was very fun');


-- Table for storing questions
CREATE TABLE quiz_questions (
    question_id INT PRIMARY KEY,
    question_text TEXT
);

-- Table for storing answers
CREATE TABLE quiz_answers (
    answer_id INT PRIMARY KEY,
    question_id INT,
    answer_text TEXT,
    is_correct BIT,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(question_id)
);

INSERT INTO quiz_questions (question_id, question_text) VALUES
(1, 'Which nutrient is the body’s primary source of energy?'),
(2, ' What is the main function of proteins in the body?'),
(3, 'Which of the following is a good source of dietary fiber?');

INSERT INTO quiz_answers (answer_id, question_id, answer_text, is_correct) VALUES
(1, 1, 'Carbohydrates', 1),
(2, 1, 'Protein', 0),
(3, 1, 'Fats', 0);

INSERT INTO quiz_answers (answer_id, question_id, answer_text, is_correct) VALUES
(4, 3, 'White Bread', 0),
(5, 3, 'Oatmeal', 1),
(6, 3, 'White Rice', 0)

INSERT INTO quiz_answers (answer_id, question_id, answer_text, is_correct) VALUES
(7, 2, ' Building and repairing body tissues', 1),
(8, 2, 'Providing energy', 0),
(9, 2, 'Enhancing cognitive function', 0)

