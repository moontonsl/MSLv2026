/**
 * Campus Tournament — view map (legacy MSL-1 URLs)
 *
 * | View            | Who                         | Route                              | Page file            |
 * |-----------------|-----------------------------|------------------------------------|----------------------|
 * | Entry           | Role redirect               | /campus-tournament                 | → role-specific page |
 * | SL Manage       | Student Leaders             | /Tournament/SL                     | SlView.jsx           |
 * | Regional Admin  | Regional / Super Admin      | /Tournament/RegionalAdmin          | RaView.jsx           |
 * | Public          | Public / testing            | /campus-tournament/public          | SlView.jsx           |
 * | Organizer       | Student Leaders             | /Tournament/Organizer              | OrganizerView.jsx    |
 * | Captain Hub     | Team captains / players     | /Tournament/CampusTournament       | CaptainHub.jsx       |
 * | Team Register   | Captains creating a team    | /Tournament/CampusTournamentReg    | CaptainRegister.jsx  |
 * | Team Mgmt       | Captains managing roster    | /Tournament/CampusTournamentTeam   | CaptainTeam.jsx      |
 * | Solo MM         | Solo player matchmaking     | /Tournament/SoloPlayer             | SoloMatchmaking.jsx  |
 * | Member          | Invited roster members      | Hub modal (Team Invitations)       | CaptainHub.jsx + TeamInvitationsModal.jsx |
 * | Member Team     | Accepted roster members     | /Tournament/MemberTeam             | MemberTeam.jsx       |
 * | Join Team       | Join assembling open slot   | /Tournament/MemberJoin             | MemberJoinCode.jsx   |
 *
 * Compatibility redirects (old rebuild paths → legacy URLs):
 *   /programs/campus-tournaments → /campus-tournament
 *   /programs/campus-tournaments/sl → /Tournament/SL
 *   /programs/campus-tournaments/captain → /Tournament/CampusTournament
 *   /programs/campus-tournaments/captain/register → /Tournament/CampusTournamentReg
 *   /programs/campus-tournaments/captain/team → /Tournament/CampusTournamentTeam
 *   /programs/campus-tournaments/solo|.../join → /Tournament/SoloPlayer
 *   /programs/campus-tournaments/member → /Tournament/MemberInvite
 *   /programs/campus-tournaments/member/join → /Tournament/MemberJoin
 *
 * Related (already exist elsewhere — not CT-specific pages):
 *   Login        → /login
 *   Sign up      → /register/shs | /register/college
 *   Profile      → /studentportal
 */

export {};
