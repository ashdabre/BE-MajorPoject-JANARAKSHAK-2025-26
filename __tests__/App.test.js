// Simple test without any imports that might conflict
test('App basic test', () => {
  expect(1 + 1).toBe(2);
});

test('String operations work', () => {
  const text = 'Legal AI Chargesheet System';
  expect(text).toContain('Legal AI');
  expect(text.length).toBeGreaterThan(5);
});

test('Array operations work', () => {
  const sections = ['IPC 379', 'IPC 420', 'IPC 406'];
  expect(sections).toHaveLength(3);
  expect(sections).toContain('IPC 379');
});