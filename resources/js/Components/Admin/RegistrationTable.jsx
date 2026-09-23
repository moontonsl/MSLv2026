import AdminPagination from "@/Components/Admin/AdminPagination";
import RegistrationDesktopTable from "@/Components/Admin/RegistrationDesktopTable";
import RegistrationMobileList from "@/Components/Admin/RegistrationMobileList";

export default function RegistrationTable({
    registrations = [],
    showDates = true,
    showActions = true,
    currentPage = 1,
    pageCount = 1,
    onPageChange = () => {},
    onEdit = () => {},
    onDelete = () => {},
    copiedCode = null,
    onCopy = () => {},
    emptyMessage = "No attendance registrations found.",
}) {
    return (
        <div className="w-full min-w-0">
            <div className="hidden md:block">
                <RegistrationDesktopTable
                    registrations={registrations}
                    showDates={showDates}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    copiedCode={copiedCode}
                    onCopy={onCopy}
                    emptyMessage={emptyMessage}
                />
            </div>

            <div className="md:hidden">
                <RegistrationMobileList
                    registrations={registrations}
                    showDates={showDates}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    copiedCode={copiedCode}
                    onCopy={onCopy}
                    emptyMessage={emptyMessage}
                />
            </div>

            <div className="mt-5 max-w-full overflow-x-auto border-t border-white/10 pt-4">
                <AdminPagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onChange={onPageChange}
                />
            </div>
        </div>
    );
}
