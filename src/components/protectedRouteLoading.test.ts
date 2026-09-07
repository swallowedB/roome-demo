import assert from 'node:assert/strict';
import test from 'node:test';
import { getProtectedRouteLoadingState } from './protectedRouteLoading';

test('skips a blocking loading screen while the demo session initializes', () => {
  assert.equal(getProtectedRouteLoadingState(true, true), 'hidden');
});

test('uses delayed loading while the service session initializes', () => {
  assert.equal(getProtectedRouteLoadingState(false, true), 'delayed');
});

test('renders route content after initialization completes', () => {
  assert.equal(getProtectedRouteLoadingState(false, false), 'ready');
});
