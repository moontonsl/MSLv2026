import AccountManagementPage from '../SL-Admin/AccountManagementPage';

export default function StudentLeader() {
    return (
        <AccountManagementPage
            title="Student Leader"
            accountView="SL View"
            allowedRoles={['Student']}
        />
    );
}
