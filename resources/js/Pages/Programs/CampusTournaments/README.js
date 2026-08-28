/**
 * Campus Tournament — view map (legacy MSL-1 URLs)
 *
 * | View            | Who                         | Route                              | Page file            |
 * |-----------------|-----------------------------|------------------------------------|----------------------|
 * | Entry           | Role redirect               | /campus-tournament                 | → /Tournament/SL     |
 * | SL Manage       | Student Leaders             | /Tournament/SL                     | SlView.jsx           |
 * | Regional Admin  | Regional / Super Admin      | /Tournament/RegionalAdmin          | SlView.jsx (temp)    |
 * | Public          | Public / testing            | /campus-tournament/public          | SlView.jsx           |
 * | Organizer       | School organizers (new)     | /Tournament/Organizer              | OrganizerView.jsx    |
 * | Captain Hub     | Team captains / players     | /Tournament/CampusTournament       | CaptainHub.jsx       |
 * | Team Register   | Captains creating a team    | /Tournament/CampusTournamentReg    | CaptainRegister.jsx  |
 * | Team Mgmt       | Captains managing roster    | /Tournament/CampusTournamentTeam   | CaptainTeam.jsx      |
 * | Solo MM         | Solo player matchmaking     | /Tournament/SoloPlayer             | SoloMatchmaking.jsx  |
 * | Member          | Invited roster members      | /Tournament/MemberInvite           | MemberInvite.jsx     |
 * | Join Code       | Members entering team code  | /Tournament/MemberJoin             | MemberJoinCode.jsx   |
 *
 * Compatibility redirects (old rebuild paths → legacy URLs):
 *   /programs/campus-tournaments → /Tournament/Organizer
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
