import RegionalAdminDesktopTable from "@/Components/Admin/RegionalAdminDesktopTable";
import RegionalAdminMobileList from "@/Components/Admin/RegionalAdminMobileList";

export default function RegionalAdminPage({
    regionalAdmins,
    isActive,
    expandedRegionalAdminId,
    onToggle,
    onEdit,
    onDelete,
}) {
    return (
        <div aria-hidden={!isActive}>
            <div className="md:hidden">
                <RegionalAdminMobileList
                    regionalAdmins={regionalAdmins}
                    expandedRegionalAdminId={expandedRegionalAdminId}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>

            <div className="hidden md:block">
                <RegionalAdminDesktopTable
                    regionalAdmins={regionalAdmins}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
}
