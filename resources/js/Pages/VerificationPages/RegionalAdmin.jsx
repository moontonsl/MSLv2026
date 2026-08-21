import AccountManagementPage from '../SL-Admin/AccountManagementPage';

export default function RegionalAdmin({ students, profile }) {
    return (
        <AccountManagementPage
            title="Regional Admin"
            accountView="Regional View"
            allowedRoles={['Student', 'Student Leader']}
            students={students}
            profile={profile}
            backgroundRoute={route('regional.admin.background')}
        />
    );
}
