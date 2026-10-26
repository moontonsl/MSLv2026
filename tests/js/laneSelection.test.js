import assert from 'node:assert/strict';
import test from 'node:test';
import { isLaneTakenByAnotherPlayer } from '../../resources/js/Pages/Programs/CampusTournaments/laneSelection.js';

const members = [
    { intended_lane_role_code: 'roam' },
    { intended_lane_role_code: 'gold_laner' },
    { intended_lane_role_code: '' },
    { intended_lane_role_code: '' },
];

test('captain cannot select a lane already assigned to a member', () => {
    assert.equal(isLaneTakenByAnotherPlayer('roam', 'jungler', members), true);
    assert.equal(isLaneTakenByAnotherPlayer('jungler', 'jungler', members), false);
});

test('members cannot select the captain or another member lane', () => {
    assert.equal(isLaneTakenByAnotherPlayer('jungler', 'jungler', members, 0), true);
    assert.equal(isLaneTakenByAnotherPlayer('gold_laner', 'jungler', members, 0), true);
    assert.equal(isLaneTakenByAnotherPlayer('roam', 'jungler', members, 0), false);
    assert.equal(isLaneTakenByAnotherPlayer('mid_laner', 'jungler', members, 0), false);
});
