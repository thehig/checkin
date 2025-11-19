-- Sample seed data for testing

-- Insert default wellness axes (Mental, Physical, Emotional)
-- Note: Replace the user_id with your actual user ID from Supabase Auth
INSERT INTO axes (user_id, name, description, icon, sort_order) VALUES
  ('USER_ID_PLACEHOLDER', 'Mental', 'Mental well-being and clarity', '🧠', 1),
  ('USER_ID_PLACEHOLDER', 'Physical', 'Physical health and energy', '💪', 2),
  ('USER_ID_PLACEHOLDER', 'Emotional', 'Emotional state and mood', '❤️', 3);

-- Insert sample topics
INSERT INTO topics (user_id, name, description, icon, color, is_wellness_check, sort_order) VALUES
  ('USER_ID_PLACEHOLDER', 'Wellness Check', 'Quick check-in on overall wellbeing', '✨', '#6366f1', TRUE, 1),
  ('USER_ID_PLACEHOLDER', 'Wake Up', 'Morning wake up time', '🌅', '#f59e0b', FALSE, 2),
  ('USER_ID_PLACEHOLDER', 'ADHD Meds', 'Take ADHD medication', '💊', '#ef4444', FALSE, 3),
  ('USER_ID_PLACEHOLDER', 'Breakfast', 'Morning meal', '🍳', '#10b981', FALSE, 4),
  ('USER_ID_PLACEHOLDER', 'Bathroom', 'Bathroom visit', '🚽', '#8b5cf6', FALSE, 5);

-- Link axes to topics
-- Get the IDs first, then create relationships
-- Wellness Check uses Mental, Physical, Emotional
-- Breakfast uses custom axes (Protein, Fiber)
-- This is just a template - actual implementation would be done through the app
