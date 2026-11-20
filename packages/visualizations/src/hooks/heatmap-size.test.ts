import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heatmapCellSize, heatmapHeight } from './useHeatmap';

test('caps at the max cell size when width allows more', () => {
  assert.equal(heatmapCellSize(1200, 5), 35);
});

test('maxHeight bounds the cell size', () => {
  assert.equal(heatmapCellSize(1200, 5, 200), (200 - 120) / 12);
  assert.equal(heatmapHeight(heatmapCellSize(1200, 5, 200)), 200);
});

test('width wins when it is the smaller bound', () => {
  assert.equal(heatmapCellSize(300, 10), (300 - 120) / 10);
});

test('never goes below 4', () => {
  assert.equal(heatmapCellSize(1200, 5, 100), 4);
});
