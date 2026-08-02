import AccountManagementPage from '../SL-Admin/AccountManagementPage';

export default function CoreAdmin() {
    return (
        <AccountManagementPage
            title="Core Admin"
            accountView="Core View"
            allowedRoles={['Student', 'Student Leader', 'Regional Admin']}
        />
    );
}
