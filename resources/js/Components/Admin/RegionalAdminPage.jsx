import RegionalAdminDesktopTable from "@/Components/Admin/RegionalAdminDesktopTable";
import RegionalAdminMobileList from "@/Components/Admin/RegionalAdminMobileList";

export default function RegionalAdminPage({
    regionalAdmins,
    isActive = true,
    expandedRegionalAdminId,
    onToggle,
    onEdit,
    onDelete,
}) {
    return (
        <div aria-hidden={!isActive}>
            <div className="xl:hidden">
                <RegionalAdminMobileList
                    regionalAdmins={regionalAdmins}
                    expandedRegionalAdminId={expandedRegionalAdminId}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>

            <div className="hidden xl:block">
                <RegionalAdminDesktopTable
                    regionalAdmins={regionalAdmins}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
}
