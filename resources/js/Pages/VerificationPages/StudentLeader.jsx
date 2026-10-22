import AccountManagementPage from '../SL-Admin/AccountManagementPage';

export default function StudentLeader({ students, profile }) {
    return (
        <AccountManagementPage
            title="Student Leader"
            accountView="SL View"
            allowedRoles={['Student']}
            students={students}
            profile={profile}
            readOnlyDetails
        />
    );
}
