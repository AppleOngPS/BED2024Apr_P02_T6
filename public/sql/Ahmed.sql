--Recipe sql code 


CREATE TABLE recipes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    image VARCHAR(255),
    calories INT NOT NULL,
    carbs INT NOT NULL,
    protein INT NOT NULL,
    fats INT NOT NULL
);

-- Insert sample data
INSERT INTO recipes (name, category, description, ingredients, image, calories, carbs, protein, fats) VALUES
('Grilled Chicken Salad', 'low carb', 'A healthy grilled chicken salad with mixed greens and vinaigrette.', 'Chicken breast, mixed greens, vinaigrette, cherry tomatoes, cucumbers', 'uploads/placeholder.jpg', 350, 10, 30, 15),
('Avocado and Egg Salad', 'low carb', 'A creamy avocado and egg salad perfect for a low carb diet.', 'Avocado, boiled eggs, mayonnaise, salt, pepper, lemon juice', 'uploads/placeholder.jpg', 400, 5, 20, 35),
('Zucchini Noodles with Pesto', 'low carb', 'Zucchini noodles tossed with fresh pesto.', 'Zucchini, basil, garlic, pine nuts, olive oil, parmesan cheese', 'uploads/placeholder.jpg', 250, 10, 8, 20),
('Cauliflower Rice Stir Fry', 'low carb', 'A flavorful stir fry with cauliflower rice and vegetables.', 'Cauliflower, bell peppers, soy sauce, carrots, peas', 'uploads/placeholder.jpg', 200, 15, 5, 5),
('Baked Salmon with Asparagus', 'low carb', 'Oven baked salmon served with asparagus.', 'Salmon fillets, asparagus, olive oil, garlic, lemon', 'uploads/placeholder.jpg', 450, 5, 40, 25),
('Greek Yogurt with Berries', 'low carb', 'Protein-packed Greek yogurt with mixed berries.', 'Greek yogurt, strawberries, blueberries, honey', 'uploads/placeholder.jpg', 200, 25, 10, 5),
('Stuffed Bell Peppers', 'low carb', 'Bell peppers stuffed with ground turkey and vegetables.', 'Bell peppers, ground turkey, onion, garlic, tomatoes', 'uploads/placeholder.jpg', 300, 20, 25, 10),

-- More inserts for other categories
('Veggie Burger', 'vegetarian', 'A delicious veggie burger made with black beans and quinoa.', 'Black beans, quinoa, bread crumbs, onion, garlic, spices', 'uploads/placeholder.jpg', 350, 45, 15, 10),
('Quinoa and Black Bean Salad', 'vegetarian', 'A refreshing salad with quinoa, black beans, and corn.', 'Quinoa, black beans, corn, bell pepper, lime, cilantro', 'uploads/placeholder.jpg', 400, 60, 15, 10),
('Spinach and Feta Stuffed Peppers', 'vegetarian', 'Bell peppers stuffed with spinach and feta cheese.', 'Bell peppers, spinach, feta cheese, olive oil, garlic', 'uploads/placeholder.jpg', 250, 15, 10, 15),
('Eggplant Parmesan', 'vegetarian', 'Breaded eggplant slices baked with marinara sauce and cheese.', 'Eggplant, bread crumbs, marinara sauce, mozzarella cheese', 'uploads/placeholder.jpg', 500, 60, 20, 20),
('Chickpea and Vegetable Curry', 'vegetarian', 'A hearty curry with chickpeas and mixed vegetables.', 'Chickpeas, carrots, potatoes, curry powder, coconut milk', 'uploads/placeholder.jpg', 400, 55, 15, 15),
('Mushroom Risotto', 'vegetarian', 'Creamy risotto with mushrooms and parmesan cheese.', 'Arborio rice, mushrooms, vegetable broth, onion, garlic, parmesan cheese', 'uploads/placeholder.jpg', 600, 70, 15, 20),
('Tofu Stir Fry', 'vegetarian', 'Stir fried tofu with vegetables and a savory sauce.', 'Tofu, bell peppers, soy sauce, broccoli, ginger, garlic', 'uploads/placeholder.jpg', 300, 20, 20, 15),


('Grilled Chicken with Quinoa', 'gluten free', 'Grilled chicken breast served with quinoa and vegetables.', 'Chicken breast, quinoa, broccoli, olive oil, lemon', 'uploads/placeholder.jpg', 450, 40, 35, 20),
('Gluten-Free Pasta with Marinara Sauce', 'gluten free', 'Gluten-free pasta topped with marinara sauce and basil.', 'Gluten-free pasta, marinara sauce, basil, parmesan cheese', 'uploads/placeholder.jpg', 350, 60, 10, 10),
('Baked Sweet Potatoes', 'gluten free', 'Oven baked sweet potatoes with cinnamon and honey.', 'Sweet potatoes, cinnamon, honey, butter', 'uploads/placeholder.jpg', 250, 55, 2, 8),
('Gluten-Free Pancakes', 'gluten free', 'Fluffy gluten-free pancakes with maple syrup.', 'Gluten-free flour, eggs, milk, baking powder, maple syrup', 'uploads/placeholder.jpg', 400, 60, 10, 15),
('Rice Paper Spring Rolls', 'gluten free', 'Fresh spring rolls made with rice paper and vegetables.', 'Rice paper, carrots, cucumber, mint, shrimp, peanut sauce', 'uploads/placeholder.jpg', 200, 30, 10, 5),
('Gluten-Free Pizza', 'gluten free', 'Homemade gluten-free pizza with various toppings.', 'Gluten-free pizza crust, tomato sauce, mozzarella cheese, pepperoni', 'uploads/placeholder.jpg', 600, 70, 25, 25),
('Lentil Soup', 'gluten free', 'Hearty lentil soup with vegetables and spices.', 'Lentils, carrots, celery, onion, garlic, cumin', 'uploads/placeholder.jpg', 300, 45, 15, 10),

('Chicken Rice', 'local', 'Traditional chicken rice with fragrant rice and tender chicken.', 'Chicken, rice, garlic, ginger, soy sauce, cucumbers', 'uploads/placeholder.jpg', 700, 90, 30, 20),
('Laksa', 'local', 'Spicy noodle soup with coconut milk and seafood.', 'Rice noodles, coconut milk, shrimp, fish cakes, laksa paste', 'uploads/placeholder.jpg', 550, 65, 25, 25),
('Satay', 'local', 'Grilled skewers of meat served with peanut sauce.', 'Chicken, beef, or lamb, skewers, peanut sauce, cucumbers, onions', 'uploads/placeholder.jpg', 600, 20, 35, 40),
('Nasi Lemak', 'local', 'Coconut rice served with fried chicken, egg, and sambal.', 'Rice, coconut milk, chicken, egg, sambal, peanuts, anchovies', 'uploads/placeholder.jpg', 800, 90, 35, 40),
('Hokkien Mee', 'local', 'Stir-fried noodles with seafood and a rich broth.', 'Yellow noodles, rice noodles, shrimp, squid, soy sauce, garlic', 'uploads/placeholder.jpg', 650, 85, 20, 30),
('Char Kway Teow', 'local', 'Stir-fried flat rice noodles with eggs, shrimp, and Chinese sausage.', 'Flat rice noodles, shrimp, Chinese sausage, eggs, soy sauce', 'uploads/placeholder.jpg', 700, 90, 25, 35),
('Roti Prata', 'local', 'Flaky flatbread served with curry sauce.', 'Flour, water, ghee, curry sauce', 'uploads/placeholder.jpg', 500, 60, 8, 25),

('Strawberry Banana Smoothie', 'smoothies and shakes', 'A refreshing smoothie made with strawberries and bananas.', 'Strawberries, bananas, yogurt, milk, honey', 'uploads/placeholder.jpg', 300, 50, 10, 5),
('Green Smoothie', 'smoothies and shakes', 'A nutritious smoothie with spinach, kale, and pineapple.', 'Spinach, kale, pineapple, banana, almond milk', 'uploads/placeholder.jpg', 250, 40, 8, 5),
('Mango Lassi', 'smoothies and shakes', 'A creamy yogurt-based drink with mangoes and cardamom.', 'Mangoes, yogurt, milk, sugar, cardamom', 'uploads/placeholder.jpg', 200, 35, 8, 5),
('Chocolate Protein Shake', 'smoothies and shakes', 'A protein-packed shake with chocolate flavor.', 'Protein powder, milk, banana, cocoa powder', 'uploads/placeholder.jpg', 350, 40, 30, 8),
('Berry Blast Smoothie', 'smoothies and shakes', 'A vibrant smoothie with mixed berries and chia seeds.', 'Mixed berries, chia seeds, yogurt, honey', 'uploads/placeholder.jpg', 250, 35, 10, 8),
('Peanut Butter Banana Shake', 'smoothies and shakes', 'A creamy shake with peanut butter and bananas.', 'Peanut butter, bananas, milk, honey, vanilla extract', 'uploads/placeholder.jpg', 400, 45, 12, 20),
('Avocado Smoothie', 'smoothies and shakes', 'A smooth and creamy avocado-based smoothie.', 'Avocado, milk, honey, ice cubes', 'uploads/placeholder.jpg', 300, 30, 5, 20);