import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { expect, test } from 'vitest';

function atlas() {
  const element = { addEventListener() {} };
  const context = vm.createContext({
    document: { querySelector: () => element, addEventListener() {} },
    window: { addEventListener() {} },
  });
  const source = readFileSync('public/app.js', 'utf8');
  vm.runInContext(source.slice(0, source.lastIndexOf('init().catch')), context);
  vm.runInContext(
    `
    report = { arms: [{family: 'a'}, {family: 'b'}], analysis: {units: [
      {arm:'a', tag:'one', repetition:1, covered:true, eligibleLabels:2, hitLabels:['x'], published:1, dollars:null},
      {arm:'b', tag:'one', repetition:1, covered:false, eligibleLabels:2, hitLabels:[], published:0},
      {arm:'a', tag:'two', repetition:1, covered:true, eligibleLabels:2, hitLabels:['y'], published:1, dollars:2},
      {arm:'b', tag:'two', repetition:1, covered:true, eligibleLabels:2, hitLabels:['y'], published:1, dollars:3}
    ]}};
    selected = new Set(['a','b']);
  `,
    context,
  );
  return (expression: string): unknown => vm.runInContext(expression, context);
}

test('planned recall includes failed reviews and unknown costs stay unknown', () => {
  const run = atlas();
  expect(run("summaries().find(s=>s.family==='b').recall")).toBe(0.25);
  expect(run("summaries().find(s=>s.family==='a').dollars")).toBeNull();
});

test('shared basis retains only cells completed by every selected lane', () => {
  const run = atlas();
  run("basis='shared'");
  expect(run('rows().length')).toBe(2);
  expect(run("summaries().find(s=>s.family==='b').recall")).toBe(0.5);
  run('selected.clear()');
  expect(run('summaries().length')).toBe(0);
});

test('finding text is escaped and links are restricted to GitHub', () => {
  const run = atlas();
  expect(run("esc('<script>')")).toBe('&lt;script&gt;');
  expect(run("link('javascript:alert(1)')")).toBe('#');
});
