import AdminAccountDesktopTable from "@/Components/Admin/AdminAccountDesktopTable";
import AdminAccountMobileList from "@/Components/Admin/AdminAccountMobileList";

export default function AdminAccountPage({
    accounts,
    expandedAccountId,
    onToggle,
    onEdit,
    onDelete,
}) {
    return (
        <div>
            <div className="md:hidden">
                <AdminAccountMobileList
                    accounts={accounts}
                    expandedAccountId={expandedAccountId}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>

            <div className="hidden md:block">
                <AdminAccountDesktopTable
                    accounts={accounts}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
}
