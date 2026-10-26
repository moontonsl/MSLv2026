export function isLaneTakenByAnotherPlayer(lane, captainLane, members, memberIndex = null) {
    if (!lane) return false;

    return (memberIndex !== null && captainLane === lane)
        || members.some((member, index) =>
            index !== memberIndex && member.intended_lane_role_code === lane);
}
