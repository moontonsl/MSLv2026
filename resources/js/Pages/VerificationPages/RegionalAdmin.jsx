import AccountManagementPage from '../SL-Admin/AccountManagementPage';

export default function RegionalAdmin() {
    return (
        <AccountManagementPage
            title="Regional Admin"
            accountView="Regional View"
            allowedRoles={['Student', 'Student Leader']}
        />
    );
}
