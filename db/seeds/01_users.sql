
INSERT INTO list (id, title)
VALUES
  ('list-1', 'ToDo'),
  ('list-2', 'Doing');

INSERT INTO task (id, content, list_id)
VALUES
  ('task-1', 'Pick up ingredients for dinner', 'list-1'),
  ('task-2', 'Take the trash out', 'list-1'),
  ('task-3', 'Walk the dog', 'list-2');

